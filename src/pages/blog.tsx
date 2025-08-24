import { useState, useEffect, useCallback, JSX, useRef } from "react";
import Head from "next/head";
import SvgIcon from "@/components/SvgIcon";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface BlogArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  readTime: string;
  filename: string;
  category: string;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface DirectoryTreeItem {
  id: string;
  name: string;
  isFolder: boolean;
  level: number;
  children: DirectoryTreeItem[];
}

interface BlogStats {
  totalArticles: number;
  totalDirectories: number;
  totalFiles: number;
  lastUpdated: string;
  categoryStats: { [key: string]: number };
  directoryTree: DirectoryTreeItem[];
}

const DirectoryItem = React.memo(
  ({
    item,
    level = 0,
    collapsedFolders,
    toggleFolder,
  }: {
    item: DirectoryTreeItem;
    level?: number;
    collapsedFolders: Set<string>;
    toggleFolder: (folderId: string) => void;
  }) => {
    const isCollapsed = collapsedFolders.has(item.id);

    if (item.isFolder) {
      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-[rgba(255,255,255,.05)] rounded px-1 py-0.5"
            style={{ paddingLeft: `${level * 12}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            <SvgIcon
              name={isCollapsed ? "right" : "down"}
              width={12}
              height={12}
              color="#9CA3AF"
              className="mr-1 flex-shrink-0"
            />
            <span className="text-yellow-400">📁</span>
            <span className="ml-1 text-gray-300">{item.name}</span>
          </div>
          {!isCollapsed && (
            <div>
              {item.children.map((child, index) => (
                <DirectoryItem
                  key={child.id || `${child.name}-${index}`}
                  item={child}
                  level={level + 1}
                  collapsedFolders={collapsedFolders}
                  toggleFolder={toggleFolder}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className="flex items-center"
          style={{ paddingLeft: `${level * 12 + 16}px` }}
        >
          <span className="text-blue-400">📄</span>
          <span className="ml-1 text-gray-300 line-clamp-1">{item.name}</span>
        </div>
      );
    }
  }
);

DirectoryItem.displayName = "DirectoryItem";

// Extract typewriter animation as independent component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;
    const restartPause = 1000;

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (currentIndex > 0) {
            setDisplayText(text.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            setTimeout(() => setIsDeleting(false), restartPause);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, text]);

  return (
    <span className="inline-block">
      {displayText.split(" ").map((word, wordIndex) => {
        if (word === "Frontend") {
          return (
            <span
              key={wordIndex}
              className="bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] bg-clip-text text-transparent"
            >
              {word}
            </span>
          );
        }
        return (
          <span key={wordIndex}>
            {word}
            {wordIndex < displayText.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
      <span className="animate-pulse text-[#3d85a9] pl-[10px] pb-[4px]">|</span>
    </span>
  );
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(
    null
  );
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const blogContentRef = useRef<HTMLDivElement>(null);
  // Load article list
  useEffect(() => {
    loadArticles();
    loadBlogStats();
  }, []);

  useEffect(() => {
    if (!selectedArticle) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollContainer = document.querySelector(
            ".custom-scrollbar"
          ) as HTMLElement;
          if (!scrollContainer) return;

          const scrollTop = scrollContainer.scrollTop;
          const containerHeight = scrollContainer.clientHeight;

          const headings = tableOfContents
            .map((item) => {
              const element = document.getElementById(item.id);
              if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                // Calculate position relative to scroll container
                const relativeTop = rect.top - containerRect.top;
                return {
                  id: item.id,
                  top: relativeTop,
                  absoluteTop: scrollTop + relativeTop,
                  element,
                };
              }
              return null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null); // Type guard

          if (headings.length === 0) return;

          // Improved detection logic
          const threshold = 80; // Reduce threshold
          let bestHeading = headings[0]; // Default to first heading

          // Find the most suitable heading
          for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];

            // If heading is near or above viewport top
            if (heading.top <= threshold) {
              bestHeading = heading;
            } else {
              // If current heading is below threshold, stop searching
              break;
            }
          }

          // Special handling: if no heading is within threshold, choose closest visible heading to top
          if (bestHeading.top > threshold) {
            const visibleHeadings = headings.filter(
              (h) => h.top >= 0 && h.top <= containerHeight
            );
            if (visibleHeadings.length > 0) {
              bestHeading = visibleHeadings[0];
            }
          }

          // Only update when found heading is different from current
          if (bestHeading && bestHeading.id !== activeHeading) {
            setActiveHeading(bestHeading.id);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    // Get scroll container
    const scrollContainer = document.querySelector(".custom-scrollbar");
    if (scrollContainer) {
      // Add debounce delay
      let timeoutId: NodeJS.Timeout;
      const debouncedHandleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, 30); // Reduce debounce time
      };

      scrollContainer.addEventListener("scroll", debouncedHandleScroll);
      // Initial check
      setTimeout(handleScroll, 100); // Delay initial check

      return () => {
        clearTimeout(timeoutId);
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
      };
    }
  }, [selectedArticle, tableOfContents, activeHeading]);

  // Listen to scroll to show/hide back to top button
  useEffect(() => {
    if (selectedArticle) {
      setShowBackToTop(false);
      return;
    }

    // Wait for data loading completion and DOM rendering
    if (loading || articles.length === 0) {
      setShowBackToTop(false);
      return;
    }

    const handleScroll = () => {
      if (blogContentRef.current) {
        const scrollTop = blogContentRef.current.scrollTop;
        const shouldShow = scrollTop > 100;
        console.log(
          "Scroll position:",
          scrollTop,
          "Should show button:",
          shouldShow
        ); // Debug log
        setShowBackToTop(shouldShow);
      }
    };

    // Delay setting up listener to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const scrollContainer = blogContentRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        console.log("Back to top listener added");

        // Immediately check scroll position once
        handleScroll();
      } else {
        console.log("blogContentRef.current is null");
      }
    }, 300); // Increase delay time

    return () => {
      clearTimeout(timer);
      const scrollContainer = blogContentRef.current;
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedArticle, loading, articles.length]);

  // Back to top function
  const scrollToTop = () => {
    if (blogContentRef.current) {
      blogContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Add collapse state management
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    new Set()
  );

  // Toggle folder collapse state
  const toggleFolder = useCallback((folderId: string) => {
    setCollapsedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to load articles");
      }
      const data = await response.json();
      setArticles(data.articles || []);
      setCategories(data.categories || ["All"]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load articles:", error);
      setArticles([]);
      setCategories(["All"]);
      setLoading(false);
    }
  };

  const loadBlogStats = async () => {
    try {
      const response = await fetch("/api/blog-stats");
      if (response.ok) {
        const stats = await response.json();
        setBlogStats(stats);

        // 默认收缩所有文件夹
        const getAllFolderIds = (items: DirectoryTreeItem[]): string[] => {
          const folderIds: string[] = [];
          items.forEach((item) => {
            if (item.isFolder) {
              folderIds.push(item.id);
              if (item.children && item.children.length > 0) {
                folderIds.push(...getAllFolderIds(item.children));
              }
            }
          });
          return folderIds;
        };

        const allFolderIds = getAllFolderIds(stats.directoryTree || []);
        setCollapsedFolders(new Set(allFolderIds));
      }
    } catch (error) {
      console.error("加载统计信息失败:", error);
    }
  };
  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Generate table of contents
  const generateTableOfContents = (content: string) => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    return headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, "");
      return {
        id: `heading-${index}`,
        title,
        level,
      };
    });
  };

  // Open article
  const openArticle = (article: BlogArticle) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedArticle(article);
      setTableOfContents(generateTableOfContents(article.content));
      setIsTransitioning(false);
    }, 300);
  };

  // Return to article list
  const backToList = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedArticle(null);
      setTableOfContents([]);
      setIsTransitioning(false);
    }, 300);
  };

  // Jump to specified heading
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [showToast, setShowToast] = React.useState(false);

  // Render Markdown content (simplified version)
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent = "";
    let codeLanguage = "";
    let headingIndex = 0; // Add heading counter

    // Copy code functionality
    const copyToClipboard = (text: string) => {
      // Remove trailing newlines
      const cleanText = text.replace(/\n$/, "");
      navigator.clipboard
        .writeText(cleanText)
        .then(() => {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 2000);
        })
        .catch((err) => {
          console.error("Copy failed:", err);
        });
    };

    lines.forEach((line, index) => {
      // Code block processing
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = "";
          // Extract language type
          codeLanguage = line.replace("```", "").trim() || "plaintext";
        } else {
          inCodeBlock = false;

          // Key fix: create independent content copy for each code block
          const currentCodeContent = codeBlockContent;
          const currentLanguage = codeLanguage;

          elements.push(
            <div
              key={`code-${index}`}
              className="bg-gray-900 rounded-lg my-4 overflow-hidden relative group"
            >
              {/* Language label and copy button */}
              <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 uppercase font-mono">
                  {currentLanguage}
                </span>
                <button
                  onClick={() => copyToClipboard(currentCodeContent)}
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                  title="Copy code"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
              </div>

              {/* Use SyntaxHighlighter for syntax highlighting */}
              <SyntaxHighlighter
                language={
                  currentLanguage === "plaintext" ? "text" : currentLanguage
                }
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  background: "transparent",
                  fontSize: "14px",
                }}
                showLineNumbers={false}
                wrapLines={true}
              >
                {currentCodeContent}
              </SyntaxHighlighter>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        // Fix copy functionality: correctly concatenate code content
        if (codeBlockContent === "") {
          codeBlockContent = line;
        } else {
          codeBlockContent += "\n" + line;
        }
        return;
      }

      // Heading processing - fix ID generation logic
      if (line.startsWith("# ")) {
        const id = `heading-${headingIndex}`; // Use counter to generate ID
        headingIndex++; // Increment counter
        elements.push(
          <h1
            key={index}
            id={id}
            className="text-3xl font-bold mb-4 text-white mt-8 first:mt-0"
          >
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        const id = `heading-${headingIndex}`; // Use counter to generate ID
        headingIndex++; // Increment counter
        elements.push(
          <h2
            key={index}
            id={id}
            className="text-2xl font-bold mb-3 text-white mt-6"
          >
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        const id = `heading-${headingIndex}`; // Use counter to generate ID
        headingIndex++; // Increment counter
        elements.push(
          <h3
            key={index}
            id={id}
            className="text-xl font-bold mb-2 text-white mt-4"
          >
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.trim() && !line.startsWith("`")) {
        // Normal paragraph
        elements.push(
          <p key={index} className="mb-4 text-gray-300 leading-relaxed">
            {line}
          </p>
        );
      } else if (!line.trim()) {
        elements.push(<br key={index} />);
      }
    });

    return elements;
  };

  if (loading) {
    return (
      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] font-[family-name:var(--font-geist-sans)] flex items-center justify-center relative z-20`}
      >
        <div className="loader">
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
          <div className="circle">
            <div className="dot"></div>
            <div className="outline"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>docs - austin&apos;s web</title>
        <meta
          name="description"
          content="Frontend development experience and technical articles"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          Code copied to clipboard
        </div>
      )}

      <div
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-[family-name:var(--font-geist-sans)] custom-scrollbar overflow-x-hidden`}
        style={{
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        {/* 导航按钮 */}
        <div className="fixed top-4 left-4 z-10 flex gap-2">
          <Link
            href="/works"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="left" width={16} height={16} color="#fff" />
            <span className="text-sm">Portfolio</span>
          </Link>
          <Link
            href="/"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="home" width={16} height={16} color="#fff" />
            <span className="text-sm">Home</span>
          </Link>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-8 max-w-full overflow-x-hidden">
          {/* Article list view */}
          <div
            className={`transition-all duration-300 ${
              selectedArticle
                ? "opacity-0 pointer-events-none absolute"
                : "opacity-100"
            } ${isTransitioning ? "scale-95" : "scale-100"}`}
          >
            {/* 主要内容区域 - 左右布局 */}
            <div className="max-w-7xl mx-auto flex gap-4 h-[80vh]">
              {/* 左侧分类面板 */}
              <div className="w-64 sticky top-45 h-fit hidden sm:block">
                <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-4 border border-[rgba(255,255,255,.1)]">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <SvgIcon name="tag" width={20} height={20} color="#fff" />
                    Article Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                          selectedCategory === category
                            ? "bg-[#3d85a9] text-white shadow-lg"
                            : "bg-[rgba(0,0,0,.2)] text-gray-300 hover:bg-[rgba(0,0,0,.4)] border border-[rgba(255,255,255,.05)]"
                        }`}
                      >
                        <span>{category}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedCategory === category
                              ? "bg-[rgba(255,255,255,.2)] text-white"
                              : "bg-[rgba(255,255,255,.1)] text-gray-400"
                          }`}
                        >
                          {category === "All"
                            ? articles.length
                            : articles.filter(
                                (article) => article.category === category
                              ).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center article list */}
              <div className="flex-1 w-full">
                {/* 搜索栏 */}
                <div className="mb-4">
                  <div className="max-w-2xl mx-auto">
                    <h1 className="text-[40px] font-bold text-[#fff] text-shadow-sm flex items-end justify-center mb-[10px]">
                      <TypewriterText text="Frontend Knowledge Base" />
                    </h1>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search articles, content, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-[rgba(0,0,0,.3)] border border-[rgba(255,255,255,.1)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#3d85a9] transition-colors"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <SvgIcon
                          name="search"
                          width={20}
                          height={20}
                          color="#fff"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 移动端分类tabs */}
                <div className="mt-4 sm:hidden">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1 -mx-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-[#3d85a9] text-white shadow-lg"
                            : "bg-[rgba(0,0,0,.3)] text-gray-300 hover:bg-[rgba(0,0,0,.5)] border border-[rgba(255,255,255,.1)]"
                        }`}
                      >
                        {category}
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            selectedCategory === category
                              ? "bg-[rgba(255,255,255,.2)] text-white"
                              : "bg-[rgba(255,255,255,.1)] text-gray-400"
                          }`}
                        >
                          {category === "All"
                            ? articles.length
                            : articles.filter(
                                (article) => article.category === category
                              ).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  ref={blogContentRef}
                  className="grid gap-3 max-h-[70vh] overflow-auto custom-scrollbar blog-content relative pb-20"
                >
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => openArticle(article)}
                      className="bg-[rgba(0,0,0,.3)] rounded-lg p-4 cursor-pointer hover:bg-[rgba(0,0,0,.4)] transition-all duration-200 border border-[rgba(255,255,255,.1)] hover:border-[#3d85a9] group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-xl font-bold text-white group-hover:text-[#3d85a9] transition-colors">
                          {article.title}
                        </h2>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm text-gray-400">
                            {article.date}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-2 leading-relaxed">
                        {article.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-[rgba(61,133,169,.2)] text-[#fff] rounded text-sm">
                            {article.category}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Back to top button */}
                  {showBackToTop && (
                    <div className="sticky bottom-4 flex justify-end pr-4 pointer-events-none ">
                      <button
                        onClick={scrollToTop}
                        className="bg-[rgba(61,133,169,0.9)] hover:bg-[rgba(61,133,169,1)] text-white p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] pointer-events-auto cursor-pointer"
                        aria-label="Back to top"
                      >
                        <SvgIcon
                          name="top"
                          width={20}
                          height={20}
                          color="#fff"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">
                      {selectedCategory === "All"
                        ? "No related articles found"
                        : `No related articles found in "${selectedCategory}" category`}
                    </p>
                  </div>
                )}
              </div>

              {/* 右侧统计面板 */}
              <div className="w-80 sticky top-49 h-fit hidden lg:block">
                <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-3 border border-[rgba(255,255,255,.1)]">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <SvgIcon name="count" width={20} height={20} color="#fff" />
                    Blog Statistics
                  </h3>

                  {blogStats ? (
                    <div className="space-y-3">
                      {/* 总体统计 */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                          <SvgIcon
                            name="count1"
                            width={15}
                            height={15}
                            color="#fff"
                          />
                          Overall Statistics
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">
                              Total Articles
                            </span>
                            <span className="text-white font-medium">
                              {blogStats.totalArticles} articles
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">
                              Total Directories
                            </span>
                            <span className="text-white font-medium">
                              {blogStats.totalDirectories} dirs
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total Files</span>
                            <span className="text-white font-medium">
                              {blogStats.totalFiles} files
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 分类统计 */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-[#fff] mb-3 flex gap-[5px] items-center">
                          <SvgIcon
                            name="count2"
                            width={15}
                            height={15}
                            color="#fff"
                          />
                          Category Statistics
                        </h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(blogStats.categoryStats).map(
                            ([category, count]) => (
                              <div
                                key={category}
                                className="flex justify-between items-center"
                              >
                                <span className="text-gray-300">
                                  {category}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-[rgba(255,255,255,.1)] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-[#3d85a9] to-[#1b2c55] rounded-full transition-all duration-300"
                                      style={{
                                        width: `${
                                          (count / blogStats.totalArticles) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-white font-medium w-8 text-right">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Directory Structure */}
                      <div className="bg-[rgba(0,0,0,.2)] rounded-lg p-4 overflow-y-auto custom-scrollbar h-[150px]">
                        <h4 className="text-sm font-medium text-[#fff] mb-3">
                          📁 Directory Structure
                        </h4>
                        <div className="text-xs text-gray-300 font-mono leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                          {blogStats?.directoryTree &&
                          blogStats.directoryTree.length > 0 ? (
                            <div className="space-y-1">
                              {blogStats.directoryTree.map(
                                (item: DirectoryTreeItem, index: number) => (
                                  <DirectoryItem
                                    key={item.id || `${item.name}-${index}`}
                                    item={item}
                                    collapsedFolders={collapsedFolders}
                                    toggleFolder={toggleFolder}
                                  />
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-500">
                              No directory structure available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 更新时间 */}
                      <div className="text-xs text-gray-400 text-center pt-2 border-t border-[rgba(255,255,255,.1)]">
                        Last updated: {blogStats.lastUpdated}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-[#3d85a9] border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">
                        Loading statistics...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Article detail view - responsive optimization */}
          {selectedArticle && (
            <div
              className={`transition-all bg-[rgba(0,0,0,.1)] duration-300 p-10 rounded-lg ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
                {/* Article content */}
                <div className="flex-1 order-2 lg:order-1">
                  {/* Back button */}
                  <button
                    onClick={backToList}
                    className="mb-4 lg:mb-6 bg-[rgba(0,0,0,.3)] hover:bg-[rgba(0,0,0,.4)] rounded-lg px-3 py-2 lg:px-4 lg:py-2 text-white transition-colors flex items-center gap-2 text-sm lg:text-base"
                  >
                    <SvgIcon name="left" width={16} height={16} color="#fff" />
                    Back to article list
                  </button>

                  {/* Article header */}
                  <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 leading-tight">
                      {selectedArticle.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-gray-300 mb-3 lg:mb-4 text-sm lg:text-base">
                      <span>{selectedArticle.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{selectedArticle.readTime}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{selectedArticle.category}</span>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline">
                        {selectedArticle.filename}
                      </span>
                    </div>
                  </div>

                  {/* Article content */}
                  <div className="prose prose-invert max-w-none prose-sm lg:prose-base">
                    {renderMarkdown(selectedArticle.content)}
                  </div>
                </div>

                {/* Table of Contents - responsive handling */}
                {tableOfContents.length > 0 && (
                  <div className="w-full max-w-[300px] order-1 lg:order-2 lg:sticky lg:top-20 lg:h-fit">
                    <div className="bg-[rgba(0,0,0,.3)] rounded-lg p-3 lg:p-4 border border-[rgba(255,255,255,.1)]">
                      <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4">
                        Table of Contents
                      </h3>
                      <nav className="lg:block">
                        {/* Mobile collapsible TOC */}
                        <div className="lg:hidden">
                          <details className="group">
                            <summary className="cursor-pointer text-sm text-gray-300 hover:text-white transition-colors list-none flex items-center justify-between">
                              <span>Expand TOC</span>
                              <SvgIcon
                                name="down"
                                width={16}
                                height={16}
                                color="#9CA3AF"
                                className="group-open:rotate-180 transition-transform"
                              />
                            </summary>
                            <div className="mt-2 max-h-60 overflow-y-auto custom-scrollbar overflow-x-hidden">
                              {tableOfContents.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => scrollToHeading(item.id)}
                                  className={`block w-full text-left py-2 px-2 text-sm hover:bg-[rgba(255,255,255,.1)] rounded transition-colors relative ${
                                    activeHeading === item.id
                                      ? "text-[#214362] font-semibold"
                                      : item.level === 1
                                      ? "text-white font-medium"
                                      : item.level === 2
                                      ? "text-gray-300 ml-4"
                                      : "text-gray-400 ml-8"
                                  }`}
                                >
                                  {activeHeading === item.id && (
                                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-[#214362] rounded-r"></span>
                                  )}
                                  <span
                                    className={
                                      activeHeading === item.id ? "ml-3" : ""
                                    }
                                  >
                                    {item.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </details>
                        </div>

                        {/* Desktop expanded TOC */}
                        <div className="hidden lg:block">
                          {tableOfContents.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => scrollToHeading(item.id)}
                              className={`block w-full text-left py-2 px-2 text-sm hover:bg-[rgba(255,255,255,.1)] rounded transition-colors relative ${
                                activeHeading === item.id
                                  ? "text-[#1E2939] font-semibold pl-4"
                                  : item.level === 1
                                  ? "text-white font-medium"
                                  : item.level === 2
                                  ? "text-gray-300 ml-4"
                                  : "text-gray-400 ml-8"
                              }`}
                            >
                              {activeHeading === item.id && (
                                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-[#1E2939] rounded-r"></span>
                              )}
                              <span
                                className={activeHeading === item.id ? "" : ""}
                              >
                                {item.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-8 right-8 z-10">
          <Link
            href="/chat"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <span className="text-sm">Chat Room</span>
            <SvgIcon name="right" width={20} height={20} color="#fff" />
          </Link>
        </div>
      </div>
    </>
  );
}
