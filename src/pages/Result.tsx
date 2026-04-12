import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Star, MessageSquare, ChevronRight, Home, Users, CheckCircle2, XCircle, Coins, Zap, BookOpen, Clock, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scripts } from '@/src/data/scripts';
import { motion } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const script = scripts.find(s => s.id === id) || scripts[0];

  const [activeTab, setActiveTab] = useState<'truth' | 'mvp' | 'review'>('truth');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [mvpVote, setMvpVote] = useState<string | null>(null);

  // 模拟揭秘动画阶段
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    if (activeTab === 'truth') {
      const timer1 = setTimeout(() => setRevealStep(1), 1000); // 浮现真凶
      const timer2 = setTimeout(() => setRevealStep(2), 2500); // 浮现排行榜
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [activeTab]);

  const mockPlayers = [
    { id: 'p1', name: '戏精本精', avatar: 'https://picsum.photos/seed/p1/100/100', score: 1250, isMvp: true, charName: '苏管家', role: '凶手' },
    { id: 'p2', name: '我', avatar: 'https://picsum.photos/seed/me/100/100', score: 980, isMvp: false, charName: '林小姐', role: '平民' },
    { id: 'p3', name: '划水怪', avatar: 'https://picsum.photos/seed/p3/100/100', score: 450, isMvp: false, charName: '王少爷', role: '帮凶' },
    { id: 'p4', name: '无情推土机', avatar: 'https://picsum.photos/seed/p4/100/100', score: 1100, isMvp: false, charName: '李探长', role: '侦探' },
  ];

  const handleShare = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-3">
         <h3 className="text-center font-bold text-white mb-2">分享战报</h3>
         <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform" onClick={() => { alert('已分享给微信好友'); hideBottomSheet(); }}>微信好友</button>
         <button className="w-full py-4 bg-red-500 text-white rounded-xl font-bold active:scale-95 transition-transform" onClick={() => { alert('已发布到社区动态'); hideBottomSheet(); }}>发布到剧本杀动态</button>
         <button className="w-full py-4 bg-neutral-800 text-neutral-300 rounded-xl font-bold active:scale-95 transition-transform mt-2" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-safe relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">对局结算</h1>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors active:scale-95">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors active:scale-95">
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Script Banner */}
        <div className="flex items-center gap-3 mt-4 mb-2">
          <img src={script.cover} alt={script.title} className="w-12 h-16 object-cover rounded-lg shadow-md" referrerPolicy="no-referrer" />
          <div>
            <h2 className="font-bold text-white">{script.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
              <span className="flex items-center gap-1 bg-neutral-800 px-1.5 py-0.5 rounded"><Clock className="w-3 h-3" /> 4h 30m</span>
              <span className="flex items-center gap-1 bg-neutral-800 px-1.5 py-0.5 rounded"><Users className="w-3 h-3" /> {typeof script.players === 'object' ? (script.players.male + script.players.female + script.players.any) : script.players}</span>
              <span className="flex items-center gap-1 bg-neutral-800 px-1.5 py-0.5 rounded text-green-400"><CheckCircle2 className="w-3 h-3" /> 成功逃脱</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveTab('truth')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap", activeTab === 'truth' ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "bg-neutral-800 text-neutral-400")}
          >
            真相揭秘
          </button>
          <button
            onClick={() => setActiveTab('mvp')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap", activeTab === 'mvp' ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "bg-neutral-800 text-neutral-400")}
          >
            MVP 评选
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={cn("px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap", activeTab === 'review' ? "bg-red-600 text-white shadow-lg shadow-red-600/30" : "bg-neutral-800 text-neutral-400")}
          >
            剧本评价
          </button>
        </div>
      </header>

      <main className="p-4">
        {activeTab === 'truth' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500" />
              <h3 className="text-neutral-400 text-sm mb-4 font-bold tracking-widest">本局真凶是</h3>

              {revealStep >= 1 ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <img src={mockPlayers[0].avatar} className="w-24 h-24 rounded-full border-4 border-red-600 object-cover shadow-[0_0_30px_rgba(220,38,38,0.5)] z-10 relative" alt="killer" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-neutral-900 z-20 whitespace-nowrap">
                      {mockPlayers[0].charName}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-white mt-4 mb-1">{mockPlayers[0].name}</h4>
                  <p className="text-xs text-red-400 font-bold">"伪装得天衣无缝，可惜百密一疏"</p>
                </motion.div>
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-neutral-800 border-4 border-neutral-700 animate-pulse flex items-center justify-center">
                  <span className="text-3xl">?</span>
                </div>
              )}
            </div>

            {revealStep >= 2 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> 最终得分榜</h3>
                </div>
                <div className="space-y-3">
                  {mockPlayers.sort((a,b) => b.score - a.score).map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div className={cn("w-6 h-6 flex items-center justify-center rounded-full font-black text-sm shrink-0", idx === 0 ? "bg-yellow-500 text-black" : idx === 1 ? "bg-neutral-300 text-black" : idx === 2 ? "bg-orange-700 text-white" : "bg-neutral-800 text-neutral-500")}>
                        {idx + 1}
                      </div>
                      <img src={p.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">{p.name}</span>
                          {p.id === 'p2' && <span className="bg-red-600 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">我</span>}
                        </div>
                        <span className="text-[10px] text-neutral-500 truncate">{p.charName} · {p.role}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-yellow-500">{p.score}</div>
                        <span className="text-[10px] text-neutral-500">PT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'mvp' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                <h3 className="text-xl font-black text-white mb-2">本局 MVP 颁发给？</h3>
                <p className="text-sm text-neutral-400">投出你心目中表现最亮眼的玩家</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               {mockPlayers.filter(p => p.id !== 'p2').map(p => (
                 <div
                   key={p.id}
                   onClick={() => setMvpVote(p.id)}
                   className={cn("bg-neutral-900 border-2 rounded-2xl p-4 text-center cursor-pointer transition-all active:scale-95", mvpVote === p.id ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "border-neutral-800 hover:border-neutral-700")}
                 >
                   <img src={p.avatar} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-neutral-800" alt={p.name} />
                   <h4 className="font-bold text-white text-sm truncate mb-1">{p.name}</h4>
                   <p className="text-[10px] text-neutral-500">{p.charName}</p>
                 </div>
               ))}
             </div>

             <button
               disabled={!mvpVote}
               onClick={() => { alert('投票成功！'); setActiveTab('review'); }}
               className="w-full mt-6 py-4 rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 bg-yellow-500 text-black hover:bg-yellow-400 active:scale-95 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none"
             >
               确认投票
             </button>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 text-center">给剧本打个分吧</h3>
               <div className="flex justify-center gap-2 mb-6">
                 {[1,2,3,4,5].map(star => (
                   <Star
                     key={star}
                     onClick={() => setRating(star)}
                     className={cn("w-10 h-10 cursor-pointer transition-all active:scale-75", rating >= star ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-neutral-700")}
                   />
                 ))}
               </div>

               <textarea
                 value={reviewText}
                 onChange={(e) => setReviewText(e.target.value)}
                 placeholder="写下你的真实评价，帮助其他玩家避坑或种草... (选填)"
                 className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-600 transition-colors h-32 resize-none"
               />
             </div>

             <button
               onClick={() => { alert('评价已发布'); navigate('/'); }}
               className="w-full py-4 rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-red-600/30"
             >
               提交评价并返回首页
             </button>
          </div>
        )}

      </main>
    </div>
  );
}
