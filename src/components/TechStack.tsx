import React from "react";
import CustomTechIcons from "./CustomTechIcons";

interface TechIcon {
  name: string;
  className?: string;
  category: string;
  displayName: string;
  hoverColor: string;
  isCustomIcon?: boolean;
}

const TechStack: React.FC = () => {
  const techStack: TechIcon[] = [
    // Frontend
    {
      name: "react",
      className: "devicon-react-original",
      category: "Frontend",
      displayName: "React",
      hoverColor: "#61DAFB",
    },
    {
      name: "nextjs",
      className: "devicon-nextjs-original-wordmark",
      category: "Frontend",
      displayName: "Next.js",
      hoverColor: "#000000",
    },
    {
      name: "typescript",
      className: "devicon-typescript-plain",
      category: "Frontend",
      displayName: "TypeScript",
      hoverColor: "#3178C6",
    },
    {
      name: "javascript",
      className: "devicon-javascript-plain",
      category: "Frontend",
      displayName: "JavaScript",
      hoverColor: "#F7DF1E",
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
    },
    {
      name: "csharp",
      className: "devicon-csharp-plain",
      category: "Backend",
      displayName: "C#",
      hoverColor: "#239120",
    },
    {
      name: "dotnetcore",
      className: "devicon-dot-net-plain",
      category: "Backend",
      displayName: ".NET Core",
      hoverColor: "#512BD4",
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
    },
    {
      name: "githubactions",
      className: "devicon-github-original",
      category: "DevOps",
      displayName: "GitHub Actions",
      hoverColor: "#2088FF",
    },

    // Tools
    {
      name: "git",
      className: "devicon-git-plain",
      category: "Tools",
      displayName: "Git",
      hoverColor: "#F05032",
    },
    {
      name: "github",
      className: "devicon-github-original",
      category: "Tools",
      displayName: "GitHub",
      hoverColor: "#181717",
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
    },
  ];

  return (
    <div className="bg-[rgba(0,0,0,.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[0.75rem] text-[#fff] text-[0.875rem] shadow-lg p-[16px]">
      {/* Header */}
      <div className="flex items-center gap-[0.5rem] mb-[1rem]">
        <i className="devicon-devicon-plain text-white text-[1rem]"></i>
        <h2 className="text-[18px] font-semibold text-white">Tech Stacks</h2>
      </div>

      {/* Categories */}
      <div className="text-[0.6875rem] text-[rgba(255,255,255,0.8)] flex flex-wrap gap-[0.625rem] justify-center mb-[1rem]">
        <span className="bg-[rgba(74,144,194,0.25)] hover:bg-[rgba(74,144,194,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(74,144,194,0.3)] shadow-sm">
          Frontend
        </span>
        <span className="bg-[rgba(125,184,216,0.25)] hover:bg-[rgba(125,184,216,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(125,184,216,0.3)] shadow-sm">
          Backend
        </span>
        <span className="bg-[rgba(61,133,169,0.25)] hover:bg-[rgba(61,133,169,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(61,133,169,0.3)] shadow-sm">
          Database
        </span>
        <span className="bg-[rgba(238,76,44,0.25)] hover:bg-[rgba(238,76,44,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(238,76,44,0.3)] shadow-sm">
          AI/ML
        </span>
        <span className="bg-[rgba(255,153,0,0.25)] hover:bg-[rgba(255,153,0,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(255,153,0,0.3)] shadow-sm">
          Cloud
        </span>
        <span className="bg-[rgba(36,150,237,0.25)] hover:bg-[rgba(36,150,237,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(36,150,237,0.3)] shadow-sm">
          DevOps
        </span>
        <span className="bg-[rgba(96,165,250,0.25)] hover:bg-[rgba(96,165,250,0.35)] px-[0.5rem] py-[0.25rem] rounded-full transition-all duration-200 border border-[rgba(96,165,250,0.3)] shadow-sm">
          Tools
        </span>
      </div>

      {/* Tech Icons Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[0.75rem] gap-y-[1.5rem] mb-[1rem]">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="group relative flex flex-col items-center justify-center cursor-pointer"
          >
            {tech.isCustomIcon ? (
              <CustomTechIcons
                name={tech.name as "claude" | "cursor"}
                size="1.75rem"
                hoverColor={tech.hoverColor}
              />
            ) : (
              <i
                className={`${tech.className} text-[1.75rem] md:text-[2.25rem] text-gray-500 group-hover:text-[var(--hover-color)] transition-colors duration-300 group-hover:scale-110 filter drop-shadow-sm`}
                style={
                  {
                    "--hover-color": tech.hoverColor,
                  } as React.CSSProperties
                }
              ></i>
            )}
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-[rgba(0,0,0,0.9)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none border border-[rgba(255,255,255,0.1)]">
              {tech.displayName}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[rgba(0,0,0,0.9)]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
