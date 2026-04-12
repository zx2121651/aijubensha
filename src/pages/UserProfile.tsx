import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, MessageCircle, MapPin, Calendar, Heart, ShieldAlert, MoreHorizontal, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { scrollY } = useScroll();

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

      <div className="px-4 relative -mt-16 z-10">
        <div className="flex justify-between items-end mb-3">
          <div className="relative">
            <img src={mockUser.avatar} className="w-24 h-24 rounded-full border-4 border-neutral-950 object-cover bg-neutral-800" alt="avatar" />
            <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-neutral-950">
              Lv.{mockUser.level}
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <button className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white active:scale-95 transition-transform" onClick={() => navigate(`/chat/${mockUser.id}`)}>
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
          <div className="flex flex-col items-center cursor-pointer active:opacity-50 transition-opacity" onClick={() => navigate(`/followers/${mockUser.id}?tab=following`)}>
            <span className="text-lg font-bold text-white">{mockUser.following}</span>
            <span className="text-xs text-neutral-500">关注</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer active:opacity-50 transition-opacity" onClick={() => navigate(`/followers/${mockUser.id}?tab=fans`)}>
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

      <div className="p-4 flex flex-col items-center justify-center pb-20">
        {activeTab === 'posts' ? (
           <div className="flex flex-col gap-4 w-full">
             {[1,2,3].map(i => (
               <div key={i} className="bg-neutral-900 rounded-xl p-4 text-left">
                 <p className="text-sm text-white mb-2 leading-relaxed">终于打完了《死光法则》，推土机表示极度舒适！这本子的反转绝了，dm的节奏也带得特别好。强推给大家！</p>
                 <div className="flex gap-2 mb-3">
                   <img src={`https://picsum.photos/seed/post${i}/100/100`} className="w-24 h-24 rounded-lg object-cover" alt="postimg" />
                 </div>
                 <div className="flex items-center gap-4 text-neutral-500 text-xs">
                   <span>2024-05-1{i}</span>
                   <span className="flex items-center gap-1"><Heart className="w-3 h-3"/> 12{i}</span>
                   <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3"/> 4{i}</span>
                 </div>
               </div>
             ))}
           </div>
        ) : (
           <div className="flex flex-col gap-3 w-full">
             {[1,2].map(i => (
               <div key={i} className="flex gap-3 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                 <img src={`https://picsum.photos/seed/script${i}/60/80`} className="w-16 h-24 rounded-lg object-cover" alt="scriptimg" />
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div>
                     <div className="text-sm font-bold text-white">第七号嫌疑人</div>
                     <div className="text-xs text-neutral-400 mt-1 flex gap-2">
                       <span>硬核推理</span>
                       <span>6人本</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-between mt-2">
                     <div className="flex items-center gap-1 text-yellow-500">
                       <Star className="w-3 h-3 fill-yellow-500"/> <span className="text-xs font-bold">9.2</span>
                     </div>
                     <span className="text-[10px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-full">已玩过</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
