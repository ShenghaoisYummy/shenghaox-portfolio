import React, { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import CustomTechIcons from "./CustomTechIcons";
import { getTechIcon } from '@/utils/techIconMapping';

interface TechIcon {
  name: string;
  className?: string;
  category: string;
  displayName: string;
  hoverColor: string;
  isCustomIcon?: boolean;
  isMainTech?: boolean;
  isSecTech?: boolean;
}

const TechStack: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const techRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const techStack: TechIcon[] = [
    // Frontend
    {
      name: "react",
      className: "devicon-react-original",
      category: "Frontend",
      displayName: "React",
      hoverColor: "#61DAFB",
      isMainTech: true,
    },
    {
      name: "nextjs",
      className: "devicon-nextjs-original-wordmark",
      category: "Frontend",
      displayName: "Next.js",
      hoverColor: "#FFFFFF",
      isMainTech: true,
    },
    {
      name: "tailwindcss",
      className: "devicon-tailwindcss-plain",
      category: "Frontend",
      displayName: "Tailwind CSS",
      hoverColor: "#06B6D4",
      isMainTech: true,
    },
    {
      name: "shadcn",
      category: "Frontend",
      displayName: "shadcn/ui",
      hoverColor: "#FFFFFF",
      isCustomIcon: true,
      isMainTech: true,
    },
    {
      name: "redux",
      className: "devicon-redux-original",
      category: "Frontend",
      displayName: "Redux",
      hoverColor: "#764ABC",
      isSecTech: true,
    },

    // Backend
    {
      name: "dotnetcore",
      className: "devicon-dot-net-plain",
      category: "Backend",
      displayName: ".NET Core",
      hoverColor: "#512BD4",
      isMainTech: true,
    },
    {
      name: "nodejs",
      className: "devicon-nodejs-plain",
      category: "Backend",
      displayName: "Node.js",
      hoverColor: "#339933",
      isMainTech: true,
    },
    {
      name: "express",
      className: "devicon-express-original",
      category: "Backend",
      displayName: "Express.js",
      hoverColor: "#FFFFFF",
      isSecTech: true,
    },
    {
      name: "php",
      className: "devicon-php-plain",
      category: "Backend",
      displayName: "PHP",
      hoverColor: "#777BB4",
      isSecTech: true,
    },

    // AI & ML

    {
      name: "claude",
      category: "AI/ML",
      displayName: "Claude Code",
      hoverColor: "#D97706",
      isCustomIcon: true,
      isMainTech: true,
    },
    {
      name: "cursor",
      category: "AI/ML",
      displayName: "Cursor",
      hoverColor: "#000000",
      isCustomIcon: true,
    },

    {
      name: "pytorch",
      className: "devicon-pytorch-original",
      category: "AI/ML",
      displayName: "PyTorch",
      hoverColor: "#EE4C2C",
      isSecTech: true,
    },
    {
      name: "huggingface",
      category: "AI/ML",
      displayName: "Hugging Face",
      hoverColor: "#FFD21E",
      isCustomIcon: true,
      isSecTech: true,
    },

    // Languages
    {
      name: "python",
      className: "devicon-python-plain",
      category: "Backend",
      displayName: "Python",
      hoverColor: "#3776AB",
      isMainTech: true,
    },
    {
      name: "csharp",
      className: "devicon-csharp-plain",
      category: "Backend",
      displayName: "C#",
      hoverColor: "#239120",
      isMainTech: true,
    },
    {
      name: "javascript",
      className: "devicon-javascript-plain",
      category: "Frontend",
      displayName: "JavaScript",
      hoverColor: "#F7DF1E",
      isMainTech: true,
    },
    {
      name: "typescript",
      className: "devicon-typescript-plain",
      category: "Frontend",
      displayName: "TypeScript",
      hoverColor: "#3178C6",
      isMainTech: true,
    },
    {
      name: "html5",
      className: "devicon-html5-plain",
      category: "Frontend",
      displayName: "HTML5",
      hoverColor: "#E34F26",
      isSecTech: true,
    },
    {
      name: "css3",
      className: "devicon-css3-plain",
      category: "Frontend",
      displayName: "CSS3",
      hoverColor: "#1572B6",
      isSecTech: true,
    },

    // Database
    {
      name: "postgresql",
      className: "devicon-postgresql-plain",
      category: "Database",
      displayName: "PostgreSQL",
      hoverColor: "#336791",
      isMainTech: true,
    },
    {
      name: "mysql",
      className: "devicon-mysql-plain",
      category: "Database",
      displayName: "MySQL",
      hoverColor: "#4479A1",
      isSecTech: true,
    },
    {
      name: "mongodb",
      className: "devicon-mongodb-plain",
      category: "Database",
      displayName: "MongoDB",
      hoverColor: "#47A248",
      isSecTech: true,
    },
    {
      name: "graphql",
      className: "devicon-graphql-plain",
      category: "Database",
      displayName: "GraphQL",
      hoverColor: "#E10098",
      isMainTech: true,
    },
    {
      name: "prisma",
      className: "devicon-prisma-original",
      category: "Database",
      displayName: "Prisma",
      hoverColor: "#5A67D8",
      isMainTech: true,
    },
    // Cloud & DevOps
    {
      name: "aws",
      className: "devicon-amazonwebservices-plain-wordmark",
      category: "Cloud",
      displayName: "AWS",
      hoverColor: "#FF9900",
      isMainTech: true,
    },
    {
      name: "azure",
      className: "devicon-azure-plain",
      category: "Cloud",
      displayName: "Azure",
      hoverColor: "#0078D4",
      isSecTech: true,
    },
    {
      name: "docker",
      className: "devicon-docker-plain",
      category: "DevOps",
      displayName: "Docker",
      hoverColor: "#2496ED",
      isMainTech: true,
    },
    {
      name: "githubactions",
      className: "devicon-githubactions-plain",
      category: "DevOps",
      displayName: "GitHub Actions",
      hoverColor: "#2088FF",
      isMainTech: true,
    },

    // Git
    {
      name: "git",
      className: "devicon-git-plain",
      category: "Tools",
      displayName: "Git",
      hoverColor: "#F05032",
      isMainTech: true,
    },
    {
      name: "github",
      className: "devicon-github-original",
      category: "Tools",
      displayName: "GitHub",
      hoverColor: "#FFFFFF",
      isMainTech: true,
    },
  ];

  const categories = Array.from(
    new Set(techStack.map((tech) => tech.category))
  );

  const filteredTechStack = selectedCategory
    ? techStack.filter((tech) => tech.category === selectedCategory)
    : techStack;

  // Fetch usage counts for all tech stacks
  useEffect(() => {
    const fetchUsageCounts = async () => {
      try {
        const response = await fetch('/api/tech-usage-stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const counts: Record<string, number> = {};

            // Create mapping for all tech items
            techStack.forEach(tech => {
              const techIconData = getTechIcon(tech.name);
              const standardName = techIconData?.displayName || tech.displayName;

              const techStat = data.data.stats.find((stat: { techName: string; totalProjects: number }) =>
                stat.techName.toLowerCase() === tech.name.toLowerCase() ||
                stat.techName.toLowerCase() === standardName.toLowerCase() ||
                stat.techName.toLowerCase() === tech.displayName.toLowerCase()
              );

              counts[tech.name] = techStat ? techStat.totalProjects : 0;
            });

            setUsageCounts(counts);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch usage counts for tech stack:', error);
      }
    };

    fetchUsageCounts();
  }, []);

  useEffect(() => {
    if (gridRef.current && containerHeight === null) {
      const height = gridRef.current.offsetHeight;
      setContainerHeight(height);
    }
  }, [containerHeight]);

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleContainerClick = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Handle mouse events for tooltip positioning
  const handleTechMouseEnter = (techName: string) => {
    const techElement = techRefs.current[techName];
    if (!techElement) return;

    const rect = techElement.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    });
    setHoveredTech(techName);
  };

  const handleTechMouseLeave = () => {
    setHoveredTech(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "rgba(59,130,246,0.25)", // Blue - UI/interface
      Backend: "rgba(34,197,94,0.25)", // Green - server/nature
      Database: "rgba(168,85,247,0.25)", // Purple - data/storage
      "AI/ML":
        "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(236,72,153,0.25) 100%)", // Cyberpunk Gradient - AI/tech future
      Cloud: "rgba(14,165,233,0.25)", // Sky Blue - cloud/sky
      DevOps: "rgba(245,158,11,0.25)", // Amber - tools/automation
      Tools: "rgba(107,114,128,0.25)", // Gray - utilities/neutral
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.25)";
  };

  const getCategoryHoverColor = (category: string) => {
    const colors = {
      Frontend: "rgba(59,130,246,0.35)", // Blue - UI/interface
      Backend: "rgba(34,197,94,0.35)", // Green - server/nature
      Database: "rgba(168,85,247,0.35)", // Purple - data/storage
      "AI/ML":
        "linear-gradient(135deg, rgba(59,130,246,0.35) 0%, rgba(236,72,153,0.35) 100%)", // Cyberpunk Gradient - AI/tech future
      Cloud: "rgba(14,165,233,0.35)", // Sky Blue - cloud/sky
      DevOps: "rgba(245,158,11,0.35)", // Amber - tools/automation
      Tools: "rgba(107,114,128,0.35)", // Gray - utilities/neutral
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.35)";
  };

  const getCategoryBorderColor = (category: string) => {
    const colors = {
      Frontend: "rgba(59,130,246,0.3)", // Blue - UI/interface
      Backend: "rgba(34,197,94,0.3)", // Green - server/nature
      Database: "rgba(168,85,247,0.3)", // Purple - data/storage
      "AI/ML": "rgba(147,51,234,0.3)", // Purple border for gradient - AI/tech future
      Cloud: "rgba(14,165,233,0.3)", // Sky Blue - cloud/sky
      DevOps: "rgba(245,158,11,0.3)", // Amber - tools/automation
      Tools: "rgba(107,114,128,0.3)", // Gray - utilities/neutral
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.3)";
  };

  // Tooltip component rendered via portal
  const TooltipPortal = () => {
    if (!hoveredTech || typeof window === 'undefined') return null;

    const tech = techStack.find(t => t.name === hoveredTech);
    if (!tech) return null;

    const usageCount = usageCounts[hoveredTech] || 0;

    return createPortal(
      <div
        className="fixed px-2 py-1 bg-[rgba(0,0,0,0.9)] text-white text-xs rounded-md whitespace-nowrap pointer-events-none border border-[rgba(255,255,255,0.1)] transform -translate-x-1/2 -translate-y-full"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          zIndex: 99999,
        }}
      >
        {tech.displayName}
        {usageCount > 0 && (
          <div className="text-[10px] opacity-75 mt-1">
            Used in {usageCount} project{usageCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <>
      <TooltipPortal />
      <div
        className="bg-[rgba(0,0,0,.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[0.75rem] text-[#fff] text-[0.875rem] shadow-lg p-[16px]"
        onClick={handleContainerClick}
      >
      {/* Header */}
      <div className="flex items-center gap-[0.5rem] mb-[1rem]">
        <i className="devicon-devicon-plain text-white text-[1rem]"></i>
        <h2 className="text-[18px] font-semibold text-white">Tech Stacks</h2>
      </div>

      {/* Categories */}
      <div className="text-[0.6875rem] text-[rgba(255,255,255,0.8)] flex flex-wrap gap-[0.625rem] justify-center mb-[2rem]">
        {categories.map((category) => (
          <span
            key={category}
            onClick={(e) => handleCategoryClick(category, e)}
            className={`rounded-full transition-all duration-300 cursor-pointer select-none ${
              selectedCategory === category
                ? "ring-2 ring-white ring-opacity-50 shadow-lg font-semibold text-white"
                : "hover:shadow-md font-medium"
            }`}
            style={{
              background:
                selectedCategory === category
                  ? getCategoryHoverColor(category)
                  : getCategoryColor(category),
              border: `2px solid ${getCategoryBorderColor(category)}`,
              padding: "0.25rem 0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "2rem",
            }}
          >
            {category}
          </span>
        ))}
      </div>

      {/* Tech Icons Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[0.75rem] gap-y-[1.5rem] mb-[1rem] transition-all duration-300"
        style={{
          minHeight: containerHeight ? `${containerHeight}px` : "auto",
        }}
      >
        {filteredTechStack.map((tech) => {
          const isMainTech =
            Boolean(tech.isMainTech) ||
            Boolean(selectedCategory && tech.category === selectedCategory);
          const usageCount = usageCounts[tech.name] || 0;

          // Helper function to convert hex color to rgba with opacity
          const hexToRgba = (hex: string, opacity: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
          };

          // Calculate opacity based on usage count (0 = 0.3, 1+ = 0.5-1.0)
          const getUsageBasedOpacity = (count: number) => {
            if (count === 0) return 0.3; // Very low opacity for unused
            if (count === 1) return 0.5; // Low opacity for rarely used
            if (count <= 3) return 0.7; // Medium opacity for moderately used
            if (count <= 5) return 0.85; // High opacity for frequently used
            return 1.0; // Full opacity for heavily used
          };

          const usageOpacity = getUsageBasedOpacity(usageCount);
          const finalOpacity = isMainTech ? Math.max(usageOpacity, 0.8) : usageOpacity;

          return (
            <div
              key={tech.name}
              ref={(el) => { techRefs.current[tech.name] = el; }}
              className="group relative flex flex-col items-center justify-center cursor-pointer"
              onMouseEnter={() => handleTechMouseEnter(tech.name)}
              onMouseLeave={handleTechMouseLeave}
            >
              {tech.isCustomIcon ? (
                <CustomTechIcons
                  name={
                    tech.name as "claude" | "cursor" | "huggingface" | "shadcn"
                  }
                  size="1.75rem"
                  hoverColor={tech.hoverColor}
                  initialColor={hexToRgba(tech.hoverColor, finalOpacity)}
                />
              ) : (
                <i
                  className={`${
                    tech.className
                  } text-[1.75rem] md:text-[2.25rem] transition-colors duration-300 group-hover:scale-110 filter drop-shadow-sm`}
                  style={{
                    color: hexToRgba(tech.hoverColor, finalOpacity)
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tech.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = hexToRgba(tech.hoverColor, finalOpacity);
                  }}
                ></i>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </>
  );
};

export default TechStack;
