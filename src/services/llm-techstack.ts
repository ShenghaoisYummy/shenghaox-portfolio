import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// LLM Provider types
type LLMProvider = 'gemini' | 'openai';

interface LLMClient {
  provider: LLMProvider;
  client: any;
  model: string;
  available: boolean;
}

// Initialize LLM clients with fallback handling
let geminiClient: LLMClient | null = null;
let openaiClient: LLMClient | null = null;

// Initialize Gemini client (primary)
try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiClient = {
      provider: 'gemini',
      client: genAI,
      model: 'gemini-2.0-flash-exp',
      available: true
    };
    console.log('Gemini client initialized successfully');
  } else {
    console.warn('Gemini API key not configured - using OpenAI as primary');
  }
} catch (error) {
  console.error('Failed to initialize Gemini client:', error);
  geminiClient = null;
}

// Initialize OpenAI client (fallback)
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openaiClient = {
      provider: 'openai',
      client: new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      model: 'gpt-4.1-nano',
      available: true
    };
    console.log('OpenAI client initialized successfully');
  } else {
    console.warn('OpenAI API key not configured - fallback will be disabled');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
  openaiClient = null;
}

// Check if any LLM is available
if (!geminiClient && !openaiClient) {
  console.error('No LLM providers available - tech stack extraction will be disabled');
}

// Model configuration
export const PRIMARY_MODEL_NAME = 'gemini-2.0-flash-exp';
export const PRIMARY_MODEL_DISPLAY_NAME = 'Gemini 2.0 Flash';
export const FALLBACK_MODEL_NAME = 'gpt-4.1-nano';
export const FALLBACK_MODEL_DISPLAY_NAME = 'GPT-4.1 Nano';

// Get active model info
export function getActiveModel(): { name: string; displayName: string; provider: LLMProvider } {
  if (geminiClient?.available) {
    return {
      name: PRIMARY_MODEL_NAME,
      displayName: PRIMARY_MODEL_DISPLAY_NAME,
      provider: 'gemini'
    };
  } else if (openaiClient?.available) {
    return {
      name: FALLBACK_MODEL_NAME,
      displayName: FALLBACK_MODEL_DISPLAY_NAME,
      provider: 'openai'
    };
  }
  throw new Error('No LLM providers available');
}

// Tech stack extraction result interface
export interface ExtractedTechStack {
  primary: string[];      // Main technologies (frameworks, languages, databases)
  secondary: string[];    // Supporting tools (testing, deployment, etc.)
  confidence: 'high' | 'medium' | 'low';  // Confidence in extraction accuracy
  extractedFrom: string[];  // What parts of README were analyzed
  provider?: LLMProvider;  // Which LLM provider was used
  model?: string;          // Which specific model was used
}

