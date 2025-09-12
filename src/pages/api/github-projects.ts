import type { NextApiRequest, NextApiResponse } from "next";
import { ProcessedRepo } from "@/services/github";
import { GitHubProjectItem, githubConfig } from "@/data/works";
import { extractTechStackFromReadme, mergeTechStacks } from "@/services/llm-techstack";

// GitHub API response type
interface ProcessedRepoAPI {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

// Response type
interface GitHubProjectsResponse {
  success: boolean;
  projects?: GitHubProjectItem[];
  error?: string;
  cached?: boolean;
  timestamp?: number;
}

// Cache for server-side
const serverCache = new Map<
  string,
  { data: GitHubProjectItem[]; timestamp: number }
>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Helper function to get project image with multiple fallback options
async function getProjectImage(
  username: string,
  repoName: string
): Promise<string> {
  // Priority 1: Custom image in local directory (try multiple formats)
  const customImageFormats = ["jpg", "jpeg", "png", "webp"];
  for (const format of customImageFormats) {
    const customImagePath = `/images/github-projects/${repoName.toLowerCase()}.${format}`;
    // Note: We can't check file existence on the server side easily in Next.js
    // The frontend will handle the fallback if the image doesn't exist

    // For now, we'll prioritize .jpg as the default format
    if (format === "jpg") {
      // Try to get README image first, if that fails, use custom path
      const readmeImage = await getRepoImage(username, repoName);
      if (readmeImage) {
        return readmeImage;
      }
      // Return custom image path (frontend will handle fallback if it doesn't exist)
      return customImagePath;
    }
  }

  // For now, return the custom path as default and let frontend handle the fallback
  const readmeImage = await getRepoImage(username, repoName);
  if (readmeImage) {
    return readmeImage;
  }

  // Return custom image path - frontend will show placeholder if this fails
  return `/images/github-projects/${repoName.toLowerCase()}.jpg`;
}

// Helper function to fetch README content (both for images and tech stack extraction)
async function getRepoReadme(
  username: string,
  repoName: string
): Promise<{ content: string; imageUrl: string | null } | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "personal-portfolio",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const readme = await response.json();
    const content = Buffer.from(readme.content, "base64").toString();

    // Extract images from markdown - look for both markdown ![alt](url) and HTML <img src="url"> patterns
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

    // First try markdown format
    let matches = content.match(markdownImageRegex);
    let imageUrl = null;

    if (matches && matches.length > 0) {
      // Get the first image URL from markdown
      const firstImageMatch = matches[0];
      const urlMatch = firstImageMatch.match(/\((.*?)\)/);

      if (urlMatch && urlMatch[1]) {
        imageUrl = urlMatch[1];
      }
    }

    // If no markdown images found, try HTML img tags
    if (!imageUrl) {
      matches = content.match(htmlImageRegex);
      if (matches && matches.length > 0) {
        // Get the first image URL from HTML
        const firstImageMatch = matches[0];
        const urlMatch = firstImageMatch.match(/src=["']([^"']+)["']/);

        if (urlMatch && urlMatch[1]) {
          imageUrl = urlMatch[1];
        }
      }
    }

    if (imageUrl) {
      // Convert relative URLs to absolute GitHub URLs
      if (
        imageUrl.startsWith("./") ||
        imageUrl.startsWith("../") ||
        (!imageUrl.startsWith("http") && !imageUrl.startsWith("//"))
      ) {
        // Remove leading ./ if present
        imageUrl = imageUrl.replace(/^\.\//, "");
        // Create absolute URL
        imageUrl = `https://raw.githubusercontent.com/${username}/${repoName}/main/${imageUrl}`;
      }
    }

    return {
      content,
      imageUrl
    };
  } catch (error) {
    console.warn(
      `Failed to fetch README for ${username}/${repoName}:`,
      error
    );
    return null;
  }
}

// Helper function to extract first image from README (backward compatibility)
async function getRepoImage(
  username: string,
  repoName: string
): Promise<string | null> {
  const readme = await getRepoReadme(username, repoName);
  return readme?.imageUrl || null;
}

