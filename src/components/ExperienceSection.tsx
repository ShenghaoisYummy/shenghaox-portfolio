import React, { forwardRef } from "react";
import Link from "next/link";
import SvgIcon from "@/components/SvgIcon";
import { experienceData } from "@/data/experience";

const ExperienceSection = forwardRef<HTMLDivElement>((_, ref) => {
  const express = experienceData;

  return (
    <div
      ref={ref}
      className="bg-[rgba(0,0,0,.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[0.75rem] text-[#fff] text-[0.875rem] flex flex-col shadow-lg overflow-hidden"
      style={{ boxSizing: "border-box" }}
    >
      <div className="p-[12px] pb-0 flex-shrink-0">
        <div className="mb-[8px] flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-semibold mb-[1px] flex items-center gap-2 flex-shrink-0">
            <SvgIcon name="work" width={16} height={16} color="#fff" />
            Experience
          </h3>
          <Link
            href="/blog"
            className="text-[0.6625rem] mt-1 font-semibold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-[length:300%_300%] bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-200 flex items-center gap-1 uppercase tracking-wide whitespace-nowrap flex-shrink-0 ml-2"
            style={{
              textShadow:
                "0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(255, 0, 255, 0.3)",
              animation: "cyberpunk-glow 2s ease-in-out infinite",
            }}
          >
            More Details
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col flex-1 overflow-y-auto custom-scrollbar px-[12px] pb-[12px] min-h-0">
        {/* Background timeline line */}
        <div
          className="absolute left-[1.1rem] top-[0.95rem] w-[0.1875rem] bg-gradient-to-b from-[#4a90c2] via-[#3d85a9] to-[#7db8d8] rounded-full shadow-sm"
          style={{ height: `${express.length * 220}px` }}
        ></div>

        {express.map((item, index) => (
          <div
            key={index}
            className={`relative flex items-start ${
              index !== express.length - 1 ? "mb-[1.25rem]" : ""
            }`}
          >
            {/* Timeline dot */}
            <div className="relative flex flex-col items-center mr-[1.40625rem] z-10">
              <div
                className={`w-[0.875rem] h-[0.875rem] rounded-full border-2 border-white shadow-md ${
                  index === 0
                    ? "bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] animate-pulse"
                    : "bg-gradient-to-br from-[#1b2c55] to-[#3d85a9]"
                }`}
                style={{ marginTop: "0.125rem" }}
              ></div>
            </div>

            <div className="flex-1">
              <div className="font-bold bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent mb-[0.1875rem] text-[0.8125rem] md:text-[0.875rem] uppercase tracking-wider drop-shadow-lg">
                {item.name}
              </div>
              <div className="text-[0.6875rem] md:text-[0.75rem] text-[#60a5fa] mb-[0.25rem] font-bold italic drop-shadow-md">
                {item.position}
              </div>
              <div className="text-[0.625rem] md:text-[0.6875rem] text-[rgba(255,255,255,0.9)] mb-[0.25rem] drop-shadow-sm">
                {item.date}
              </div>
              <div className="text-[0.6875rem] md:text-[0.75rem] text-[rgba(255,255,255,0.95)] leading-relaxed drop-shadow-sm">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ExperienceSection.displayName = "ExperienceSection";

export default ExperienceSection;
