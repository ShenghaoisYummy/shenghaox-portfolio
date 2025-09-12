import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import SvgIcon from "@/components/SvgIcon";
import { useState, useEffect } from "react";
import ImageModal from "@/components/ImageModal";
import Head from "next/head";
import Link from "next/link";
import {
  manualWorksData,
  ProjectDisplayItem,
  GitHubProjectItem,
} from "@/data/works";
import { LLM_MODEL_DISPLAY_NAME } from "@/services/llm-techstack";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface WorkFunction {
  name: string;
  img1?: string;
  img2?: string;
  img3?: string;
}

interface Work {
  title: string;
  description: string;
  image: string;
  tech: string[];
  link: string;
  features: string[];
  download_url?: string;
  function?: WorkFunction[];
  desc?: string;
  // Enhanced tech stack information
  extractedTechStack?: string[];
  techStackSource?: 'manual' | 'extracted' | 'mixed';
  extractedTechCount?: number;
  source?: 'manual' | 'github';
}

// Component to handle GitHub project image loading with proper fallbacks
function GitHubProjectImage({ work }: { work: ProjectDisplayItem }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skipImageLoad, setSkipImageLoad] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Check if image exists using API to avoid 404 errors
  useEffect(() => {
    setValidationComplete(false);

    // Validate image path first
    if (
      !work.image ||
      work.image.length < 5 ||
      work.image === "/images/" ||
      work.image === "/images"
    ) {
      setSkipImageLoad(true);
      setIsLoading(false);
      setImageError(true);
      setValidationComplete(true);
      return;
    }

    if (work.source === "github") {
      if (work.image.includes("/images/github-projects/")) {
        // Local GitHub project images - check if the image exists server-side
        fetch(`/api/check-image?imagePath=${encodeURIComponent(work.image)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.exists) {
              // Image exists, load it normally
              setSkipImageLoad(false);
              setIsLoading(true);
              setImageError(false);
            } else {
              // Image doesn't exist, skip loading and show placeholder
              setSkipImageLoad(true);
              setIsLoading(false);
              setImageError(true);
            }
            setValidationComplete(true);
          })
          .catch(() => {
            // On API error, default to showing placeholder
            setSkipImageLoad(true);
            setIsLoading(false);
            setImageError(true);
            setValidationComplete(true);
          });
      } else {
        // GitHub asset URLs or external images - load directly
        setSkipImageLoad(false);
        setIsLoading(true);
        setImageError(false);
        setValidationComplete(true);
      }
    } else {
      // For other images (README, manual projects), load normally
      setSkipImageLoad(false);
      setIsLoading(true);
      setImageError(false);
      setValidationComplete(true);
    }
  }, [work.image, work.source]);

  const GitHubPlaceholder = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center p-6 shadow-2xl border border-slate-700/50">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #4A90E2 3px, transparent 3px), radial-gradient(circle at 75% 75%, #4A90E2 2px, transparent 2px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent"></div>
      <div className="relative z-10 text-center transform hover:scale-105 transition-all duration-300">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1b2c55] via-[#2d4a7a] to-[#3d85a9] rounded-3xl flex items-center justify-center shadow-xl ring-4 ring-blue-500/20 hover:ring-blue-400/40 transition-all duration-300">
          <SvgIcon name="github" width={36} height={36} color="#fff" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{work.title}</h3>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {work.tech.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="bg-[rgba(255,255,255,0.1)] text-white text-xs px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        {work.source === "github" && (
          <div className="flex items-center justify-center gap-4 text-sm text-[rgba(255,255,255,0.8)]">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{work.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <span>{work.forks}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Show loading state until validation is complete
  if (!validationComplete) {
    return work.source === "github" ? (
      <GitHubPlaceholder />
    ) : (
      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If we determined to skip image loading, show placeholder immediately
  if (skipImageLoad || (work.source === "github" && imageError)) {
    return <GitHubPlaceholder />;
  }

  return (
    <>
      {/* Only render Image component after validation and if not skipping */}
      {validationComplete &&
        !skipImageLoad &&
        work.image &&
        work.image.length > 5 && (
          <div className="absolute inset-1 rounded-xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
            <Image
              src={work.image}
              alt={work.title}
              fill
              className={`object-contain p-2 transition-all duration-500 ${
                isLoading
                  ? "opacity-0 scale-90 blur-sm"
                  : "opacity-100 scale-100 blur-0"
              } hover:scale-110 drop-shadow-lg`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={false}
            />
          </div>
        )}

      {/* Show placeholder while loading or on error for GitHub projects */}
      {(isLoading || imageError) && work.source === "github" && (
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            isLoading || imageError ? "opacity-100" : "opacity-0"
          }`}
        >
          <GitHubPlaceholder />
        </div>
      )}

      {/* For manual projects, just hide the image on error (no placeholder) */}
      {imageError && work.source === "manual" && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-lg">Image not found</span>
        </div>
      )}
    </>
  );
}

