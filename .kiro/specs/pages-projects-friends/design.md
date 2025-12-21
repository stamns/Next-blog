# Design Document

## Overview

本设计扩展博客系统的页面管理功能，新增三个内置页面模块：关于页面、项目展示、友情链接。项目模块是核心功能，需要完整的数据模型、API 和前后台界面支持。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│  Admin Pages                    │  Public Pages              │
│  ├── /admin/pages (管理入口)     │  ├── /about (关于页面)      │
│  ├── /admin/projects (项目管理)  │  ├── /projects (项目列表)   │
│  └── /admin/friends (友链管理)   │  └── /friends (友链页面)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend (Express)                     │
├─────────────────────────────────────────────────────────────┤
│  Routes                         │  Services                  │
│  ├── /api/projects              │  ├── ProjectService        │
│  ├── /api/project-categories    │  ├── ProjectCategoryService│
│  └── /api/friend-links          │  └── FriendLinkService     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (SQLite)                       │
├─────────────────────────────────────────────────────────────┤
│  Project  │  ProjectCategory  │  FriendLink  │  Setting      │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Backend API

#### Projects API (`/api/projects`)
- `GET /` - 获取项目列表（支持分类筛选、分页）
- `GET /published` - 获取已发布项目（公开接口）
- `GET /:id` - 获取单个项目
- `POST /` - 创建项目
- `PUT /:id` - 更新项目
- `DELETE /:id` - 删除项目

#### Project Categories API (`/api/project-categories`)
- `GET /` - 获取分类列表
- `POST /` - 创建分类
- `PUT /:id` - 更新分类
- `DELETE /:id` - 删除分类

#### Friend Links API (`/api/friend-links`)
- `GET /` - 获取友链列表
- `GET /public` - 获取公开友链（公开接口）
- `POST /` - 创建友链
- `PUT /:id` - 更新友链
- `DELETE /:id` - 删除友链

### Frontend Components

#### Admin Components
- `ProjectsPage` - 项目管理页面
- `ProjectEditor` - 项目编辑表单
- `ProjectCategoryManager` - 项目分类管理
- `FriendLinksPage` - 友链管理页面
- `PagesOverview` - 页面管理总览（显示/隐藏控制）

#### Public Components
- `AboutPage` - 关于页面展示
- `ProjectsListPage` - 项目列表页面
- `ProjectCard` - 项目卡片组件
- `FriendsPage` - 友链页面展示
- `FriendLinkCard` - 友链卡片组件
- `PageTemplate` - 页面模板组件（支持 fullwidth/sidebar/standard）

## Data Models

### Project Model
```prisma
model Project {
  id            String           @id @default(cuid())
  name          String
  slug          String           @unique
  description   String
  content       String?          // Markdown 详细说明
  githubUrl     String?
  demoUrl       String?
  docsUrl       String?
  featuredImage String?
  status        String           @default("DRAFT") // DRAFT, PUBLISHED
  isRecommended Boolean          @default(false)   // 推荐项目
  isPinned      Boolean          @default(false)   // 置顶项目
  sortOrder     Int              @default(0)
  categoryId    String?
  category      ProjectCategory? @relation(fields: [categoryId], references: [id])
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}
```

### ProjectCategory Model
```prisma
model ProjectCategory {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  sortOrder Int       @default(0)
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### FriendLink Model
```prisma
model FriendLink {
  id          String   @id @default(cuid())
  name        String
  url         String
  description String?
  logo        String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Settings (使用现有 Setting 模型)
- `aboutPageEnabled` - 关于页面是否启用
- `aboutPageContent` - 关于页面 Markdown 内容
- `aboutPageTemplate` - 关于页面模板（fullwidth/sidebar/standard）
- `projectsPageEnabled` - 项目页面是否启用
- `projectsPageTemplate` - 项目页面模板
- `friendsPageEnabled` - 友链页面是否启用
- `friendsPageTemplate` - 友链页面模板

### Page Templates
系统内置三种页面模板：
- `fullwidth` - 全宽布局，无侧边栏，内容占满整个宽度
- `sidebar` - 带侧边栏布局，左侧内容区 + 右侧侧边栏
- `standard` - 标准布局，居中内容区，适中宽度

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Project CRUD Consistency
*For any* valid project data, creating a project and then retrieving it should return the same data.
**Validates: Requirements 2.2, 2.3**

### Property 2: Project Status Filtering
*For any* set of projects with mixed statuses, the public API should only return projects with PUBLISHED status.
**Validates: Requirements 4.1**

### Property 3: Category Filter Correctness
*For any* category filter applied to projects, all returned projects should belong to that category.
**Validates: Requirements 4.4**

### Property 4: Category Deletion Preserves Projects
*For any* category with associated projects, deleting the category should set projects' categoryId to null but not delete the projects.
**Validates: Requirements 3.4**

### Property 5: Page Visibility Control
*For any* page visibility setting, when set to false, the corresponding public page should return 404 or redirect.
**Validates: Requirements 4.5, 6.4**

### Property 6: FriendLink CRUD Consistency
*For any* valid friend link data, creating and then retrieving should return the same data.
**Validates: Requirements 5.2, 5.3**

### Property 7: Sort Order Consistency
*For any* list of projects or friend links, they should be returned in ascending sortOrder, with pinned items first.
**Validates: Requirements 2.2, 5.2**

### Property 8: Pinned Projects Priority
*For any* list of projects, pinned projects should always appear before non-pinned projects regardless of sortOrder.
**Validates: Requirements 2.2**

## Error Handling

- **404 Not Found**: 当访问不存在的项目或隐藏的页面时返回
- **400 Bad Request**: 当提交的数据格式不正确时返回
- **401 Unauthorized**: 当未登录用户访问管理接口时返回
- **500 Internal Server Error**: 数据库操作失败时返回

## Testing Strategy

### Unit Tests
- ProjectService CRUD 操作测试
- ProjectCategoryService CRUD 操作测试
- FriendLinkService CRUD 操作测试
- 数据验证测试

### Property-Based Tests
使用 fast-check 库进行属性测试：
- 项目创建/读取一致性测试
- 状态过滤正确性测试
- 分类过滤正确性测试
- 排序一致性测试

### Integration Tests
- API 端点测试
- 页面渲染测试
- 权限控制测试
