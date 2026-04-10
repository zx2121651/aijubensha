import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Box, Vote, MessageSquare, ChevronLeft, Send, Mic, MicOff, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRoomContext, RoomProvider } from '@/src/context/RoomContext';
import { scripts } from '@/src/data/scripts';

// ============================================================================
// 游戏视图主组件容器 (GameInner)
// 使用了 Context 来管理全部后端状态，通过 activeTab 来无缝切换各功能级页面
// ============================================================================
function GameInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, socket, toggleReady } = useRoomContext();
  const script = scripts.find(s => s.id === id);

  // 确保用户已加入（防御性刷新处理，从 localStorage 取用户数据）
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Tabs: 'script' | 'map' | 'clues' | 'vote'
  const [activeTab, setActiveTab] = useState<'script' | 'map' | 'clues' | 'vote'>('script');
  
  // 悬浮聊天侧边栏
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 伪数据：当前角色、获得的线索、可搜证的地点
  const [unlockedClues, setUnlockedClues] = useState<any[]>([]);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (messagesEndRef.current && isChatOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, isChatOpen]);

  const sendMessage = () => {
    if (!chatInput.trim() || !socket) return;
    socket.emit('room:message', {
      roomId: state.roomId,
      userId: localUser.id,
      nickname: localUser.nickname,
      content: chatInput
    });
    setChatInput('');
  };

  const handleSearchSpot = (spotName: string) => {
    // 模拟前端点击地图搜证，获取假线索
    const newClue = {
      id: Math.random().toString(),
      name: `关于${spotName}的线索`,
      description: `在${spotName}的角落里，你发现了一张烧焦的纸条...`,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/300/200`
    };
    setUnlockedClues(prev => [...prev, newClue]);
    
    // 通知全房间某人获得了线索（制造紧张感）
    socket?.emit('room:message', {
      roomId: state.roomId,
      userId: 'SYSTEM',
      nickname: '系统',
      content: `🕵️ ${localUser.nickname} 在【${spotName}】发现了新的关键线索！`
    });
    alert(`在 ${spotName} 搜证成功，已放入背包！`);
  };

  const handleVote = () => {
    if (!selectedSuspect) return alert('请先选择嫌疑人');
    alert(`你已将选票投给：${selectedSuspect}`);
    // 真实业务中此处将发送 socket 或 API 请求统计票数
  };

  const phaseNameMap: Record<string, string> = {
    'RECRUITING': '等候大厅',
    'PREPARING': '选角准备',
    'READING': '阅读幕间',
    'INVESTIGATING': '搜证环节',
    'DISCUSSING': '公审讨论',
    'VOTING': '最终盘凶',
    'REVEAL': '复盘揭秘',
    'FINISHED': '游戏结束'
  };

  // 只有到对应阶段才能点特定 Tab
  const isTabDisabled = (tab: string) => {
    const phase = state.phase;
    if (phase === 'RECRUITING' || phase === 'PREPARING') return true;
    if (tab === 'vote' && phase !== 'VOTING') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans relative overflow-hidden">

      {/* ================= 顶部状态栏 ================= */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">{script?.title || '剧本进行中'}</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-medium px-2 py-0.5 bg-red-500/10 rounded">
                当前阶段: {phaseNameMap[state.phase] || state.phase}
              </span>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {state.players.length} 人在线
              </span>
            </div>
          </div>
        </div>

        {/* 打开聊天悬浮窗按钮 */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative p-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-transform active:scale-95"
        >
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 border-2 border-neutral-900 rounded-full animate-pulse" />
        </button>
      </div>

      {/* ================= 核心视图区 (多级页面切换) ================= */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 relative z-0">

        {/* 1. 阅读剧本视图 */}
        {activeTab === 'script' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-amber-50/5 p-6 md:p-10 rounded-2xl border border-amber-900/30 font-serif leading-loose tracking-wide text-amber-100/90 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
               <h2 className="text-2xl font-black text-red-500/80 text-center mb-8 tracking-[0.2em] border-b border-red-900/30 pb-4">
                 第一幕：血染百合花
               </h2>
               <p className="indent-8 mb-6 text-justify">
                 雨一直下着，拍打在长夜庄园冰冷的窗玻璃上。作为受邀的侦探，你一踏入这个门厅就闻到了一股若有若无的铁锈味。那是血的味道。
               </p>
               <p className="indent-8 mb-6 text-justify">
                 昨天夜里，庄园主的老爷突然在书房暴毙，门窗紧锁，是一起典型的密室杀人案。而你，在这之前竟然完全没有见过管家所说的那把“沾满鲜血的花剪”。这到底是怎么回事？
               </p>
               <div className="mt-12 pt-8 border-t border-amber-900/20 text-center">
                 <p className="text-neutral-500 text-sm mb-4">阅读完毕后，等待 DM 推进阶段进行搜证</p>
               </div>
            </div>
          </div>
        )}

        {/* 2. 搜证地图视图 */}
        {activeTab === 'map' && (
          <div className="max-w-2xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-blue-400" /> 庄园搜证地图</h2>
            <div className="relative flex-1 min-h-[400px] bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden group">
               {/* 模拟背景地图 */}
               <img src="https://picsum.photos/seed/map1/800/600" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" alt="Map Map" />

               {/* 搜证交互点 */}
               <button onClick={() => handleSearchSpot('老爷书房')} className="absolute top-[30%] left-[20%] group/spot">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping absolute inset-0" />
                  <div className="w-4 h-4 bg-yellow-400 rounded-full relative z-10 border-2 border-neutral-900" />
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover/spot:opacity-100 transition-opacity">
                    老爷书房
                  </span>
               </button>

               <button onClick={() => handleSearchSpot('后花园')} className="absolute top-[60%] right-[30%] group/spot">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping absolute inset-0" />
                  <div className="w-4 h-4 bg-yellow-400 rounded-full relative z-10 border-2 border-neutral-900" />
                  <span className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover/spot:opacity-100 transition-opacity">
                    后花园
                  </span>
               </button>
            </div>
            <p className="text-xs text-neutral-500 text-center mt-4">点击高亮光点搜集环境线索</p>
          </div>
        )}

        {/* 3. 线索背包视图 */}
        {activeTab === 'clues' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Box className="w-5 h-5 text-yellow-400" /> 我的线索背包</h2>
            {unlockedClues.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 border border-neutral-800 border-dashed rounded-2xl">
                <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>背包空空如也，快去搜证吧</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {unlockedClues.map((clue, idx) => (
                  <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg group">
                    <img src={clue.imageUrl} alt="clue" className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-red-200 mb-1 line-clamp-1">{clue.name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">{clue.description}</p>
                      <button className="w-full mt-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> 公开分享
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. 投票盘凶视图 */}
        {activeTab === 'vote' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <Vote className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-black text-red-500">真相只有一个</h2>
              <p className="text-neutral-400 mt-2 text-sm">请根据你掌握的线索，投出你心目中的真凶</p>
            </div>

            <div className="space-y-3">
              {['管家老王', '大少爷', '厨师长', '神秘客人'].map(suspect => (
                <button
                  key={suspect}
                  onClick={() => setSelectedSuspect(suspect)}
                  className={cn(
                    "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                    selectedSuspect === suspect
                      ? "bg-red-900/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "bg-neutral-900 border-neutral-800 hover:border-neutral-600"
                  )}
                >
                  <span className="font-bold">{suspect}</span>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selectedSuspect === suspect ? "border-red-500" : "border-neutral-600"
                  )}>
                    {selectedSuspect === suspect && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handleVote}
              className="w-full mt-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl tracking-widest shadow-lg shadow-red-900/50 transition-colors"
            >
              确认指控
            </button>
          </div>
        )}
      </div>

      {/* ================= 悬浮聊天侧滑/弹出层 ================= */}
      {isChatOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end pointer-events-none">
          {/* 点击背景关闭 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsChatOpen(false)} />

          <div className="relative w-full h-[60vh] bg-neutral-900 border-t border-neutral-800 rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 rounded-t-3xl">
              <h3 className="font-bold flex items-center gap-2">
                <Mic className="w-4 h-4 text-green-400" /> 实时公屏讨论
              </h3>
              <button onClick={() => setIsChatOpen(false)} className="text-neutral-400 hover:text-white p-1">关闭</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950/50">
              {state.messages.map((msg: any, i: number) => (
                <div key={i} className={cn("flex gap-3", msg.userId === localUser.id ? "flex-row-reverse" : "flex-row")}>
                   <div className="w-8 h-8 rounded-full bg-neutral-800 overflow-hidden shrink-0">
                     <img src={`https://picsum.photos/seed/${msg.userId}/100/100`} className="w-full h-full object-cover" alt="avatar" />
                   </div>
                   <div className={cn("flex flex-col max-w-[75%]", msg.userId === localUser.id ? "items-end" : "items-start")}>
                     <span className="text-[10px] text-neutral-500 mb-1">{msg.nickname}</span>
                     <div className={cn(
                       "px-4 py-2 rounded-2xl text-sm",
                       msg.userId === 'SYSTEM' ? "bg-amber-900/30 text-amber-200 border border-amber-500/20" :
                       msg.userId === localUser.id ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-100"
                     )}>
                       {msg.content}
                     </div>
                   </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 发送框 */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 pb-safe">
               <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-full border border-neutral-800">
                 <button className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 shrink-0">
                   <Mic className="w-5 h-5 text-neutral-400" />
                 </button>
                 <input
                   type="text"
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   onKeyPress={e => e.key === 'Enter' && sendMessage()}
                   placeholder="输入你的盘凶推理..."
                   className="flex-1 bg-transparent text-sm focus:outline-none px-2"
                 />
                 <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 shrink-0">
                   <Send className="w-4 h-4 text-white ml-0.5" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 底部常驻功能导航栏 ================= */}
      <div className="absolute bottom-0 w-full bg-neutral-900 border-t border-neutral-800 flex items-center justify-around pb-safe z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {[
          { id: 'script', icon: BookOpen, label: '阅读' },
          { id: 'map', icon: Search, label: '搜证' },
          { id: 'clues', icon: Box, label: '线索' },
          { id: 'vote', icon: Vote, label: '盘凶' }
        ].map(tab => {
          const Icon = tab.icon;
          const disabled = isTabDisabled(tab.id);
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              disabled={disabled}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 gap-1 relative transition-all",
                disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-neutral-800",
                active ? "text-red-500" : "text-neutral-500"
              )}
            >
              {active && <div className="absolute top-0 w-1/2 h-1 bg-red-500 rounded-b-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
              <Icon className={cn("w-6 h-6", active && "animate-bounce")} />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <RoomProvider>
      <GameInner />
    </RoomProvider>
  );
}
