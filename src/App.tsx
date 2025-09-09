import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './components/MainLayout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import MemoryPage from './pages/MemoryPage';
import StudyPlanPage from './pages/StudyPlanPage';
import TestPage from './pages/TestPage';
import GamePage from './pages/GamePage';
import SocialPage from './pages/SocialPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(0);

  // 监听认证状态变化
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('Auth change event received, forcing update');
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  console.log('App render - user:', user, 'loading:', loading, 'forceUpdate:', forceUpdate);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" replace /> : <AuthPage />} 
          />
          <Route 
            path="/" 
            element={user ? <MainLayout><DashboardPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/learn" 
            element={user ? <MainLayout><LearnPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/memory" 
            element={user ? <MainLayout><MemoryPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/plan" 
            element={user ? <MainLayout><StudyPlanPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/test" 
            element={user ? <MainLayout><TestPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/game" 
            element={user ? <MainLayout><GamePage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/social" 
            element={user ? <MainLayout><SocialPage /></MainLayout> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
