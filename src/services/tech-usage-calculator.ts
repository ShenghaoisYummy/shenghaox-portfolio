import { PrismaClient } from '@prisma/client';
import { manualWorksData } from '@/data/works';
import { getTechIcon } from '@/utils/techIconMapping';

const prisma = new PrismaClient();

// Interface for tech usage statistics
export interface TechUsageStats {
  techName: string;
  totalProjects: number;
  manualProjects: number;
  aiExtractedProjects: number;
  lastCalculated: Date;
  hasIcon: boolean; // Whether tech has icon mapping
}

// Interface for tech usage calculation result
export interface TechUsageCalculationResult {
  stats: TechUsageStats[];
  totalTechnologies: number;
  totalProjects: number;
  calculationTime: Date;
}

// Cache for tech usage stats
let cachedStats: TechUsageCalculationResult | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes


/**
 * Get standardized tech name using icon mapping
 */
function getStandardTechName(techName: string): string {
  const techIcon = getTechIcon(techName);
  return techIcon ? techIcon.displayName : techName;
}

/**
 * Calculate tech usage from manual projects
 */
function calculateManualTechUsage(): Map<string, number> {
  const manualTechCount = new Map<string, number>();

  manualWorksData.forEach(project => {
    if (project.tech && Array.isArray(project.tech)) {
      project.tech.forEach(tech => {
        const standardName = getStandardTechName(tech);
        manualTechCount.set(standardName, (manualTechCount.get(standardName) || 0) + 1);
      });
    }
  });

  return manualTechCount;
}

/**
 * Calculate tech usage from GitHub projects with AI extraction
 */
