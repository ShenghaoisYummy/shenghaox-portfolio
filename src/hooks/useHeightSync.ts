import { useEffect, RefObject } from 'react';

interface UseHeightSyncOptions {
  githubHeatmapRef: RefObject<HTMLDivElement | null>;
  navigationRef: RefObject<HTMLDivElement | null>;
  experienceRef: RefObject<HTMLDivElement | null>;
  techStackRef: RefObject<HTMLDivElement | null>;
  dependencies?: unknown[];
}

export const useHeightSync = ({
  githubHeatmapRef,
  navigationRef,
  experienceRef,
  techStackRef,
  dependencies = []
}: UseHeightSyncOptions) => {
  useEffect(() => {
    const syncHeights = () => {
      if (githubHeatmapRef.current && navigationRef.current && experienceRef.current && techStackRef.current) {
        experienceRef.current.style.height = "auto";
        
        const githubHeight = githubHeatmapRef.current.offsetHeight;
        const techStackHeight = techStackRef.current.offsetHeight;
        
        navigationRef.current.style.height = `${githubHeight}px`;
        navigationRef.current.style.minHeight = `${githubHeight}px`;
        
        experienceRef.current.style.height = `${techStackHeight}px`;
        experienceRef.current.style.minHeight = `${techStackHeight}px`;
      }
    };

    const timeouts = [100, 500, 1000, 2000].map(delay =>
      setTimeout(syncHeights, delay)
    );

    const observer = new MutationObserver(() => {
      setTimeout(syncHeights, 100);
    });

    if (githubHeatmapRef.current) {
      observer.observe(githubHeatmapRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    if (techStackRef.current) {
      observer.observe(techStackRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(syncHeights, 50);
    });

    if (githubHeatmapRef.current) {
      resizeObserver.observe(githubHeatmapRef.current);
    }

    if (techStackRef.current) {
      resizeObserver.observe(techStackRef.current);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [githubHeatmapRef, navigationRef, experienceRef, techStackRef, ...dependencies]);
};