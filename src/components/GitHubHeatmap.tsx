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
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动设备
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

        // 计算需要获取的日期范围（移动端6个月，桌面端12个月）
        const today = new Date();
        const monthsToShow = isMobile ? 6 : 12;
        const startDate = new Date(today);
        if (monthsToShow === 6) {
          startDate.setMonth(today.getMonth() - 6);
        } else {
          startDate.setFullYear(today.getFullYear() - 1);
        }
        startDate.setDate(today.getDate() + 1); // 从指定时间前的明天开始

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

        // 过滤出指定月数的数据
        const filteredData = allContributions.filter((day: ContributionDay) => {
          const dayDate = new Date(day.date);
          return dayDate >= startDate && dayDate <= today;
        });

        // 按日期排序
        filteredData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // 计算总贡献数
        const total = filteredData.reduce(
          (sum: number, day: ContributionDay) => sum + day.count,
          0
        );

        setContributions(filteredData);
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
  }, [username, isMobile]);

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

  // 按周分组（移动端6个月，桌面端12个月滚动）
  const getWeeks = () => {
    if (contributions.length === 0) return [];

    // 计算显示的周数（移动端约26周，桌面端53周）
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
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 调整到周日

    const weeks: ContributionDay[][] = [];
    const currentDate = new Date(startDate);

    // 生成对应周数的网格
    for (let week = 0; week < weeksToShow; week++) {
      const currentWeek: ContributionDay[] = [];

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];

        // 查找是否有该日期的贡献数据
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
