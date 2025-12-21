# Implementation Plan

- [x] 1. 数据库模型扩展
  - [x] 1.1 添加 Project 模型到 Prisma schema
    - 包含 name, slug, description, content, githubUrl, demoUrl, docsUrl, featuredImage, status, isRecommended, isPinned, sortOrder, categoryId
    - _Requirements: 2.2_
  - [x] 1.2 添加 ProjectCategory 模型到 Prisma schema
    - 包含 name, slug, sortOrder
    - _Requirements: 3.2_
  - [x] 1.3 添加 FriendLink 模型到 Prisma schema
    - 包含 name, url, description, logo, sortOrder
    - _Requirements: 5.2_
  - [x] 1.4 运行数据库迁移
    - _Requirements: 1.3, 2.2, 5.2_

- [x] 2. 后端项目分类服务
  - [x] 2.1 创建 ProjectCategoryService
    - 实现 CRUD 操作
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 2.2 创建项目分类路由 /api/project-categories
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 2.3 编写项目分类服务单元测试
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 3. 后端项目服务
  - [x] 3.1 创建 ProjectService
    - 实现 CRUD 操作，支持状态过滤、分类过滤、置顶排序
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  - [x] 3.2 创建项目路由 /api/projects
    - 包含公开接口 /published
    - _Requirements: 2.1, 4.1_
  - [x] 3.3 编写项目服务单元测试
    - _Requirements: 2.2, 2.3, 2.4_
  - [x] 3.4 编写属性测试：项目状态过滤
    - **Property 2: Project Status Filtering**
    - **Validates: Requirements 4.1**
  - [x] 3.5 编写属性测试：分类过滤正确性
    - **Property 3: Category Filter Correctness**
    - **Validates: Requirements 4.4**
  - [x] 3.6 编写属性测试：分类删除保留项目
    - **Property 4: Category Deletion Preserves Projects**
    - **Validates: Requirements 3.4**

- [x] 4. 后端友链服务
  - [x] 4.1 创建 FriendLinkService
    - 实现 CRUD 操作
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [x] 4.2 创建友链路由 /api/friend-links
    - 包含公开接口 /public
    - _Requirements: 5.1, 6.1_
  - [x] 4.3 编写友链服务单元测试
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 5. Checkpoint - 确保后端测试通过
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. 后台项目管理页面
  - [x] 6.1 创建 /admin/projects 页面
    - 显示项目列表，支持添加、编辑、删除
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 6.2 创建项目编辑表单组件
    - 包含所有字段：名称、描述、链接、特色图、分类、状态、推荐、置顶
    - _Requirements: 2.2, 2.5, 2.6_
  - [x] 6.3 添加项目分类管理功能
    - 在项目管理页面添加分类管理入口
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 7. 后台友链管理页面
  - [x] 7.1 创建 /admin/friends 页面
    - 显示友链列表，支持添加、编辑、删除
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. 后台页面管理总览
  - [x] 8.1 修改 /admin/pages 页面
    - 添加三个内置页面的显示/隐藏开关
    - 添加关于页面内容编辑入口
    - 添加页面模板选择
    - _Requirements: 1.1, 1.2, 1.4, 7.1, 7.2_

- [x] 9. 前台页面模板组件
  - [x] 9.1 创建 PageTemplate 组件
    - 支持 fullwidth、sidebar、standard 三种布局
    - _Requirements: 4.2, 6.2_

- [x] 10. 前台关于页面
  - [x] 10.1 创建 /about 页面
    - 渲染关于页面内容，支持模板选择
    - _Requirements: 1.5_
  - [x] 10.2 添加页面可见性检查
    - 页面隐藏时返回 404
    - _Requirements: 1.4_

- [x] 11. 前台项目页面
  - [x] 11.1 创建 /projects 页面
    - 显示已发布项目列表，支持分类筛选
    - _Requirements: 4.1, 4.2, 4.4_
  - [x] 11.2 创建项目卡片组件
    - 显示项目信息和链接
    - _Requirements: 4.2, 4.3_
  - [x] 11.3 添加页面可见性检查
    - _Requirements: 4.5_

- [x] 12. 前台友链页面
  - [x] 12.1 创建 /friends 页面
    - 显示友链列表
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 12.2 创建友链卡片组件
    - _Requirements: 6.2_
  - [x] 12.3 添加页面可见性检查
    - _Requirements: 6.4_

- [x] 13. 导航菜单集成
  - [x] 13.1 更新导航菜单配置
    - 根据页面启用状态显示/隐藏菜单项（通过后台设置配置）
    - _Requirements: 7.3_

- [x] 14. API 服务端函数
  - [x] 14.1 添加项目和友链的服务端 API 函数
    - 在 api-server.ts 中添加 getProjects, getFriendLinks 等函数
    - _Requirements: 4.1, 6.1_

- [x] 15. Final Checkpoint - 确保所有测试通过
  - All code implemented and diagnostics passed.
