import React, { useState, useEffect } from "react";
import SvgIcon from "./SvgIcon";
import { useLoading } from "@/contexts/LoadingContext";

// GitHub contribution data type definition
interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsData {
  total: { [year: string]: number };
  contributions: ContributionDay[];
}

interface GitHubHeatmapProps {
  username: string;
}

// Cache key generation function
const getCacheKey = (username: string, year: number) =>
  `github_contributions_${username}_${year}`;

// Cache expiration time (24 hours)
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({ username }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Use loading context if available, but don't crash if not
  let setHeatmapLoaded: ((loaded: boolean) => void) | null = null;
  try {
    const loadingContext = useLoading();
    setHeatmapLoaded = loadingContext.setHeatmapLoaded;
  } catch {
    // Loading context not available, which is fine for non-home pages
    setHeatmapLoaded = null;
  }

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Get cached data from local storage
  const getCachedData = (username: string, year: number) => {
    try {
      const cacheKey = getCacheKey(username, year);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - timestamp < CACHE_EXPIRY) {
          return data;
        } else {
          // Clear expired cache
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error("Failed to read cache:", error);
    }
    return null;
  };

  // Save data to local storage
  const setCachedData = (
    username: string,
    year: number,
    data: GitHubContributionsData
  ) => {
    try {
      const cacheKey = getCacheKey(username, year);
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to save cache:", error);
    }
  };

  // Use github-contributions-api to fetch contribution data
  const fetchContributions = async (username: string, year: number) => {
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GitHubContributionsData = await response.json();

      // Save to cache
      setCachedData(username, year, data);

      return data;
    } catch (error) {
      console.error("Failed to fetch GitHub contribution data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate date range to fetch (6 months for mobile, 12 months for desktop)
        const today = new Date();
        const monthsToShow = isMobile ? 6 : 12;
        const startDate = new Date(today);
        if (monthsToShow === 6) {
          startDate.setMonth(today.getMonth() - 6);
        } else {
          startDate.setFullYear(today.getFullYear() - 1);
        }
        startDate.setDate(today.getDate() + 1); // Start from the day after specified time

        const currentYear = today.getFullYear();
        const previousYear = currentYear - 1;

        // Years of data to fetch
        const yearsToFetch = [previousYear, currentYear];
        const allContributions: ContributionDay[] = [];

        // Fetch data for required years
        for (const year of yearsToFetch) {
          let yearData: GitHubContributionsData | null = null;

          // Try to get from cache
          const cachedData = getCachedData(username, year);
          if (cachedData) {
            console.log(`Using cached data for ${year}`);
            yearData = cachedData;
          } else {
            console.log(`Fetching ${year} data from API`);
            try {
              yearData = await fetchContributions(username, year);
            } catch (error) {
              console.warn(`Failed to fetch ${year} data:`, error);
              continue;
            }
          }

          if (yearData) {
            allContributions.push(...yearData.contributions);
          }
        }

        // Filter data for specified months
        const filteredData = allContributions.filter((day: ContributionDay) => {
          const dayDate = new Date(day.date);
          return dayDate >= startDate && dayDate <= today;
        });

        // Sort by date
        filteredData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Calculate total contributions
        const total = filteredData.reduce(
          (sum: number, day: ContributionDay) => sum + day.count,
          0
        );

        setContributions(filteredData);
        setTotalContributions(total);
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        setError(
          "Failed to fetch GitHub data. Please check username or network connection"
        );
        setContributions([]);
        setTotalContributions(0);
      } finally {
        setLoading(false);
        // Notify that heatmap has finished loading (if loading context is available)
        if (setHeatmapLoaded) {
          setHeatmapLoaded(true);
        }
      }
    };

    if (username) {
      loadContributions();
    }
  }, [username, isMobile]);

  // Get color
  const getColor = (level: number): string => {
    const colors = {
      0: "#161b22", // No commits
      1: "#0e4429", // Few commits
      2: "#006d32", // Medium commits
      3: "#26a641", // Many commits
      4: "#39d353", // Lots of commits
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  // Group by week (6 months for mobile, 12 months rolling for desktop)
  const getWeeks = () => {
    if (contributions.length === 0) return [];

    // Calculate weeks to display (approximately 26 weeks for mobile, 53 weeks for desktop)
    const weeksToShow = isMobile ? 26 : 53;
    const monthsBack = isMobile ? 6 : 12;

    const today = new Date();
    const periodStart = new Date(today);
    if (monthsBack === 6) {
      periodStart.setMonth(today.getMonth() - 6);
    } else {
      periodStart.setFullYear(today.getFullYear() - 1);
    }
    periodStart.setDate(today.getDate() + 1);

    // 找到开始周的星期天
    const startDate = new Date(periodStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to Sunday

    const weeks: ContributionDay[][] = [];
    const currentDate = new Date(startDate);

    // Generate grid for corresponding weeks
    for (let week = 0; week < weeksToShow; week++) {
      const currentWeek: ContributionDay[] = [];

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];

        // Check if there's contribution data for this date
        const contribution = contributions.find((c) => c.date === dateStr);

        if (contribution) {
          currentWeek.push(contribution);
        } else if (currentDate >= periodStart && currentDate <= today) {
          // 在日期范围内但没有数据，填充0
          currentWeek.push({ date: dateStr, count: 0, level: 0 });
        } else {
          // 超出范围，填充空白
          currentWeek.push({ date: "", count: 0, level: 0 });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = getWeeks();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[16px] text-[#fff] w-full max-w-full shadow-lg">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="heatmap-loading-animation mb-4">
            {/* GitHub icon with loading animation */}
            <div className="relative">
              <SvgIcon name="github" width={32} height={32} color="#4A90E2" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4A90E2] animate-spin"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium mb-1">
              Loading GitHub Contributions
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.7)]">
              Fetching your coding activity...
            </div>
          </div>
        </div>

        <style jsx>{`
          .heatmap-loading-animation {
            position: relative;
            display: inline-block;
          }

          .heatmap-loading-animation::after {
            content: "";
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: #4a90e2;
            border-right-color: #4a90e2;
            animation: heatmap-pulse 2s ease-in-out infinite;
          }

          @keyframes heatmap-pulse {
            0%,
            100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[16px] text-[#fff] w-full max-w-full shadow-lg">
        <div className="text-red-400">
          <div className="font-semibold mb-2">⚠️ 加载失败</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[16px] text-[#fff] overflow-x-auto custom-scrollbar shadow-lg">
      <div className="mb-[12px]">
        <h3 className="text-[18px] font-semibold mb-[1px] flex items-center gap-2">
          <SvgIcon name="github" width={20} height={20} color="#fff" />
          Past {isMobile ? "6" : "12"} Months GitHub Commits
        </h3>
        <p className="text-[12px] text-[rgba(255,255,255,0.7)]">
          {totalContributions} contributions in the last {isMobile ? "6" : "12"}{" "}
          months
        </p>
      </div>

      <div className="relative">
        {/* 月份标签 */}
        <div className="flex mb-[8px] text-[10px] text-[rgba(255,255,255,0.7)] pl-[20px]">
          {(() => {
            const monthLabels: React.ReactElement[] = [];
            const today = new Date();
            const monthsBack = isMobile ? 6 : 12;
            const weeksToShow = isMobile ? 26 : 53;

            const periodStart = new Date(today);
            if (monthsBack === 6) {
              periodStart.setMonth(today.getMonth() - 6);
            } else {
              periodStart.setFullYear(today.getFullYear() - 1);
            }

            // 找到开始周的星期天
            const startDate = new Date(periodStart);
            startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 下周一

            let currentMonth = startDate.getMonth();
            let weekCount = 0;

            for (let week = 0; week < weeksToShow; week++) {
              const weekStartDate = new Date(startDate);
              weekStartDate.setDate(startDate.getDate() + week * 7);
              const weekMonth = weekStartDate.getMonth();

              if (week === 0 || weekMonth !== currentMonth) {
                if (week > 0) {
                  // 添加前一个月的标签
                  monthLabels.push(
                    <div
                      key={`${currentMonth}-${week}`}
                      className="text-center flex-shrink-0"
                      style={{
                        width: `${Math.max(weekCount * 12, 26)}px`,
                      }}
                    >
                      {months[currentMonth]}
                    </div>
                  );
                }
                currentMonth = weekMonth;
                weekCount = 1;
              } else {
                weekCount++;
              }
            }

            // 添加最后一个月
            if (weekCount > 0) {
              monthLabels.push(
                <div
                  key={`${currentMonth}-final`}
                  className="text-center flex-shrink-0"
                  style={{
                    width: `${Math.max(weekCount * 12, 26)}px`,
                  }}
                >
                  {months[currentMonth]}
                </div>
              );
            }

            return monthLabels;
          })()}
        </div>

        <div className="flex">
          {/* 星期标签 */}
          <div className="flex flex-col mr-[8px] text-[10px] text-[rgba(255,255,255,0.7)] flex-shrink-0">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className="h-[11px] flex items-center mb-[2px] last:mb-0"
              >
                {index % 2 === 1 ? day.slice(0, 1) : ""}
              </div>
            ))}
          </div>

          {/* 热力图网格 */}
          <div className="flex gap-[1px] min-w-0">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-[2px] flex-shrink-0"
              >
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-[11px] h-[11px] rounded-[2px] cursor-pointer hover:ring-1 hover:ring-white transition-all relative group"
                    style={{ backgroundColor: getColor(day.level) }}
                  >
                    {/* 悬停提示 */}
                    {day.date && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {day.date}: {day.count} contributions
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-between mt-[15px] text-[10px] text-[rgba(255,255,255,0.7)]">
          <span>Less</span>
          <div className="flex gap-[2px] items-center">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-[11px] h-[11px] rounded-[2px]"
                style={{ backgroundColor: getColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubHeatmap;
