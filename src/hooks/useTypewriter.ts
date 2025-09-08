import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
}

interface UseTypewriterReturn {
  displayText: string;
  isTyping: boolean;
  isComplete: boolean;
}

export const useTypewriter = ({ 
  text, 
  speed = 100, 
  delay = 0 
}: UseTypewriterOptions): UseTypewriterReturn => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex === 0 && delay > 0) {
      const delayTimeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);

      return () => clearTimeout(delayTimeout);
    } else if (currentIndex === 0) {
      setIsTyping(true);
    }
  }, [currentIndex, delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, isTyping]);

  return {
    displayText,
    isTyping,
    isComplete
  };
};