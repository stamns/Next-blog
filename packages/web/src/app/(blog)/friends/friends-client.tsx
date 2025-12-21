'use client';

import type { FriendLink } from '@/types';

interface Props {
  links: FriendLink[];
  template: string;
}

export function FriendsClient({ links, template }: Props) {
  const containerClass =
    template === 'fullwidth'
      ? 'max-w-full px-4'
      : template === 'sidebar'
        ? 'max-w-6xl mx-auto px-4'
        : 'max-w-4xl mx-auto px-4';

  return (
    <div className={`${containerClass} py-8`}>
      <h1 className="text-3xl font-bold mb-6">友情链接</h1>

      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">暂无友链</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              {link.logo ? (
                <img
                  src={link.logo}
                  alt={link.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  {link.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-medium truncate">{link.name}</h3>
                {link.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {link.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
