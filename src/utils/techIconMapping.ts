export interface TechIconData {
  name: string;
  className?: string;
  category: string;
  displayName: string;
  hoverColor: string;
  isCustomIcon?: boolean;
  isMainTech?: boolean;
  isSecTech?: boolean;
}

// Complete tech stack mapping data
export const TECH_ICONS: TechIconData[] = [
  // Frontend
  {
    name: "react",
    className: "devicon-react-original",
    category: "Frontend",
    displayName: "React",
    hoverColor: "#61DAFB",
    isMainTech: true,
  },
  {
    name: "nextjs",
    className: "devicon-nextjs-original-wordmark",
    category: "Frontend",
    displayName: "Next.js",
    hoverColor: "#FFFFFF",
    isMainTech: true,
  },
  {
    name: "tailwindcss",
    className: "devicon-tailwindcss-plain",
    category: "Frontend",
    displayName: "Tailwind CSS",
    hoverColor: "#06B6D4",
    isMainTech: true,
  },
  {
    name: "shadcn",
    category: "Frontend",
    displayName: "shadcn/ui",
    hoverColor: "#FFFFFF",
    isCustomIcon: true,
    isMainTech: true,
  },
  {
    name: "redux",
    className: "devicon-redux-original",
    category: "Frontend",
    displayName: "Redux",
    hoverColor: "#764ABC",
    isSecTech: true,
  },

  // Backend
  {
    name: "dotnetcore",
    className: "devicon-dot-net-plain",
    category: "Backend",
    displayName: ".NET Core",
    hoverColor: "#512BD4",
    isMainTech: true,
  },
  {
    name: "nodejs",
    className: "devicon-nodejs-plain",
    category: "Backend",
    displayName: "Node.js",
    hoverColor: "#339933",
    isMainTech: true,
  },
  {
    name: "express",
    className: "devicon-express-original",
    category: "Backend",
    displayName: "Express.js",
    hoverColor: "#FFFFFF",
    isSecTech: true,
  },
  {
    name: "php",
    className: "devicon-php-plain",
    category: "Backend",
    displayName: "PHP",
    hoverColor: "#777BB4",
    isSecTech: true,
  },

  // AI & ML
  {
    name: "claude",
    category: "AI/ML",
    displayName: "Claude Code",
    hoverColor: "#D97706",
    isCustomIcon: true,
    isMainTech: true,
  },
  {
    name: "cursor",
    category: "AI/ML",
    displayName: "Cursor",
    hoverColor: "#000000",
    isCustomIcon: true,
  },
  {
    name: "pytorch",
    className: "devicon-pytorch-original",
    category: "AI/ML",
    displayName: "PyTorch",
    hoverColor: "#EE4C2C",
    isSecTech: true,
  },
  {
    name: "huggingface",
    category: "AI/ML",
    displayName: "Hugging Face",
    hoverColor: "#FFD21E",
    isCustomIcon: true,
    isSecTech: true,
  },

  // Languages
  {
    name: "python",
    className: "devicon-python-plain",
    category: "Backend",
    displayName: "Python",
    hoverColor: "#3776AB",
    isMainTech: true,
  },
  {
    name: "csharp",
    className: "devicon-csharp-plain",
    category: "Backend",
    displayName: "C#",
    hoverColor: "#239120",
    isMainTech: true,
  },
  {
    name: "javascript",
    className: "devicon-javascript-plain",
    category: "Frontend",
    displayName: "JavaScript",
    hoverColor: "#F7DF1E",
    isMainTech: true,
  },
  {
    name: "typescript",
    className: "devicon-typescript-plain",
    category: "Frontend",
    displayName: "TypeScript",
    hoverColor: "#3178C6",
    isMainTech: true,
  },
  {
    name: "html5",
    className: "devicon-html5-plain",
    category: "Frontend",
    displayName: "HTML5",
    hoverColor: "#E34F26",
    isSecTech: true,
  },
  {
    name: "css3",
    className: "devicon-css3-plain",
    category: "Frontend",
    displayName: "CSS3",
    hoverColor: "#1572B6",
    isSecTech: true,
  },

  // Database
  {
    name: "postgresql",
    className: "devicon-postgresql-plain",
    category: "Database",
    displayName: "PostgreSQL",
    hoverColor: "#336791",
    isMainTech: true,
  },
  {
    name: "mysql",
    className: "devicon-mysql-plain",
    category: "Database",
    displayName: "MySQL",
    hoverColor: "#4479A1",
    isSecTech: true,
  },
  {
    name: "mongodb",
    className: "devicon-mongodb-plain",
    category: "Database",
    displayName: "MongoDB",
    hoverColor: "#47A248",
    isSecTech: true,
  },
  {
    name: "graphql",
    className: "devicon-graphql-plain",
    category: "Database",
    displayName: "GraphQL",
    hoverColor: "#E10098",
    isMainTech: true,
  },
  {
    name: "prisma",
    className: "devicon-prisma-original",
    category: "Database",
    displayName: "Prisma",
    hoverColor: "#5A67D8",
    isMainTech: true,
  },

  // Cloud & DevOps
  {
    name: "aws",
    className: "devicon-amazonwebservices-plain-wordmark",
    category: "Cloud",
    displayName: "AWS",
    hoverColor: "#FF9900",
    isMainTech: true,
  },
  {
    name: "azure",
    className: "devicon-azure-plain",
    category: "Cloud",
    displayName: "Azure",
    hoverColor: "#0078D4",
    isSecTech: true,
  },
  {
    name: "docker",
    className: "devicon-docker-plain",
    category: "DevOps",
    displayName: "Docker",
    hoverColor: "#2496ED",
    isMainTech: true,
  },
  {
    name: "githubactions",
    className: "devicon-githubactions-plain",
    category: "DevOps",
    displayName: "GitHub Actions",
    hoverColor: "#2088FF",
    isMainTech: true,
  },

  // Tools
  {
    name: "git",
    className: "devicon-git-plain",
    category: "Tools",
    displayName: "Git",
    hoverColor: "#F05032",
    isMainTech: true,
  },
  {
    name: "github",
    className: "devicon-github-original",
    category: "Tools",
    displayName: "GitHub",
    hoverColor: "#FFFFFF",
    isMainTech: true,
  },

  // ML/Data Science Tools (commonly appear in projects but don't have icons)
  {
    name: "mlflow",
    category: "AI/ML",
    displayName: "MLflow",
    hoverColor: "#0194E2",
    isSecTech: true,
  },
  {
    name: "dvc",
    category: "AI/ML", 
    displayName: "DVC",
    hoverColor: "#13ADC7",
    isSecTech: true,
  },
  {
    name: "jupyter",
    category: "AI/ML",
    displayName: "Jupyter",
    hoverColor: "#F37626",
    isSecTech: true,
  },
  {
    name: "pandas",
    category: "AI/ML",
    displayName: "Pandas",
    hoverColor: "#150458",
    isSecTech: true,
  },
  {
    name: "numpy",
    category: "AI/ML",
    displayName: "NumPy", 
    hoverColor: "#013243",
    isSecTech: true,
  },
  {
    name: "sklearn",
    category: "AI/ML",
    displayName: "Scikit-learn",
    hoverColor: "#F7931E",
    isSecTech: true,
  },
  {
    name: "tensorflow",
    className: "devicon-tensorflow-original",
    category: "AI/ML",
    displayName: "TensorFlow",
    hoverColor: "#FF6F00",
    isSecTech: true,
  },
  {
    name: "keras",
    category: "AI/ML",
    displayName: "Keras",
    hoverColor: "#D00000",
    isSecTech: true,
  },
  {
    name: "fastapi",
    className: "devicon-fastapi-plain",
    category: "Backend",
    displayName: "FastAPI",
    hoverColor: "#009688",
    isMainTech: true,
  },
  {
    name: "flask",
    className: "devicon-flask-original",
    category: "Backend",
    displayName: "Flask",
    hoverColor: "#FFFFFF",
    isSecTech: true,
  },
  {
    name: "django",
    className: "devicon-django-plain",
    category: "Backend",
    displayName: "Django",
    hoverColor: "#092E20",
    isMainTech: true,
  },
  {
    name: "sqlite",
    className: "devicon-sqlite-plain",
    category: "Database",
    displayName: "SQLite",
    hoverColor: "#003B57",
    isSecTech: true,
  },
  {
    name: "redis",
    className: "devicon-redis-plain",
    category: "Database",
    displayName: "Redis",
    hoverColor: "#DC382D",
    isMainTech: true,
  },
  {
    name: "elasticsearch",
    className: "devicon-elasticsearch-plain",
    category: "Database", 
    displayName: "Elasticsearch",
    hoverColor: "#005571",
    isMainTech: true,
  },
];

