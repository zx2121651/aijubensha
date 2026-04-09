import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  VideoCameraOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据大盘',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/scripts',
      icon: <BookOutlined />,
      label: '剧本管理',
    },
    {
      key: '/rooms',
      icon: <VideoCameraOutlined />,
      label: '房间监控',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
      },
    ],
  };

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" className="border-r border-gray-200">
        <div className="h-16 m-4 flex items-center justify-center bg-gray-100 rounded-lg font-bold text-lg text-gray-700">
          {collapsed ? 'JB' : '剧本杀运营后台'}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between items-center pr-6 shadow-sm z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div className="flex items-center gap-4">
            <span className="text-gray-500">欢迎回来，超级管理员</span>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer font-bold">
                A
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="overflow-auto"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
