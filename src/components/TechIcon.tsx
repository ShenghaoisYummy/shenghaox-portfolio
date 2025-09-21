import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import CustomTechIcons from './CustomTechIcons';
import { getTechIcon } from '@/utils/techIconMapping';

interface TechIconProps {
  techName: string;
  size?: 'sm' | 'md' | 'lg';
  isExtracted?: boolean;
  extractedModel?: string;
  className?: string;
  showUsageCount?: boolean;
}

const TechIcon: React.FC<TechIconProps> = ({
  techName,
  size = 'md',
  isExtracted = false,
  extractedModel,
  className = '',
  showUsageCount = false,
}) => {
  const techIconData = getTechIcon(techName);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  // Always fetch usage count for tooltips
  useEffect(() => {
    const fetchUsageCount = async () => {
      try {
        const response = await fetch('/api/tech-usage-stats');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const techStat = data.data.stats.find((stat: { techName: string; totalProjects: number }) =>
              stat.techName.toLowerCase() === techName.toLowerCase() ||
              stat.techName.toLowerCase() === techIconData?.displayName.toLowerCase()
            );
            setUsageCount(techStat ? techStat.totalProjects : 0);
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch usage count for ${techName}:`, error);
      }
    };

    fetchUsageCount();
  }, [techName, techIconData?.displayName]);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-4 h-4 text-sm',
    md: 'w-6 h-6 text-base',
    lg: 'w-8 h-8 text-lg',
  };
  
  const iconSizes = {
    sm: '1rem',
    md: '1.5rem', 
    lg: '2rem',
  };

  // If no icon data found, fallback to text
  if (!techIconData) {
    return (
      <span
        className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-white text-xs backdrop-blur-sm transition-all duration-200 bg-[rgba(0,0,0,.5)] border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(0,0,0,.7)] ${className}`}
        title={
          isExtracted
            ? `Technology extracted from README using ${extractedModel || 'AI'}`
            : "Technology from repository metadata"
        }
      >
        {techName}
      </span>
    );
  }

  const containerClasses = `
    group relative inline-flex items-center justify-center transition-all duration-300 hover:scale-110
    ${sizeClasses[size]} ${className}
  `.trim();

  // Handle mouse events for tooltip positioning
  const handleMouseEnter = () => {
    if (!iconRef.current) return;

    const rect = iconRef.current.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 10, // Position above the icon
      left: rect.left + rect.width / 2, // Center horizontally
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Tooltip component rendered via portal
  const TooltipPortal = () => {
    if (!showTooltip || typeof window === 'undefined') return null;

    return createPortal(
      <div
        className="fixed px-2 py-1 bg-[rgba(0,0,0,0.9)] text-white text-xs rounded-md whitespace-nowrap pointer-events-none border border-[rgba(255,255,255,0.1)] transform -translate-x-1/2 -translate-y-full"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          zIndex: 99999,
        }}
      >
        {techIconData.displayName}
        {usageCount > 0 && (
          <div className="text-[10px] opacity-75 mt-1">
            Used in {usageCount} project{usageCount !== 1 ? 's' : ''}
          </div>
        )}
        {isExtracted && (
          <div className="text-[10px] opacity-75 mt-1">
            Extracted using {extractedModel || 'AI'}
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <>
      <TooltipPortal />
      <div className={`flex items-center gap-2`}>
        {/* Icon */}
        <div
          ref={iconRef}
          className={containerClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        {techIconData.isCustomIcon ? (
          <CustomTechIcons
            name={techIconData.name as "claude" | "cursor" | "huggingface" | "shadcn"}
            size={iconSizes[size]}
            hoverColor={techIconData.hoverColor}
            initialColor={techIconData.hoverColor}
          />
        ) : (
          <i
            className={`${techIconData.className} transition-colors duration-300 filter drop-shadow-sm`}
            style={{
              color: techIconData.hoverColor,
              fontSize: iconSizes[size],
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = techIconData.hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = techIconData.hoverColor;
            }}
          />
        )}
        
        {/* Usage count badge */}
        {showUsageCount && usageCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#4A90E2] to-[#67B26F] text-white text-xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-lg border border-white/20">
            {usageCount}
          </div>
        )}
        </div>

        {/* Text label */}
        <span className={`text-white font-medium ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        }`}>
          {techIconData.displayName}
          {showUsageCount && usageCount > 0 && (
            <span className="ml-1 text-xs opacity-75">
              ({usageCount})
            </span>
          )}
        </span>
      </div>
    </>
  );
};

export default TechIcon;