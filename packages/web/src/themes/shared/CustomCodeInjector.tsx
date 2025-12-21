// 共享的自定义代码注入组件
// 可被所有主题复用，用于注入自定义HTML、统计代码、广告等
// 安全说明：这些代码只能由管理员在后台配置，普通用户无法注入
import { useEffect, useMemo } from 'react';

/**
 * 危险模式列表 - 用于警告但不阻止（管理员可能需要这些功能）
 */
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /<iframe[^>]*src\s*=\s*["'][^"']*["']/i,
];

/**
 * 检查HTML是否包含可疑内容（仅用于开发环境警告）
 */
function checkSuspiciousContent(html: string): string[] {
  const warnings: string[] = [];
  SUSPICIOUS_PATTERNS.forEach((pattern) => {
    if (pattern.test(html)) {
      warnings.push(`检测到可疑模式: ${pattern.toString()}`);
    }
  });
  return warnings;
}

/**
 * 自定义HTML块组件 - 渲染任意HTML内容
 * 安全说明：此组件仅用于渲染管理员配置的可信内容
 */
export function CustomHtmlBlock({
  html,
  className = '',
}: {
  html: string;
  className?: string;
}) {
  // 开发环境下检查可疑内容
  useMemo(() => {
    if (process.env.NODE_ENV === 'development' && html) {
      const warnings = checkSuspiciousContent(html);
      if (warnings.length > 0) {
        console.warn('[CustomHtmlBlock] 安全警告:', warnings);
      }
    }
  }, [html]);

  if (!html || html.trim() === '') return null;

  return (
    <div
      className={`custom-html-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Head代码注入Hook - 将代码注入到document.head
 * 适用于统计代码、字体引入、meta标签等
 */
export function useHeadCodeInjector(code: string | undefined) {
  useEffect(() => {
    if (!code || code.trim() === '') return;

    // 创建容器标记，便于清理
    const container = document.createElement('div');
    container.setAttribute('data-custom-head', 'true');
    container.innerHTML = code;

    // 将子节点逐个添加到head
    const nodes: Node[] = [];
    while (container.firstChild) {
      const node = container.firstChild;
      document.head.appendChild(node);
      nodes.push(node);
    }

    // 清理函数
    return () => {
      nodes.forEach((node) => {
        if (node.parentNode === document.head) {
          document.head.removeChild(node);
        }
      });
    };
  }, [code]);
}

/**
 * 自定义代码注入配置选项
 * 可直接添加到主题的configOptions数组中
 */
export const customCodeConfigOptions = [
  {
    key: 'customHeadCode',
    label: '自定义Head代码',
    type: 'text' as const,
    default: '',
    description: '插入到页面head标签中的代码（如统计代码、字体引入等）。⚠️ 仅管理员可配置',
  },
  {
    key: 'customBodyStartCode',
    label: '页面顶部自定义代码',
    type: 'text' as const,
    default: '',
    description: '插入到页面body开始处的代码。⚠️ 仅管理员可配置',
  },
  {
    key: 'customBodyEndCode',
    label: '页面底部自定义代码',
    type: 'text' as const,
    default: '',
    description: '插入到页面body结束处的代码（如统计代码）。⚠️ 仅管理员可配置',
  },
];

/**
 * 侧边栏自定义HTML配置选项
 */
export const sidebarCustomHtmlConfigOptions = [
  {
    key: 'sidebarCustomHtml',
    label: '侧边栏自定义HTML',
    type: 'text' as const,
    default: '',
    description: '在侧边栏显示的自定义HTML代码（支持广告、统计等）。⚠️ 仅管理员可配置',
  },
];

/**
 * 左右侧边栏自定义HTML配置选项（三栏布局用）
 */
export const dualSidebarCustomHtmlConfigOptions = [
  {
    key: 'leftSidebarCustomHtml',
    label: '左侧栏自定义HTML',
    type: 'text' as const,
    default: '',
    description: '在左侧栏底部显示的自定义HTML代码。⚠️ 仅管理员可配置',
  },
  {
    key: 'rightSidebarCustomHtml',
    label: '右侧栏自定义HTML',
    type: 'text' as const,
    default: '',
    description: '在右侧栏底部显示的自定义HTML代码。⚠️ 仅管理员可配置',
  },
];

/**
 * 自定义代码默认配置值
 */
export const customCodeDefaultConfig = {
  customHeadCode: '',
  customBodyStartCode: '',
  customBodyEndCode: '',
};

/**
 * 侧边栏自定义HTML默认配置值
 */
export const sidebarCustomHtmlDefaultConfig = {
  sidebarCustomHtml: '',
};

/**
 * 左右侧边栏自定义HTML默认配置值
 */
export const dualSidebarCustomHtmlDefaultConfig = {
  leftSidebarCustomHtml: '',
  rightSidebarCustomHtml: '',
};
