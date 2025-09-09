import React from 'react';
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import SvgIcon from "@/components/SvgIcon";
import { useTypewriter } from "@/hooks/useTypewriter";

interface ProfileHeaderProps {
  onQQClick: () => void;
  onGithubClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onQQClick, onGithubClick }) => {
  const { theme } = useTheme();
  
  const { displayText } = useTypewriter({
    text: "Hello, I'm Austin",
    speed: 150,
    delay: 0,
    pauseDuration: 2000,
    loop: true
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
          <span className="bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] bg-clip-text text-transparent text-[1.0625rem] md:text-[1.25rem] font-semibold">
            Full-Stack & AI Developer
          </span>{" "}
        </div>

        <div className="text-shadow-sm text-[rgba(255,255,255,0.9)] text-[0.875rem] md:text-[1rem]">
          <span className="bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] bg-clip-text text-transparent text-[1rem] md:text-[1.125rem] font-semibold">
            2.5
          </span>{" "}
          years work experience
        </div>
        <div className="flex mt-[0.1875rem] gap-[0.3125rem] justify-center md:justify-start">
          <div
            className="bg-[rgba(0,0,0,.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-[0.5rem] p-[0.5rem] cursor-pointer hover:bg-[rgba(0,0,0,.8)] transition-all duration-300 shadow-md"
            onClick={onGithubClick}
          >
            <SvgIcon
              name="github"
              width={18}
              height={18}
              color="#fff"
            />
          </div>
          <div
            className="bg-[rgba(0,0,0,.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-[0.5rem] p-[0.5rem] cursor-pointer hover:bg-[rgba(0,0,0,.8)] transition-all duration-300 shadow-md"
            onClick={onQQClick}
          >
            <SvgIcon name="qq" width={18} height={18} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;