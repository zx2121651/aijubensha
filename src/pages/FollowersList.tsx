import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function FollowersList() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'fans'; // 'fans' | 'following' | 'mutual'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);

  // 模拟带有双向关注状态的数据
  const [users, setUsers] = useState(Array.from({ length: 15 }).map((_, i) => {
    const isFollowing = i % 2 === 0;
    const isFollower = i % 3 === 0;
    return {
      id: `user-${i}`,
      nickname: `剧本狂热粉_${i}`,
      avatar: `https://picsum.photos/seed/user${i}/50/50`,
      signature: '永远在推本的路上...',
      isFollowing,
      isFollower,
      isMutual: isFollowing && isFollower
    };
  }));

  const toggleFollow = (targetId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        const newFollowing = !u.isFollowing;
        return {
          ...u,
          isFollowing: newFollowing,
          isMutual: newFollowing && u.isFollower
        };
      }
      return u;
    }));
  };

  const getFilteredUsers = () => {
    if (activeTab === 'following') return users.filter(u => u.isFollowing);
    if (activeTab === 'mutual') return users.filter(u => u.isMutual);
    // fans
    return users.filter(u => u.isFollower);
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-10">
      {/* Header */}
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 border-b border-neutral-900 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-base">推理大师_Seven</span>
        </div>
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 text-sm font-bold relative ${activeTab === 'following' ? 'text-white' : 'text-neutral-500'}`}
          >
            关注
            {activeTab === 'following' && <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('fans')}
            className={`flex-1 py-2 text-sm font-bold relative ${activeTab === 'fans' ? 'text-white' : 'text-neutral-500'}`}
          >
            粉丝
            {activeTab === 'fans' && <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('mutual')}
            className={`flex-1 py-2 text-sm font-bold relative ${activeTab === 'mutual' ? 'text-white' : 'text-neutral-500'}`}
          >
            互相关注
            {activeTab === 'mutual' && <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-3 sticky top-[92px] z-30 bg-neutral-950/90 backdrop-blur-sm">
        <div className="bg-neutral-900 rounded-full flex items-center px-4 py-2 border border-neutral-800">
          <Search className="w-4 h-4 text-neutral-500 mr-2" />
          <input
            type="text"
            placeholder="搜索用户昵称"
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-neutral-600"
          />
        </div>
      </div>

      {/* List */}
      <main className="p-4 flex flex-col gap-5">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-neutral-500 mt-10 text-sm">
            暂无相关用户
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 active:scale-95 transition-transform" onClick={() => navigate(`/user/${user.id}`)}>
              <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">{user.nickname}</div>
                <div className="text-xs text-neutral-500 truncate mt-0.5">{user.signature}</div>
              </div>
              <button
                className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center justify-center min-w-[76px] transition-colors ${
                  user.isMutual
                    ? 'bg-neutral-900 border-neutral-700 text-neutral-300'
                    : user.isFollowing
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-500'
                      : 'bg-red-600 border-red-600 text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(user.id);
                }}
              >
                {user.isMutual ? (
                  <>互相关注</>
                ) : user.isFollowing ? (
                  <>已关注</>
                ) : (
                  <><UserPlus className="w-3 h-3 mr-1"/>关注</>
                )}
              </button>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
