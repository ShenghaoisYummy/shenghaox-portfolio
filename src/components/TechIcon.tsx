import React from 'react';
import CustomTechIcons from './CustomTechIcons';
import { getTechIcon } from '@/utils/techIconMapping';

interface TechIconProps {
  techName: string;
  size?: 'sm' | 'md' | 'lg';
  isExtracted?: boolean;
  extractedModel?: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({
  techName,
  size = 'md',
  isExtracted = false,
  extractedModel,
  className = '',
}) => {
  const techIconData = getTechIcon(techName);
  
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

  return (
    <div className={`flex items-center gap-2`}>
      {/* Icon */}
      <div className={containerClasses}>
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
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[rgba(0,0,0,0.9)] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none border border-[rgba(255,255,255,0.1)]">
          {techIconData.displayName}
          {isExtracted && (
            <div className="text-[10px] opacity-75 mt-1">
              Extracted using {extractedModel || 'AI'}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[rgba(0,0,0,0.9)]"></div>
        </div>
      </div>
      
      {/* Text label */}
      <span className={`text-white font-medium ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        {techIconData.displayName}
      </span>
    </div>
  );
};

export default TechIcon;