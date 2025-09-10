import React from 'react';

interface CustomIconProps {
  name: 'claude' | 'cursor' | 'huggingface' | 'shadcn';
  size?: string;
  hoverColor?: string;
  initialColor?: string;
}

const CustomTechIcons: React.FC<CustomIconProps> = ({ name, size = '1.75rem', hoverColor, initialColor }) => {
  // Use larger size for Hugging Face icon
  const actualSize = name === 'huggingface' ? '2.25rem' : size;
  const baseClasses = `transition-colors duration-300 group-hover:scale-110 filter drop-shadow-sm`;
  
  const iconStyle = {
    color: initialColor || '#6B7280',
    width: actualSize,
    height: actualSize,
    fontSize: actualSize,
  } as React.CSSProperties;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hoverColor) {
      (e.currentTarget as HTMLElement).style.color = hoverColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.color = initialColor || '#6B7280';
  };

  if (name === 'claude') {
    return (
      <div 
        className={baseClasses}
        style={iconStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#DA7A5B',
            mask: 'url(/icons/claude-stroke-rounded.svg) no-repeat center',
            maskSize: 'contain',
            WebkitMask: 'url(/icons/claude-stroke-rounded.svg) no-repeat center',
            WebkitMaskSize: 'contain',
          }}
        />
      </div>
    );
  }

  if (name === 'cursor') {
    return (
      <div 
        className={baseClasses}
        style={iconStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: initialColor || '#FFFFFF',
            mask: 'url(/icons/cursor-color.svg) no-repeat center',
            maskSize: 'contain',
            WebkitMask: 'url(/icons/cursor-color.svg) no-repeat center',
            WebkitMaskSize: 'contain',
          }}
        />
      </div>
    );
  }

  if (name === 'huggingface') {
    const handleHuggingFaceMouseEnter = (e: React.MouseEvent) => {
      (e.currentTarget as HTMLElement).style.opacity = '1';
    };

    const handleHuggingFaceMouseLeave = (e: React.MouseEvent) => {
      const baseOpacity = initialColor === '#FFD21E' ? '1' : (initialColor ? '0.5' : '0.4');
      (e.currentTarget as HTMLElement).style.opacity = baseOpacity;
    };

    return (
      <div 
        className={baseClasses}
        style={{
          ...iconStyle,
          opacity: initialColor === '#FFD21E' ? 1 : (initialColor ? 0.5 : 0.4),
        }}
        onMouseEnter={handleHuggingFaceMouseEnter}
        onMouseLeave={handleHuggingFaceMouseLeave}
      >
        <img
          src="/icons/hf-logo.svg"
          alt="Hugging Face"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    );
  }

  if (name === 'shadcn') {
    return (
      <div 
        className={baseClasses}
        style={iconStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: initialColor || '#FFFFFF',
            mask: 'url(/icons/shadcn.svg) no-repeat center',
            maskSize: 'contain',
            WebkitMask: 'url(/icons/shadcn.svg) no-repeat center',
            WebkitMaskSize: 'contain',
          }}
        />
      </div>
    );
  }

  return null;
};

export default CustomTechIcons;