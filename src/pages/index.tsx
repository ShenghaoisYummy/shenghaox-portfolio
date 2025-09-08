import { Geist, Geist_Mono } from "next/font/google";
import GitHubHeatmap from "@/components/GitHubHeatmap";
import TechStack from "@/components/TechStack";
import ImageModal from "@/components/ImageModal";
import MusicModal from "@/components/MusicModal";
import VideoModal from "@/components/VideoModal";
import ProfileHeader from "@/components/ProfileHeader";
import NavigationSection from "@/components/NavigationSection";
import ExperienceSection from "@/components/ExperienceSection";
import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import SvgIcon from "@/components/SvgIcon";
import { useHeightSync } from "@/hooks/useHeightSync";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
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

  // Refs for height synchronization
  const githubHeatmapRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);

  // Use height synchronization hook
  useHeightSync({
    githubHeatmapRef,
    navigationRef,
    experienceRef,
    techStackRef,
  });

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
            <ProfileHeader
              onGithubClick={handleGithubClick}
              onQQClick={handleQQClick}
            />

            {/* Content area - vertical layout below 800px */}
            <div className="flex gap-[0.5rem] md:gap-[0.75rem] flex-col lg:grid lg:grid-cols-[16rem_1fr] px-4 md:px-6 lg:px-8">
              {/* Left/center area */}
              <div className="order-2 lg:order-1 flex flex-col gap-[0.5rem] md:gap-[0.625rem]">
                <NavigationSection ref={navigationRef} />

                <ExperienceSection ref={experienceRef} />
              </div>
              {/* Right/bottom area */}
              <div className="flex flex-col gap-[0.5rem] md:gap-[0.75rem] order-1 lg:order-2">
                {/* GitHub contribution heatmap */}
                <div ref={githubHeatmapRef}>
                  <GitHubHeatmap username="shenghaoisyummy" />
                </div>

                {/* Tech Stack Section */}
                <div ref={techStackRef}>
                  <TechStack />
                </div>
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
