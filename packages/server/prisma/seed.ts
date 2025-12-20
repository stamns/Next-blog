import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 创建默认管理员账户
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
    },
  });

  console.log('Created admin user:', admin.username);

  // 创建默认分类
  const defaultCategory = await prisma.category.upsert({
    where: { slug: 'uncategorized' },
    update: {},
    create: {
      name: '未分类',
      slug: 'uncategorized',
    },
  });

  console.log('Created default category:', defaultCategory.name);

  // 创建示例文章
  const article = await prisma.article.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: '欢迎使用博客系统',
      slug: 'hello-world',
      content: `# 欢迎使用博客系统

这是一篇示例文章，展示博客系统的基本功能。

## 功能特性

- **Markdown 支持** - 使用 Markdown 编写文章
- **代码高亮** - 支持多种编程语言
- **分类标签** - 灵活的内容组织
- **AI 写作** - 智能辅助创作

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

开始你的博客之旅吧！`,
      excerpt: '这是一篇示例文章，展示博客系统的基本功能。',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: defaultCategory.id,
    },
  });

  console.log('Created sample article:', article.title);

  // 创建内置主题
  await prisma.theme.upsert({
    where: { name: 'classic' },
    update: {},
    create: {
      name: 'classic',
      version: '1.0.0',
      path: '/themes/classic',
      isActive: true,
      config: JSON.stringify({
        displayName: '经典主题',
        description: '传统博客风格，简洁大方',
      }),
    },
  });

  await prisma.theme.upsert({
    where: { name: 'minimal' },
    update: {},
    create: {
      name: 'minimal',
      version: '1.0.0',
      path: '/themes/minimal',
      isActive: false,
      config: JSON.stringify({
        displayName: '极简主题',
        description: '简约风格，专注阅读体验',
      }),
    },
  });

  await prisma.theme.upsert({
    where: { name: 'magazine' },
    update: {},
    create: {
      name: 'magazine',
      version: '1.0.0',
      path: '/themes/magazine',
      isActive: false,
      config: JSON.stringify({
        displayName: '杂志主题',
        description: '卡片式布局，现代视觉风格',
      }),
    },
  });

  console.log('Created default themes: classic, minimal, magazine');

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
