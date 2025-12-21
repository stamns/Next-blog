'use client';

import {
  Github,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Code2,
  Terminal,
  Cpu,
  Coffee,
  Music,
  Camera,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface AboutConfig {
  // 基本信息
  name?: string;
  avatar?: string;
  slogan?: string;
  location?: string;
  joinDate?: string;
  email?: string;
  github?: string;
  twitter?: string;
  // 简介
  bio?: string;
  // 技术栈
  skills?: Array<{
    category: string;
    icon: string;
    items: string[];
  }>;
  // 经历
  timeline?: Array<{
    year: string;
    title: string;
    company: string;
    description: string;
    type: 'work' | 'education';
  }>;
  // 兴趣爱好
  hobbies?: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  // 统计数据
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

interface Props {
  content: string;
  template: string;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 className="text-blue-500" />,
  terminal: <Terminal className="text-emerald-500" />,
  cpu: <Cpu className="text-purple-500" />,
  coffee: <Coffee size={20} />,
  music: <Music size={20} />,
  camera: <Camera size={20} />,
};

const hobbyColorMap: Record<string, string> = {
  coffee: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  music: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  camera: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
};

// 默认配置
const defaultConfig: AboutConfig = {
  name: '博主名称',
  slogan: '"代码是写给人看的，顺便给机器执行。"',
  location: '中国',
  joinDate: '2024',
  bio: '你好！欢迎来到我的博客。这里记录着我的技术探索和生活感悟。',
  skills: [
    { category: 'Frontend', icon: 'code', items: ['React', 'Next.js', 'TypeScript'] },
    { category: 'Backend', icon: 'terminal', items: ['Node.js', 'Go', 'PostgreSQL'] },
    { category: 'Tools', icon: 'cpu', items: ['Git', 'Docker', 'Linux'] },
  ],
  timeline: [
    {
      year: '2024 - Present',
      title: '全栈开发工程师',
      company: '某公司',
      description: '负责核心业务系统的开发与维护。',
      type: 'work',
    },
  ],
  hobbies: [
    { name: '咖啡', description: '寻找城市中最好喝的咖啡', icon: 'coffee' },
    { name: '音乐', description: 'Lo-fi 音乐爱好者', icon: 'music' },
    { name: '摄影', description: '用镜头捕捉瞬间', icon: 'camera' },
  ],
  stats: [
    { value: '10+', label: '开源项目' },
    { value: '50+', label: '文章发布' },
    { value: '100+', label: 'GitHub Stars' },
  ],
};

export function AboutClient({ content, template }: Props) {
  // 解析配置
  let config: AboutConfig = defaultConfig;
  try {
    if (content) {
      const parsed = JSON.parse(content);
      config = { ...defaultConfig, ...parsed };
    }
  } catch {
    // 如果不是 JSON，尝试作为 Markdown 处理（向后兼容）
    if (content && !content.startsWith('{')) {
      config = { ...defaultConfig, bio: content };
    }
  }

  const containerClass =
    template === 'fullwidth'
      ? 'max-w-full'
      : template === 'sidebar'
        ? 'max-w-6xl mx-auto'
        : 'max-w-4xl mx-auto';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* 顶部背景 */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
      </div>

      <div className={`${containerClass} px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20`}>
        {/* 个人名片 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-2xl">
                {config.avatar ? (
                  <img src={config.avatar} alt={config.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {config.name?.[0] || '?'}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" title="在线" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {config.name}
              </h1>
              {config.slogan && (
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium italic">
                  {config.slogan}
                </p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                {config.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} /> {config.location}
                  </div>
                )}
                {config.joinDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} /> 加入于 {config.joinDate}
                  </div>
                )}
                {config.email && (
                  <a href={`mailto:${config.email}`} className="flex items-center gap-1.5 text-blue-500 hover:underline">
                    <Mail size={16} /> {config.email}
                  </a>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col gap-3">
              {config.github && (
                <a
                  href={config.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Github size={20} />
                </a>
              )}
              {config.twitter && (
                <a
                  href={config.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-blue-400 hover:text-white transition-all shadow-sm"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 主体内容网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* 左侧：简介与技能 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 关于我描述 */}
            {config.bio && (
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-red-500" /> 简介
                </h2>
                <div className="text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed text-sm whitespace-pre-line">
                  {config.bio}
                </div>
              </section>
            )}

            {/* 技术栈 */}
            {config.skills && config.skills.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Code2 size={20} className="text-blue-500" /> 技术栈
                </h2>
                <div className="space-y-6">
                  {config.skills.map((category) => (
                    <div key={category.category}>
                      <div className="flex items-center gap-2 mb-3">
                        {iconMap[category.icon] || <Code2 className="text-blue-500" />}
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
                          {category.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs border border-slate-100 dark:border-slate-800"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 历程时间轴 */}
            {config.timeline && config.timeline.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                  <Calendar size={20} className="text-amber-500" /> 历程
                </h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-300 before:to-transparent dark:before:via-slate-700">
                  {config.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border-2 border-blue-500 text-blue-500 z-10 transition-transform group-hover:scale-110">
                        {item.type === 'education' ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                      </div>
                      <div className="flex-1">
                        <time className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
                          {item.year}
                        </time>
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-xs font-medium text-slate-400 mb-2">{item.company}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 右侧：兴趣与其他 */}
          <div className="space-y-8">
            {/* 兴趣爱好 */}
            {config.hobbies && config.hobbies.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">兴趣爱好</h2>
                <div className="space-y-4">
                  {config.hobbies.map((hobby, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className={`p-2.5 rounded-xl ${hobbyColorMap[hobby.icon] || 'bg-slate-50 dark:bg-slate-800 text-slate-600'}`}>
                        {iconMap[hobby.icon] || <Heart size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{hobby.name}</h4>
                        <p className="text-xs text-slate-500">{hobby.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 状态统计 */}
            {config.stats && config.stats.length > 0 && (
              <section className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-500/20">
                <h2 className="text-lg font-bold mb-6">数字足迹</h2>
                <div className="grid grid-cols-2 gap-4">
                  {config.stats.map((stat, idx) => (
                    <div key={idx} className="text-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-2xl font-black">{stat.value}</div>
                      <div className="text-[10px] uppercase opacity-70 tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 留言邀请 */}
            <div className="p-8 bg-slate-900 dark:bg-blue-900/20 rounded-3xl border border-slate-800 text-center">
              <h3 className="text-white font-bold mb-2">想和我聊聊？</h3>
              <p className="text-slate-400 text-xs mb-4">无论是技术探讨还是闲聊，都欢迎你的来信。</p>
              {config.email ? (
                <a
                  href={`mailto:${config.email}`}
                  className="block w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors"
                >
                  发送邮件
                </a>
              ) : (
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors">
                  联系我
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
