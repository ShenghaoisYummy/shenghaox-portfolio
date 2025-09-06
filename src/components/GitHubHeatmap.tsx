import React, { useState, useEffect } from "react";
import SvgIcon from "./SvgIcon";

// GitHub贡献数据类型定义
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

// 缓存键生成函数
const getCacheKey = (username: string, year: number) =>
  `github_contributions_${username}_${year}`;

// 缓存过期时间（24小时）
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({ username }) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 从本地存储获取缓存数据
  const getCachedData = (username: string, year: number) => {
    try {
      const cacheKey = getCacheKey(username, year);
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // 检查缓存是否过期
        if (now - timestamp < CACHE_EXPIRY) {
          return data;
        } else {
          // 清除过期缓存
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.error("读取缓存失败:", error);
    }
    return null;
  };

  // 保存数据到本地存储
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
      console.error("保存缓存失败:", error);
    }
  };

  // 使用 github-contributions-api 获取贡献数据
  const fetchContributions = async (username: string, year: number) => {
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GitHubContributionsData = await response.json();

      // 保存到缓存
      setCachedData(username, year, data);

      return data;
    } catch (error) {
      console.error("获取GitHub贡献数据失败:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 计算需要获取的日期范围（过去12个月）
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        oneYearAgo.setDate(today.getDate() + 1); // 从12个月前的明天开始

        const currentYear = today.getFullYear();
        const previousYear = currentYear - 1;
        
        // 需要获取的年份数据
        const yearsToFetch = [previousYear, currentYear];
        const allContributions: ContributionDay[] = [];

        // 获取所需年份的数据
        for (const year of yearsToFetch) {
          let yearData: GitHubContributionsData | null = null;
          
          // 尝试从缓存获取
          const cachedData = getCachedData(username, year);
          if (cachedData) {
            console.log(`使用${year}年缓存数据`);
            yearData = cachedData;
          } else {
            console.log(`从API获取${year}年数据`);
            try {
              yearData = await fetchContributions(username, year);
            } catch (error) {
              console.warn(`获取${year}年数据失败:`, error);
              continue;
            }
          }

          if (yearData) {
            allContributions.push(...yearData.contributions);
          }
        }

        // 过滤出过去12个月的数据
        const twelveMonthsData = allContributions.filter((day: ContributionDay) => {
          const dayDate = new Date(day.date);
          return dayDate >= oneYearAgo && dayDate <= today;
        });

        // 按日期排序
        twelveMonthsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 计算总贡献数
        const total = twelveMonthsData.reduce((sum: number, day: ContributionDay) => sum + day.count, 0);

        setContributions(twelveMonthsData);
        setTotalContributions(total);
      } catch (error) {
        console.error("获取GitHub数据失败:", error);
        setError("获取GitHub数据失败，请检查用户名或网络连接");
        setContributions([]);
        setTotalContributions(0);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadContributions();
    }
  }, [username]);

  // 获取颜色
  const getColor = (level: number): string => {
    const colors = {
      0: "#161b22", // 无提交
      1: "#0e4429", // 少量提交
      2: "#006d32", // 中等提交
      3: "#26a641", // 较多提交
      4: "#39d353", // 大量提交
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  // 按周分组（12个月滚动）
  const getWeeks = () => {
    if (contributions.length === 0) return [];

    // 创建完整的53周网格（一年最多53周）
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(today.getDate() + 1);

    // 找到开始周的星期天
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 调整到周日

    const weeks: ContributionDay[][] = [];
    const currentDate = new Date(startDate);

    // 生成53周的网格
    for (let week = 0; week < 53; week++) {
      const currentWeek: ContributionDay[] = [];
      
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // 查找是否有该日期的贡献数据
        const contribution = contributions.find(c => c.date === dateStr);
        
        if (contribution) {
          currentWeek.push(contribution);
        } else if (currentDate >= oneYearAgo && currentDate <= today) {
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
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 bg-[#3d85a9] rounded animate-spin"></div>
          <span>加载GitHub贡献图...</span>
        </div>
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
        <h3 className="text-[16px] font-semibold mb-[1px] flex items-center gap-2">
          <SvgIcon name="github" width={20} height={20} color="#fff" />
          Past 12 Months GitHub Commits
        </h3>
        <p className="text-[12px] text-[rgba(255,255,255,0.7)]">
          {totalContributions} contributions in the last 12 months
        </p>
      </div>

      <div className="relative">
        {/* 月份标签 */}
        <div className="flex mb-[8px] text-[10px] text-[rgba(255,255,255,0.7)] pl-[20px]">
          {(() => {
            const monthLabels: React.ReactElement[] = [];
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);
            
            // 找到开始周的星期天
            const startDate = new Date(oneYearAgo);
            startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 下周一
            
            let currentMonth = startDate.getMonth();
            let weekCount = 0;
            
            for (let week = 0; week < 53; week++) {
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
