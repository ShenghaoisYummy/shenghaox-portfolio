import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Tech stack extraction result interface
export interface ExtractedTechStack {
  primary: string[];      // Main technologies (frameworks, languages, databases)
  secondary: string[];    // Supporting tools (testing, deployment, etc.)
  confidence: 'high' | 'medium' | 'low';  // Confidence in extraction accuracy
  extractedFrom: string[];  // What parts of README were analyzed
}

// Cache for tech stack extractions to avoid repeated API calls
const extractionCache = new Map<string, { 
  result: ExtractedTechStack; 
  timestamp: number; 
  contentHash: string; 
}>();

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Generate a simple hash for README content
function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Clean and prepare README content for analysis
function preprocessReadmeContent(content: string): string {
  // Remove excessive whitespace and clean up formatting
  let cleaned = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // Remove bold/italic formatting
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .trim();

  // Limit content length to avoid token limits (approximately 3000 tokens = 12000 chars)
  if (cleaned.length > 12000) {
    cleaned = cleaned.substring(0, 12000) + '...';
  }

  return cleaned;
}

// Create structured prompt for tech stack extraction
function createExtractionPrompt(readmeContent: string, repoName: string): string {
  return `You are a technical expert tasked with extracting technology stack information from a GitHub repository's README file.

Repository Name: ${repoName}

README Content:
${readmeContent}

Please analyze this README and extract the technology stack used in this project. Return a JSON object with the following structure:

{
  "primary": ["main technologies like languages, frameworks, databases"],
  "secondary": ["supporting tools, testing libraries, deployment tools, etc."],
  "confidence": "high|medium|low",
  "extractedFrom": ["list of sections or indicators that helped identify the tech"]
}

Guidelines:
1. Focus on actual technologies used in the project, not just mentioned in passing
2. Primary technologies are core to the project (React, Node.js, PostgreSQL, Python, etc.)
3. Secondary technologies are supporting tools (Jest, Docker, AWS, etc.)
4. Set confidence to "high" if tech stack is clearly documented, "medium" if inferred from context, "low" if mostly guessing
5. Include in extractedFrom what helped you identify the technologies (badges, installation instructions, dependencies, etc.)
6. Limit primary to max 8 items and secondary to max 6 items
7. Use standard technology names (e.g., "JavaScript" not "JS", "TypeScript" not "TS")
8. If no clear tech stack is found, return empty arrays but still provide confidence and extractedFrom

Return only valid JSON, no additional text or explanation.`;
}

// Extract tech stack from README content using OpenAI
export async function extractTechStackFromReadme(
  readmeContent: string,
  repoName: string
): Promise<ExtractedTechStack | null> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('OpenAI API key not configured, skipping tech stack extraction');
      return null;
    }

    // Generate cache key and content hash
    const contentHash = generateContentHash(readmeContent);
    const cacheKey = `${repoName}-${contentHash}`;
    
    // Check cache first
    const cached = extractionCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRY && cached.contentHash === contentHash) {
      console.log(`Using cached tech stack for ${repoName}`);
      return cached.result;
    }

    // Preprocess README content
    const cleanedContent = preprocessReadmeContent(readmeContent);
    
    // Skip extraction if content is too short or empty
    if (cleanedContent.length < 50) {
      console.warn(`README content too short for ${repoName}, skipping extraction`);
      return null;
    }

    console.log(`Extracting tech stack for ${repoName} using OpenAI...`);

    // Create prompt and call OpenAI
    const prompt = createExtractionPrompt(cleanedContent, repoName);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 800,
    }, {
      timeout: 30000, // 30 second timeout
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.warn(`No response from OpenAI for ${repoName}`);
      return null;
    }

    // Parse JSON response
    let extractedData: ExtractedTechStack;
    try {
      extractedData = JSON.parse(response.trim());
    } catch (parseError) {
      console.error(`Failed to parse OpenAI response for ${repoName}:`, parseError);
      console.error('Response was:', response);
      return null;
    }

    // Validate the structure
    if (!extractedData.primary || !Array.isArray(extractedData.primary) ||
        !extractedData.secondary || !Array.isArray(extractedData.secondary) ||
        !extractedData.confidence || !extractedData.extractedFrom) {
      console.warn(`Invalid response structure for ${repoName}:`, extractedData);
      return null;
    }

    // Clean and validate the arrays
    extractedData.primary = extractedData.primary
      .filter(tech => typeof tech === 'string' && tech.trim().length > 0)
      .map(tech => tech.trim())
      .slice(0, 8); // Limit to 8 items

    extractedData.secondary = extractedData.secondary
      .filter(tech => typeof tech === 'string' && tech.trim().length > 0)
      .map(tech => tech.trim())
      .slice(0, 6); // Limit to 6 items

    // Ensure confidence is valid
    if (!['high', 'medium', 'low'].includes(extractedData.confidence)) {
      extractedData.confidence = 'medium';
    }

    // Cache the result
    extractionCache.set(cacheKey, {
      result: extractedData,
      timestamp: now,
      contentHash: contentHash
    });

    console.log(`Successfully extracted tech stack for ${repoName}:`, {
      primary: extractedData.primary.length,
      secondary: extractedData.secondary.length,
      confidence: extractedData.confidence
    });

    return extractedData;

  } catch (error) {
    console.error(`Error extracting tech stack for ${repoName}:`, error);
    
    // Return null on error, fallback logic will handle this
    return null;
  }
}

// Merge extracted tech stack with existing tech array
export function mergeTechStacks(
  existingTech: string[],
  extracted: ExtractedTechStack | null
): { 
  mergedTech: string[], 
  extractedCount: number, 
  source: 'manual' | 'extracted' | 'mixed' 
} {
  if (!extracted) {
    return {
      mergedTech: existingTech,
      extractedCount: 0,
      source: 'manual'
    };
  }

  // Combine all extracted technologies
  const allExtracted = [...extracted.primary, ...extracted.secondary];
  
  if (allExtracted.length === 0) {
    return {
      mergedTech: existingTech,
      extractedCount: 0,
      source: 'manual'
    };
  }

  // Create a normalized comparison function
  const normalize = (tech: string) => tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Combine unique technologies, preferring extracted names for duplicates
  const techMap = new Map<string, string>();
  
  // Add existing tech first
  existingTech.forEach(tech => {
    const normalized = normalize(tech);
    if (!techMap.has(normalized)) {
      techMap.set(normalized, tech);
    }
  });
  
  // Add extracted tech, potentially overwriting with better names
  allExtracted.forEach(tech => {
    const normalized = normalize(tech);
    techMap.set(normalized, tech); // Prefer extracted names
  });
  
  const mergedTech = Array.from(techMap.values());
  const extractedCount = allExtracted.length;
  
  return {
    mergedTech,
    extractedCount,
    source: existingTech.length > 0 && extractedCount > 0 ? 'mixed' : 
            extractedCount > 0 ? 'extracted' : 'manual'
  };
}

// Clear cache (useful for testing or manual refresh)
export function clearTechStackCache(): void {
  extractionCache.clear();
  console.log('Tech stack extraction cache cleared');
}

// Get cache statistics
export function getCacheStats(): { size: number, entries: string[] } {
  return {
    size: extractionCache.size,
    entries: Array.from(extractionCache.keys())
  };
}