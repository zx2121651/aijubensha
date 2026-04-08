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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="community" element={<Community />} />
          <Route path="discover" element={<Discover />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
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
