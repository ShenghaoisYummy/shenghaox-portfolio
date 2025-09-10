import type { NextApiRequest, NextApiResponse } from 'next';
import { ProcessedRepo } from '@/services/github';
import { GitHubProjectItem, githubConfig } from '@/data/works';

// Response type
interface GitHubProjectsResponse {
  success: boolean;
  projects?: GitHubProjectItem[];
  error?: string;
  cached?: boolean;
  timestamp?: number;
}

// Cache for server-side
const serverCache = new Map<string, { data: GitHubProjectItem[]; timestamp: number }>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

// Convert ProcessedRepo to GitHubProjectItem
function convertToGitHubProjectItem(repo: ProcessedRepo): GitHubProjectItem {
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
    if (repo.name.toLowerCase().includes('web') || repo.name.toLowerCase().includes('site')) {
      features.push('Website');
    }
    if (repo.name.toLowerCase().includes('app')) {
      features.push('Application');
    }
    if (repo.name.toLowerCase().includes('api')) {
      features.push('API');
    }
    if (repo.name.toLowerCase().includes('tool')) {
      features.push('Tool');
    }
    
    // Fallback
    if (features.length === 0) {
      features.push('Project');
    }
  }

  // Generate tech stack from language and topics
  const tech: string[] = [];
  if (repo.language) {
    tech.push(repo.language);
  }
  
  // Add related technologies based on topics
  repo.topics?.forEach(topic => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('react')) tech.push('React');
    if (topicLower.includes('vue')) tech.push('Vue');
    if (topicLower.includes('angular')) tech.push('Angular');
    if (topicLower.includes('nextjs') || topicLower.includes('next-js')) tech.push('Next.js');
    if (topicLower.includes('nodejs') || topicLower.includes('node')) tech.push('Node.js');
    if (topicLower.includes('typescript')) tech.push('TypeScript');
    if (topicLower.includes('javascript')) tech.push('JavaScript');
    if (topicLower.includes('python')) tech.push('Python');
    if (topicLower.includes('docker')) tech.push('Docker');
    if (topicLower.includes('kubernetes')) tech.push('Kubernetes');
    if (topicLower.includes('aws')) tech.push('AWS');
    if (topicLower.includes('firebase')) tech.push('Firebase');
    if (topicLower.includes('mongodb')) tech.push('MongoDB');
    if (topicLower.includes('postgresql') || topicLower.includes('postgres')) tech.push('PostgreSQL');
    if (topicLower.includes('mysql')) tech.push('MySQL');
    if (topicLower.includes('redis')) tech.push('Redis');
    if (topicLower.includes('graphql')) tech.push('GraphQL');
    if (topicLower.includes('rest-api') || topicLower.includes('restful')) tech.push('REST API');
    if (topicLower.includes('machine-learning') || topicLower.includes('ml')) tech.push('Machine Learning');
    if (topicLower.includes('ai') || topicLower.includes('artificial-intelligence')) tech.push('AI');
    if (topicLower.includes('blockchain')) tech.push('Blockchain');
    if (topicLower.includes('mobile')) tech.push('Mobile');
    if (topicLower.includes('ios')) tech.push('iOS');
    if (topicLower.includes('android')) tech.push('Android');
    if (topicLower.includes('flutter')) tech.push('Flutter');
    if (topicLower.includes('react-native')) tech.push('React Native');
  });

  // Remove duplicates and limit to reasonable number
  const uniqueTech = Array.from(new Set(tech)).slice(0, 6);

  // Generate default image path (you might want to create these or use a service)
  const image = `/images/github-projects/${repo.name.toLowerCase()}.jpg`;

  return {
    source: 'github',
    repoName: repo.name,
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description,
    image,
    tech: uniqueTech.length > 0 ? uniqueTech : [repo.language || 'Project'],
    link: repo.html_url,
    features,
    stars: repo.stargazers_count,
    forks: repo.forks,
    language: repo.language,
    languageColor: repo.languageColor,
    topics: repo.topics || [],
    lastUpdated: repo.updated_at,
    createdAt: repo.created_at,
    homepage: repo.homepage,
    download_url: repo.homepage || undefined,
  };
}

// Server-side GitHub API calls
async function fetchGitHubRepositories(): Promise<ProcessedRepo[]> {
  const { username, excludeRepos = [], maxRepos = 10, minStars = 0, showArchived = false, showForks = false } = githubConfig;
  
  try {
    const params = new URLSearchParams({
      sort: 'updated',
      direction: 'desc',
      per_page: String(Math.min(maxRepos * 2, 100)), // Fetch more to filter later
      type: 'public'
    });

    const response = await fetch(`https://api.github.com/users/${username}/repos?${params}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'personal-portfolio',
        // Add token if available in server environment
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const repos = await response.json();
    
    // Process and filter repositories
    const processedRepos: ProcessedRepo[] = repos
      .filter((repo: any) => {
        // Filter conditions
        if (excludeRepos.includes(repo.name)) return false;
        if (!showForks && repo.fork) return false;
        if (!showArchived && repo.archived) return false;
        if (repo.stargazers_count < minStars) return false;
        return true;
      })
      .slice(0, maxRepos) // Limit number of repos
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description available',
        html_url: repo.html_url,
        homepage: repo.homepage,
        stargazers_count: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || '',
        languageColor: getLanguageColor(repo.language || ''),
        allLanguages: repo.language ? [repo.language] : [],
        allLanguageColors: repo.language ? { [repo.language]: getLanguageColor(repo.language) } : {},
        fork: repo.fork || false,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size || 0,
        default_branch: repo.default_branch || 'main',
        archived: repo.archived || false,
        disabled: repo.disabled || false,
        private: repo.private || false,
      }));

    return processedRepos;
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw error;
  }
}

// Language colors (subset for server-side)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#fa7343',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#4FC08D',
    Shell: '#89e051',
    Docker: '#384d54',
    YAML: '#cb171e',
    Markdown: '#083fa1',
  };
  return colors[language] || '#858585';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GitHubProjectsResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const cacheKey = `github-projects-${githubConfig.username}`;
  
  try {
    // Check server cache
    const cached = serverCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRY) {
      return res.status(200).json({
        success: true,
        projects: cached.data,
        cached: true,
        timestamp: cached.timestamp
      });
    }

    // Fetch fresh data
    const repos = await fetchGitHubRepositories();
    const projects = repos.map(convertToGitHubProjectItem);

    // Update server cache
    serverCache.set(cacheKey, {
      data: projects,
      timestamp: now
    });

    // Return success response
    res.status(200).json({
      success: true,
      projects,
      cached: false,
      timestamp: now
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Try to return cached data even if expired
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        projects: cached.data,
        cached: true,
        timestamp: cached.timestamp
      });
    }

    // Return error response
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub projects'
    });
  }
}