async function calculateGitHubTechUsage(): Promise<{
  aiExtracted: Map<string, number>;
  manual: Map<string, number>;
}> {
  const aiExtractedCount = new Map<string, number>();
  const manualCount = new Map<string, number>();

  try {
    // Fetch GitHub projects from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github-projects`);

    if (!response.ok) {
      console.warn('Failed to fetch GitHub projects for tech usage calculation');
      return { aiExtracted: aiExtractedCount, manual: manualCount };
    }

    const data = await response.json();

    if (!data.success || !data.projects) {
      return { aiExtracted: aiExtractedCount, manual: manualCount };
    }

    data.projects.forEach((project: { tech: string[]; extractedTechStack?: string[] }) => {
      if (project.tech && Array.isArray(project.tech)) {
        project.tech.forEach((tech: string) => {
          const standardName = getStandardTechName(tech);

          // Check if this tech was AI extracted
          const isAiExtracted = project.extractedTechStack &&
                                Array.isArray(project.extractedTechStack) &&
                                project.extractedTechStack.includes(tech);

          if (isAiExtracted) {
            aiExtractedCount.set(standardName, (aiExtractedCount.get(standardName) || 0) + 1);
          } else {
            manualCount.set(standardName, (manualCount.get(standardName) || 0) + 1);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error calculating GitHub tech usage:', error);
  }

  return { aiExtracted: aiExtractedCount, manual: manualCount };
}

/**
 * Calculate combined tech usage statistics
 */
export async function calculateTechUsage(): Promise<TechUsageCalculationResult> {
  const calculationStart = Date.now();

  try {
    // Calculate manual project tech usage
    const manualProjectTech = calculateManualTechUsage();

    // Calculate GitHub project tech usage
    const { aiExtracted: githubAiTech, manual: githubManualTech } = await calculateGitHubTechUsage();

    // Combine all tech usage data
    const combinedTechUsage = new Map<string, {
      manualProjects: number;
      aiExtractedProjects: number;
    }>();

    // Add manual project techs
    manualProjectTech.forEach((count, techName) => {
      const existing = combinedTechUsage.get(techName) || { manualProjects: 0, aiExtractedProjects: 0 };
      existing.manualProjects += count;
      combinedTechUsage.set(techName, existing);
    });

    // Add GitHub manual techs
    githubManualTech.forEach((count, techName) => {
      const existing = combinedTechUsage.get(techName) || { manualProjects: 0, aiExtractedProjects: 0 };
      existing.manualProjects += count;
      combinedTechUsage.set(techName, existing);
    });

    // Add GitHub AI extracted techs
    githubAiTech.forEach((count, techName) => {
      const existing = combinedTechUsage.get(techName) || { manualProjects: 0, aiExtractedProjects: 0 };
      existing.aiExtractedProjects += count;
      combinedTechUsage.set(techName, existing);
    });

    // Convert to stats array
    const stats: TechUsageStats[] = Array.from(combinedTechUsage.entries()).map(([techName, counts]) => ({
      techName,
      totalProjects: counts.manualProjects + counts.aiExtractedProjects,
      manualProjects: counts.manualProjects,
      aiExtractedProjects: counts.aiExtractedProjects,
      lastCalculated: new Date(),
      hasIcon: getTechIcon(techName) !== null
    }));

    // Sort by total usage (descending), then by name
    stats.sort((a, b) => {
      if (b.totalProjects !== a.totalProjects) {
        return b.totalProjects - a.totalProjects;
      }
      return a.techName.localeCompare(b.techName);
    });

    const result: TechUsageCalculationResult = {
      stats,
      totalTechnologies: stats.length,
      totalProjects: manualWorksData.length + (await getTotalGitHubProjects()),
      calculationTime: new Date()
    };

    console.log(`Tech usage calculation completed in ${Date.now() - calculationStart}ms:`, {
      totalTechnologies: result.totalTechnologies,
      totalProjects: result.totalProjects,
      topTechs: stats.slice(0, 5).map(s => `${s.techName}(${s.totalProjects})`)
    });

    return result;

  } catch (error) {
    console.error('Error in calculateTechUsage:', error);
    throw error;
  }
}

/**
 * Get total number of GitHub projects
 */
async function getTotalGitHubProjects(): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github-projects`);
    if (response.ok) {
      const data = await response.json();
      return data.projects?.length || 0;
    }
  } catch (error) {
    console.warn('Failed to get GitHub project count:', error);
  }
  return 0;
}

/**
 * Update tech usage statistics in database
 */
export async function updateTechUsageInDatabase(): Promise<void> {
  try {
    const calculationResult = await calculateTechUsage();

    // Delete existing records
    await prisma.techUsage.deleteMany();

    // Insert new records
    await prisma.techUsage.createMany({
      data: calculationResult.stats.map(stat => ({
        techName: stat.techName,
        totalProjects: stat.totalProjects,
        manualProjects: stat.manualProjects,
        aiExtractedProjects: stat.aiExtractedProjects,
        lastCalculated: stat.lastCalculated
      }))
    });

    console.log(`Updated ${calculationResult.stats.length} tech usage records in database`);
  } catch (error) {
    console.error('Error updating tech usage in database:', error);
    throw error;
  }
}

/**
 * Get tech usage statistics with caching
 */
export async function getTechUsageStats(): Promise<TechUsageCalculationResult> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedStats && (now - lastCacheTime) < CACHE_DURATION) {
    return cachedStats;
  }

  try {
    // Try to get from database first
    const dbStats = await prisma.techUsage.findMany({
      orderBy: [
        { totalProjects: 'desc' },
        { techName: 'asc' }
      ]
    });

    // Check if database data is recent (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const hasRecentData = dbStats.length > 0 &&
                         dbStats.some(stat => stat.lastCalculated > oneHourAgo);

    if (hasRecentData) {
      // Use database data
      const result: TechUsageCalculationResult = {
        stats: dbStats.map(stat => ({
          techName: stat.techName,
          totalProjects: stat.totalProjects,
          manualProjects: stat.manualProjects,
          aiExtractedProjects: stat.aiExtractedProjects,
          lastCalculated: stat.lastCalculated,
          hasIcon: getTechIcon(stat.techName) !== null
        })),
        totalTechnologies: dbStats.length,
        totalProjects: dbStats.reduce((sum, stat) => sum + stat.totalProjects, 0),
        calculationTime: dbStats[0]?.lastCalculated || new Date()
      };

      // Cache the result
      cachedStats = result;
      lastCacheTime = now;

      return result;
    }
  } catch (error) {
    console.warn('Failed to get tech usage from database:', error);
  }

  // Calculate fresh data if database is empty or stale
  console.log('Calculating fresh tech usage statistics...');
  const freshStats = await calculateTechUsage();

  // Update cache
  cachedStats = freshStats;
  lastCacheTime = now;

  // Update database in background (don't wait)
  updateTechUsageInDatabase().catch(error => {
    console.error('Background database update failed:', error);
  });

  return freshStats;
}

/**
 * Get usage count for a specific technology
 */
export async function getTechUsageCount(techName: string): Promise<number> {
  try {
    const stats = await getTechUsageStats();
    const standardName = getStandardTechName(techName);
    const techStat = stats.stats.find(stat => stat.techName === standardName);
    return techStat ? techStat.totalProjects : 0;
  } catch (error) {
    console.error(`Error getting usage count for ${techName}:`, error);
    return 0;
  }
}

/**
 * Clear tech usage cache (useful for testing)
 */
export function clearTechUsageCache(): void {
  cachedStats = null;
  lastCacheTime = 0;
  console.log('Tech usage cache cleared');
}