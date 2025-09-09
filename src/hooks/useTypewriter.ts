import { useState, useEffect, useRef } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  pauseDuration?: number;
  loop?: boolean;
}

interface UseTypewriterReturn {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
}

type AnimationState =
  | "idle"
  | "delayed"
  | "typing"
  | "complete"
  | "paused"
  | "deleting";

export const useTypewriter = ({
  text,
  speed = 100,
  delay = 0,
  pauseDuration = 2000,
  loop = true,
}: UseTypewriterOptions): UseTypewriterReturn => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    switch (animationState) {
      case "idle":
        if (delay > 0) {
          setAnimationState("delayed");
          timeoutRef.current = setTimeout(() => {
            setAnimationState("typing");
          }, delay);
        } else {
          setAnimationState("typing");
        }
        break;

      case "typing":
        if (currentIndex < text.length) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(text.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          }, speed);
        } else {
          setAnimationState("complete");
        }
        break;

      case "complete":
        if (loop) {
          timeoutRef.current = setTimeout(() => {
            setAnimationState("deleting");
          }, pauseDuration);
        }
        break;

      case "deleting":
        if (currentIndex > 0) {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(text.slice(0, currentIndex - 1));
            setCurrentIndex(currentIndex - 1);
          }, speed);
        } else {
          if (loop) {
            setAnimationState("typing");
          }
        }
        break;

      // 'delayed' and 'paused' states are handled by their respective timeouts
      default:
        break;
    }
  }, [animationState, currentIndex, text, speed, delay, pauseDuration, loop]);

  return {
    displayText,
    isTyping: animationState === "typing" || animationState === "deleting",
    isComplete: animationState === "complete" && !loop,
  };
};
