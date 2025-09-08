import React, { forwardRef } from 'react';
import Link from "next/link";
import SvgIcon from "@/components/SvgIcon";

const NavigationSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[12px] text-[#fff] shadow-lg flex flex-col"
      style={{ boxSizing: "border-box" }}
    >
      <div className="mb-[8px] flex-shrink-0">
        <h3 className="text-[18px] font-semibold mb-[1px] flex items-center gap-2">
          <SvgIcon
            name="site"
            width={16}
            height={16}
            color="#fff"
          />
          Navigation
        </h3>
      </div>
      <div className="flex flex-col gap-[6px] flex-1 justify-center">
        <Link
          href="/works"
          className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[6px] p-[8px] text-[#fff] flex items-center cursor-pointer hover:bg-[rgba(74,144,194,0.15)] hover:border-[#4a90c2] hover:shadow-lg hover:shadow-[rgba(74,144,194,0.2)] transition-all duration-300 group"
        >
          <div className="group-hover:rotate-12 transition-transform duration-300 mr-[8px]">
            <SvgIcon
              name="zuopin"
              width={18}
              height={18}
              color="#fff"
            />
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-[16px]">
              Projects
            </span>
            <span className="text-[11px] text-[rgba(255,255,255,0.7)]">
              Full-Stack projects
            </span>
          </div>
        </Link>
        <Link
          href="https://personal-blog-jade-five.vercel.app/"
          className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[6px] p-[6px] text-[#fff] flex items-center cursor-pointer hover:bg-[rgba(32,178,170,0.15)] hover:border-[#20b2aa] hover:shadow-lg hover:shadow-[rgba(32,178,170,0.2)] transition-all duration-300 group"
        >
          <div className="group-hover:scale-110 transition-transform duration-300 mr-[6px]">
            <SvgIcon
              name="docs"
              width={18}
              height={18}
              color="#fff"
            />
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-[16px]">Blog</span>
            <span className="text-[11px] text-[rgba(255,255,255,0.7)]">
              Full-Stack & AI knowledges
            </span>
          </div>
        </Link>
        <Link
          href="/chat"
          className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[6px] p-[8px] text-[#fff] flex items-center cursor-pointer hover:bg-[rgba(255,107,53,0.15)] hover:border-[#ff6b35] hover:shadow-lg hover:shadow-[rgba(255,107,53,0.2)] transition-all duration-300 group"
        >
          <div className="group-hover:animate-pulse transition-all duration-300 mr-[8px]">
            <SvgIcon
              name="comment"
              width={18}
              height={18}
              color="#fff"
            />
          </div>

          <div className="flex flex-col text-sm">
            <span className="font-semibold text-[16px]">
              Chat Room
            </span>
            <span className="text-[11px] text-[rgba(255,255,255,0.7)]">
              Real-time chat
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
});

NavigationSection.displayName = 'NavigationSection';

export default NavigationSection;