/**
 * 主题配色方案接口
 * 
 * 提供统一的配色方案定义，供页面组件（友链、关于、项目等）使用。
 * 主题可以通过实现 getColorScheme 方法来提供自定义配色。
 */

/**
 * 配色方案接口
 * 定义了页面组件需要的所有颜色相关的 Tailwind 类名
 */
export interface ColorScheme {
  /** 主色调名称，如 'violet', 'blue', 'amber' */
  accent: string;
  /** 渐变背景类，如 'from-violet-500 via-fuchsia-500 to-pink-500' */
  gradient: string;
  /** 强调文字颜色类，如 'text-violet-600 dark:text-violet-400' */
  accentText: string;
  /** 强调背景颜色类，如 'bg-violet-50 dark:bg-violet-900/20' */
  accentBg: string;
  /** 统计区域背景（可选），如 'bg-gradient-to-r from-violet-600 to-fuchsia-600' */
  statsBg?: string;
  /** 激活状态按钮样式（可选），如 'bg-violet-600 text-white' */
  buttonActive?: string;
  /** 按钮悬停样式（可选），如 'hover:border-violet-500' */
  buttonHover?: string;
}

/**
 * 获取配色方案的函数类型
 */
export type GetColorScheme = (config: Record<string, unknown>) => ColorScheme;

/**
 * 默认配色方案（经典主题风格）
 */
export const defaultColorScheme: ColorScheme = {
  accent: 'amber',
  gradient: 'from-amber-500 via-orange-500 to-amber-600',
  accentText: 'text-amber-600 dark:text-amber-400',
  accentBg: 'bg-amber-50 dark:bg-amber-900/20',
  statsBg: 'bg-gradient-to-r from-amber-600 to-orange-600',
  buttonActive: 'bg-amber-600 text-white',
  buttonHover: 'hover:border-amber-500',
};

/**
 * 内置主题的配色方案映射
 */
export const builtinColorSchemes: Record<string, ColorScheme> = {
  classic: {
    accent: 'amber',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    accentText: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-50 dark:bg-amber-900/20',
    statsBg: 'bg-gradient-to-r from-amber-600 to-orange-600',
    buttonActive: 'bg-amber-600 text-white',
    buttonHover: 'hover:border-amber-500',
  },
  minimal: {
    accent: 'gray',
    gradient: 'from-gray-500 via-gray-600 to-gray-700',
    accentText: 'text-gray-600 dark:text-gray-400',
    accentBg: 'bg-gray-100 dark:bg-gray-800',
    statsBg: 'bg-gray-800 dark:bg-gray-700',
    buttonActive: 'bg-gray-800 dark:bg-white text-white dark:text-gray-900',
    buttonHover: 'hover:border-gray-500',
  },
  magazine: {
    accent: 'violet',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    accentText: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-50 dark:bg-violet-900/20',
    statsBg: 'bg-gradient-to-r from-violet-600 to-fuchsia-600',
    buttonActive: 'bg-violet-600 text-white',
    buttonHover: 'hover:border-violet-500',
  },
  cyber: {
    accent: 'emerald',
    gradient: 'from-emerald-500 via-cyan-500 to-emerald-400',
    accentText: 'text-emerald-500',
    accentBg: 'bg-emerald-500/10',
    statsBg: 'bg-gradient-to-r from-emerald-600 to-cyan-600',
    buttonActive: 'bg-emerald-600 text-white',
    buttonHover: 'hover:border-emerald-500',
  },
  vibrant: {
    accent: 'indigo',
    gradient: 'from-indigo-500 via-pink-500 to-lime-400',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    accentBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    statsBg: 'bg-gradient-to-r from-indigo-500 via-pink-500 to-lime-400',
    buttonActive: 'bg-indigo-600 text-white',
    buttonHover: 'hover:border-indigo-500',
  },
  'aura-nexus': {
    accent: 'red',
    gradient: 'from-red-500 via-orange-500 to-cyan-500',
    accentText: 'text-red-500 dark:text-red-400',
    accentBg: 'bg-red-50 dark:bg-red-900/20',
    statsBg: 'bg-gradient-to-r from-red-500 to-cyan-500',
    buttonActive: 'bg-red-600 text-white',
    buttonHover: 'hover:border-red-500',
  },
  'vibe-pulse': {
    accent: 'orange',
    gradient: 'from-orange-500 via-amber-500 to-orange-400',
    accentText: 'text-orange-500 dark:text-orange-400',
    accentBg: 'bg-orange-50 dark:bg-orange-900/20',
    statsBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
    buttonActive: 'bg-orange-500 text-white',
    buttonHover: 'hover:border-orange-500',
  },
  'aether-bloom': {
    accent: 'blue',
    gradient: 'from-blue-400 via-teal-400 to-amber-300',
    accentText: 'text-blue-500 dark:text-blue-400',
    accentBg: 'bg-blue-50 dark:bg-blue-900/20',
    statsBg: 'bg-gradient-to-r from-blue-400 via-teal-400 to-amber-300',
    buttonActive: 'bg-blue-500 text-white',
    buttonHover: 'hover:border-blue-500',
  },
  'chroma-dimension': {
    accent: 'fuchsia',
    gradient: 'from-fuchsia-500 via-purple-500 to-cyan-500',
    accentText: 'text-fuchsia-500 dark:text-fuchsia-400',
    accentBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    statsBg: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500',
    buttonActive: 'bg-fuchsia-600 text-white',
    buttonHover: 'hover:border-fuchsia-500',
  },
  'serene-ink': {
    accent: 'stone',
    gradient: 'from-stone-500 via-stone-600 to-stone-700',
    accentText: 'text-stone-600 dark:text-stone-400',
    accentBg: 'bg-stone-100 dark:bg-stone-800/30',
    statsBg: 'bg-gradient-to-r from-stone-600 to-stone-700',
    buttonActive: 'bg-stone-600 text-white',
    buttonHover: 'hover:border-stone-500',
  },
  'clarity-focus': {
    accent: 'emerald',
    gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    statsBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    buttonActive: 'bg-emerald-600 text-white',
    buttonHover: 'hover:border-emerald-500',
  },
};

