import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { NavMenuItem } from '../stores/site-settings.store';

interface NavMenuProps {
  items: NavMenuItem[];
  className?: string;
  itemClassName?: string;
  dropdownClassName?: string;
}

// 桌面端导航菜单（支持二级下拉）
export function DesktopNavMenu({ items, className = '', itemClassName = '' }: NavMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const renderLink = (item: NavMenuItem) => {
    if (item.type === 'external') {
      return (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={itemClassName}>
          {item.label}
        </a>
      );
    }
    return (
      <Link to={item.url} className={itemClassName}>
        {item.label}
      </Link>
    );
  };

  return (
    <div className={`hidden md:flex items-center gap-1 ${className}`}>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        
        if (hasChildren) {
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className={`${itemClassName} flex items-center gap-1`}>
                {item.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === item.id && (
                <div className="absolute top-full left-0 mt-1 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px] z-50">
                  {item.children!.map((child) => (
                    <div key={child.id}>
                      {child.type === 'external' ? (
                        <a
                          href={child.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          to={child.url}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {child.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return <div key={item.id}>{renderLink(item)}</div>;
      })}
    </div>
  );
}

// 移动端导航菜单（支持二级展开）
export function MobileNavMenu({ items, onClose }: { items: NavMenuItem[]; onClose: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderLink = (item: NavMenuItem, isChild = false) => {
    const baseClass = `block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${isChild ? 'pl-8' : ''}`;
    
    if (item.type === 'external') {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={baseClass}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link to={item.url} onClick={onClose} className={baseClass}>
        {item.label}
      </Link>
    );
  };

  return (
    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div key={item.id}>
            {hasChildren ? (
              <>
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="bg-gray-50 dark:bg-gray-900">
                    {item.children!.map((child) => (
                      <div key={child.id}>{renderLink(child, true)}</div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              renderLink(item)
            )}
          </div>
        );
      })}
    </div>
  );
}