export default function Works() {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [textHeights, setTextHeights] = useState<{ [key: number]: number }>({});
  // Add image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    title: string;
    image: string;
  }>({ title: "", image: "" });

  // Add drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // GitHub projects state
  const [githubProjects, setGithubProjects] = useState<GitHubProjectItem[]>([]);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [showGithubProjects, setShowGithubProjects] = useState(true);

  // Combine manual and GitHub projects
  const [allProjects, setAllProjects] =
    useState<ProjectDisplayItem[]>(manualWorksData);
  const works = allProjects;

  // Loading state - show loading until GitHub projects are loaded and processed
  const isLoading = loadingGithub || (showGithubProjects && githubProjects.length === 0 && !githubError);

  // Reset scroll position immediately on component mount
  useEffect(() => {
    // Disable scroll restoration temporarily
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also reset the current section to 0 to ensure we're on the first project
    setCurrentSection(0);
  }, []);

  // Listen to scroll events, update current section
  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollY = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const newSection = Math.round(scrollY / containerHeight);
      setCurrentSection(newSection);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainer]);

  // Scroll to top on page load
  useEffect(() => {
    if (scrollContainer) {
      // Force scroll to the first project (section 0) with multiple attempts
      const resetScroll = () => {
        scrollContainer.scrollTop = 0;
        setCurrentSection(0);
      };

      // Immediate reset
      resetScroll();

      // Additional resets with delays to handle any async interference
      setTimeout(resetScroll, 50);
      setTimeout(resetScroll, 100);
      setTimeout(resetScroll, 200);
      setTimeout(resetScroll, 500);
    }
    // Also ensure window scrolls to top as fallback
    window.scrollTo(0, 0);
  }, [scrollContainer]);

  // Fetch GitHub projects
  useEffect(() => {
    const fetchGithubProjects = async () => {
      try {
        setLoadingGithub(true);
        setGithubError(null);

        const response = await fetch("/api/github-projects");
        const data = await response.json();

        if (data.success && data.projects) {
          setGithubProjects(data.projects);
        } else {
          throw new Error(data.error || "Failed to fetch GitHub projects");
        }
      } catch (error) {
        console.error("Error fetching GitHub projects:", error);
        setGithubError(
          error instanceof Error
            ? error.message
            : "Failed to load GitHub projects"
        );
        setGithubProjects([]);
      } finally {
        setLoadingGithub(false);
      }
    };

    fetchGithubProjects();
  }, []);

  // Update combined projects when GitHub projects change or toggle changes
  useEffect(() => {
    const combinedProjects: ProjectDisplayItem[] = [
      ...manualWorksData,
      ...(showGithubProjects ? githubProjects : []),
    ];

    // Sort by priority (manual projects first, then by stars for GitHub projects)
    combinedProjects.sort((a, b) => {
      if (a.source === "manual" && b.source === "github") return -1;
      if (a.source === "github" && b.source === "manual") return 1;
      if (a.source === "manual" && b.source === "manual") {
        return (a.priority || 0) - (b.priority || 0);
      }
      if (a.source === "github" && b.source === "github") {
        return b.stars - a.stars; // Sort by stars descending
      }
      return 0;
    });

    setAllProjects(combinedProjects);
  }, [githubProjects, showGithubProjects]);

  // Reset scroll position after projects are loaded
  useEffect(() => {
    if (scrollContainer && allProjects.length > 0) {
      const resetAfterLoad = () => {
        scrollContainer.scrollTop = 0;
        setCurrentSection(0);
      };

      // Reset after projects are loaded
      setTimeout(resetAfterLoad, 100);
      setTimeout(resetAfterLoad, 300);
    }
  }, [scrollContainer, allProjects.length]);

  // Effect to measure text heights and sync image heights
  useEffect(() => {
    const measureTextHeights = () => {
      const newTextHeights: { [key: number]: number } = {};
      works.forEach((_, index) => {
        const textElement = document.querySelector(
          `[data-text-section="${index}"]`
        ) as HTMLElement;
        if (textElement) {
          newTextHeights[index] = textElement.offsetHeight;
        }
      });
      setTextHeights(newTextHeights);
    };

    // Measure on initial load and when content changes
    if (works.length > 0) {
      setTimeout(measureTextHeights, 100);
      setTimeout(measureTextHeights, 500);
      setTimeout(measureTextHeights, 1000);
    }

    // Add resize listener
    window.addEventListener("resize", measureTextHeights);
    return () => window.removeEventListener("resize", measureTextHeights);
  }, [works]);

  // Scroll to specified section
  const scrollToSection = (index: number) => {
    if (!scrollContainer) return;
    scrollContainer.scrollTo({
      top: index * scrollContainer.clientHeight,
      behavior: "smooth",
    });
  };

  // Total pages (including contact page)
  const totalSections = works.length + 1;

  // Open image modal
  const openImageModal = (imageInfo: { title: string; image: string }) => {
    setSelectedImage(imageInfo);
    setIsImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Open detail drawer
  const openDrawer = (work: Work) => {
    setSelectedWork(work);
    setIsDrawerOpen(true);
  };

  // Close detail drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedWork(null);
  };

  const [isQQModalOpen, setIsQQModalOpen] = useState(false);

  // QQ button click event
  const handleQQClick = () => {
    setIsQQModalOpen(true);
  };

  // Close QQ modal
  const closeQQModal = () => {
    setIsQQModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Portfolio - austin&apos;s web</title>
        <meta name="description" content="austin's portfolio showcase page" />
      </Head>

      {/* Image modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        title={selectedImage.title}
        images={[selectedImage.image]}
        enableDanmaku={false}
        imageHeight={1000}
        imageWidth={1000}
      />

      <ImageModal
        isOpen={isQQModalOpen}
        onClose={closeQQModal}
        title="QQ Contact Information"
        images={["/images/qq.jpg"]}
        enableDanmaku={false}
        imageWidth={300}
        imageHeight={300}
      />

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, #4A90E2 3px, transparent 3px), radial-gradient(circle at 75% 75%, #67B26F 2px, transparent 2px)`,
                 backgroundSize: "60px 60px"
               }}></div>
          
          {/* Additional gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent"></div>
          
          {/* Loading content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Spinner */}
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-transparent border-t-[#4A90E2] animate-spin rounded-full"></div>
            </div>
            
            {/* Loading text */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Loading <span className="bg-gradient-to-r from-[#4A90E2] to-[#67B26F] bg-clip-text text-transparent">Projects</span>
              </h2>
              <p className="text-[rgba(255,255,255,0.8)] text-sm md:text-base">
                Fetching repositories and extracting tech stacks with AI...
              </p>
              
              {/* LLM Model Indicator */}
              <div className="mt-3 px-4 py-2 bg-gradient-to-r from-[rgba(74,144,226,0.2)] to-[rgba(103,178,111,0.2)] rounded-full border border-[rgba(74,144,226,0.3)] backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 text-xs text-[rgba(255,255,255,0.9)]">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse"></div>
                  <span className="font-medium">Powered by</span>
                  <span className="font-bold bg-gradient-to-r from-[#4A90E2] to-[#67B26F] bg-clip-text text-transparent">
                    {LLM_MODEL_DISPLAY_NAME}
                  </span>
                  <span className="text-[rgba(255,255,255,0.6)]">•</span>
                  <span className="text-[rgba(255,255,255,0.7)]">90% cost optimized</span>
                </div>
              </div>
              
              {/* Progress indicators */}
              <div className="flex justify-center items-center gap-4 mt-4 text-xs text-[rgba(255,255,255,0.6)]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse"></div>
                  <span>GitHub Projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#67B26F] to-[#4A90E2] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>Tech Stack Analysis</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>README Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-11 flex items-end">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer content */}
          <div
            className={`relative w-full h-[90vh] bg-[rgba(0,0,0,0.5)] rounded-t-3xl pb-[100px]`}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-[rgba(255,255,255,0.1)]">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {selectedWork?.title}
              </h2>
              <button
                onClick={closeDrawer}
                className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full p-2 transition-all duration-200 cursor-pointer"
              >
                <SvgIcon name="close" width={24} height={24} color="#fff" />
              </button>
            </div>

            {/* Drawer content area */}
            <div className="p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
              {selectedWork && (
                <div className="space-y-6">
                  {/* Project image */}
                  <div className="relative rounded-xl overflow-hidden flex justify-center">
                    <Image
                      src={selectedWork.image}
                      alt={selectedWork.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full md:w-[50%] h-auto rounded-xl"
                    />
                  </div>

                  {/* Project description */}
                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      Project Description
                    </h3>
                    <p className="text-[rgba(255,255,255,0.8)] leading-relaxed text-sm md:text-base line-clamp-6">
                      {selectedWork.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-semibold text-white">
                        Tech Stack
                      </h3>
                      {/* Tech stack source indicator */}
                      {selectedWork.techStackSource && selectedWork.techStackSource !== 'manual' && (
                        <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.7)]">
                          <div className="w-3 h-3 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                          <span>
                            {selectedWork.techStackSource === 'extracted' ? 'AI Enhanced' : 
                             selectedWork.techStackSource === 'mixed' ? 'Mixed Sources' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {selectedWork.tech.map((tech: string, index: number) => {
                        // Check if this tech was extracted by LLM
                        const isExtracted = selectedWork.extractedTechStack?.includes(tech) && 
                                          selectedWork.techStackSource !== 'manual';
                        
                        return (
                          <span
                            key={index}
                            className={`text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-full transition-all duration-200 ${
                              isExtracted 
                                ? 'bg-gradient-to-r from-[rgba(74,144,226,0.4)] to-[rgba(103,178,111,0.4)] border border-[rgba(74,144,226,0.3)] hover:from-[rgba(74,144,226,0.5)] hover:to-[rgba(103,178,111,0.5)]' 
                                : 'bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)]'
                            }`}
                            title={isExtracted ? 'Technology extracted from README using AI' : 'Technology from repository metadata'}
                          >
                            {tech}
                            {isExtracted && (
                              <span className="ml-1 text-[10px] opacity-75">✨</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    
                    {/* Show extraction info for GitHub projects */}
                    {selectedWork.source === 'github' && selectedWork.extractedTechCount && selectedWork.extractedTechCount > 0 && (
                      <div className="text-sm text-[rgba(255,255,255,0.6)] mt-2 p-3 bg-[rgba(74,144,226,0.1)] rounded-lg border border-[rgba(74,144,226,0.2)]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                          <span>
                            {selectedWork.extractedTechCount} technologies were automatically extracted from the project&apos;s README file using AI analysis
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main features */}
                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      Main Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedWork.features.map(
                        (feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.05)] p-3 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] rounded-full flex-shrink-0" />
                            <span className="text-sm md:text-base">
                              {feature}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Main functions */}
                  <div className="space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-white">
                      Main Functions
                    </h3>
                    {selectedWork.desc ? (
                      <div>
                        <p className="text-[rgba(255,255,255,0.8)] leading-relaxed text-sm md:text-base">
                          {selectedWork.desc}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="space-y-6">
                      {selectedWork.function?.map(
                        (func: WorkFunction, index: number) => (
                          <div key={index} className="space-y-3">
                            {/* Function name */}
                            <h4 className="text-sm md:text-base font-medium text-white">
                              {func.name}
                            </h4>

                            {/* Media display area - single row display */}
                            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2">
                              {/* Image 1 */}
                              {func.img1 && (
                                <div className="flex-shrink-0">
                                  {func.img1.endsWith(".mp4") ? (
                                    <video
                                      src={func.img1}
                                      controls
                                      className="w-64 md:w-84 h-auto rounded-lg"
                                      preload="metadata"
                                    >
                                      Your browser does not support video
                                      playback.
                                    </video>
                                  ) : (
                                    <Image
                                      src={func.img1}
                                      alt={`${func.name} - Image 1`}
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                      className="w-64 md:w-84 h-auto rounded-lg
                                      cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                      onClick={() => {
                                        if (func.img1) {
                                          openImageModal({
                                            image: func.img1,
                                            title: `${func.name} - Image 1`,
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              )}

                              {/* Image 2 */}
                              {func.img2 && (
                                <div className="flex-shrink-0">
                                  {func.img2.endsWith(".mp4") ? (
                                    <video
                                      src={func.img2}
                                      controls
                                      className="w-64 md:w-84 h-auto rounded-lg"
                                      preload="metadata"
                                    >
                                      Your browser does not support video
                                      playback.
                                    </video>
                                  ) : (
                                    <Image
                                      src={func.img2}
                                      alt={`${func.name} - Image 2`}
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                      className="w-64 md:w-84 h-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                      onClick={() => {
                                        if (func.img2) {
                                          openImageModal({
                                            image: func.img2,
                                            title: `${func.name} - Image 2`,
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              )}

                              {/* Image 3 */}
                              {func.img3 && (
                                <div className="flex-shrink-0">
                                  {func.img3.endsWith(".mp4") ? (
                                    <video
                                      src={func.img3}
                                      controls
                                      className="w-64 md:w-84 h-auto rounded-lg"
                                      preload="metadata"
                                    >
                                      Your browser does not support video
                                      playback.
                                    </video>
                                  ) : (
                                    <Image
                                      src={func.img3}
                                      alt={`${func.name} - Image 3`}
                                      width={0}
                                      height={0}
                                      sizes="100vw"
                                      className="w-64 md:w-84 h-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                      onClick={() => {
                                        if (func.img3) {
                                          openImageModal({
                                            image: func.img3,
                                            title: `${func.name} - Image 3`,
                                          });
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Top navigation controls */}
        <div className="fixed top-2 md:top-4 left-2 md:left-4 z-10 font-[family-name:var(--font-geist-sans)] flex flex-col gap-2">
          {/* Back to homepage button */}
          <Link
            href="/"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[6px] md:p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-1 md:gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon
              name="left"
              width={16}
              height={16}
              color="#fff"
              className="md:w-5 md:h-5"
            />
            <span className="text-xs md:text-sm">Back to Home</span>
          </Link>

          {/* GitHub projects toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGithubProjects(!showGithubProjects)}
              className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[6px] md:p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-1 md:gap-2 text-white backdrop-blur-sm"
              title={`${showGithubProjects ? "Hide" : "Show"} GitHub projects`}
            >
              <SvgIcon
                name="github"
                width={16}
                height={16}
                color={showGithubProjects ? "#4A90E2" : "#fff"}
                className="md:w-5 md:h-5"
              />
              <span className="text-xs md:text-sm">
                GitHub ({githubProjects.length})
              </span>
            </button>

            {/* Loading indicator for GitHub projects */}
            {loadingGithub && (
              <div className="bg-[rgba(0,0,0,.5)] rounded-[5px] p-[6px] md:p-[8px] backdrop-blur-sm">
                <div className="w-4 h-4 border-2 border-transparent border-t-[#4A90E2] animate-spin rounded-full"></div>
              </div>
            )}

            {/* Error indicator */}
            {githubError && (
              <div
                className="bg-[rgba(220,38,38,.5)] rounded-[5px] p-[6px] md:p-[8px] backdrop-blur-sm"
                title={githubError}
              >
                <SvgIcon
                  name="close"
                  width={16}
                  height={16}
                  color="#fff"
                  className="md:w-5 md:h-5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right navigation indicator */}
        <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 flex flex-col gap-2 md:gap-3">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-1 h-2 md:h-3 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? "bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] scale-125"
                  : "bg-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.8)]"
              }`}
              title={
                index < works.length ? `Project ${index + 1}` : "Contact Me"
              }
            />
          ))}
        </div>

        {/* Full screen scroll container */}
        <div
          ref={setScrollContainer}
          className={`${geistSans.className} ${geistMono.className} font-[family-name:var(--font-geist-sans)] custom-scrollbar`}
          style={{
            scrollSnapType: "y mandatory",
            overflowY: "scroll",
            height: "100vh",
          }}
        >
          {/* Project showcase area */}
          {works.map((work, index) => (
            <section
              key={index}
              className="h-screen flex items-center justify-center px-4 md:px-8"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start overflow-hidden">
                {/* Project information */}
                <div
                  data-text-section={index}
                  className={`space-y-4 md:space-y-6 flex flex-col justify-center min-w-0 ${
                    index % 2 === 1 ? "lg:order-2 lg:-ml-6" : ""
                  }`}
                >
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] font-medium">
                        Project {index + 1} / {works.length}
                      </div>
                      {/* GitHub project indicator */}
                      {work.source === "github" && (
                        <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.6)]">
                          <SvgIcon
                            name="github"
                            width={14}
                            height={14}
                            color="#4A90E2"
                          />
                          <span>GitHub Project</span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#fff] text-shadow-sm">
                      {work.title.split(" ").map((word, wordIndex) => (
                        <span key={wordIndex}>
                          {wordIndex === 0 ? (
                            <span className="bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] bg-clip-text text-transparent">
                              {word}
                            </span>
                          ) : (
                            word
                          )}
                          {wordIndex < work.title.split(" ").length - 1
                            ? " "
                            : ""}
                        </span>
                      ))}
                    </h1>

                    {/* GitHub stats for GitHub projects */}
                    {work.source === "github" && (
                      <div className="flex items-center gap-4 text-xs md:text-sm">
                        <div className="flex items-center gap-1 text-[rgba(255,255,255,0.7)]">
                          <span>⭐</span>
                          <span>{work.stars}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[rgba(255,255,255,0.7)]">
                          <span>🔗</span>
                          <span>{work.forks}</span>
                        </div>
                        {/* Show all languages if available, otherwise show primary language */}
                        {work.allLanguages && work.allLanguages.length > 0 ? (
                          <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)]">
                            {work.allLanguages
                              .slice(0, 3)
                              .map((lang, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        work.allLanguageColors?.[lang] ||
                                        "#858585",
                                    }}
                                  />
                                  <span>{lang}</span>
                                </div>
                              ))}
                            {work.allLanguages.length > 3 && (
                              <span>+{work.allLanguages.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          work.language && (
                            <div className="flex items-center gap-1 text-[rgba(255,255,255,0.7)]">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: work.languageColor }}
                              />
                              <span>{work.language}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <p className="text-sm md:text-lg text-[rgba(255,255,255,0.8)] leading-relaxed line-clamp-3 md:line-clamp-4">
                      {work.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base md:text-lg font-semibold text-[#fff]">
                        Tech Stack
                      </h3>
                      {/* Tech stack source indicator */}
                      {work.techStackSource && work.techStackSource !== 'manual' && (
                        <div className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.6)]">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                          <span>
                            {work.techStackSource === 'extracted' ? 'AI Enhanced' : 
                             work.techStackSource === 'mixed' ? 'Mixed Sources' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {work.tech.map((tech, techIndex) => {
                        // Check if this tech was extracted by LLM
                        const isExtracted = work.extractedTechStack?.includes(tech) && 
                                          work.techStackSource !== 'manual';
                        
                        return (
                          <span
                            key={techIndex}
                            className={`text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                              isExtracted 
                                ? 'bg-gradient-to-r from-[rgba(74,144,226,0.4)] to-[rgba(103,178,111,0.4)] border border-[rgba(74,144,226,0.5)] hover:from-[rgba(74,144,226,0.5)] hover:to-[rgba(103,178,111,0.5)]' 
                                : 'bg-[rgba(0,0,0,.5)] border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(0,0,0,.7)]'
                            }`}
                            title={isExtracted ? 'Technology extracted from README using AI' : 'Technology from repository metadata'}
                          >
                            {tech}
                            {isExtracted && (
                              <span className="ml-1 text-[10px] opacity-75">✨</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    
                    {/* Show extraction info for GitHub projects */}
                    {work.source === 'github' && work.extractedTechCount && work.extractedTechCount > 0 && (
                      <div className="text-xs text-[rgba(255,255,255,0.6)] mt-1">
                        {work.extractedTechCount} technologies extracted from README using AI
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-base md:text-lg font-semibold text-[#fff]">
                      Main Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {work.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2 text-[rgba(255,255,255,0.8)]"
                        >
                          <div className="w-2 h-2 bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] rounded-full flex-shrink-0" />
                          <span className="text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!work.title.includes("austin") ? (
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                      {/* 查看详情按钮 */}
                      <button
                        onClick={() => openDrawer(work)}
                        className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:bg-emerald-500 hover:border-emerald-500 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <SvgIcon
                          name="docs"
                          width={16}
                          height={16}
                          color="#fff"
                          className="md:w-[18px] md:h-[18px]"
                        />
                        <span className="text-xs font-bold bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] bg-clip-text text-transparent group-hover:hidden drop-shadow-sm">
                          View Details
                        </span>
                        <span className="text-xs font-bold bg-gradient-to-r from-[#93c5fd] to-[#60a5fa] bg-clip-text text-transparent hidden group-hover:block drop-shadow-sm">
                          Show Details
                        </span>
                      </button>

                      {/* Original project link button */}
                      {!work.title.includes("austin") && work.link !== "#" && (
                        <>
                          <button
                            onClick={() => window.open(work.link, "_blank")}
                            className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:bg-black hover:border-black text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                          >
                            <SvgIcon
                              name="github"
                              width={16}
                              height={16}
                              color="#fff"
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span className="text-xs font-bold bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] bg-clip-text text-transparent group-hover:hidden drop-shadow-sm">
                              View Project
                            </span>
                            <span className="text-xs font-bold bg-gradient-to-r from-[#d1d5db] to-[#9ca3af] bg-clip-text text-transparent hidden group-hover:block drop-shadow-sm">
                              Visit Github
                            </span>
                          </button>
                        </>
                      )}

                      {!work.title.includes("austin") && work.download_url && (
                        <>
                          <button
                            onClick={() =>
                              window.open(work.download_url, "_blank")
                            }
                            className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:bg-orange-500 hover:border-orange-500 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                          >
                            <SvgIcon
                              name="down"
                              width={16}
                              height={16}
                              color="#fff"
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span className="text-xs font-bold bg-gradient-to-r from-[#f9fafb] to-[#e5e7eb] bg-clip-text text-transparent group-hover:hidden drop-shadow-sm">
                              Demo
                            </span>
                            <span className="text-xs font-bold bg-gradient-to-r from-[#fdba74] to-[#f97316] bg-clip-text text-transparent hidden group-hover:block drop-shadow-sm">
                              Live
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {/* Project image */}
                <div
                  className={`relative order-first lg:order-none flex items-center justify-center ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                  style={{
                    height: textHeights[index]
                      ? `${textHeights[index]}px`
                      : "auto",
                    minHeight: textHeights[index]
                      ? `${textHeights[index]}px`
                      : "16rem",
                  }}
                >
                  <div
                    className="relative w-full rounded-[12px] overflow-hidden shadow-lg group cursor-pointer bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] p-[16px]"
                    onClick={() => openImageModal(work)}
                    style={{
                      height: textHeights[index]
                        ? `${textHeights[index]}px`
                        : "16rem",
                    }}
                  >
                    <GitHubProjectImage work={work} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-50 transition-opacity duration-700 cursor-pointer" />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] rounded-full opacity-20 blur-xl" />
                  <div className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-[#3d85a9] to-[#1b2c55] rounded-full opacity-20 blur-xl" />
                </div>
              </div>
            </section>
          ))}

          {/* Contact page */}
          <section
            className="h-screen flex items-center justify-center px-4 md:px-8"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="text-center max-w-2xl mx-auto space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#fff] text-shadow-sm">
                  Interested in
                  <span className="bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] bg-clip-text text-transparent">
                    Projects?
                  </span>
                </h2>
                <p className="text-sm md:text-lg text-[rgba(255,255,255,0.8)] leading-relaxed">
                  If you are interested in my work or have collaboration
                  intentions, feel free to contact me!
                </p>
              </div>

              <div className="flex justify-center gap-4 md:gap-6">
                <button
                  onClick={() =>
                    window.open("https://github.com/996austin", "_blank")
                  }
                  className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group"
                >
                  <SvgIcon
                    name="github"
                    width={24}
                    height={24}
                    color="#fff"
                    className="md:w-[30px] md:h-[30px]"
                  />
                </button>
                <button
                  onClick={handleQQClick}
                  className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group"
                >
                  <SvgIcon
                    name="qq"
                    width={24}
                    height={24}
                    color="#fff"
                    className="md:w-[30px] md:h-[30px]"
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        <Link
          href="/blog"
          className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-10"
        >
          <button className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[6px] md:p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-1 md:gap-2 text-white backdrop-blur-sm">
            <span className="text-xs md:text-sm">Articles</span>
            <SvgIcon
              name="right"
              width={16}
              height={16}
              color="#fff"
              className="md:w-5 md:h-5"
            />
          </button>
        </Link>
      </div>
    </>
  );
}
