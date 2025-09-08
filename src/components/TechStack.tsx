import React, { useState, useEffect, useRef } from "react";
import CustomTechIcons from "./CustomTechIcons";

interface TechIcon {
  name: string;
  className?: string;
  category: string;
  displayName: string;
  hoverColor: string;
  isCustomIcon?: boolean;
  isMainTech?: boolean;
}

const TechStack: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
      hoverColor: "#000000",
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
      name: "javascript",
      className: "devicon-javascript-plain",
      category: "Frontend",
      displayName: "JavaScript",
      hoverColor: "#F7DF1E",
      isMainTech: true,
    },
    {
      name: "html5",
      className: "devicon-html5-plain",
      category: "Frontend",
      displayName: "HTML5",
      hoverColor: "#E34F26",
    },
    {
      name: "css3",
      className: "devicon-css3-plain",
      category: "Frontend",
      displayName: "CSS3",
      hoverColor: "#1572B6",
    },
    {
      name: "tailwindcss",
      className: "devicon-tailwindcss-plain",
      category: "Frontend",
      displayName: "Tailwind CSS",
      hoverColor: "#06B6D4",
    },
    {
      name: "sass",
      className: "devicon-sass-original",
      category: "Frontend",
      displayName: "SASS",
      hoverColor: "#CC6699",
    },
    {
      name: "redux",
      className: "devicon-redux-original",
      category: "Frontend",
      displayName: "Redux",
      hoverColor: "#764ABC",
    },

    // Backend & Languages
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
      hoverColor: "#000000",
    },
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
      name: "dotnetcore",
      className: "devicon-dot-net-plain",
      category: "Backend",
      displayName: ".NET Core",
      hoverColor: "#512BD4",
      isMainTech: true,
    },
    {
      name: "php",
      className: "devicon-php-plain",
      category: "Backend",
      displayName: "PHP",
      hoverColor: "#777BB4",
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
    },
    {
      name: "mongodb",
      className: "devicon-mongodb-plain",
      category: "Database",
      displayName: "MongoDB",
      hoverColor: "#47A248",
    },
    {
      name: "graphql",
      className: "devicon-graphql-plain",
      category: "Database",
      displayName: "GraphQL",
      hoverColor: "#E10098",
      isMainTech: true,
    },

    // AI & ML
    {
      name: "pytorch",
      className: "devicon-pytorch-original",
      category: "AI/ML",
      displayName: "PyTorch",
      hoverColor: "#EE4C2C",
    },
    {
      name: "huggingface",
      className: "devicon-python-plain",
      category: "AI/ML",
      displayName: "Hugging Face",
      hoverColor: "#FFD21E",
    },
    {
      name: "claude",
      category: "AI/ML",
      displayName: "Claude",
      hoverColor: "#D97706",
      isCustomIcon: true,
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
      className: "devicon-github-original",
      category: "DevOps",
      displayName: "GitHub Actions",
      hoverColor: "#2088FF",
      isMainTech: true,
    },

    // Tools
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
      hoverColor: "#181717",
      isMainTech: true,
    },
    {
      name: "cursor",
      category: "Tools",
      displayName: "Cursor",
      hoverColor: "#000000",
      isCustomIcon: true,
    },
    {
      name: "prisma",
      className: "devicon-prisma-original",
      category: "Tools",
      displayName: "Prisma",
      hoverColor: "#2D3748",
      isMainTech: true,
    },
  ];

  const categories = Array.from(
    new Set(techStack.map((tech) => tech.category))
  );

  const filteredTechStack = selectedCategory
    ? techStack.filter((tech) => tech.category === selectedCategory)
    : techStack;

  useEffect(() => {
    if (gridRef.current && containerHeight === null) {
      const height = gridRef.current.offsetHeight;
      setContainerHeight(height);
    }
  }, [containerHeight]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "rgba(74,144,194,0.25)",
      Backend: "rgba(125,184,216,0.25)",
      Database: "rgba(61,133,169,0.25)",
      "AI/ML": "rgba(238,76,44,0.25)",
      Cloud: "rgba(255,153,0,0.25)",
      DevOps: "rgba(36,150,237,0.25)",
      Tools: "rgba(96,165,250,0.25)",
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.25)";
  };

  const getCategoryHoverColor = (category: string) => {
    const colors = {
      Frontend: "rgba(74,144,194,0.35)",
      Backend: "rgba(125,184,216,0.35)",
      Database: "rgba(61,133,169,0.35)",
      "AI/ML": "rgba(238,76,44,0.35)",
      Cloud: "rgba(255,153,0,0.35)",
      DevOps: "rgba(36,150,237,0.35)",
      Tools: "rgba(96,165,250,0.35)",
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.35)";
  };

  const getCategoryBorderColor = (category: string) => {
    const colors = {
      Frontend: "rgba(74,144,194,0.3)",
      Backend: "rgba(125,184,216,0.3)",
      Database: "rgba(61,133,169,0.3)",
      "AI/ML": "rgba(238,76,44,0.3)",
      Cloud: "rgba(255,153,0,0.3)",
      DevOps: "rgba(36,150,237,0.3)",
      Tools: "rgba(96,165,250,0.3)",
    };
    return colors[category as keyof typeof colors] || "rgba(128,128,128,0.3)";
  };

  return (
    <div className="bg-[rgba(0,0,0,.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[0.75rem] text-[#fff] text-[0.875rem] shadow-lg p-[16px]">
      {/* Header */}
      <div className="flex items-center gap-[0.5rem] mb-[1rem]">
        <i className="devicon-devicon-plain text-white text-[1rem]"></i>
        <h2 className="text-[18px] font-semibold text-white">Tech Stacks</h2>
      </div>

      {/* Categories */}
      <div className="text-[0.6875rem] text-[rgba(255,255,255,0.8)] flex flex-wrap gap-[0.625rem] justify-center mb-[1rem]">
        {categories.map((category) => (
          <span
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 shadow-sm cursor-pointer select-none ${
              selectedCategory === category
                ? `bg-[${getCategoryHoverColor(
                    category
                  )}] border-2 border-[${getCategoryBorderColor(
                    category
                  )}] ring-2 ring-white ring-opacity-30`
                : `bg-[${getCategoryColor(
                    category
                  )}] hover:bg-[${getCategoryHoverColor(
                    category
                  )}] border border-[${getCategoryBorderColor(category)}]`
            }`}
            style={{
              backgroundColor:
                selectedCategory === category
                  ? getCategoryHoverColor(category)
                  : getCategoryColor(category),
              borderColor: getCategoryBorderColor(category),
              borderWidth: selectedCategory === category ? "2px" : "1px",
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
          return (
            <div
              key={tech.name}
              className="group relative flex flex-col items-center justify-center cursor-pointer"
            >
              {tech.isCustomIcon ? (
                <CustomTechIcons
                  name={tech.name as "claude" | "cursor"}
                  size="1.75rem"
                  hoverColor={isMainTech ? tech.hoverColor : "#6B7280"}
                />
              ) : (
                <i
                  className={`${
                    tech.className
                  } text-[1.75rem] md:text-[2.25rem] transition-colors duration-300 group-hover:scale-110 filter drop-shadow-sm ${
                    isMainTech
                      ? "group-hover:text-[var(--hover-color)]"
                      : "text-gray-600 group-hover:text-gray-400"
                  }`}
                  style={
                    isMainTech
                      ? ({
                          color: tech.hoverColor,
                          "--hover-color": tech.hoverColor,
                        } as React.CSSProperties)
                      : {}
                  }
                ></i>
              )}
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-[rgba(0,0,0,0.9)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none border border-[rgba(255,255,255,0.1)]">
                {tech.displayName}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[rgba(0,0,0,0.9)]"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStack;
