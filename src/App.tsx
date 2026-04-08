/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScriptDetail from './pages/ScriptDetail';
import Room from './pages/Room';
import Game from './pages/Game';
import Result from './pages/Result';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Discover from './pages/Discover';
import Community from './pages/Community';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Store from './pages/Store';
import Achievements from './pages/Achievements';
import Leaderboard from './pages/Leaderboard';
import Lobby from './pages/Lobby';
import PostDetail from './pages/PostDetail';
import Wallet from './pages/Wallet';
import Inventory from './pages/Inventory';
import Clubs from './pages/Clubs';

// 应用程序的主组件，主要负责定义全局的前端路由系统
// 使用 react-router-dom 构建 SPA（单页应用）
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Layout 包含通用的页面外壳结构（比如底部导航栏等） */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="community" element={<Community />} />
          <Route path="discover" element={<Discover />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 下面的这些路由没有包含在 Layout 内，通常表示不需要底部导航或全局布局的全屏/独立页面 */}
        {/* Routes without bottom nav */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/store" element={<Store />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/script/:id" element={<ScriptDetail />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/result/:id" element={<Result />} />
      </Routes>
    </Router>
  );
}
