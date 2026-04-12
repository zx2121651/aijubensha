import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScriptDetail from './pages/ScriptDetail';
import DmConsole from './pages/dm/DmConsole';
import ProjectList from './pages/editor/ProjectList';
import ProjectEditor from './pages/editor/ProjectEditor';
import ScriptReviews from './pages/ScriptReviews';
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
import UserProfile from './pages/UserProfile';
import FollowersList from './pages/FollowersList';
import ChatDetail from './pages/ChatDetail';
import Wallet from './pages/Wallet';
import WalletHistory from './pages/WalletHistory';
import Inventory from './pages/Inventory';
import Clubs from './pages/Clubs';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-full w-full bg-neutral-950"
    >
      {children}
    </motion.div>
  );
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />

        <Route element={<Layout />}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/discover" element={<PageWrapper><Discover /></PageWrapper>} />
          <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
          <Route path="/messages" element={<PageWrapper><Messages /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/user/:id" element={<PageWrapper><UserProfile /></PageWrapper>} />
          <Route path="/followers/:id" element={<PageWrapper><FollowersList /></PageWrapper>} />
          <Route path="/chat/:id" element={<PageWrapper><ChatDetail /></PageWrapper>} />
        </Route>

        <Route path="/lobby" element={<PageWrapper><Lobby /></PageWrapper>} />
        <Route path="/script/:id" element={<PageWrapper><ScriptDetail /></PageWrapper>} />
        <Route path="/script/:id/reviews" element={<PageWrapper><ScriptReviews /></PageWrapper>} />
        <Route path="/room/:id" element={<PageWrapper><Room /></PageWrapper>} />
        <Route path="/game/:id" element={<PageWrapper><Game /></PageWrapper>} />
        <Route path="/dm/room/:id" element={<PageWrapper><DmConsole /></PageWrapper>} />
        <Route path="/editor" element={<PageWrapper><ProjectList /></PageWrapper>} />
        <Route path="/editor/project/:id" element={<PageWrapper><ProjectEditor /></PageWrapper>} />
        <Route path="/result/:id" element={<PageWrapper><Result /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/notifications" element={<PageWrapper><Notifications /></PageWrapper>} />
        <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
        <Route path="/achievements" element={<PageWrapper><Achievements /></PageWrapper>} />
        <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
        <Route path="/post/:id" element={<PageWrapper><PostDetail /></PageWrapper>} />
        <Route path="/wallet" element={<PageWrapper><Wallet /></PageWrapper>} />
        <Route path="/wallet/history" element={<PageWrapper><WalletHistory /></PageWrapper>} />
        <Route path="/inventory" element={<PageWrapper><Inventory /></PageWrapper>} />
        <Route path="/clubs" element={<PageWrapper><Clubs /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}
