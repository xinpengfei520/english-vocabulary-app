#!/bin/bash

# 英语单词学习应用停止脚本

echo "🛑 停止英语单词学习应用..."

# 查找并停止相关进程
PIDS=$(ps aux | grep -E "(node.*server\.js|react-scripts)" | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "✅ 没有找到运行中的进程"
    exit 0
fi

echo "🔍 找到进程: $PIDS"
echo "⏹️  正在停止进程..."

# 停止进程
echo $PIDS | xargs kill -9

# 等待进程完全停止
sleep 2

# 检查是否还有残留进程
REMAINING=$(ps aux | grep -E "(node.*server\.js|react-scripts)" | grep -v grep | wc -l)

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ 所有进程已成功停止"
else
    echo "⚠️  部分进程可能仍在运行，请手动检查"
fi

echo "🏁 应用停止完成"