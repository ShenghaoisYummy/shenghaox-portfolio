import React from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface SvgIconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  lightColor?: string; // Color for light theme
  darkColor?: string; // Color for dark theme
  hoverColor?: string; // Color on hover
}

export default function SvgIcon({
  name,
  width = 24,
  height = 24,
  className = "",
  color = "currentColor",
  lightColor,
  darkColor,
}: Omit<SvgIconProps, 'hoverColor'>) {
  const { theme } = useTheme();
  // Choose color based on theme
  const getThemeColor = () => {
    if (lightColor && darkColor) {
      return theme === "dark" ? darkColor : lightColor;
    }
    return color;
  };

  const finalColor = getThemeColor();

  return (
    <Image
      src={`/svgs/${name}.svg`}
      alt={name}
      width={width}
      height={height}
      className={className}
      style={{
        filter:
          finalColor !== "currentColor"
            ? `brightness(0) saturate(100%) ${getColorFilter(finalColor)}`
            : undefined,
      }}
    />
  );
}

// Helper function: Convert color to CSS filter
function getColorFilter(color: string): string {
  const colorMap: Record<string, string> = {
    "#fff": "invert(100%)",
    "#ffffff": "invert(100%)",
    white: "invert(100%)",
    "#000": "invert(0%)",
    "#000000": "invert(0%)",
    black: "invert(0%)",
    "#6b7280":
      "invert(52%) sepia(6%) saturate(640%) hue-rotate(185deg) brightness(93%) contrast(88%)", // gray-500
    "#9ca3af":
      "invert(64%) sepia(11%) saturate(297%) hue-rotate(185deg) brightness(97%) contrast(87%)", // gray-400
    "#ff0000":
      "invert(13%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(97%) contrast(118%)",
    red: "invert(13%) sepia(99%) saturate(7404%) hue-rotate(4deg) brightness(97%) contrast(118%)",
    // Location pin red
    "#F76D57":
      "invert(65%) sepia(85%) saturate(565%) hue-rotate(315deg) brightness(96%) contrast(96%)",
    // Location pin red (lowercase)
    "#f76d57":
      "invert(65%) sepia(85%) saturate(565%) hue-rotate(315deg) brightness(96%) contrast(96%)",

    // Social media brand colors
    // LinkedIn blue
    "#0077b5":
      "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)",
    // X (Twitter) blue
    "#1da1f2":
      "invert(64%) sepia(88%) saturate(1018%) hue-rotate(169deg) brightness(97%) contrast(89%)",
    // Instagram gradient (main pink)
    "#e4405f":
      "invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)",
    // TikTok pink/red
    "#ff0050":
      "invert(9%) sepia(100%) saturate(7426%) hue-rotate(321deg) brightness(118%) contrast(115%)",
    // TikTok cyan
    "#25f4ee":
      "invert(92%) sepia(58%) saturate(200%) hue-rotate(137deg) brightness(91%) contrast(80%)",
  };

  return colorMap[color.toLowerCase()] || "invert(50%)";
}