// Cache for tech stack extractions to avoid repeated API calls
// Separate cache per provider to avoid conflicts
const extractionCache = new Map<string, { 
  result: ExtractedTechStack; 
  timestamp: number; 
  contentHash: string;
  provider: LLMProvider;
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

// Create structured prompt for tech stack extraction (OpenAI format)
function createOpenAIExtractionPrompt(readmeContent: string, repoName: string): string {
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

// Create structured prompt for tech stack extraction (Gemini format)
function createGeminiExtractionPrompt(readmeContent: string, repoName: string): string {
  return `Extract technology stack information from this GitHub repository's README.

**Repository:** ${repoName}

**README Content:**
${readmeContent}

**Task:** Analyze the README and identify the technology stack. Focus on technologies actually used in the project.

**Output Format:** JSON object with this exact structure:
{
  "primary": ["main technologies: languages, frameworks, databases"],
  "secondary": ["supporting tools: testing, deployment, etc."],
  "confidence": "high|medium|low",
  "extractedFrom": ["sources that indicated the technologies"]
}

**Guidelines:**
- Primary: Core project technologies (max 8)
- Secondary: Supporting tools and libraries (max 6) 
- Confidence: "high" if clearly documented, "medium" if inferred, "low" if guessing
- ExtractedFrom: What indicated each technology (badges, dependencies, instructions, etc.)
- Use standard names: "JavaScript" not "JS", "TypeScript" not "TS"
- Return empty arrays if no clear tech stack found

**Important:** Return only the JSON object, no additional text or formatting.`;
}

// Extract tech stack using Gemini
async function extractWithGemini(
  readmeContent: string,
  repoName: string
): Promise<string> {
  if (!geminiClient?.available || !geminiClient.client) {
    throw new Error('Gemini client not available');
  }

  console.log(`Extracting tech stack for ${repoName} using Gemini...`);

  const model = geminiClient.client.getGenerativeModel({ 
    model: geminiClient.model,
    generationConfig: {
      temperature: 0.1,
      topK: 1,
      topP: 0.8,
      maxOutputTokens: 800,
    },
  });

  const prompt = createGeminiExtractionPrompt(readmeContent, repoName);
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  if (!response) {
    throw new Error('No response from Gemini');
  }

  return response;
}

// Extract tech stack using OpenAI
async function extractWithOpenAI(
  readmeContent: string,
  repoName: string
): Promise<string> {
  if (!openaiClient?.available || !openaiClient.client) {
    throw new Error('OpenAI client not available');
  }

  console.log(`Extracting tech stack for ${repoName} using OpenAI...`);

  const completion = await openaiClient.client.chat.completions.create({
    model: openaiClient.model,
    messages: [
      {
        role: "user",
        content: createOpenAIExtractionPrompt(readmeContent, repoName)
      }
    ],
    temperature: 0.1,
    max_tokens: 800,
  }, {
    timeout: 30000,
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  return response;
}

// Extract tech stack from README content using dual provider system
export async function extractTechStackFromReadme(
  readmeContent: string,
  repoName: string
): Promise<ExtractedTechStack | null> {
  try {
    // Check if any LLM provider is available
    if (!geminiClient?.available && !openaiClient?.available) {
      console.warn('No LLM providers configured, skipping tech stack extraction for', repoName);
      return null;
    }

    // Generate cache key and content hash
    const contentHash = generateContentHash(readmeContent);
    const primaryProvider = geminiClient?.available ? 'gemini' : 'openai';
    const cacheKey = `${repoName}-${contentHash}-${primaryProvider}`;
    
    // Check cache first
    const cached = extractionCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRY && cached.contentHash === contentHash) {
      console.log(`Using cached tech stack for ${repoName} (provider: ${cached.provider})`);
      return cached.result;
    }

    // Preprocess README content
    const cleanedContent = preprocessReadmeContent(readmeContent);
    
    // Skip extraction if content is too short or empty
    if (cleanedContent.length < 50) {
      console.warn(`README content too short for ${repoName}, skipping extraction`);
      return null;
    }

    let response: string;
    let usedProvider: LLMProvider;
    let usedModel: string;

    // Try Gemini first (primary), then OpenAI (fallback)
    try {
      if (geminiClient?.available) {
        response = await extractWithGemini(cleanedContent, repoName);
        usedProvider = 'gemini';
        usedModel = geminiClient.model;
      } else if (openaiClient?.available) {
        response = await extractWithOpenAI(cleanedContent, repoName);
        usedProvider = 'openai';
        usedModel = openaiClient.model;
      } else {
        throw new Error('No LLM providers available');
      }
    } catch (error) {
      console.warn(`Primary LLM provider failed for ${repoName}:`, error);
      
      // Try fallback if primary failed
      if (geminiClient?.available && openaiClient?.available) {
        try {
          console.log(`Falling back to OpenAI for ${repoName}`);
          response = await extractWithOpenAI(cleanedContent, repoName);
          usedProvider = 'openai';
          usedModel = openaiClient.model;
        } catch (fallbackError) {
          console.error(`Fallback provider also failed for ${repoName}:`, fallbackError);
          return null;
        }
      } else {
        console.error(`No fallback provider available for ${repoName}`);
        return null;
      }
    }
    
    if (!response) {
      console.warn(`No response from ${usedProvider} for ${repoName}`);
      return null;
    }

    // Parse JSON response (remove markdown code blocks if present)
    let extractedData: ExtractedTechStack;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = response.trim();
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      
      extractedData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`Failed to parse ${usedProvider} response for ${repoName}:`, parseError);
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

    // Add provider info
    extractedData.provider = usedProvider;
    extractedData.model = usedModel;

    // Cache the result
    extractionCache.set(cacheKey, {
      result: extractedData,
      timestamp: now,
      contentHash: contentHash,
      provider: usedProvider
    });

    console.log(`Successfully extracted tech stack for ${repoName} using ${usedProvider}:`, {
      primary: extractedData.primary.length,
      secondary: extractedData.secondary.length,
      confidence: extractedData.confidence,
      provider: usedProvider,
      model: usedModel
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
export function getCacheStats(): { 
  size: number; 
  entries: string[]; 
  byProvider: Record<LLMProvider, number>;
} {
  const byProvider: Record<LLMProvider, number> = {
    gemini: 0,
    openai: 0
  };
  
  for (const [, cached] of extractionCache) {
    byProvider[cached.provider]++;
  }
  
  return {
    size: extractionCache.size,
    entries: Array.from(extractionCache.keys()),
    byProvider
  };
}