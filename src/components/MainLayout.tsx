import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, TrophyOutlined, BookOutlined, TeamOutlined, HomeOutlined, FileTextOutlined, CalendarOutlined, AimOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/learn',
      icon: <BookOutlined />,
      label: '学习',
    },
    {
      key: '/memory',
      icon: <CalendarOutlined />,
      label: '记忆',
    },
    {
      key: '/plan',
      icon: <AimOutlined />,
      label: '计划',
    },
    {
      key: '/test',
      icon: <FileTextOutlined />,
      label: '测试',
    },
    {
      key: '/game',
      icon: <TrophyOutlined />,
      label: '游戏',
    },
    {
      key: '/social',
      icon: <TeamOutlined />,
      label: '社交',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={250}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>单词冒险</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div>
            <Badge count={user?.level || 1} showZero color="#52c41a">
              <Avatar 
                src={user?.avatar} 
                icon={<UserOutlined />}
                size="large"
              />
            </Badge>
            <span style={{ marginLeft: 12, fontWeight: 'bold' }}>
              {user?.username || '游客'}
            </span>
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              账户
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;