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
          className={`${geistSans.className} ${geistMono.className} min-h-screen font-[family-name:var(--font-geist-sans)] flex justify-center items-center px-4 md:px-0 w-full`}
          style={{ transform: "translateX(-5%)" }}
        >
          <div className="flex flex-col w-full max-w-3xl md:h-auto overflow-y-auto md:overflow-y-visible custom-scrollbar pb-20 md:pb-0 hide-scrollbar">
            {/* Header area - avatar and basic info */}
            <div className="flex gap-[10px] flex-col md:flex-row">
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
              <div className="flex flex-col gap-[10px] text-center md:text-left px-4 md:px-0">
                <div className="text-[28px] md:text-[40px] font-bold text-[#fff] text-shadow-sm">
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
                <div className="text-shadow-sm text-[#fff] text-[14px] md:text-[16px]">
                  <span className="bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] bg-clip-text text-transparent text-[16px] md:text-[18px]">
                    Full-Stack & AI Developer
                  </span>{" "}
                </div>

                <div className="text-shadow-sm text-[#fff] text-[14px] md:text-[16px]">
                  <span className="bg-gradient-to-br from-[#1b2c55] to-[#3d85a9] bg-clip-text text-transparent text-[16px] md:text-[18px]">
                    2.5
                  </span>{" "}
                  years work experience
                </div>
                <div className="flex mt-[10px] gap-[10px] justify-center md:justify-start">
                  <div
                    className="bg-[rgba(0,0,0,.5)] rounded-[5px] p-[8px] cursor-pointer"
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
                    className="bg-[rgba(0,0,0,.5)] rounded-[5px] p-[8px] cursor-pointer"
                    onClick={handleQQClick}
                  >
                    <SvgIcon name="qq" width={20} height={20} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content area - vertical layout below 800px */}
            <div className="flex gap-[10px] mt-[20px] flex-col md:grid md:grid-cols-[250px_1fr] px-4 md:px-0">
              {/* Left/center area */}
              <div className="order-2 md:order-1">
                <div className="bg-[rgba(0,0,0,.3)] rounded-[5px] p-[10px] text-[#fff] text-[14px] gap-[10px] flex flex-col h-full">
                  <div className="relative flex flex-col justify-between h-full">
                    {/* Background timeline line */}
                    <div className="absolute left-[5px] top-[6px] bottom-[6px] w-[2px] bg-gradient-to-b from-[#1b2c55] to-[#3d85a9]"></div>

                    {express.map((item, index) => (
                      <div key={index} className="relative flex items-start">
                        {/* 时间线左侧圆点 */}
                        <div className="relative flex flex-col items-center mr-[15px] z-10 mt-[2px]">
                          <div
                            className={`w-[12px] h-[12px] rounded-full border-2 border-white ${
                              index === express.length - 1
                                ? "bg-[#3d85a9]"
                                : "bg-[#1b2c55]"
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
                          <div className="text-[10px] md:text-[11px] text-[rgba(255,255,255,0.6)] leading-relaxed">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right/bottom area */}
              <div className="flex flex-col gap-[10px] order-1 md:order-2">
                {/* GitHub contribution heatmap */}
                <div className="w-full overflow-x-auto">
                  <GitHubHeatmap username="shenghaoisyummy" />
                </div>

                <div className="bg-[rgba(0,0,0,.3)] rounded-[5px] p-[20px] text-[#fff] text-[16px] gap-[20px] flex flex-col flex-1">
                  <div className="font-bold text-[20px] flex items-center gap-[8px]">
                    <SvgIcon name="site" width={24} height={24} color="#fff" />
                    <div className="flex flex-col">Navigation</div>
                  </div>
                  <div className="flex gap-[20px] flex-col sm:flex-row">
                    <Link
                      href="/works"
                      className="bg-[rgba(0,0,0,.3)] rounded-[8px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(255,107,53,0.2)] hover:border-[#ff6b35] border border-transparent transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Portfolio</span>
                        <SvgIcon
                          name="zuopin"
                          width={30}
                          height={30}
                          color="#fff"
                        />
                      </div>
                      <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                        Full-Stack projects
                      </span>
                    </Link>
                    <Link
                      href="/blog"
                      className="bg-[rgba(0,0,0,.3)] rounded-[8px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(32,178,170,0.2)] hover:border-[#20b2aa] border border-transparent transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Articles</span>
                        <SvgIcon
                          name="docs"
                          width={30}
                          height={30}
                          color="#fff"
                        />
                      </div>
                      <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                        Full-Stack & AI knowledges
                      </span>
                    </Link>
                    <Link
                      href="/chat"
                      className="bg-[rgba(0,0,0,.3)] rounded-[8px] p-[20px] text-[#fff] text-[16px] gap-[15px] flex flex-col cursor-pointer flex-1 hover:bg-[rgba(74,144,194,0.2)] hover:border-[#4a90c2] border border-transparent transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Chat Room</span>
                        <SvgIcon
                          name="comment"
                          width={30}
                          height={30}
                          color="#fff"
                        />
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
          <div
            className="fixed bottom-8 right-8 z-10"
            style={{ transform: "translateX(80%)" }}
          >
            <Link
              href="/works"
              className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
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
