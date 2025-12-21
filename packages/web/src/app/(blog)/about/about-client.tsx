'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Props {
  content: string;
  template: string;
}

export function AboutClient({ content, template }: Props) {
  const containerClass =
    template === 'fullwidth'
      ? 'max-w-full px-4'
      : template === 'sidebar'
        ? 'max-w-6xl mx-auto px-4'
        : 'max-w-4xl mx-auto px-4';

  return (
    <div className={`${containerClass} py-8`}>
      <h1 className="text-3xl font-bold mb-6">关于</h1>

      {content ? (
        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </article>
      ) : (
        <div className="text-center py-12 text-gray-500">暂无内容</div>
      )}
    </div>
  );
}