// Technology family patterns for fuzzy matching
interface TechPattern {
  pattern: RegExp;
  techData: TechIconData;
  priority: number; // Higher priority = more specific match
}

const TECH_PATTERNS: TechPattern[] = [];

// Helper function to create patterns for each technology
function createTechPatterns() {
  TECH_ICONS.forEach(tech => {
    const patterns = getTechPatterns(tech);
    patterns.forEach(({ pattern, priority }) => {
      TECH_PATTERNS.push({
        pattern,
        techData: tech,
        priority
      });
    });
  });
  
  // Sort by priority (highest first) for better matching
  TECH_PATTERNS.sort((a, b) => b.priority - a.priority);
}

// Generate regex patterns for each technology
function getTechPatterns(tech: TechIconData): Array<{ pattern: RegExp; priority: number }> {
  const patterns: Array<{ pattern: RegExp; priority: number }> = [];
  
  switch (tech.name) {
    case 'dotnetcore':
      patterns.push(
        { pattern: /^(asp\.?net(\s+core)?)\s*\d*\.?\d*$/i, priority: 100 }, // ASP.NET Core 9.0
        { pattern: /^\.?net(\s+core)?\s*\d*\.?\d*$/i, priority: 90 }, // .NET Core, .NET 9
        { pattern: /^dotnet(\s+core)?\s*\d*\.?\d*$/i, priority: 80 }, // dotnet core
      );
      break;
      
    case 'nextjs':
      patterns.push(
        { pattern: /^next(\.?js)?\s*\d*\.?\d*$/i, priority: 100 }, // Next.js 15, nextjs
        { pattern: /^nuxt(\.?js)?\s*\d*\.?\d*$/i, priority: 50 }, // Sometimes confused
      );
      break;
      
    case 'react':
      patterns.push(
        { pattern: /^react(\.?js)?\s*\d*\.?\d*$/i, priority: 100 }, // React 18, ReactJS
      );
      break;
      
    case 'typescript':
      patterns.push(
        { pattern: /^typescript\s*\d*\.?\d*$/i, priority: 100 }, // TypeScript 5.0
        { pattern: /^ts\s*\d*\.?\d*$/i, priority: 80 }, // TS
      );
      break;
      
    case 'javascript':
      patterns.push(
        { pattern: /^javascript\s*\d*\.?\d*$/i, priority: 100 }, // JavaScript ES2023
        { pattern: /^js\s*\d*\.?\d*$/i, priority: 80 }, // JS
        { pattern: /^ecmascript\s*\d*\.?\d*$/i, priority: 70 }, // ECMAScript
      );
      break;
      
    case 'python':
      patterns.push(
        { pattern: /^python\s*\d*\.?\d*$/i, priority: 100 }, // Python 3.11
      );
      break;
      
    case 'nodejs':
      patterns.push(
        { pattern: /^node(\.?js)?\s*\d*\.?\d*$/i, priority: 100 }, // Node.js 20
      );
      break;
      
    case 'postgresql':
      patterns.push(
        { pattern: /^postgres(ql)?\s*\d*\.?\d*$/i, priority: 100 }, // PostgreSQL 15
      );
      break;
      
    case 'mongodb':
      patterns.push(
        { pattern: /^mongo(db)?\s*\d*\.?\d*$/i, priority: 100 }, // MongoDB 7.0
      );
      break;
      
    case 'tailwindcss':
      patterns.push(
        { pattern: /^tailwind(\s+css)?\s*\d*\.?\d*$/i, priority: 100 }, // Tailwind CSS 3.0
      );
      break;
      
    case 'docker':
      patterns.push(
        { pattern: /^docker\s*\d*\.?\d*$/i, priority: 100 }, // Docker 24.0
      );
      break;
      
    case 'prisma':
      patterns.push(
        { pattern: /^prisma\s*\d*\.?\d*$/i, priority: 100 }, // Prisma 5.0
      );
      break;
      
    case 'express':
      patterns.push(
        { pattern: /^express(\.?js)?\s*\d*\.?\d*$/i, priority: 100 }, // Express.js 4.18
      );
      break;
      
    case 'pytorch':
      patterns.push(
        { pattern: /^pytorch\s*\d*\.?\d*$/i, priority: 100 }, // PyTorch 2.0
        { pattern: /^torch\s*\d*\.?\d*$/i, priority: 80 }, // torch
      );
      break;
      
    case 'csharp':
      patterns.push(
        { pattern: /^c#\s*\d*\.?\d*$/i, priority: 100 }, // C# 11
        { pattern: /^csharp\s*\d*\.?\d*$/i, priority: 90 }, // csharp
      );
      break;
      
    case 'html5':
      patterns.push(
        { pattern: /^html\s*\d*\.?\d*$/i, priority: 100 }, // HTML5
      );
      break;
      
    case 'css3':
      patterns.push(
        { pattern: /^css\s*\d*\.?\d*$/i, priority: 100 }, // CSS3
      );
      break;
      
    case 'mysql':
      patterns.push(
        { pattern: /^mysql\s*\d*\.?\d*$/i, priority: 100 }, // MySQL 8.0
      );
      break;
      
    case 'php':
      patterns.push(
        { pattern: /^php\s*\d*\.?\d*$/i, priority: 100 }, // PHP 8.2
      );
      break;
      
    case 'aws':
      patterns.push(
        { pattern: /^aws\s*\d*\.?\d*$/i, priority: 100 }, // AWS
        { pattern: /^amazon(\s+web\s+services)?\s*\d*\.?\d*$/i, priority: 90 }, // Amazon Web Services
      );
      break;
      
    case 'azure':
      patterns.push(
        { pattern: /^(microsoft\s+)?azure\s*\d*\.?\d*$/i, priority: 100 }, // Microsoft Azure
      );
      break;
      
    case 'git':
      patterns.push(
        { pattern: /^git\s*\d*\.?\d*$/i, priority: 100 }, // Git 2.40
      );
      break;
      
    case 'github':
      patterns.push(
        { pattern: /^github\s*\d*\.?\d*$/i, priority: 100 }, // GitHub
      );
      break;
      
    case 'githubactions':
      patterns.push(
        { pattern: /^github\s+actions\s*\d*\.?\d*$/i, priority: 100 }, // GitHub Actions
      );
      break;
      
    case 'mlflow':
      patterns.push(
        { pattern: /^mlflow\s*\d*\.?\d*$/i, priority: 100 }, // MLflow
      );
      break;
      
    case 'dvc':
      patterns.push(
        { pattern: /^dvc\s*\d*\.?\d*$/i, priority: 100 }, // DVC
        { pattern: /^data\s+version\s+control\s*\d*\.?\d*$/i, priority: 90 }, // Data Version Control
      );
      break;
      
    case 'jupyter':
      patterns.push(
        { pattern: /^jupyter(\s+notebook)?\s*\d*\.?\d*$/i, priority: 100 }, // Jupyter Notebook
      );
      break;
      
    case 'pandas':
      patterns.push(
        { pattern: /^pandas\s*\d*\.?\d*$/i, priority: 100 }, // Pandas
      );
      break;
      
    case 'numpy':
      patterns.push(
        { pattern: /^numpy\s*\d*\.?\d*$/i, priority: 100 }, // NumPy
      );
      break;
      
    case 'sklearn':
      patterns.push(
        { pattern: /^(scikit-learn|sklearn)\s*\d*\.?\d*$/i, priority: 100 }, // Scikit-learn
      );
      break;
      
    case 'tensorflow':
      patterns.push(
        { pattern: /^tensorflow\s*\d*\.?\d*$/i, priority: 100 }, // TensorFlow
        { pattern: /^tf\s*\d*\.?\d*$/i, priority: 80 }, // TF
      );
      break;
      
    case 'keras':
      patterns.push(
        { pattern: /^keras\s*\d*\.?\d*$/i, priority: 100 }, // Keras
      );
      break;
      
    case 'fastapi':
      patterns.push(
        { pattern: /^fastapi\s*\d*\.?\d*$/i, priority: 100 }, // FastAPI
      );
      break;
      
    case 'flask':
      patterns.push(
        { pattern: /^flask\s*\d*\.?\d*$/i, priority: 100 }, // Flask
      );
      break;
      
    case 'django':
      patterns.push(
        { pattern: /^django\s*\d*\.?\d*$/i, priority: 100 }, // Django
      );
      break;
      
    case 'sqlite':
      patterns.push(
        { pattern: /^sqlite\s*\d*\.?\d*$/i, priority: 100 }, // SQLite
      );
      break;
      
    case 'redis':
      patterns.push(
        { pattern: /^redis\s*\d*\.?\d*$/i, priority: 100 }, // Redis
      );
      break;
      
    case 'elasticsearch':
      patterns.push(
        { pattern: /^elasticsearch\s*\d*\.?\d*$/i, priority: 100 }, // Elasticsearch
        { pattern: /^elastic\s+search\s*\d*\.?\d*$/i, priority: 90 }, // Elastic Search
      );
      break;
  }
  
  // Add exact matches with high priority
  patterns.push(
    { pattern: new RegExp(`^${tech.name}$`, 'i'), priority: 200 },
    { pattern: new RegExp(`^${tech.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'), priority: 190 }
  );
  
  return patterns;
}

// Create a mapping for quick lookup
const techIconMap = new Map<string, TechIconData>();

// Populate the map with various name variations
TECH_ICONS.forEach(tech => {
  // Add the primary name
  techIconMap.set(tech.name.toLowerCase(), tech);
  
  // Add the display name
  techIconMap.set(tech.displayName.toLowerCase(), tech);
  
  // Add common variations
  const variations = getTechNameVariations(tech.name, tech.displayName);
  variations.forEach(variation => {
    techIconMap.set(variation.toLowerCase(), tech);
  });
});

// Initialize patterns
createTechPatterns();

// Helper function to generate common name variations
function getTechNameVariations(name: string, displayName: string): string[] {
  const variations: string[] = [];
  
  // Common mappings for specific technologies
  const mappings: Record<string, string[]> = {
    'nextjs': ['next.js', 'next', 'nextjs'],
    'nodejs': ['node.js', 'node', 'nodejs'],
    'typescript': ['ts', 'typescript'],
    'javascript': ['js', 'javascript'],
    'postgresql': ['postgres', 'postgresql'],
    'mongodb': ['mongo', 'mongodb'],
    'dotnetcore': ['.net', '.net core', 'dotnet', 'dotnetcore'],
    'csharp': ['c#', 'csharp'],
    'tailwindcss': ['tailwind', 'tailwindcss', 'tailwind css'],
    'githubactions': ['github actions', 'githubactions'],
    'huggingface': ['hugging face', 'huggingface', 'hf'],
    'shadcn': ['shadcn/ui', 'shadcn', 'shadcnui'],
    'express': ['express.js', 'express', 'expressjs'],
    'pytorch': ['torch', 'pytorch'],
  };
  
  if (mappings[name]) {
    variations.push(...mappings[name]);
  }
  
  // Add display name variations
  variations.push(displayName);
  variations.push(displayName.replace(/[.\s]/g, ''));
  variations.push(displayName.replace(/[.\s]/g, '').toLowerCase());
  
  return variations;
}

/**
 * Get tech icon data using pattern-based matching
 * @param techName - The technology name (case insensitive)
 * @returns Tech icon data or null if not found
 */
function getPatternMatch(techName: string): TechIconData | null {
  const cleanName = techName.trim();
  
  // Try pattern matching
  for (const techPattern of TECH_PATTERNS) {
    if (techPattern.pattern.test(cleanName)) {
      return techPattern.techData;
    }
  }
  
  return null;
}

/**
 * Get tech icon data for a given technology name
 * @param techName - The technology name (case insensitive)
 * @returns Tech icon data or null if not found
 */
export function getTechIcon(techName: string): TechIconData | null {
  if (!techName) return null;
  
  const normalizedName = techName.toLowerCase().trim();
  
  // First try exact match for performance
  const exactMatch = techIconMap.get(normalizedName);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Fall back to pattern matching
  return getPatternMatch(techName);
}

/**
 * Check if a technology has an available icon
 * @param techName - The technology name
 * @returns True if icon is available
 */
export function hasTechIcon(techName: string): boolean {
  return getTechIcon(techName) !== null;
}

/**
 * Get all available tech icons
 * @returns Array of all tech icon data
 */
export function getAllTechIcons(): TechIconData[] {
  return TECH_ICONS;
}