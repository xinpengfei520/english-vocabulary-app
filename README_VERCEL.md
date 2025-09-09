# English Vocabulary Learning App

## 部署到Vercel

### 方案1：Vercel Serverless Functions（推荐）

1. **项目结构**
   - 前端：React应用（根目录）
   - 后端：Vercel Serverless Functions（`/api`目录）

2. **部署步骤**
   ```bash
   # 1. 安装依赖
   npm install
   
   # 2. 构建项目
   npm run build
   
   # 3. 部署到Vercel
   npx vercel --prod
   ```

3. **环境变量设置**
   在Vercel控制台设置：
   - `JWT_SECRET`：用于JWT签名的密钥
   - `NODE_ENV`：`production`

### 方案2：分离部署

1. **前端部署到Vercel**
   - 只部署React应用
   - API地址指向其他后端服务

2. **后端部署到其他平台**
   - Heroku
   - Railway
   - Render
   - 自己的服务器

### 本地开发

```bash
# 安装依赖
npm install

# 启动后端
npm run server

# 启动前端（新终端）
npm start

# 或同时启动前后端
npm run dev
```

### 访问地址
- 本地前端：http://localhost:3000
- 本地后端：http://localhost:3001
- Vercel部署：https://your-app.vercel.app

### 测试账号
- 邮箱：demo@example.com
- 密码：demo123