// Convert ProcessedRepo to GitHubProjectItem
async function convertToGitHubProjectItem(
  repo: ProcessedRepo
): Promise<GitHubProjectItem> {
  // Generate features from topics and language
  const features: string[] = [];

  // Add language as a feature if available
  if (repo.language) {
    features.push(repo.language);
  }

  // Add topics as features (limit to 4 most relevant)
  if (repo.topics && repo.topics.length > 0) {
    features.push(...repo.topics.slice(0, 4));
  }

  // If no features, add some defaults based on common patterns
  if (features.length === 0) {
    if (
      repo.name.toLowerCase().includes("web") ||
      repo.name.toLowerCase().includes("site")
    ) {
      features.push("Website");
    }
    if (repo.name.toLowerCase().includes("app")) {
      features.push("Application");
    }
    if (repo.name.toLowerCase().includes("api")) {
      features.push("API");
    }
    if (repo.name.toLowerCase().includes("tool")) {
      features.push("Tool");
    }

    // Fallback
    if (features.length === 0) {
      features.push("Project");
    }
  }

  // Generate initial tech stack from language and topics
  const initialTech: string[] = [];
  if (repo.language) {
    initialTech.push(repo.language);
  }

  // Add related technologies based on topics
  repo.topics?.forEach((topic) => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes("react")) initialTech.push("React");
    if (topicLower.includes("vue")) initialTech.push("Vue");
    if (topicLower.includes("angular")) initialTech.push("Angular");
    if (topicLower.includes("nextjs") || topicLower.includes("next-js"))
      initialTech.push("Next.js");
    if (topicLower.includes("nodejs") || topicLower.includes("node"))
      initialTech.push("Node.js");
    if (topicLower.includes("typescript")) initialTech.push("TypeScript");
    if (topicLower.includes("javascript")) initialTech.push("JavaScript");
    if (topicLower.includes("python")) initialTech.push("Python");
    if (topicLower.includes("docker")) initialTech.push("Docker");
    if (topicLower.includes("kubernetes")) initialTech.push("Kubernetes");
    if (topicLower.includes("aws")) initialTech.push("AWS");
    if (topicLower.includes("firebase")) initialTech.push("Firebase");
    if (topicLower.includes("mongodb")) initialTech.push("MongoDB");
    if (topicLower.includes("postgresql") || topicLower.includes("postgres"))
      initialTech.push("PostgreSQL");
    if (topicLower.includes("mysql")) initialTech.push("MySQL");
    if (topicLower.includes("redis")) initialTech.push("Redis");
    if (topicLower.includes("graphql")) initialTech.push("GraphQL");
    if (topicLower.includes("rest-api") || topicLower.includes("restful"))
      initialTech.push("REST API");
    if (topicLower.includes("machine-learning") || topicLower.includes("ml"))
      initialTech.push("Machine Learning");
    if (
      topicLower.includes("ai") ||
      topicLower.includes("artificial-intelligence")
    )
      initialTech.push("AI");
    if (topicLower.includes("blockchain")) initialTech.push("Blockchain");
    if (topicLower.includes("mobile")) initialTech.push("Mobile");
    if (topicLower.includes("ios")) initialTech.push("iOS");
    if (topicLower.includes("android")) initialTech.push("Android");
    if (topicLower.includes("flutter")) initialTech.push("Flutter");
    if (topicLower.includes("react-native")) initialTech.push("React Native");
  });

  // Remove duplicates from initial tech
  const uniqueInitialTech = Array.from(new Set(initialTech));

  // Get README content and extract tech stack if enabled
  let finalTech = uniqueInitialTech;
  let extractedTechStack: string[] = [];
  let techStackSource: 'manual' | 'extracted' | 'mixed' = 'manual';
  let extractedTechCount = 0;
  let extractedProvider: string | undefined;
  let extractedModel: string | undefined;

  const shouldExtractTechStack = 
    githubConfig.enableTechStackExtraction && 
    !githubConfig.skipExtractionForRepos?.includes(repo.name);

  if (shouldExtractTechStack) {
    try {
      console.log(`Fetching README and extracting tech stack for ${repo.name}...`);
      const readme = await getRepoReadme(githubConfig.username, repo.name);
      
      if (readme && readme.content) {
        const extracted = await extractTechStackFromReadme(readme.content, repo.name);
        
        if (extracted) {
          const mergeResult = mergeTechStacks(uniqueInitialTech, extracted);
          finalTech = mergeResult.mergedTech;
          extractedTechStack = [...extracted.primary, ...extracted.secondary];
          techStackSource = mergeResult.source;
          extractedTechCount = mergeResult.extractedCount;
          extractedProvider = extracted.provider;
          extractedModel = extracted.model;
          
          console.log(`Tech stack extraction completed for ${repo.name}:`, {
            original: uniqueInitialTech.length,
            extracted: extractedTechCount,
            final: finalTech.length,
            source: techStackSource
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to extract tech stack for ${repo.name}:`, error);
      // Continue with initial tech stack on error - this is expected when API key is not configured
      // In development or incognito mode, this graceful fallback ensures the app still works
    }
  }

  // Use full tech stack (no artificial limits)
  const tech = finalTech;

  // Get project image
  const image = await getProjectImage(githubConfig.username, repo.name);

  return {
    source: "github",
    repoName: repo.name,
    title: repo.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    description: repo.description,
    image,
    tech: tech.length > 0 ? tech : [repo.language || "Project"],
    link: repo.html_url,
    features,
    stars: repo.stargazers_count,
    forks: repo.forks,
    language: repo.language,
    languageColor: repo.languageColor,
    allLanguages: repo.allLanguages || [],
    allLanguageColors: repo.allLanguageColors || {},
    topics: repo.topics || [],
    lastUpdated: repo.updated_at,
    createdAt: repo.created_at,
    homepage: repo.homepage || undefined,
    download_url: repo.homepage || undefined,
    // Enhanced tech stack information
    extractedTechStack: extractedTechStack.length > 0 ? extractedTechStack : undefined,
    techStackSource,
    extractedTechCount,
    // LLM provider information
    extractedProvider,
    extractedModel,
  };
}

// Helper function to get commit count for a repository
async function getCommitCount(username: string, repoName: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "personal-portfolio",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      return 0;
    }

    // Get total count from Link header
    const linkHeader = response.headers.get("link");
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        return parseInt(lastPageMatch[1], 10);
      }
    }

    // If no pagination, count commits directly
    const commits = await response.json();
    return Array.isArray(commits) ? commits.length : 0;
  } catch (error) {
    console.warn(`Failed to get commit count for ${username}/${repoName}:`, error);
    return 0;
  }
}

// Fetch repository languages
async function fetchRepositoryLanguages(username: string, repoName: string): Promise<{
  allLanguages: string[];
  allLanguageColors: Record<string, string>;
}> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/languages`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "personal-portfolio",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch languages for ${username}/${repoName}`);
      return { allLanguages: [], allLanguageColors: {} };
    }

    const languagesData = await response.json();
    const languages = Object.keys(languagesData);
    const languageColors = languages.reduce((acc, lang) => {
      acc[lang] = getLanguageColor(lang);
      return acc;
    }, {} as Record<string, string>);


    return {
      allLanguages: languages,
      allLanguageColors: languageColors,
    };
  } catch (error) {
    console.warn(`Error fetching languages for ${username}/${repoName}:`, error);
    return { allLanguages: [], allLanguageColors: {} };
  }
}

// Server-side GitHub API calls
async function fetchGitHubRepositories(): Promise<ProcessedRepo[]> {
  const {
    username,
    excludeRepos = [],
    maxRepos = 10,
    minStars = 0,
    showArchived = false,
    showForks = false,
  } = githubConfig;

  try {
    // Fetch more repos initially to have a good selection for sorting
    const params = new URLSearchParams({
      sort: "updated",
      direction: "desc",
      per_page: "100", // Fetch more to get accurate commit counts
      type: "public",
    });

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?${params}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "personal-portfolio",
          // Add token if available in server environment
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const repos = await response.json();

    // Filter repositories first
    const filteredRepos = repos.filter((repo: ProcessedRepoAPI) => {
      if (excludeRepos.includes(repo.name)) return false;
      if (!showForks && repo.fork) return false;
      if (!showArchived && repo.archived) return false;
      if (repo.stargazers_count < minStars) return false;
      return true;
    });

    // Get commit counts and languages for all filtered repos in parallel
    const reposWithCommits = await Promise.all(
      filteredRepos.map(async (repo: ProcessedRepoAPI) => {
        const [commitCount, languagesData] = await Promise.all([
          getCommitCount(username, repo.name),
          fetchRepositoryLanguages(username, repo.name)
        ]);
        return {
          ...repo,
          commitCount,
          ...languagesData,
        };
      })
    );

    // Sort by commit count (descending) and take top 10
    const sortedRepos = reposWithCommits
      .sort((a, b) => b.commitCount - a.commitCount)
      .slice(0, maxRepos);

    // Process and convert to the expected format
    const processedRepos: ProcessedRepo[] = sortedRepos.map((repo) => {
      return {
      name: repo.name,
      description: repo.description || "No description available",
      html_url: repo.html_url,
      homepage: repo.homepage,
      stargazers_count: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || "",
      languageColor: getLanguageColor(repo.language || ""),
      allLanguages: repo.allLanguages || (repo.language ? [repo.language] : []),
      allLanguageColors: repo.allLanguageColors || (repo.language
        ? { [repo.language]: getLanguageColor(repo.language) }
        : {}),
      fork: repo.fork || false,
      topics: repo.topics || [],
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      size: repo.size || 0,
      default_branch: repo.default_branch || "main",
      archived: repo.archived || false,
      disabled: repo.disabled || false,
      private: repo.private || false,
      commitCount: repo.commitCount, // Add commit count to the result
    };
    });

    return processedRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw error;
  }
}

// Language colors (subset for server-side)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#fa7343",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#4FC08D",
    Shell: "#89e051",
    Docker: "#384d54",
    YAML: "#cb171e",
    Markdown: "#083fa1",
  };
  return colors[language] || "#858585";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubProjectsResponse>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const cacheKey = `github-projects-${githubConfig.username}`;

  try {
    // Check server cache
    const cached = serverCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_EXPIRY) {
      return res.status(200).json({
        success: true,
        projects: cached.data,
        cached: true,
        timestamp: cached.timestamp,
      });
    }

    // Fetch fresh data
    const repos = await fetchGitHubRepositories();
    const projects = await Promise.all(repos.map(convertToGitHubProjectItem));

    // Update server cache
    serverCache.set(cacheKey, {
      data: projects,
      timestamp: now,
    });

    // Return success response
    res.status(200).json({
      success: true,
      projects,
      cached: false,
      timestamp: now,
    });
  } catch (error) {
    console.error("API Error:", error);

    // Try to return cached data even if expired
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        projects: cached.data,
        cached: true,
        timestamp: cached.timestamp,
      });
    }

    // Return error response
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch GitHub projects",
    });
  }
}
