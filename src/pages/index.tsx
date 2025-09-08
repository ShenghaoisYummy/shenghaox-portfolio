import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useTheme } from "@/contexts/ThemeContext";
import SvgIcon from "@/components/SvgIcon";
import GitHubHeatmap from "@/components/GitHubHeatmap";
import TechStack from "@/components/TechStack";
import ImageModal from "@/components/ImageModal";
import MusicModal from "@/components/MusicModal";
import VideoModal from "@/components/VideoModal";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { experienceData } from "@/data/experience";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { theme } = useTheme();
  // Modal states
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    title: "",
    images: [] as string[],
    danmakuText: "",
    enableDanmaku: true,
    imageWidth: 500,
    imageHeight: 500,
  });
  const [musicModal, setMusicModal] = useState({
    isOpen: false,
    title: "",
    musicUrl: "",
    cover: "",
    author: "",
    danmakuText: "",
    enableDanmaku: true,
  });
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: "",
    danmakuText: "",
    enableDanmaku: true,
  });

  // Typewriter animation state
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = "Hello, I'm Austin";

  // Typewriter animation effect
  useEffect(() => {
    const typeSpeed = 150; // Typing speed
    const deleteSpeed = 100; // Delete speed
    const pauseTime = 2000; // Pause time after complete display
    const restartPause = 1000; // Restart pause after deletion

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Add character by character
          if (currentIndex < fullText.length) {
            setDisplayText(fullText.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            // Pause after complete display, then start deleting
            setTimeout(() => {
              setIsDeleting(true);
            }, pauseTime);
          }
        } else {
          // Delete character by character
          if (currentIndex > 0) {
            setDisplayText(fullText.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          } else {
            // Pause after deletion, then restart
            setTimeout(() => {
              setIsDeleting(false);
            }, restartPause);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, fullText]);

  // Add GitHub and QQ click handler functions
  const handleGithubClick = () => {
    window.open("https://github.com/ShenghaoisYummy", "_blank");
  };

  const handleQQClick = () => {
    setImageModal({
      isOpen: true,
      title: "QQ",
      images: ["/images/qq.jpg"],
      danmakuText: "Contact Me",
      enableDanmaku: true,
      imageWidth: 500,
      imageHeight: 500,
    });
  };

  const express = experienceData;

  return (
    <>
      <Head>
        <title>Home - austin&apos;s web</title>
        <meta name="description" content="austin's personal website homepage" />
      </Head>
      <div className="relative">
        {/* Modal components */}
        <ImageModal
          isOpen={imageModal.isOpen}
          onClose={() => setImageModal({ ...imageModal, isOpen: false })}
          title={imageModal.title}
          images={imageModal.images}
          danmakuText={imageModal.danmakuText}
          enableDanmaku={imageModal.enableDanmaku}
          imageWidth={imageModal.imageWidth}
          imageHeight={imageModal.imageHeight}
        />

        <MusicModal
          isOpen={musicModal.isOpen}
          onClose={() => setMusicModal({ ...musicModal, isOpen: false })}
          title={musicModal.title}
          musicUrl={musicModal.musicUrl}
          author={musicModal.author}
          cover={musicModal.cover}
          danmakuText={musicModal.danmakuText}
          enableDanmaku={musicModal.enableDanmaku}
        />

        <VideoModal
          isOpen={videoModal.isOpen}
          onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
          videoUrl={videoModal.videoUrl}
          danmakuText={videoModal.danmakuText}
          enableDanmaku={videoModal.enableDanmaku}
        />

        {/* Main content area */}
        <div
          className={`${geistSans.className} ${geistMono.className} min-h-screen font-[family-name:var(--font-geist-sans)] flex justify-center items-center px-4 md:px-8 w-full`}
        >
          <div className="flex flex-col w-full max-w-4xl lg:max-w-5xl md:h-auto overflow-y-auto md:overflow-y-visible custom-scrollbar pb-8 md:pb-0 hide-scrollbar pt-2">
            {/* Header area - avatar and basic info */}
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
                          {wordIndex < displayText.split(" ").length - 1
                            ? " "
                            : ""}
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
                    onClick={handleGithubClick}
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
                    onClick={handleQQClick}
                  >
                    <SvgIcon name="qq" width={18} height={18} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content area - vertical layout below 800px */}
            <div className="flex gap-[0.5rem] md:gap-[0.75rem] flex-col lg:grid lg:grid-cols-[16rem_1fr] px-4 md:px-6 lg:px-8">
              {/* Left/center area */}
              <div className="order-2 lg:order-1 flex flex-col gap-[0.5rem] md:gap-[0.625rem]">
                {/* Navigation Section */}
                <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[12px] text-[#fff] shadow-lg">
                  <div className="mb-[8px]">
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
                  <div className="flex flex-col gap-[6px]">
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

                {/* Experience Section */}
                <div className="bg-[rgba(0,0,0,.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[0.75rem] text-[#fff] text-[0.875rem] flex flex-col h-full shadow-lg overflow-hidden">
                  <div className="p-[12px] pb-0">
                    <div className="mb-[8px]">
                      <h3 className="text-[18px] font-semibold mb-[1px] flex items-center gap-2">
                        <SvgIcon
                          name="work"
                          width={16}
                          height={16}
                          color="#fff"
                        />
                        Experience
                      </h3>
                    </div>
                  </div>
                  <div className="relative flex flex-col h-full max-h-[375px] overflow-y-auto custom-scrollbar px-[12px] pb-[12px]">
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
                        {/* 时间线左侧圆点 */}
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
              </div>
              {/* Right/bottom area */}
              <div className="flex flex-col gap-[0.5rem] md:gap-[0.75rem] order-1 lg:order-2">
                {/* GitHub contribution heatmap */}
                <GitHubHeatmap username="shenghaoisyummy" />

                {/* Tech Stack Section */}
                <TechStack />
              </div>
            </div>
          </div>

          {/* Scroll to works page button */}
          <div className="fixed bottom-8 right-8 z-10 hidden">
            <Link
              href="/works"
              className="bg-[rgba(0,0,0,.6)] hover:bg-[rgba(0,0,0,.8)] border border-[rgba(255,255,255,0.1)] rounded-[0.625rem] p-[0.75rem] cursor-pointer transition-all duration-300 flex items-center gap-2 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span className="text-sm">Portfolio</span>
              <SvgIcon name="right" width={20} height={20} color="#fff" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
