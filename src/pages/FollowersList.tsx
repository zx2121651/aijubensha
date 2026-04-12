import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function FollowersList() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'fans'; // 'fans' | 'following'
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);

  const mockUsers = Array.from({ length: 15 }).map((_, i) => ({
    id: `user-${i}`,
    nickname: `剧本狂热粉_${i}`,
    avatar: `https://picsum.photos/seed/user${i}/50/50`,
    signature: '永远在推本的路上...',
    isFollowing: i % 3 === 0
  }));

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-10">
      {/* Header */}
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 border-b border-neutral-900 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
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
            关注 128
            {activeTab === 'following' && <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('fans')}
            className={`flex-1 py-2 text-sm font-bold relative ${activeTab === 'fans' ? 'text-white' : 'text-neutral-500'}`}
          >
            粉丝 2304
            {activeTab === 'fans' && <motion.div layoutId="followTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </header>

      {/* List */}
      <main className="p-4 flex flex-col gap-5">
        {mockUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-3 active:scale-95 transition-transform" onClick={() => navigate(`/user/${user.id}`)}>
            <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{user.nickname}</div>
              <div className="text-xs text-neutral-500 truncate mt-0.5">{user.signature}</div>
            </div>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                user.isFollowing
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  : 'bg-red-600 border-red-600 text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                // handle toggle follow
              }}
            >
              {user.isFollowing ? (
                <>互相关注</>
              ) : (
                <><UserPlus className="w-3 h-3"/>关注</>
              )}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
