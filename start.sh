#!/bin/bash

# 英语单词学习应用启动脚本

echo "🚀 启动英语单词学习应用..."
echo "=================================="

# 检查是否已经安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查端口是否被占用
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  端口3000已被占用，请先关闭相关服务"
    exit 1
fi

if lsof -i :3001 >/dev/null 2>&1; then
    echo "⚠️  端口3001已被占用，请先关闭相关服务"
    exit 1
fi

# 启动后端服务器
echo "🔧 启动后端API服务器 (端口3001)..."
node server.js &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端开发服务器
echo "🎨 启动前端开发服务器 (端口3000)..."
npm start &
FRONTEND_PID=$!

# 等待前端启动
sleep 10

echo "✅ 应用启动成功！"
echo "=================================="
echo "📱 前端应用: http://localhost:3000"
echo "🔧 后端API:  http://localhost:3001"
echo "📚 API文档: http://localhost:3001/api/health"
echo "=================================="
echo "🔑 测试账号:"
echo "   用户名: demo"
echo "   邮箱: demo@example.com"
echo "   密码: demo123"
echo "=================================="
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap 'echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; exit 0' INT

# 保持脚本运行
wait