/** chroma-dimension 主题的 vibeMode 配色方案 */
export const chromaDimensionPalettes: Record<string, ColorScheme> = {
  'electric-candy': {
    accent: 'fuchsia',
    gradient: 'from-[#FF00FF] via-[#7000FF] to-[#00FFFF]',
    accentText: 'text-fuchsia-500',
    accentBg: 'bg-fuchsia-500/20',
    statsBg: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500',
    buttonActive: 'bg-fuchsia-600 text-white',
    buttonHover: 'hover:border-fuchsia-500',
  },
  'acid-sun': {
    accent: 'lime',
    gradient: 'from-[#CCFF00] via-[#FF5E00] to-[#00E5FF]',
    accentText: 'text-lime-400',
    accentBg: 'bg-lime-500/20',
    statsBg: 'bg-gradient-to-r from-lime-500 via-orange-500 to-cyan-500',
    buttonActive: 'bg-lime-500 text-black',
    buttonHover: 'hover:border-lime-500',
  },
  'holographic': {
    accent: 'blue',
    gradient: 'from-blue-400 via-pink-400 to-yellow-400',
    accentText: 'text-blue-500',
    accentBg: 'bg-blue-500/20',
    statsBg: 'bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400',
    buttonActive: 'bg-blue-500 text-white',
    buttonHover: 'hover:border-blue-500',
  },
  'hyper-white': {
    accent: 'emerald',
    gradient: 'from-[#00FF41] via-slate-900 to-[#00FF41]',
    accentText: 'text-emerald-500',
    accentBg: 'bg-emerald-500/20',
    statsBg: 'bg-gradient-to-r from-emerald-500 via-slate-900 to-emerald-500',
    buttonActive: 'bg-emerald-500 text-black',
    buttonHover: 'hover:border-emerald-500',
  },
  'cyber-pulse': {
    accent: 'cyan',
    gradient: 'from-[#00FFFF] via-[#FF00FF] to-[#FFFF00]',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/20',
    statsBg: 'bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-500',
    buttonActive: 'bg-cyan-500 text-black',
    buttonHover: 'hover:border-cyan-500',
  },
  'rainbow-vortex': {
    accent: 'purple',
    gradient: 'from-red-500 via-green-500 to-purple-500',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/20',
    statsBg: 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500',
    buttonActive: 'bg-purple-500 text-white',
    buttonHover: 'hover:border-purple-500',
  },
};

/** magazine 主题的配色方案 */
export const magazineColorSchemes: Record<string, ColorScheme> = {
  purple: {
    accent: 'violet',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    accentText: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-50 dark:bg-violet-900/20',
    statsBg: 'bg-gradient-to-r from-violet-600 to-fuchsia-600',
    buttonActive: 'bg-violet-600 text-white',
    buttonHover: 'hover:border-violet-500',
  },
  blue: {
    accent: 'cyan',
    gradient: 'from-cyan-500 via-blue-500 to-cyan-400',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    accentBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    statsBg: 'bg-gradient-to-r from-cyan-600 to-blue-600',
    buttonActive: 'bg-cyan-600 text-white',
    buttonHover: 'hover:border-cyan-500',
  },
  warm: {
    accent: 'orange',
    gradient: 'from-orange-500 via-rose-500 to-orange-400',
    accentText: 'text-orange-600 dark:text-orange-400',
    accentBg: 'bg-orange-50 dark:bg-orange-900/20',
    statsBg: 'bg-gradient-to-r from-orange-600 to-rose-600',
    buttonActive: 'bg-orange-600 text-white',
    buttonHover: 'hover:border-orange-500',
  },
};
