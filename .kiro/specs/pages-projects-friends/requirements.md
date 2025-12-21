# Requirements Document

## Introduction

扩展博客系统的页面管理功能，新增三个内置页面：关于页面（博主介绍）、项目页面（开源项目展示）、友链页面（友情链接）。项目功能需要完整的后台管理支持，包括项目的添加、编辑、分类和展示。

## Glossary

- **Page_System**: 博客系统的页面管理模块
- **Project**: 开源项目实体，包含项目信息、链接、文档等
- **FriendLink**: 友情链接实体，包含网站名称、链接、描述等
- **ProjectCategory**: 项目分类实体，用于组织项目

## Requirements

### Requirement 1: 关于页面管理

**User Story:** As a 博主, I want to 编辑关于页面内容, so that 访客可以了解我的个人介绍。

#### Acceptance Criteria

1. WHEN 管理员访问页面管理 THEN the Page_System SHALL 显示关于页面的编辑入口
2. WHEN 管理员编辑关于页面 THEN the Page_System SHALL 提供 Markdown 编辑器用于编写内容
3. WHEN 管理员保存关于页面 THEN the Page_System SHALL 将内容存储到数据库
4. WHEN 管理员切换关于页面显示状态 THEN the Page_System SHALL 控制前台是否展示该页面
5. WHEN 访客访问 /about 路径 THEN the Page_System SHALL 渲染关于页面内容

### Requirement 2: 项目管理后台

**User Story:** As a 博主, I want to 在后台管理开源项目, so that 我可以展示我的开源作品。

#### Acceptance Criteria

1. WHEN 管理员访问项目管理 THEN the Page_System SHALL 显示项目列表和添加按钮
2. WHEN 管理员添加项目 THEN the Page_System SHALL 提供表单包含：名称、描述、GitHub 链接、演示链接、文档链接、特色图、分类、排序、状态
3. WHEN 管理员编辑项目 THEN the Page_System SHALL 加载现有数据并允许修改
4. WHEN 管理员删除项目 THEN the Page_System SHALL 从数据库移除该项目
5. WHEN 管理员上传特色图 THEN the Page_System SHALL 支持本地图片上传
6. WHEN 管理员设置项目状态 THEN the Page_System SHALL 支持发布、草稿两种状态

### Requirement 3: 项目分类管理

**User Story:** As a 博主, I want to 对项目进行分类, so that 访客可以按类别浏览项目。

#### Acceptance Criteria

1. WHEN 管理员访问项目分类 THEN the Page_System SHALL 显示分类列表
2. WHEN 管理员添加分类 THEN the Page_System SHALL 创建新的项目分类
3. WHEN 管理员编辑分类 THEN the Page_System SHALL 允许修改分类名称和排序
4. WHEN 管理员删除分类 THEN the Page_System SHALL 移除分类但保留项目

### Requirement 4: 项目前台展示

**User Story:** As a 访客, I want to 浏览开源项目列表, so that 我可以了解博主的开源作品。

#### Acceptance Criteria

1. WHEN 访客访问 /projects 路径 THEN the Page_System SHALL 显示已发布的项目列表
2. WHEN 访客查看项目卡片 THEN the Page_System SHALL 显示项目名称、描述、特色图、分类标签
3. WHEN 访客点击项目 THEN the Page_System SHALL 显示项目详情包含所有链接
4. WHEN 访客按分类筛选 THEN the Page_System SHALL 只显示该分类下的项目
5. WHEN 项目页面被隐藏 THEN the Page_System SHALL 返回 404 或重定向到首页

### Requirement 5: 友链管理

**User Story:** As a 博主, I want to 管理友情链接, so that 我可以与其他博主互换链接。

#### Acceptance Criteria

1. WHEN 管理员访问友链管理 THEN the Page_System SHALL 显示友链列表
2. WHEN 管理员添加友链 THEN the Page_System SHALL 提供表单包含：网站名称、链接、描述、Logo、排序
3. WHEN 管理员编辑友链 THEN the Page_System SHALL 加载现有数据并允许修改
4. WHEN 管理员删除友链 THEN the Page_System SHALL 从数据库移除该友链
5. WHEN 管理员切换友链页面显示状态 THEN the Page_System SHALL 控制前台是否展示友链页面

### Requirement 6: 友链前台展示

**User Story:** As a 访客, I want to 查看友情链接, so that 我可以发现更多优质博客。

#### Acceptance Criteria

1. WHEN 访客访问 /friends 路径 THEN the Page_System SHALL 显示友链列表
2. WHEN 访客查看友链卡片 THEN the Page_System SHALL 显示网站名称、Logo、描述
3. WHEN 访客点击友链 THEN the Page_System SHALL 在新标签页打开目标网站
4. WHEN 友链页面被隐藏 THEN the Page_System SHALL 返回 404 或重定向到首页

### Requirement 7: 页面显示控制

**User Story:** As a 博主, I want to 控制内置页面的显示状态, so that 我可以灵活管理网站内容。

#### Acceptance Criteria

1. WHEN 管理员访问页面管理 THEN the Page_System SHALL 显示三个内置页面的状态开关
2. WHEN 管理员切换页面状态 THEN the Page_System SHALL 立即更新数据库
3. WHEN 页面被隐藏 THEN the Page_System SHALL 在导航菜单中隐藏对应入口
