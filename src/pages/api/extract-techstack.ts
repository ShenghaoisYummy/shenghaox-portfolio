import type { NextApiRequest, NextApiResponse } from "next";
import { extractTechStackFromReadme, mergeTechStacks, ExtractedTechStack } from "@/services/llm-techstack";

// Request body interface
interface ExtractTechStackRequest {
  readmeContent: string;
  repoName: string;
  existingTech?: string[];
}

// Response interface
interface ExtractTechStackResponse {
  success: boolean;
  data?: {
    extracted: ExtractedTechStack | null;
    mergedTech: string[];
    extractedCount: number;
    source: 'manual' | 'extracted' | 'mixed';
  };
  error?: string;
  cached?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractTechStackResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    // Validate request body
    const { readmeContent, repoName, existingTech = [] }: ExtractTechStackRequest = req.body;

    if (!readmeContent || typeof readmeContent !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing readmeContent in request body",
      });
    }

    if (!repoName || typeof repoName !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing repoName in request body",
      });
    }

    if (!Array.isArray(existingTech)) {
      return res.status(400).json({
        success: false,
        error: "existingTech must be an array",
      });
    }

    // Check content length
    if (readmeContent.length < 10) {
      return res.status(400).json({
        success: false,
        error: "README content too short for meaningful extraction",
      });
    }

    if (readmeContent.length > 50000) {
      return res.status(400).json({
        success: false,
        error: "README content too large. Maximum size is 50,000 characters.",
      });
    }

    console.log(`Tech stack extraction requested for: ${repoName}`);

    // Extract tech stack using LLM
    const extracted = await extractTechStackFromReadme(readmeContent, repoName);

    // Merge with existing tech stack
    const { mergedTech, extractedCount, source } = mergeTechStacks(existingTech, extracted);

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        extracted,
        mergedTech,
        extractedCount,
        source,
      },
    });

  } catch (error) {
    console.error("Tech stack extraction API error:", error);

    // Handle OpenAI API errors specifically
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({
          success: false,
          error: "OpenAI API key configuration issue",
        });
      }
      
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          success: false,
          error: "OpenAI API rate limit exceeded. Please try again later.",
        });
      }

      if (error.message.includes('timeout')) {
        return res.status(408).json({
          success: false,
          error: "Request timeout. Please try again with shorter content.",
        });
      }
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to extract tech stack",
    });
  }
}