import React from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import SvgIcon from "@/components/SvgIcon";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ProfileHeaderProps {
  onGithubClick: () => void;
  onLinkedinClick: () => void;
  onXClick: () => void;
  onInstagramClick: () => void;
  onTiktokClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onGithubClick,
  onLinkedinClick,
  onXClick,
  onInstagramClick,
  onTiktokClick,
}) => {
  const { theme } = useTheme();

  const { displayText } = useTypewriter({
    text: "Hello, I'm Austin",
    speed: 150,
    delay: 0,
    pauseDuration: 2000,
    loop: true,
  });

  return (
    <div className="flex gap-[0.375rem] md:gap-[0.5rem] flex-col md:flex-row mb-1 ml-[1.875rem]">
      <div className="relative w-full md:w-[15.625rem] flex justify-center items-center mx-auto md:mx-0">
        <Image
          src="/images/avatar.jpg"
          alt="Logo"
          width={200}
          height={200}
          className="rounded-[50%] shadow-lg w-[9.375rem] h-[9.375rem] md:w-[12.5rem] md:h-[12.5rem] float-animation"
        />
        {theme !== "dark" ? (
          <Image
            src="/images/"
            alt="Logo"
            width={200}
            height={200}
            className="top-[-8.4375rem] md:top-[-11.25rem] left-[50%] translate-x-[-50%] absolute w-[9.375rem] h-[9.375rem] md:w-[12.5rem] md:h-[12.5rem]"
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col gap-[0.1875rem] md:gap-[0.3125rem] text-center md:text-left px-4 md:px-0 md:translate-x-5 lg:translate-x-10">
        <div className="text-[1.75rem] md:text-[2.625rem] font-bold text-[#fff] text-shadow-lg leading-tight mb-[1.5rem]">
          <span className="inline-block">
            {displayText.split(" ").map((word, wordIndex) => {
              if (word === "austin") {
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
            <span className="animate-pulse text-[#3d85a9]">|</span>
          </span>
        </div>
        <div className="text-shadow-sm text-[#fff] text-[0.9375rem] md:text-[1.125rem]">
          <span className="bg-gradient-to-r from-[#2196f3] to-[#1976d2] bg-clip-text text-transparent text-[1.0625rem] md:text-[1.25rem] font-black drop-shadow-lg">
            Full-Stack & AI Developer
          </span>{" "}
        </div>

        <div className="text-shadow-sm text-[rgba(255,255,255,0.9)] text-[1rem] md:text-[rem] flex items-center gap-2">
          <SvgIcon name="location" width={18} height={18} />
          Sydney,Australia
        </div>
        <div className="flex mt-[0.8rem] gap-[0.3125rem] justify-center md:justify-start flex-wrap">
          {/* GitHub */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-gray-400 hover:text-white hover:border-gray-400 flex items-center justify-center"
            onClick={onGithubClick}
          >
            <SvgIcon name="github" width={16} height={16} color="#fff" />
          </div>

          {/* LinkedIn */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center"
            onClick={onLinkedinClick}
          >
            <SvgIcon name="linkedin" width={16} height={16} color="#fff" />
          </div>

          {/* X (Twitter) */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-blue-400 hover:text-white hover:border-blue-400 flex items-center justify-center"
            onClick={onXClick}
          >
            <SvgIcon name="x" width={16} height={16} color="#fff" />
          </div>

          {/* Instagram */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500 hover:text-white hover:border-transparent flex items-center justify-center"
            onClick={onInstagramClick}
          >
            <SvgIcon name="instagram" width={16} height={16} color="#fff" />
          </div>

          {/* TikTok */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-black hover:text-white hover:border-black flex items-center justify-center"
            onClick={onTiktokClick}
          >
            <SvgIcon name="tiktok" width={16} height={16} color="#fff" />
          </div>

          {/* Email */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-red-500 backdrop-blur-md border border-red-500 hover:shadow-lg hover:scale-105 hover:bg-red-600 hover:border-red-600 flex items-center justify-center"
            onClick={() =>
              window.open("mailto:your.email@example.com", "_blank")
            }
          >
            <SvgIcon name="email" width={16} height={16} color="#fff" />
          </div>

          {/* Phone */}
          <div
            className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-green-500 backdrop-blur-md border border-green-500 hover:shadow-lg hover:scale-105 hover:bg-green-600 hover:border-green-600 flex items-center justify-center"
            onClick={() => window.open("tel:+1234567890", "_blank")}
          >
            <SvgIcon name="phone" width={16} height={16} color="#fff" />
          </div>

          {/* Projects */}
          <div
            className="ml-2 cursor-pointer transition-all duration-300 rounded-lg p-2 w-18 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-[oklch(71.5%_0.143_215.221)] hover:border-[oklch(71.5%_0.143_215.221)] flex items-center justify-center group"
            onClick={() => window.open("/works", "_self")}
          >
            <span className="text-xs font-bold text-white group-hover:hidden">Resume</span>
            <span className="text-xs font-bold text-white hidden group-hover:block">View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
