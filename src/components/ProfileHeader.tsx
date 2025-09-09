import React, { useState, useEffect, useRef } from "react";
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
  const emailIconRef = useRef<HTMLDivElement>(null);
  const phoneIconRef = useRef<HTMLDivElement>(null);

  const { displayText } = useTypewriter({
    text: "Hello, I'm AustinX",
    speed: 150,
    delay: 0,
    pauseDuration: 2000,
    loop: true,
  });

  const getModalPosition = (
    iconRef: React.RefObject<HTMLDivElement | null>
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

  return (
    <>
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
                if (word.toLowerCase() === "austinx") {
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

          <div className="text-shadow-sm font-semibold text-[rgba(255,255,255,0.9)] text-[1rem] md:text-[rem] flex items-center gap-2">
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
              ref={emailIconRef}
              className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-red-500 backdrop-blur-md border border-red-500 hover:shadow-lg hover:scale-105 hover:bg-red-600 hover:border-red-600 flex items-center justify-center relative"
              onClick={(e) => {
                e.stopPropagation();
                if (!showEmailInfo) {
                  const position = getModalPosition(emailIconRef);
                  setEmailModalPosition(position);
                  setShowPhoneInfo(false); // Close phone modal
                }
                setShowEmailInfo(!showEmailInfo);
              }}
            >
              <SvgIcon name="email" width={16} height={16} color="#fff" />
            </div>

            {/* Phone */}
            <div
              ref={phoneIconRef}
              className="cursor-pointer transition-all duration-300 rounded-full p-2 w-8 h-8 bg-green-500 backdrop-blur-md border border-green-500 hover:shadow-lg hover:scale-105 hover:bg-green-600 hover:border-green-600 flex items-center justify-center relative"
              onClick={(e) => {
                e.stopPropagation();
                if (!showPhoneInfo) {
                  const position = getModalPosition(phoneIconRef);
                  setPhoneModalPosition(position);
                  setShowEmailInfo(false); // Close email modal
                }
                setShowPhoneInfo(!showPhoneInfo);
              }}
            >
              <SvgIcon name="phone" width={16} height={16} color="#fff" />
            </div>

            {/* Projects */}
            <div
              className="ml-2 cursor-pointer transition-all duration-300 rounded-lg p-2 w-18 h-8 bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:shadow-lg hover:scale-105 hover:bg-[oklch(71.5%_0.143_215.221)] hover:border-[oklch(71.5%_0.143_215.221)] flex items-center justify-center group"
              onClick={() => window.open("/works", "_self")}
            >
              <span className="text-xs font-bold text-white group-hover:hidden">
                Resume
              </span>
              <span className="text-xs font-bold text-white hidden group-hover:block">
                View
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
