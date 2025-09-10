// GitHub API service for fetching repository data
export interface ProcessedRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks: number;
  language: string;
  languageColor: string;
  allLanguages: string[];
  allLanguageColors: Record<string, string>;
  fork: boolean;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

// Language colors mapping (common languages)
const LANGUAGE_COLORS: Record<string, string> = {
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
  SCSS: '#c6538c',
  Vue: '#4FC08D',
  React: '#61DAFB',
  Angular: '#DD0031',
  Shell: '#89e051',
  Docker: '#384d54',
  Dockerfile: '#384d54',
  YAML: '#cb171e',
  JSON: '#292929',
  Markdown: '#083fa1',
  default: '#858585'
};

// Cache configuration
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const getCacheKey = (repoName: string) => `github_repo_${repoName}`;

// Get cached data from localStorage
const getCachedData = (repoName: string): ProcessedRepo | null => {
  try {
    const cacheKey = getCacheKey(repoName);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp < CACHE_EXPIRY) {
        return data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.error('Failed to read cache:', error);
  }
  return null;
};

// Save data to localStorage
const setCachedData = (repoName: string, data: ProcessedRepo) => {
  try {
    const cacheKey = getCacheKey(repoName);
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
};

// Get language color
const getLanguageColor = (language: string): string => {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
};

// Fetch single GitHub repository
export async function getGitHubRepo(repoName: string): Promise<ProcessedRepo> {
  // Check cache first
  const cachedData = getCachedData(repoName);
  if (cachedData) {
    console.log(`Using cached data for ${repoName}`);
    return cachedData;
  }

  try {
    // Fetch basic repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${repoName}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add token if available (for higher rate limits)
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        })
      }
    });

    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repository: ${repoResponse.status}`);
    }

    const repoData = await repoResponse.json();

    // Fetch languages
    let allLanguages: string[] = [];
    let allLanguageColors: Record<string, string> = {};
    
    try {
      const languagesResponse = await fetch(`https://api.github.com/repos/${repoName}/languages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
            'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
          })
        }
      });

      if (languagesResponse.ok) {
        const languagesData = await languagesResponse.json();
        allLanguages = Object.keys(languagesData);
        allLanguageColors = Object.keys(languagesData).reduce((acc, lang) => {
          acc[lang] = getLanguageColor(lang);
          return acc;
        }, {} as Record<string, string>);
      }
    } catch (error) {
      console.warn(`Failed to fetch languages for ${repoName}:`, error);
    }

    const processedRepo: ProcessedRepo = {
      name: repoData.name,
      description: repoData.description || 'No description available',
      html_url: repoData.html_url,
      homepage: repoData.homepage,
      stargazers_count: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      language: repoData.language || '',
      languageColor: getLanguageColor(repoData.language || ''),
      allLanguages,
      allLanguageColors,
      fork: repoData.fork || false,
      topics: repoData.topics || [],
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      size: repoData.size || 0,
      default_branch: repoData.default_branch || 'main',
      archived: repoData.archived || false,
      disabled: repoData.disabled || false,
      private: repoData.private || false,
    };

    // Cache the processed data
    setCachedData(repoName, processedRepo);

    return processedRepo;
  } catch (error) {
    console.error(`Failed to fetch GitHub repository ${repoName}:`, error);
    throw error;
  }
}

// Fetch multiple repositories with rate limiting
export async function getMultipleRepos(
  repoNames: string[]
): Promise<ProcessedRepo[]> {
  const BATCH_SIZE = 2; // Reduce batch size to avoid rate limits
  const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches
  const results: ProcessedRepo[] = [];

  for (let i = 0; i < repoNames.length; i += BATCH_SIZE) {
    const batch = repoNames.slice(i, i + BATCH_SIZE);
    
    // Add delay between batches (except for the first batch)
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }

    const batchResults = await Promise.allSettled(
      batch.map(repoName => getGitHubRepo(repoName))
    );

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error(`Failed to fetch ${batch[index]}:`, result.reason);
        // Add fallback repo data
        const repoName = batch[index];
        const fallbackRepo: ProcessedRepo = {
          name: repoName.split('/')[1] || repoName,
          description: 'Repository information unavailable',
          html_url: `https://github.com/${repoName}`,
          homepage: null,
          stargazers_count: 0,
          forks: 0,
          language: '',
          languageColor: LANGUAGE_COLORS.default,
          allLanguages: [],
          allLanguageColors: {},
          fork: false,
          topics: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pushed_at: new Date().toISOString(),
          size: 0,
          default_branch: 'main',
          archived: false,
          disabled: false,
          private: false,
        };
        results.push(fallbackRepo);
      }
    });
  }

  return results;
}

// Get user's repositories (public only)
export async function getUserRepositories(username: string, options?: {
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}): Promise<ProcessedRepo[]> {
  try {
    const params = new URLSearchParams({
      sort: options?.sort || 'updated',
      direction: options?.direction || 'desc',
      per_page: String(options?.per_page || 30),
      page: String(options?.page || 1),
      type: 'public'
    });

    const response = await fetch(`https://api.github.com/users/${username}/repos?${params}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
          'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user repositories: ${response.status}`);
    }

    const repos = await response.json();
    
    // Process each repository
    const processedRepos = repos
      .filter((repo: any) => !repo.fork) // Exclude forks by default
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
    console.error(`Failed to fetch repositories for user ${username}:`, error);
    throw error;
  }
}