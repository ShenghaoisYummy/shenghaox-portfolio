import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useTheme } from "@/contexts/ThemeContext";
import SvgIcon from "@/components/SvgIcon";
import GitHubHeatmap from "@/components/GitHubHeatmap";
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
          <div className="flex flex-col w-full max-w-4xl md:h-auto overflow-y-auto md:overflow-y-visible custom-scrollbar pb-24 md:pb-0 hide-scrollbar">
            {/* Header area - avatar and basic info */}
            <div className="flex gap-[16px] md:gap-[20px] flex-col md:flex-row mb-6">
              <div className="relative w-full md:w-[250px] flex justify-center items-center mx-auto md:mx-0">
                <Image
                  src="/images/avatar.jpg"
                  alt="Logo"
                  width={200}
                  height={200}
                  className="rounded-[50%] shadow-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
                />
                {theme !== "dark" ? (
                  <Image
                    src="/images/smoke.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="top-[-135px] md:top-[-180px] left-[50%] translate-x-[-50%] absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                className="flex flex-col gap-[12px] md:gap-[16px] text-center md:text-left px-4 md:px-0 relative"
                style={{ left: "40px" }}
              >
                <div className="text-[32px] md:text-[48px] font-bold text-[#fff] text-shadow-lg">
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
                <div className="text-shadow-sm text-[#fff] text-[16px] md:text-[20px]">
                  <span className="bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] bg-clip-text text-transparent text-[18px] md:text-[22px] font-semibold">
                    Full-Stack & AI Developer
                  </span>{" "}
                </div>

                <div className="text-shadow-sm text-[rgba(255,255,255,0.9)] text-[15px] md:text-[18px]">
                  <span className="bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] bg-clip-text text-transparent text-[17px] md:text-[20px] font-semibold">
                    2.5
                  </span>{" "}
                  years work experience
                </div>
                <div className="flex mt-[10px] gap-[10px] justify-center md:justify-start">
                  <div
                    className="bg-[rgba(0,0,0,.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-[8px] p-[10px] cursor-pointer hover:bg-[rgba(0,0,0,.8)] transition-all duration-300 shadow-md"
                    onClick={handleGithubClick}
                  >
                    <SvgIcon
                      name="github"
                      width={20}
                      height={20}
                      color="#fff"
                    />
                  </div>
                  <div
                    className="bg-[rgba(0,0,0,.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-[8px] p-[10px] cursor-pointer hover:bg-[rgba(0,0,0,.8)] transition-all duration-300 shadow-md"
                    onClick={handleQQClick}
                  >
                    <SvgIcon name="qq" width={20} height={20} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content area - vertical layout below 800px */}
            <div className="flex gap-[16px] md:gap-[20px] mt-[24px] flex-col lg:grid lg:grid-cols-[290px_1fr] px-4 md:px-0">
              {/* Left/center area */}
              <div className="order-2 lg:order-1">
                <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[16px] text-[#fff] text-[14px] gap-[12px] flex flex-col h-full shadow-lg">
                  <div className="relative flex flex-col justify-between h-full">
                    {/* Background timeline line */}
                    <div className="absolute left-[5px] top-[6px] bottom-[6px] w-[3px] bg-gradient-to-b from-[#4a90c2] via-[#3d85a9] to-[#7db8d8] rounded-full shadow-sm"></div>

                    {express.map((item, index) => (
                      <div key={index} className="relative flex items-start">
                        {/* 时间线左侧圆点 */}
                        <div className="relative flex flex-col items-center mr-[15px] z-10 mt-[2px]">
                          <div
                            className={`w-[14px] h-[14px] rounded-full border-2 border-white shadow-md ${
                              index === express.length - 1
                                ? "bg-gradient-to-br from-[#4a90c2] to-[#7db8d8] animate-pulse"
                                : "bg-gradient-to-br from-[#1b2c55] to-[#3d85a9]"
                            }`}
                          ></div>
                        </div>

                        <div className="flex-1">
                          <div className="font-bold bg-gradient-to-r from-[#4a90c2] to-[#7db8d8] bg-clip-text text-transparent mb-[3px] text-[13px] md:text-[14px] uppercase tracking-wider">
                            {item.name}
                          </div>
                          <div className="text-[11px] md:text-[12px] text-[#87ceeb] mb-[4px] font-bold italic">
                            {item.position}
                          </div>
                          <div className="text-[10px] md:text-[11px] text-[rgba(255,255,255,0.7)] mb-[4px]">
                            {item.date}
                          </div>
                          <div className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.8)] leading-relaxed">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right/bottom area */}
              <div className="flex flex-col gap-[16px] md:gap-[20px] order-1 lg:order-2">
                {/* GitHub contribution heatmap */}
                <GitHubHeatmap username="shenghaoisyummy" />

                <div className="bg-[rgba(0,0,0,.4)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[24px] text-[#fff] text-[16px] gap-[24px] flex flex-col flex-1 shadow-lg">
                  <div className="font-bold text-[20px] flex items-center gap-[8px]">
                    <SvgIcon name="site" width={24} height={24} color="#fff" />
                    <div className="flex flex-col">Navigation</div>
                  </div>
                  <div className="flex gap-[16px] md:gap-[20px] flex-col sm:flex-row">
                    <Link
                      href="/works"
                      className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(255,107,53,0.15)] hover:border-[#ff6b35] hover:shadow-lg hover:shadow-[rgba(255,107,53,0.2)] hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Portfolio</span>
                        <div className="group-hover:rotate-12 transition-transform duration-300">
                          <SvgIcon
                            name="zuopin"
                            width={30}
                            height={30}
                            color="#fff"
                          />
                        </div>
                      </div>
                      <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                        Full-Stack projects
                      </span>
                    </Link>
                    <Link
                      href="/blog"
                      className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(32,178,170,0.15)] hover:border-[#20b2aa] hover:shadow-lg hover:shadow-[rgba(32,178,170,0.2)] hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Articles</span>
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          <SvgIcon
                            name="docs"
                            width={30}
                            height={30}
                            color="#fff"
                          />
                        </div>
                      </div>
                      <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                        Full-Stack & AI knowledges
                      </span>
                    </Link>
                    <Link
                      href="/chat"
                      className="bg-[rgba(0,0,0,.3)] backdrop-blur-sm border border-[rgba(255,255,255,0.05)] rounded-[12px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(74,144,194,0.15)] hover:border-[#4a90c2] hover:shadow-lg hover:shadow-[rgba(74,144,194,0.2)] hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Chat Room</span>
                        <div className="group-hover:animate-pulse transition-all duration-300">
                          <SvgIcon
                            name="comment"
                            width={30}
                            height={30}
                            color="#fff"
                          />
                        </div>
                      </div>
                      <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                        Real-time chat
                      </span>
                    </Link>
                  </div>
                  <div className="text-[14px] md:text-[16px] text-[rgba(255,255,255,0.7)]">
                    Continuously updating since 2025...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll to works page button */}
          <div className="fixed bottom-8 right-8 z-10">
            <Link
              href="/works"
              className="bg-[rgba(0,0,0,.6)] hover:bg-[rgba(0,0,0,.8)] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-[12px] cursor-pointer transition-all duration-300 flex items-center gap-2 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105"
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
