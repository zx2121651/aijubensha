import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AdminLayout } from './layouts/AdminLayout';

// Placeholder components for pages
import Dashboard from './pages/Dashboard';
import UserManage from './pages/UserManage';
import ScriptManage from './pages/ScriptManage';

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1677ff' } }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManage />} />
            <Route path="scripts" element={<ScriptManage />} />
            <Route path="rooms" element={<div className="p-4 text-center text-gray-500">房间监控开发中...</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
