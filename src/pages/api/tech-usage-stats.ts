import type { NextApiRequest, NextApiResponse } from 'next';
import { getTechUsageStats, updateTechUsageInDatabase, clearTechUsageCache, TechUsageCalculationResult } from '@/services/tech-usage-calculator';

// Response type
interface TechUsageStatsResponse {
  success: boolean;
  data?: TechUsageCalculationResult;
  error?: string;
  cached?: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TechUsageStatsResponse>
) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        // Get tech usage statistics
        const stats = await getTechUsageStats();

        return res.status(200).json({
          success: true,
          data: stats,
          cached: false // The service handles its own caching
        });

      case 'POST':
        // Manual refresh of tech usage statistics
        if (query.action === 'refresh') {
          console.log('Manual refresh of tech usage statistics requested');

          // Clear cache first
          clearTechUsageCache();

          // Update database
          await updateTechUsageInDatabase();

          // Get fresh stats
          const freshStats = await getTechUsageStats();

          return res.status(200).json({
            success: true,
            data: freshStats,
            message: 'Tech usage statistics refreshed successfully'
          });
        }

        // Clear cache only
        if (query.action === 'clear-cache') {
          clearTechUsageCache();

          return res.status(200).json({
            success: true,
            message: 'Tech usage cache cleared successfully'
          });
        }

        return res.status(400).json({
          success: false,
          error: 'Invalid action. Use ?action=refresh or ?action=clear-cache'
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
          success: false,
          error: `Method ${method} Not Allowed`
        });
    }
  } catch (error) {
    console.error('Tech usage stats API error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}