// Base work item interface
export interface WorkItem {
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  features: string[];
  desc?: string;
  download_url?: string;
  function?: {
    name: string;
    img1: string;
    img2?: string;
    img3?: string;
  }[];
}

// Manual project item (existing static projects)
export interface ManualProjectItem extends WorkItem {
  source: "manual";
  priority?: number; // For ordering manual projects first
}

// GitHub project item (fetched from GitHub API)
export interface GitHubProjectItem
  extends Omit<WorkItem, "image" | "features" | "function"> {
  source: "github";
  // GitHub-specific data
  repoName: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  allLanguages?: string[];
  allLanguageColors?: Record<string, string>;
  topics: string[];
  lastUpdated: string;
  createdAt: string;
  homepage?: string;
  // Auto-generated fields
  image: string; // Will be generated or use default
  features: string[]; // Will be derived from topics/language
}

// Combined project display item
export type ProjectDisplayItem = ManualProjectItem | GitHubProjectItem;

// Configuration for GitHub integration
export interface GitHubConfig {
  username: string;
  // Specific repositories to include (if empty, fetches all public repos)
  includeRepos?: string[];
  // Repositories to exclude
  excludeRepos?: string[];
  // Maximum number of GitHub projects to show
  maxRepos?: number;
  // Minimum stars required to show a project
  minStars?: number;
  // Whether to show archived repositories
  showArchived?: boolean;
  // Whether to show forked repositories
  showForks?: boolean;
}

// GitHub configuration
export const githubConfig: GitHubConfig = {
  username: "ShenghaoisYummy", // Your GitHub username
  excludeRepos: [
    "personal-web", // Exclude this website itself since it's manually added
    "ShenghaoisYummy", // Exclude profile README repo
  ],
  maxRepos: 8, // Show maximum 10 GitHub projects
  minStars: 0, // Show projects with any number of stars
  showArchived: false,
  showForks: false,
};

// Manual works data (static projects)
export const manualWorksData: ManualProjectItem[] = [];

// Legacy export for backward compatibility
export const worksData: WorkItem[] = manualWorksData;
