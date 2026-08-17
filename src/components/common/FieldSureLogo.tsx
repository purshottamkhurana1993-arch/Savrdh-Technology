import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const FieldSureLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-xl',
    xl: 'w-14 h-14 text-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: F + Verified Check Shield */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-blue-700 text-white shadow-sm ring-1 ring-emerald-500/20 ${iconSizes[size]}`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-4/5 h-4/5">
          {/* Shield outline */}
          <path 
            d="M16 3L6 7V14C6 21 10.5 27 16 29C21.5 27 26 21 26 14V7L16 3Z" 
            fill="currentColor" 
            fillOpacity="0.15" 
            stroke="currentColor" 
            strokeWidth="1.8"
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Stylized 'F' */}
          <path 
            d="M11 10H19.5M11 15H17M11 10V22" 
            stroke="white" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Verified Check Badge */}
          <circle cx="21" cy="20" r="5" fill="#10B981" />
          <path 
            d="M19 20L20.5 21.5L23.5 18.5" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-slate-900 ${textSizes[size]}`}>
            Field<span className="text-emerald-600 font-extrabold">Sure</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">
            by Savrdh Technologies
          </span>
        )}
      </div>
    </div>
  );
};
