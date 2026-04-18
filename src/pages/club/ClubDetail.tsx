import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, MoreHorizontal, Users, Activity, Crown, Zap, MessageCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { scrollY } = useScroll();

  const [activeTab, setActiveTab] = useState<'posts'|'members'>('posts');
  const [isJoined, setIsJoined] = useState(id === '1'); // mock

  const mockClub = {
    id: id || '1',
    name: '硬核推理联盟',
    logo: 'https://picsum.photos/seed/clublogo/200/200',
    cover: 'https://picsum.photos/seed/clubcover/800/400',
    description: '本公会只收硬核玩家！每周保底组织三场 6 小时以上的硬核推理本。推土机快来，不欢迎玻璃心和划水怪。',
    level: 5,
    members: 142,
    maxMembers: 200,
    heatValue: 9800,
    rank: 3
  };

  const headerOpacity = useTransform(scrollY, [0, 150], [0, 1]);

  const showMoreOptions = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full text-center text-white font-bold mb-4">公会操作</div>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left" onClick={() => { alert('已分享'); hideBottomSheet(); }}>
          <Share2 className="w-5 h-5 text-neutral-400" />
          分享给好友
        </button>
        {isJoined ? (
           <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => {
              if (confirm('退出公会将会清空你在本公会的活跃度，确定吗？')) {
                 setIsJoined(false); hideBottomSheet();
              }
           }}>
             退出公会
           </button>
        ) : (
           <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('举报成功'); hideBottomSheet(); }}>
             举报公会
           </button>
        )}
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24 relative">
      {/* 渐变吸顶 Header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 h-14 bg-neutral-950/90 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-neutral-800"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-base flex items-center gap-2">
            <img src={mockClub.logo} className="w-6 h-6 rounded-md object-cover" alt="logo" />
            {mockClub.name}
          </span>
        </div>
        <button onClick={showMoreOptions} className="p-2 -mr-2 text-white">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </motion.header>

      {/* 沉浸式背景大图 */}
      <div className="relative w-full h-64 sm:h-80">
        <img src={mockClub.cover} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/20" />

        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-sm z-40">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button onClick={showMoreOptions} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-sm z-40">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* 资料悬浮面板 */}
      <div className="px-4 relative -mt-16 z-10">
        <div className="flex items-end justify-between mb-4">
          <img src={mockClub.logo} className="w-24 h-24 rounded-2xl border-4 border-neutral-950 object-cover shadow-xl bg-neutral-800" alt="logo" />
          <div className="flex gap-2 mb-2">
             <div className="flex flex-col items-center bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 px-4 py-2 rounded-xl">
               <span className="text-xl font-black text-yellow-500 flex items-center gap-1"><Zap className="w-4 h-4 fill-yellow-500" /> {mockClub.heatValue}</span>
               <span className="text-[10px] text-neutral-400">活跃度</span>
             </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
          {mockClub.name}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-sm skew-x-[-10deg]">Lv.{mockClub.level}</span>
        </h1>

        <p className="text-sm text-neutral-300 leading-relaxed mb-4 text-justify">{mockClub.description}</p>

        <div className="flex items-center gap-6 text-sm mb-6">
          <div className="flex items-center gap-1.5 text-neutral-400 font-bold">
            <Users className="w-4 h-4" />
            成员 <span className="text-white">{mockClub.members}</span> / {mockClub.maxMembers}
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 font-bold">
            <TrophyIcon className="w-4 h-4" />
            大区排名 <span className="text-white">No.{mockClub.rank}</span>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-900" />

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-neutral-950 border-b border-neutral-900 flex px-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-sm font-bold relative ${activeTab === 'posts' ? 'text-white' : 'text-neutral-500'}`}
        >
          公会圈子
          {activeTab === 'posts' && <motion.div layoutId="clubTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 text-sm font-bold relative ${activeTab === 'members' ? 'text-white' : 'text-neutral-500'}`}
        >
          成员大厅
          {activeTab === 'members' && <motion.div layoutId="clubTab" className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-red-600 rounded-t-full" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
         {activeTab === 'posts' ? (
           <div className="flex flex-col gap-4">
             {[1,2,3].map(i => (
               <div key={i} className="bg-neutral-900 rounded-xl p-4 text-left border border-neutral-800">
                 <div className="flex items-center gap-2 mb-3">
                   <img src={`https://picsum.photos/seed/u${i}/40/40`} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                   <div>
                     <div className="text-xs font-bold text-white flex items-center gap-1">硬核玩家_{i} <span className="text-[8px] bg-red-600/20 text-red-500 px-1 rounded">成员</span></div>
                     <div className="text-[10px] text-neutral-500">昨天 14:00</div>
                   </div>
                 </div>
                 <p className="text-sm text-white mb-2 leading-relaxed">今晚 8 点《第七号嫌疑人》，缺一个女角色，公会里有没有人来的？直接发私信给我！</p>
                 <div className="flex items-center gap-4 text-neutral-500 text-xs mt-3 border-t border-neutral-800 pt-3">
                   <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4"/> 4 回复</span>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="flex flex-col gap-3">
             {[
                { name: '推理大师_Seven', role: '会长', active: '10分钟前', isMe: false },
                { name: '戏精本精', role: '副会长', active: '当前在线', isMe: false },
                { name: '我', role: '精英', active: '当前在线', isMe: true },
                { name: '划水怪', role: '成员', active: '3天前', isMe: false },
             ].map((m, i) => (
               <div key={i} className="flex items-center gap-3 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/u${i+5}/50/50`} className="w-12 h-12 rounded-full object-cover" alt="avatar"/>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${m.active == '当前在线' ? 'bg-green-500' : 'bg-neutral-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-sm text-white truncate">{m.name}</span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${m.role === '会长' ? 'bg-yellow-500/20 text-yellow-500' : m.role === '副会长' ? 'bg-purple-500/20 text-purple-400' : 'bg-neutral-800 text-neutral-400'}`}>
                         {m.role}
                       </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">最近活跃: {m.active}</div>
                  </div>
               </div>
             ))}
           </div>
         )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-900 px-4 py-3 pb-safe z-40">
        {isJoined ? (
          <button
            onClick={() => navigate(`/chat/club-${id}`)}
            className="w-full py-4 bg-red-600 hover:bg-red-500 active:scale-[0.98] transition-all text-white font-black rounded-full flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            <MessageCircle className="w-5 h-5" />
            进入公会群聊大厅
          </button>
        ) : (
          <button
            onClick={() => {
              // 模拟申请加入
              alert('已发送加入申请，等待会长审核');
              setIsJoined(true);
            }}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 active:scale-[0.98] transition-all text-black font-black rounded-full text-lg shadow-lg shadow-yellow-500/20"
          >
            申请加入公会
          </button>
        )}
      </div>

    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  );
}
