import React from 'react';

interface CustomIconProps {
  name: 'claude' | 'cursor';
  size?: string;
  hoverColor?: string;
  initialColor?: string;
}

const CustomTechIcons: React.FC<CustomIconProps> = ({ name, size = '1.75rem', hoverColor, initialColor }) => {
  const baseClasses = `transition-colors duration-300 group-hover:scale-110 filter drop-shadow-sm`;
  
  const iconStyle = {
    color: initialColor || '#6B7280',
    width: size,
    height: size,
    fontSize: size,
  } as React.CSSProperties;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hoverColor) {
      e.currentTarget.style.color = hoverColor;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.currentTarget.style.color = initialColor || '#6B7280';
  };

  if (name === 'claude') {
    return (
      <div 
        className={baseClasses}
        style={iconStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          width="100%" 
          height="100%"
        >
          <path d="M12 2C9.79 2 7.67 2.68 5.93 4.03c-1.74 1.35-3.07 3.28-3.74 5.47-.67 2.19-.67 4.53 0 6.72.67 2.19 2 4.12 3.74 5.47C7.67 22.32 9.79 23 12 23s4.33-.68 6.07-2.03c1.74-1.35 3.07-3.28 3.74-5.47.67-2.19.67-4.53 0-6.72-.67-2.19-2-4.12-3.74-5.47C16.33 2.68 14.21 2 12 2zm0 2c1.66 0 3.24.51 4.54 1.39 1.3.88 2.29 2.14 2.83 3.61.54 1.47.54 3.07 0 4.54-.54 1.47-1.53 2.73-2.83 3.61C15.24 17.99 13.66 18.5 12 18.5s-3.24-.51-4.54-1.39c-1.3-.88-2.29-2.14-2.83-3.61-.54-1.47-.54-3.07 0-4.54.54-1.47 1.53-2.73 2.83-3.61C8.76 4.51 10.34 4 12 4zm-3 6c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1zm6 0c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1zm-3 4c-1.38 0-2.5 1.12-2.5 2.5 0 .28.22.5.5.5h4c.28 0 .5-.22.5-.5 0-1.38-1.12-2.5-2.5-2.5z"/>
        </svg>
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
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          width="100%" 
          height="100%"
        >
          <path d="M5.5 2L21 7.5L14 14L11 16L8 11L5.5 2Z" stroke="currentColor" strokeWidth="1" fill="currentColor"/>
          <path d="M11 16L8 19L5 16L8 11L11 16Z" fill="currentColor"/>
          <circle cx="17" cy="5" r="1" fill="currentColor"/>
          <circle cx="19" cy="7" r="1" fill="currentColor"/>
          <circle cx="15" cy="7" r="1" fill="currentColor"/>
        </svg>
      </div>
    );
  }

  return null;
};

export default CustomTechIcons;