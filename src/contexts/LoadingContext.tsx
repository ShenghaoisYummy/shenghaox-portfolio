import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  heatmapLoaded: boolean;
  setHeatmapLoaded: (loaded: boolean) => void;
  isMainLoadingComplete: () => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  const isMainLoadingComplete = () => {
    // Main loading is complete when heatmap has finished loading
    return heatmapLoaded;
  };

  return (
    <LoadingContext.Provider value={{
      heatmapLoaded,
      setHeatmapLoaded,
      isMainLoadingComplete,
    }}>
      {children}
    </LoadingContext.Provider>
  );
};