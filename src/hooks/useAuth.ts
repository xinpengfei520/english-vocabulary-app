import { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('useAuth useEffect - token exists:', !!token);
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // 添加一个effect来监听localStorage的变化
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      console.log('Storage change detected, token:', !!token);
      if (token) {
        getCurrentUser();
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 同时检查当前token
    const token = localStorage.getItem('token');
    if (token && !user) {
      getCurrentUser();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const getCurrentUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError('Failed to get user data');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await userService.login({ email, password }) as any;
      localStorage.setItem('token', response.token);
      console.log('Login successful, user set:', response.user);
      
      // 强制设置用户状态
      setUser(response.user);
      
      // 触发自定义事件来通知其他组件
      window.dispatchEvent(new Event('authChange'));
      
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await userService.register({ username, email, password }) as any;
      localStorage.setItem('token', response.token);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
};