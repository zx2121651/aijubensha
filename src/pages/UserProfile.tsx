import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, MessageCircle, MapPin, Calendar, Heart, ShieldAlert, MoreHorizontal } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { scrollY } = useScroll();

  // 模拟假数据
  const mockUser = {
    id: id || '123',
    nickname: '推理大师_Seven',
    avatar: `https://picsum.photos/seed/${id || 123}/200/200`,
    background: `https://picsum.photos/seed/${id || 123}/800/400`,
    signature: '永远在寻找最难的硬核推理本。不推土，不睡觉。',
    level: 42,
    playCount: 156,
    fans: 2304,
    following: 128,
    tags: ['硬核玩家', '菠萝头', '无情推土机'],
    location: '上海',
    joinDate: '2023-01-15'
  };

  const [activeTab, setActiveTab] = useState<'posts'|'scripts'>('posts');

  // 滑动渐变 AppBar
  const headerOpacity = useTransform(scrollY, [0, 150], [0, 1]);
  const headerY = useTransform(scrollY, [0, 150], [-20, 0]);

  const showMoreOptions = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full text-center text-white font-bold mb-4">用户操作</div>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left" onClick={hideBottomSheet}>
          分享该用户
        </button>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('已拉黑'); hideBottomSheet(); }}>
          加入黑名单
        </button>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('举报成功'); hideBottomSheet(); }}>
          <ShieldAlert className="w-5 h-5 text-red-500" />
          举报该用户
        </button>
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 relative">
      {/* 渐变吸顶 Header */}
      <motion.header
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-0 left-0 right-0 h-14 bg-neutral-950/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-neutral-800"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-base">{mockUser.nickname}</span>
        </div>
        <button onClick={showMoreOptions} className="p-2 -mr-2 text-white">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </motion.header>

      {/* 沉浸式背景大图 */}
      <div className="relative w-full h-64 sm:h-80">
        <img src={mockUser.background} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-sm z-40">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={showMoreOptions} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-sm z-40">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* 资料面板 */}
      <div className="px-4 relative -mt-16 z-10">
        <div className="flex justify-between items-end mb-3">
          <div className="relative">
            <img src={mockUser.avatar} className="w-24 h-24 rounded-full border-4 border-neutral-950 object-cover bg-neutral-800" alt="avatar" />
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-neutral-950">
              Lv.{mockUser.level}
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <button className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white active:scale-95 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="px-6 h-10 rounded-full bg-red-600 text-white font-bold flex items-center gap-1 active:scale-95 transition-transform">
              <UserPlus className="w-4 h-4" />
              关注
            </button>
          </div>
        </div>

        <h1 className="text-xl font-black text-white mb-1">{mockUser.nickname}</h1>
        <p className="text-sm text-neutral-400 mb-4">{mockUser.signature}</p>

        <div className="flex gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{mockUser.following}</span>
            <span className="text-xs text-neutral-500">关注</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{mockUser.fans}</span>
            <span className="text-xs text-neutral-500">粉丝</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-white">{mockUser.playCount}</span>
            <span className="text-xs text-neutral-500">打本数</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {mockUser.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-neutral-900 text-neutral-300 text-xs rounded-md border border-neutral-800">
              {tag}
            </span>
          ))}
          <span className="px-2 py-1 bg-neutral-900 text-neutral-300 text-xs rounded-md border border-neutral-800 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {mockUser.location}
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-900" />

      {/* 底部动态 Tab */}
      <div className="sticky top-14 z-30 bg-neutral-950 border-b border-neutral-900 flex px-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-sm font-bold relative ${activeTab === 'posts' ? 'text-white' : 'text-neutral-500'}`}
        >
          TA的动态
          {activeTab === 'posts' && <motion.div layoutId="userTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('scripts')}
          className={`flex-1 py-3 text-sm font-bold relative ${activeTab === 'scripts' ? 'text-white' : 'text-neutral-500'}`}
        >
          想玩/玩过
          {activeTab === 'scripts' && <motion.div layoutId="userTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
        </button>
      </div>

      {/* 列表区占位 */}
      <div className="p-4 flex flex-col items-center justify-center opacity-50 py-20">
        {activeTab === 'posts' ? (
           <div className="text-center text-sm text-neutral-500">
             <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
               <Heart className="w-6 h-6 text-neutral-700" />
             </div>
             暂无动态
           </div>
        ) : (
           <div className="text-center text-sm text-neutral-500">
             <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
               <Calendar className="w-6 h-6 text-neutral-700" />
             </div>
             TA还没标记过剧本
           </div>
        )}
      </div>

    </div>
  );
}
