
import React from 'react';

interface LevelBadgeProps {
  level: number;
  type?: 'noble' | 'vip' | 'level';
  size?: 'sm' | 'md' | 'lg';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, type = 'noble', size = 'md' }) => {
  const getNobleConfig = (lvl: number) => {
    if (lvl >= 20) return { label: 'N20', color: 'from-amber-300 via-yellow-500 to-amber-600', icon: '🐲', textColor: 'text-amber-950' };
    if (lvl >= 19) return { label: 'N19', color: 'from-red-500 via-red-600 to-red-800', icon: '🐉', textColor: 'text-white' };
    if (lvl >= 16) return { label: 'N16', color: 'from-orange-400 via-orange-500 to-red-600', icon: '🦁', textColor: 'text-white' };
    if (lvl >= 13) return { label: 'N13', color: 'from-purple-400 via-purple-600 to-purple-900', icon: '👾', textColor: 'text-white' };
    if (lvl >= 10) return { label: 'N10', color: 'from-blue-400 via-blue-600 to-blue-800', icon: '🐯', textColor: 'text-white' };
    if (lvl >= 7) return { label: 'N7', color: 'from-cyan-400 via-cyan-500 to-blue-600', icon: '🐆', textColor: 'text-white' };
    if (lvl >= 4) return { label: 'N4', color: 'from-green-400 via-green-500 to-emerald-700', icon: '🐺', textColor: 'text-white' };
    return { label: 'N1', color: 'from-zinc-300 via-zinc-400 to-zinc-600', icon: '🐎', textColor: 'text-zinc-900' };
  };

  if (type === 'vip') {
    return (
      <div className={`flex items-center justify-center px-1.5 rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900 border border-white/20 shadow-sm ${size === 'sm' ? 'h-3.5 min-w-[30px]' : 'h-5 min-w-[45px]'}`}>
        <span className={`font-black italic text-white leading-none ${size === 'sm' ? 'text-[7px]' : 'text-[9px]'}`}>VIP{level}</span>
      </div>
    );
  }

  if (type === 'level') {
    return (
      <div className={`flex items-center justify-center px-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border border-white/20 shadow-sm ${size === 'sm' ? 'h-3.5 min-w-[24px]' : 'h-5 min-w-[35px]'}`}>
        <span className={`font-black text-white leading-none ${size === 'sm' ? 'text-[7px]' : 'text-[9px]'}`}>{level}</span>
      </div>
    );
  }

  const config = getNobleConfig(level);
  const sizeStyles = {
    sm: { container: 'h-3.5 min-w-[34px] px-0.5', iconSize: 'w-2.5 h-2.5 text-[7px]', fontSize: 'text-[7px]' },
    md: { container: 'h-5 min-w-[54px] px-1', iconSize: 'w-4 h-4 text-[10px]', fontSize: 'text-[9px]' },
    lg: { container: 'h-8 min-w-[80px] px-2', iconSize: 'w-6 h-6 text-[14px]', fontSize: 'text-[12px]' }
  };
  const currentSize = sizeStyles[size];

  return (
    <div className={`flex items-center ${currentSize.container} rounded-full bg-gradient-to-r ${config.color} border border-white/30 shadow-md relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/30 opacity-40"></div>
      <div className={`${currentSize.iconSize} rounded-full bg-black/20 flex items-center justify-center shrink-0 z-10 mr-0.5`}>
        {config.icon}
      </div>
      <span className={`flex-1 text-center font-black italic z-10 ${config.textColor} ${currentSize.fontSize}`}>
        {config.label}
      </span>
    </div>
  );
};

export default LevelBadge;
