import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import SvgIcon from "@/components/SvgIcon";
import TechIcon from "@/components/TechIcon";
import { useState, useEffect, useRef } from "react";
import ImageModal from "@/components/ImageModal";
import Head from "next/head";
import Link from "next/link";
import {
  manualWorksData,
  ProjectDisplayItem,
  GitHubProjectItem,
} from "@/data/works";
import { PRIMARY_MODEL_DISPLAY_NAME, FALLBACK_MODEL_DISPLAY_NAME } from "@/services/llm-techstack";
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
  techStackSource?: "manual" | "extracted" | "mixed";
  extractedTechCount?: number;
  source?: "manual" | "github";
  // LLM provider information
  extractedProvider?: string;
  extractedModel?: string;
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
  
  // Current model being used for loading display
  const [currentModelInUse, setCurrentModelInUse] = useState(PRIMARY_MODEL_DISPLAY_NAME);
  const [modelFallbackOccurred, setModelFallbackOccurred] = useState(false);

  // Tech stack popup state
  const [isTechStackPopupOpen, setIsTechStackPopupOpen] = useState(false);
  const [selectedTechStackWork, setSelectedTechStackWork] = useState<ProjectDisplayItem | null>(null);

  
  // Contact modal state - same as ProfileHeader
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const [emailModalPosition, setEmailModalPosition] = useState({
    top: 0,
    left: 0,
  });
  const [phoneModalPosition, setPhoneModalPosition] = useState({
    top: 0,
    left: 0,
  });
  const emailIconRef = useRef<HTMLButtonElement>(null);
  const phoneIconRef = useRef<HTMLButtonElement>(null);

  // Helper function to get main technologies for display
  const getMainTechnologies = (work: ProjectDisplayItem | Work): string[] => {
    // Show first 8 technologies, prioritizing extracted ones if available
    const maxMainTechs = 8;
    
    if (work.techStackSource === "extracted" && work.extractedTechStack) {
      // For extracted tech, show extracted ones first, then manual ones
      const extractedTechs = work.tech.filter(tech => work.extractedTechStack?.includes(tech));
      const manualTechs = work.tech.filter(tech => !work.extractedTechStack?.includes(tech));
      return [...extractedTechs, ...manualTechs].slice(0, maxMainTechs);
    }
    
    // For manual or mixed projects, just show first few technologies
    return work.tech.slice(0, maxMainTechs);
  };

  // Combine manual and GitHub projects
  const [allProjects, setAllProjects] =
    useState<ProjectDisplayItem[]>(manualWorksData);
  const works = allProjects;

  // Loading state - show loading until GitHub projects are loaded and processed
  const isLoading =
    loadingGithub ||
    (showGithubProjects && githubProjects.length === 0 && !githubError);

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
          
          // Track model usage for loading display
          const usedModels = new Set<string>();
          let fallbackDetected = false;
          
          data.projects.forEach((project: GitHubProjectItem) => {
            if (project.extractedModel) {
              usedModels.add(project.extractedModel);
              // If we see a fallback model, mark it
              if (project.extractedModel.toLowerCase().includes('gpt') || 
                  project.extractedModel.toLowerCase().includes('openai')) {
                fallbackDetected = true;
              }
            }
          });
          
          // Update current model display
          if (fallbackDetected) {
            setCurrentModelInUse(FALLBACK_MODEL_DISPLAY_NAME);
            setModelFallbackOccurred(true);
          } else if (usedModels.size > 0) {
            // Use the first model found (likely primary)
            const firstModel = Array.from(usedModels)[0];
            if (firstModel.toLowerCase().includes('gemini')) {
              setCurrentModelInUse(PRIMARY_MODEL_DISPLAY_NAME);
            }
          }
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

  // Modal positioning function - same as ProfileHeader
  const getModalPosition = (
    iconRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (!iconRef.current) return { top: 0, left: 0 };

    const rect = iconRef.current.getBoundingClientRect();
    return {
      top: rect.top - 150, // Show modal above the icon
      left: Math.max(10, rect.left - 100), // Center modal relative to icon, but keep it on screen
    };
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEmailInfo(false);
      setShowPhoneInfo(false);
    };

    if (showEmailInfo || showPhoneInfo) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showEmailInfo, showPhoneInfo]);

  // Contact handlers - same as home page social icons
  const handleGithubClick = () => {
    window.open("https://github.com/ShenghaoisYummy", "_blank");
  };
  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showPhoneInfo) {
      const position = getModalPosition(phoneIconRef);
      setPhoneModalPosition(position);
      setShowEmailInfo(false); // Close email modal
    }
    setShowPhoneInfo(!showPhoneInfo);
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showEmailInfo) {
      const position = getModalPosition(emailIconRef);
      setEmailModalPosition(position);
      setShowPhoneInfo(false); // Close phone modal
    }
    setShowEmailInfo(!showEmailInfo);
  };

  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/austin-xu-272586160/", "_blank");
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

      {/* Email Modal - Positioned near email icon */}
      {showEmailInfo && (
        <div
          className="fixed w-[280px] bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] text-[#fff] text-sm p-4 z-[9999] shadow-lg"
          style={{
            top: `${emailModalPosition.top}px`,
            left: `${emailModalPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 font-semibold text-center">
            Contact Information
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span>📧</span>
            <span className="truncate">hsupisces@hotmail.com</span>
          </div>
          <div className="text-gray-300 mb-3 text-xs">
            Available for collaboration
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                window.open("mailto:hsupisces@hotmail.com", "_blank");
                setShowEmailInfo(false);
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs transition-colors flex-1"
            >
              Send Email
            </button>
            <button
              onClick={() => setShowEmailInfo(false)}
              className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-xs transition-colors flex-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Phone Modal - Positioned near phone icon */}
      {showPhoneInfo && (
        <div
          className="fixed w-[280px] bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] text-[#fff] text-sm p-4 z-[9999] shadow-lg"
          style={{
            top: `${phoneModalPosition.top}px`,
            left: `${phoneModalPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 font-semibold text-center">
            Phone Information
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span>📱</span>
            <span>+61 491 648 468</span>
          </div>
          <div className="text-gray-300 mb-3 text-xs">
            Available: 9AM - 9PM AEST
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                window.open("tel:+61491648468", "_blank");
                setShowPhoneInfo(false);
              }}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs transition-colors flex-1"
            >
              Call Now
            </button>
            <button
              onClick={() => setShowPhoneInfo(false)}
              className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-xs transition-colors flex-1"
            >
              Close
            </button>
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
                      {selectedWork.techStackSource &&
                        selectedWork.techStackSource !== "manual" && (
                          <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.7)]">
                            <div className="w-3 h-3 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                            <span>
                              {selectedWork.techStackSource === "extracted"
                                ? "AI Enhanced"
                                : selectedWork.techStackSource === "mixed"
                                ? "Mixed Sources"
                                : ""}
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {getMainTechnologies(selectedWork).map((tech: string, index: number) => {
                          // Check if this tech was extracted by LLM
                          const isExtracted =
                            selectedWork.extractedTechStack?.includes(tech) &&
                            selectedWork.techStackSource !== "manual";

                          return (
                            <div key={index} className="flex items-center">
                              <TechIcon
                                techName={tech}
                                size="lg"
                                isExtracted={isExtracted}
                                extractedModel={selectedWork.extractedModel}
                              />
                              {index < getMainTechnologies(selectedWork).length - 1 && (
                                <div className="mx-2 w-1 h-1 bg-[rgba(255,255,255,0.3)] rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Show extraction info for GitHub projects */}
                    {selectedWork.source === "github" &&
                      selectedWork.extractedTechCount &&
                      selectedWork.extractedTechCount > 0 && (
                        <div className="text-sm text-[rgba(255,255,255,0.6)] mt-2 p-3 bg-[rgba(74,144,226,0.1)] rounded-lg border border-[rgba(74,144,226,0.2)]">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                            <span>
                              {selectedWork.extractedTechCount} technologies
                              were automatically extracted from the
                              project&apos;s README file using {selectedWork.extractedModel || 'AI'} analysis
                            </span>
                          </div>
                        </div>
                      )}
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


      {/* Tech Stack Popup Modal */}
      {isTechStackPopupOpen && selectedTechStackWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTechStackPopupOpen(false)}
          />
          
          {/* Modal content */}
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedTechStackWork.title} - Tech Stack
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-gradient-to-r from-[#4A90E2] to-[#67B26F] bg-clip-text text-transparent font-bold">
                    {selectedTechStackWork.extractedTechCount || selectedTechStackWork.tech.length}
                  </span>
                  <span className="text-gray-400">technologies</span>
                  {selectedTechStackWork.extractedModel && (
                    <>
                      <span className="text-gray-400">extracted using</span>
                      <span className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent font-bold">
                        {selectedTechStackWork.extractedModel}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsTechStackPopupOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Tech stack content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedTechStackWork.tech.map((tech, index) => {
                  const isExtracted = 
                    selectedTechStackWork.extractedTechStack?.includes(tech) &&
                    selectedTechStackWork.techStackSource !== "manual";
                  
                  return (
                    <div
                      key={index}
                      className={`relative px-4 py-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        isExtracted
                          ? "bg-gradient-to-r from-[rgba(74,144,226,0.15)] to-[rgba(103,178,111,0.15)] border-[rgba(74,144,226,0.3)] shadow-lg"
                          : "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
                      }`}
                    >
                      <span className="text-white font-medium text-sm block text-center">
                        {tech}
                      </span>
                      {isExtracted && (
                        <div className="absolute top-1 right-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              {selectedTechStackWork.extractedTechCount && selectedTechStackWork.extractedTechCount > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse" />
                      <span>AI Extracted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      <span>Manual/GitHub</span>
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
          {/* Loading Section */}
          {isLoading && (
            <section
              className="h-screen flex items-center justify-center px-4 md:px-8"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center overflow-hidden">
                {/* Loading content */}
                <div className="space-y-4 md:space-y-6 flex flex-col justify-center min-w-0">
                  <div className="space-y-3 md:space-y-4">
                    <div className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] font-medium">
                      Loading Projects...
                    </div>

                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      Fetching{" "}
                      <span className="bg-gradient-to-r from-[#4A90E2] to-[#67B26F] bg-clip-text text-transparent">
                        GitHub Projects
                      </span>
                    </h1>

                    <p className="text-sm md:text-lg text-[rgba(255,255,255,0.8)] leading-relaxed">
                      Loading repositories and extracting tech stacks using{" "}
                      <span className={`font-medium transition-colors duration-500 ${
                        modelFallbackOccurred 
                          ? "text-[rgba(255,165,0,0.9)]" 
                          : "text-[rgba(74,144,226,0.9)]"
                      }`}>
                        {currentModelInUse}
                      </span>{" "}
                      analysis...
                      {modelFallbackOccurred && (
                        <span className="block text-xs text-[rgba(255,165,0,0.8)] mt-1">
                          ⚠️ Primary model unavailable, using fallback
                        </span>
                      )}
                    </p>
                  </div>

                  {/* LLM Model Indicator */}
                  <div className="space-y-2 md:space-y-3">
                    <h3 className="text-base md:text-lg font-semibold text-[#fff]">
                      AI Analysis Engine
                    </h3>
                    <div className="px-4 py-2 bg-gradient-to-r from-[rgba(74,144,226,0.15)] to-[rgba(103,178,111,0.15)] rounded-lg border border-[rgba(74,144,226,0.2)] backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.9)]">
                          <div className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-500 ${
                            modelFallbackOccurred 
                              ? "bg-gradient-to-r from-[#FF8C00] to-[#FFB347]"
                              : "bg-gradient-to-r from-[#4A90E2] to-[#67B26F]"
                          }`}></div>
                          <span className="font-medium">
                            {modelFallbackOccurred ? "Fallback to" : "Powered by"}
                          </span>
                          <span className={`font-bold bg-clip-text text-transparent transition-all duration-500 ${
                            modelFallbackOccurred
                              ? "bg-gradient-to-r from-[#FF8C00] to-[#FFB347]"
                              : "bg-gradient-to-r from-[#4A90E2] to-[#67B26F]"
                          }`}>
                            {currentModelInUse}
                          </span>
                          {modelFallbackOccurred && (
                            <span className="text-xs text-[rgba(255,165,0,0.7)] ml-1">
                              (Backup)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress indicators */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-xs text-[rgba(255,255,255,0.7)]">
                      <div className="flex items-center gap-2 bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-full">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse"></div>
                        <span>GitHub API</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-full">
                        <div
                          className="w-2 h-2 bg-gradient-to-r from-[#67B26F] to-[#4A90E2] rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <span>README Processing</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[rgba(0,0,0,0.3)] px-3 py-2 rounded-full">
                        <div
                          className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <span>Tech Stack Analysis</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading visual/spinner */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    {/* Main spinner */}
                    <div className="w-32 h-32 border-4 border-transparent border-t-[#4A90E2] animate-spin rounded-full"></div>
                    {/* Inner spinner */}
                    <div
                      className="absolute inset-4 w-24 h-24 border-4 border-transparent border-b-[#67B26F] animate-spin rounded-full"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                    {/* Center dot */}
                    <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Project showcase area */}
          {!isLoading &&
            works.map((work, index) => (
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
                                  style={{
                                    backgroundColor: work.languageColor,
                                  }}
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
                        {work.techStackSource &&
                          work.techStackSource !== "manual" && (
                            <div className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.6)]">
                              <div className="w-2 h-2 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] rounded-full"></div>
                              <span>
                                {work.techStackSource === "extracted"
                                  ? "AI Enhanced"
                                  : work.techStackSource === "mixed"
                                  ? "Mixed Sources"
                                  : ""}
                              </span>
                            </div>
                          )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {getMainTechnologies(work).map((tech, techIndex) => {
                            // Check if this tech was extracted by LLM
                            const isExtracted =
                              work.extractedTechStack?.includes(tech) &&
                              work.techStackSource !== "manual";

                            return (
                              <div key={techIndex} className="flex items-center">
                                <TechIcon
                                  techName={tech}
                                  size="md"
                                  isExtracted={isExtracted}
                                  extractedModel={work.extractedModel}
                                />
                                {techIndex < getMainTechnologies(work).length - 1 && (
                                  <div className="mx-1.5 w-0.5 h-0.5 bg-[rgba(255,255,255,0.3)] rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Show extraction info for GitHub projects */}
                      {work.source === "github" &&
                        work.extractedTechCount &&
                        work.extractedTechCount > 0 && (
                          <div className="text-xs mt-1">
                            <button
                              onClick={() => {
                                setSelectedTechStackWork(work);
                                setIsTechStackPopupOpen(true);
                              }}
                              className="text-[rgba(255,255,255,0.8)] hover:text-[rgba(255,255,255,1)] transition-colors duration-200 cursor-pointer group flex items-center gap-1"
                            >
                              <span className="bg-gradient-to-r from-[#4A90E2] to-[#67B26F] bg-clip-text text-transparent font-bold">
                                {work.extractedTechCount}
                              </span>
                              <span>tech stacks extracted from README using</span>
                              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent font-bold">
                                {work.extractedModel || 'AI'}
                              </span>
                              <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity duration-200">🔍</span>
                            </button>
                          </div>
                        )}
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
                        {!work.title.includes("austin") &&
                          work.link !== "#" && (
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

                        {!work.title.includes("austin") &&
                          work.download_url && (
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

              <div className="flex justify-center gap-3 md:gap-4">
                <button
                  onClick={handleGithubClick}
                  className="bg-[rgba(0,0,0,.5)] hover:bg-gray-400 hover:border-gray-400 rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group hover:scale-105 hover:shadow-lg"
                  title="GitHub"
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
                  ref={phoneIconRef}
                  onClick={handlePhoneClick}
                  className="bg-[rgba(0,0,0,.5)] hover:bg-green-600 hover:border-green-600 rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group hover:scale-105 hover:shadow-lg"
                  title="Phone"
                >
                  <SvgIcon
                    name="phone"
                    width={24}
                    height={24}
                    color="#fff"
                    className="md:w-[30px] md:h-[30px]"
                  />
                </button>
                <button
                  ref={emailIconRef}
                  onClick={handleEmailClick}
                  className="bg-[rgba(0,0,0,.5)] hover:bg-red-600 hover:border-red-600 rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group hover:scale-105 hover:shadow-lg"
                  title="Email"
                >
                  <SvgIcon
                    name="email"
                    width={24}
                    height={24}
                    color="#fff"
                    className="md:w-[30px] md:h-[30px]"
                  />
                </button>
                <button
                  onClick={handleLinkedInClick}
                  className="bg-[rgba(0,0,0,.5)] hover:bg-blue-600 hover:border-blue-600 rounded-xl p-2 md:p-3 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-[rgba(255,255,255,0.2)] group hover:scale-105 hover:shadow-lg"
                  title="LinkedIn"
                >
                  <SvgIcon
                    name="linkedin"
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
