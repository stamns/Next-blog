# 部署指南

## 本地开发

### 1. 环境准备

确保已安装:
- Node.js >= 18
- npm >= 9

### 2. 安装依赖

```bash
# 在项目根目录
npm install
```

### 3. 配置环境变量

```bash
cd packages/server
cp .env.example .env
```

编辑 `.env` 文件:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
ENCRYPTION_KEY="your-32-character-key-here"
PORT=3001
```

### 4. 初始化数据库

```bash
cd packages/server

# 运行数据库迁移
npx prisma migrate dev

# 初始化数据 (创建管理员账户)
npm run db:seed
```

默认管理员账户:
- 用户名: `admin`
- 密码: `admin123`

### 5. 启动服务

终端 1 - 后端:
```bash
cd packages/server
npm run dev
```

终端 2 - 前端:
```bash
cd packages/web
npm run dev
```

访问:
- 前台: http://localhost:3011
- 后台: http://localhost:3011/admin
- API: http://localhost:3012/api

---

## 生产部署

### 方式一: 传统服务器部署

#### 1. 构建项目

```bash
# 构建后端
cd packages/server
npm run build

# 构建前端
cd packages/web
npm run build
```

#### 2. 配置生产环境变量

```bash
cd packages/server
```

创建 `.env.production`:
```env
DATABASE_URL="file:./prod.db"
JWT_SECRET="your-production-secret-key"
ENCRYPTION_KEY="your-32-char-production-key"
PORT=3012
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
```

#### 3. 运行数据库迁移

```bash
npx prisma migrate deploy
npm run db:seed  # 首次部署
```

#### 4. 启动服务

使用 PM2 管理进程:
```bash
npm install -g pm2

cd packages/server
pm2 start dist/index.js --name blog-api
```

#### 5. 配置 Web 服务器

##### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/packages/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3012;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 媒体文件
    location /uploads {
        alias /path/to/packages/server/uploads;
    }
}
```

##### Caddy 配置

Caddy 会自动处理 HTTPS 证书，配置更简洁。

`Caddyfile`:
```caddyfile
your-domain.com {
    # 前端静态文件
    root * /path/to/packages/web/dist
    
    # API 反向代理
    handle /api/* {
        reverse_proxy localhost:3012
    }
    
    # 媒体文件
    handle /uploads/* {
        root * /path/to/packages/server
        file_server
    }
    
    # SPA 路由支持
    handle {
        try_files {path} /index.html
        file_server
    }
}
```

如果前后端分开部署（不同域名）：

```caddyfile
# 前端
www.your-domain.com {
    root * /path/to/packages/web/dist
    try_files {path} /index.html
    file_server
}

# 后端 API
api.your-domain.com {
    reverse_proxy localhost:3012
}
```

#### 6. 配置 CORS（跨域）

如果前后端使用不同域名，需要配置 `ALLOWED_ORIGINS` 环境变量：

```env
# 单个域名
ALLOWED_ORIGINS=https://www.your-domain.com

# 多个域名（逗号分隔）
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 允许所有（仅开发环境使用）
ALLOWED_ORIGINS=*
```

---

### 方式二: Docker 部署

#### 1. 创建 Dockerfile

后端 `packages/server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.js"]
```

前端 `packages/web/Dockerfile`:
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### 2. Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  api:
    build: ./packages/server
    ports:
      - "3012:3012"
    environment:
      - DATABASE_URL=file:./data/prod.db
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads

  web:
    build: ./packages/web
    ports:
      - "80:80"
    depends_on:
      - api
```

#### 3. 启动

```bash
docker-compose up -d
```

---

## 数据库备份

### 手动备份

```bash
# SQLite 数据库文件位置
packages/server/prisma/dev.db  # 开发环境
packages/server/prisma/prod.db # 生产环境

# 复制备份
cp packages/server/prisma/prod.db backups/prod-$(date +%Y%m%d).db
```

### 使用系统备份功能

通过 API 导出:
```bash
curl -X POST http://localhost:3001/api/backup/export \
  -H "Authorization: Bearer <token>" \
  -o backup.json
```

---

## 常见问题

### 1. 数据库迁移失败

```bash
# 重置数据库
npx prisma migrate reset

# 重新迁移
npx prisma migrate dev
```

### 2. 端口被占用

修改 `.env` 中的 `PORT` 或使用:
```bash
PORT=3013 npm run dev
```

### 3. 前端无法连接后端

检查 `packages/web/vite.config.ts` 中的代理配置:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3012',
    changeOrigin: true,
  },
}
```

### 4. CORS 跨域错误

如果使用反向代理部署，确保配置了正确的 `ALLOWED_ORIGINS`：
```bash
# 在 .env 中设置
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 5. 图片上传失败

确保 `uploads` 目录存在且有写入权限:
```bash
mkdir -p packages/server/uploads
chmod 755 packages/server/uploads
```

---

## 监控与日志

### PM2 监控

```bash
pm2 monit
pm2 logs blog-api
```

### 健康检查

```bash
curl http://localhost:3012/api/health
```

响应:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
