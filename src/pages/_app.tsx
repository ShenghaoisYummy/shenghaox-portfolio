import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import LoadingAnimation from "@/components/LoadingAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import CommentModal from "@/components/CommentModal";
import { useState, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import {
  commentAPI,
  reactionAPI,
  ReactionType,
  ReactionCounts,
} from "../../service/api/comment";
import { useRouter } from "next/router";

// 布局组件，包含公共的主题切换和背景
function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [commentCount, setCommentCount] = useState(0);
  const [reactionCounts, setReactionCounts] = useState<ReactionCounts>({
    like: 0,
    cheer: 0,
    celebrate: 0,
    appreciate: 0,
    smile: 0,
  });
  const [hasReacted, setHasReacted] = useState<Record<ReactionType, boolean>>({
    like: false,
    cheer: false,
    celebrate: false,
    appreciate: false,
    smile: false,
  });

  // 添加谢谢你动画状态
  const [showThanks, setShowThanks] = useState<Record<ReactionType, boolean>>({
    like: false,
    cheer: false,
    celebrate: false,
    appreciate: false,
    smile: false,
  });

  // 加载评论数量和点赞数量
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [commentsData, reactionsData] = await Promise.all([
          commentAPI.getComments(),
          reactionAPI.getReactions(),
        ]);
        setCommentCount(commentsData.length);
        setReactionCounts(reactionsData);

        // 检查本地存储是否已点赞
        const reacted: Record<ReactionType, boolean> = {
          like: localStorage.getItem("hasReacted_like") === "true",
          cheer: localStorage.getItem("hasReacted_cheer") === "true",
          celebrate: localStorage.getItem("hasReacted_celebrate") === "true",
          appreciate: localStorage.getItem("hasReacted_appreciate") === "true",
          smile: localStorage.getItem("hasReacted_smile") === "true",
        };
        setHasReacted(reacted);
      } catch (error) {
        console.error("加载数据失败:", error);
      }
    };

    loadCounts();
  }, []);

  // 处理点赞
  const handleReaction = async (type: ReactionType) => {
    if (hasReacted[type]) return;

    try {
      const result = await reactionAPI.addReaction(type);
      setReactionCounts((prev) => ({
        ...prev,
        [type]: result.count,
      }));
      setHasReacted((prev) => ({
        ...prev,
        [type]: true,
      }));
      localStorage.setItem(`hasReacted_${type}`, "true");

      // 显示谢谢你动画
      setShowThanks((prev) => ({
        ...prev,
        [type]: true,
      }));

      // 1秒后隐藏动画
      setTimeout(() => {
        setShowThanks((prev) => ({
          ...prev,
          [type]: false,
        }));
      }, 2000);
    } catch (error) {
      console.error("点赞失败:", error);
    }
  };

  const handleCommentClick = () => {
    setIsCommentOpen(true);
  };

  // 格式化评论数量显示
  const formatCount = (count: number) => {
    return count > 99 ? "99+" : count.toString();
  };

  const isChatPage = router.pathname === "/chat";

  return (
    <div className="relative min-h-screen mb-8">
      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 浅色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1] min-h-full"
        style={{
          backgroundImage: `url('/images/sea.jpg')`,
          opacity: theme === "light" ? 1 : 0,
        }}
      />

      {/* 深色主题背景图片 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat blur-sm transition-opacity duration-1000 ease-in-out z-[-1] min-h-full"
        style={{
          backgroundImage: `url('/images/starry-night2.jpg')`,
          opacity: theme === "dark" ? 1 : 0,
        }}
      />

      {/* 点赞按钮 */}

      {!isChatPage && (
        <div className="fixed top-72 right-4 z-10 hidden md:block">
          <div className="flex flex-col justify-start text-1xl items-center shadow-xl z-10 bg-black/20 dark:bg-[#191818] gap-2 p-2 rounded-2xl transition-transform duration-300 hover:scale-105">
            <button
              onClick={() => handleReaction("like")}
              disabled={hasReacted.like}
              className={`
              relative group transition-all duration-200 ease-out
              ${
                hasReacted.like
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110"
              }
              bg-white dark:bg-[#191818] rounded-full p-1 px-2 dark:bg-gray-700
              transform hover:-translate-y-1
            `}
            >
              {/* 谢谢你动画 */}
              {showThanks.like && (
                <div className="fixed top-1/2 right-4 transform -translate-y-1/2 animate-slide-in-right z-50">
                  <div className="text-white text-sm font-bold shadow-2xl bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/20">
                    Thanks
                  </div>
                </div>
              )}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black dark:bg-white dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Like{" "}
                {reactionCounts.like > 0 &&
                  `(${formatCount(reactionCounts.like)})`}
              </div>
              👍
            </button>

            <button
              onClick={() => handleReaction("cheer")}
              disabled={hasReacted.cheer}
              className={`
              relative group transition-all duration-200 ease-out
              ${
                hasReacted.cheer
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110"
              }
              bg-white dark:bg-[#191818] rounded-full p-1 px-2 dark:bg-gray-700
              transform hover:-translate-y-1
            `}
            >
              {/* 谢谢你动画 */}
              {showThanks.cheer && (
                <div className="fixed top-1/2 right-4 transform -translate-y-1/2 animate-slide-in-right z-50">
                  <div className="text-white text-sm font-bold shadow-2xl bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/20">
                    谢啦
                  </div>
                </div>
              )}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black dark:bg-white dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Cheer{" "}
                {reactionCounts.cheer > 0 &&
                  `(${formatCount(reactionCounts.cheer)})`}
              </div>
              👏🏻
            </button>

            <button
              onClick={() => handleReaction("celebrate")}
              disabled={hasReacted.celebrate}
              className={`
              relative group transition-all duration-200 ease-out
              ${
                hasReacted.celebrate
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110"
              }
              bg-white dark:bg-[#191818] rounded-full p-1 px-2 dark:bg-gray-700
              transform hover:-translate-y-1
            `}
            >
              {/* 谢谢你动画 */}
              {showThanks.celebrate && (
                <div className="fixed top-1/2 right-4 transform -translate-y-1/2 animate-slide-in-right z-50">
                  <div className="text-white text-sm font-bold shadow-2xl bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/20">
                    Thanks
                  </div>
                </div>
              )}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black dark:bg-white dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Celebrate{" "}
                {reactionCounts.celebrate > 0 &&
                  `(${formatCount(reactionCounts.celebrate)})`}
              </div>
              🎉
            </button>

            <button
              onClick={() => handleReaction("appreciate")}
              disabled={hasReacted.appreciate}
              className={`
              relative group transition-all duration-200 ease-out
              ${
                hasReacted.appreciate
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110"
              }
              bg-white dark:bg-[#191818] rounded-full p-1 px-2 dark:bg-gray-700
              transform hover:-translate-y-1
            `}
            >
              {/* 谢谢你动画 */}
              {showThanks.appreciate && (
                <div className="fixed top-1/2 right-4 transform -translate-y-1/2 animate-slide-in-right z-50">
                  <div className="text-white text-sm font-bold shadow-2xl bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/20">
                    谢啦
                  </div>
                </div>
              )}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black dark:bg-white dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Appreciate{" "}
                {reactionCounts.appreciate > 0 &&
                  `(${formatCount(reactionCounts.appreciate)})`}
              </div>
              ✨
            </button>

            <button
              onClick={() => handleReaction("smile")}
              disabled={hasReacted.smile}
              className={`
              relative group transition-all duration-200 ease-out
              ${
                hasReacted.smile
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:scale-110"
              }
              bg-white dark:bg-[#191818] rounded-full p-1 px-2 dark:bg-gray-700
              transform hover:-translate-y-1
            `}
            >
              {/* 谢谢你动画 */}
              {showThanks.smile && (
                <div className="fixed top-1/2 right-4 transform -translate-y-1/2 animate-slide-in-right z-50">
                  <div className="text-white text-sm font-bold shadow-2xl bg-black/80 px-2 py-1 rounded whitespace-nowrap border border-white/20">
                    Thanks
                  </div>
                </div>
              )}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black dark:bg-white dark:text-black text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Smile{" "}
                {reactionCounts.smile > 0 &&
                  `(${formatCount(reactionCounts.smile)})`}
              </div>
              🙂
            </button>
          </div>
        </div>
      )}

      {/* 评论按钮 */}
      {!isChatPage && (
        <button
          onClick={handleCommentClick}
          className={`
          fixed bottom-48 right-4 z-10 hidden md:flex
          bg-[#5D676B] hover:bg-[#2C363F] text-white
          shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          items-center justify-center cursor-pointer w-12 h-12 rounded-full 
        `}
        >
          <SvgIcon name="comment" width={20} height={20} color="#fff" />
          <span className="text-[11px] flex items-center justify-center font-medium absolute right-[-15px] top-0 bg-[#2C363F] w-[25px] h-[25px] rounded-full">
            {formatCount(commentCount)}
          </span>
        </button>
      )}
      {/* 评论弹窗 */}
      <CommentModal
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />

      {/* 页面内容 */}
      {children}
    </div>
  );
}

// Inner App component that uses loading context
function AppContent({ Component, pageProps }: AppProps) {
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const { isMainLoadingComplete } = useLoading();
  const router = useRouter();

  // Minimum loading time of 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading animation until both minimum time has elapsed AND heatmap is loaded
  // Only wait for heatmap on the home page
  const isHomePage = router.pathname === '/';
  const shouldShowLoading = !isMinTimeElapsed || (isHomePage && !isMainLoadingComplete());

  return (
    <>
      {/* 全局加载动画 */}
      <LoadingAnimation isVisible={shouldShowLoading} />

      {/* 布局组件包装页面内容 */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </LoadingProvider>
    </ThemeProvider>
  );
}
