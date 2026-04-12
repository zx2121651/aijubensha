import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MicOff, Mic, Skull, ShieldAlert, Send, Eye, MoreVertical, PlayCircle, PauseCircle, FastForward } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const MOCK_PLAYERS = [
  { id: 'p1', name: '戏精本精', avatar: 'https://picsum.photos/seed/p1/100/100', charName: '苏管家', isMuted: false, isDead: false, online: true },
  { id: 'p2', name: '安静的推土机', avatar: 'https://picsum.photos/seed/p2/100/100', charName: '林小姐', isMuted: true, isDead: false, online: true },
  { id: 'p3', name: '划水怪', avatar: 'https://picsum.photos/seed/p3/100/100', charName: '王少爷', isMuted: false, isDead: true, online: true },
  { id: 'p4', name: '掉线玩家', avatar: 'https://picsum.photos/seed/p4/100/100', charName: '李探长', isMuted: false, isDead: false, online: false },
];

const GAME_PHASES = [
  { id: 'PREPARING', name: '准备中' },
  { id: 'READING', name: '阅读剧本' },
  { id: 'INVESTIGATING', name: '第一轮搜证' },
  { id: 'DISCUSSING', name: '集中讨论' },
  { id: 'VOTING', name: '投票结案' },
  { id: 'FINISHED', name: '复盘结束' },
];

export default function DmConsole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();

  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [currentPhase, setCurrentPhase] = useState('INVESTIGATING');
  const [isGamePaused, setIsGamePaused] = useState(false);

  const toggleMuteAll = (mute: boolean) => {
    setPlayers(prev => prev.map(p => ({ ...p, isMuted: mute })));
    alert(`已开启全员${mute ? '禁言' : '解禁'}`);
  };

  const showPlayerOptions = (player: any) => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-4">
          <img src={player.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700" alt={player.name}/>
          <div>
            <h3 className="font-bold text-white leading-tight">{player.name}</h3>
            <span className="text-[10px] text-neutral-400">扮演：{player.charName}</span>
          </div>
        </div>

        <button
          className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left"
          onClick={() => {
            setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, isMuted: !p.isMuted } : p));
            hideBottomSheet();
          }}
        >
          {player.isMuted ? <Mic className="w-5 h-5 text-green-500" /> : <MicOff className="w-5 h-5 text-yellow-500" />}
          {player.isMuted ? '解除禁言' : '强制禁言'}
        </button>

        <button
          className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left"
          onClick={() => {
            setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, isDead: !p.isDead } : p));
            hideBottomSheet();
          }}
        >
          <Skull className="w-5 h-5 text-purple-500" />
          {player.isDead ? '使用复活道具' : '标记为死亡出局'}
        </button>

        <button
          className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left"
          onClick={() => {
            if (confirm('确定要将该玩家踢出房间吗？游戏可能会因此中断。')) {
               setPlayers(prev => prev.filter(p => p.id !== player.id));
               hideBottomSheet();
            }
          }}
        >
          <ShieldAlert className="w-5 h-5 text-red-500" />
          强制踢出房间
        </button>

        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  const handleAdvancePhase = () => {
    const currentIndex = GAME_PHASES.findIndex(p => p.id === currentPhase);
    if (currentIndex < GAME_PHASES.length - 1) {
       if (confirm(`即将强行进入阶段【${GAME_PHASES[currentIndex + 1].name}】，所有玩家的界面将被刷新，确认执行？`)) {
         setCurrentPhase(GAME_PHASES[currentIndex + 1].id);
       }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-base flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-black">DM视角</span>
              七号嫌疑人房间控制台
            </h1>
            <span className="text-[10px] text-green-500 font-bold">房间号: {id || 'ROOM-8821'} · 服务器状态良好</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsGamePaused(!isGamePaused)}
            className={cn("px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors", isGamePaused ? "bg-yellow-500 text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700")}
          >
            {isGamePaused ? <PlayCircle className="w-4 h-4"/> : <PauseCircle className="w-4 h-4"/>}
            {isGamePaused ? '恢复游戏' : '暂停游戏'}
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel: Players */}
        <div className="w-1/3 min-w-[280px] bg-neutral-950 border-r border-neutral-900 flex flex-col">
          <div className="p-4 border-b border-neutral-900 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-300"><Users className="w-4 h-4" /> 玩家控场 ({players.length})</h2>
            <div className="flex gap-1">
              <button onClick={() => toggleMuteAll(true)} className="p-1.5 bg-neutral-800 rounded hover:bg-neutral-700 text-red-400" title="全员禁言"><MicOff className="w-4 h-4" /></button>
              <button onClick={() => toggleMuteAll(false)} className="p-1.5 bg-neutral-800 rounded hover:bg-neutral-700 text-green-400" title="全员开麦"><Mic className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {players.map(player => (
              <div
                key={player.id}
                className={cn("bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center justify-between group transition-colors hover:border-neutral-700 cursor-pointer", !player.online && "opacity-50", player.isDead && "grayscale")}
                onClick={() => showPlayerOptions(player)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={player.avatar} className={cn("w-10 h-10 rounded-full object-cover", player.isDead && "border-2 border-purple-500")} alt="avatar"/>
                    <div className={cn("absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-900", player.online ? "bg-green-500" : "bg-neutral-500")} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      {player.name}
                      {player.isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                    </div>
                    <div className="text-xs text-neutral-500">{player.charName}</div>
                  </div>
                </div>
                <button className="text-neutral-500 group-hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Game State & Clues */}
        <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden relative">
          {isGamePaused && (
            <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[2px] z-20 flex items-center justify-center">
               <div className="bg-neutral-900 border border-yellow-500 p-6 rounded-2xl text-center shadow-2xl">
                 <PauseCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                 <h2 className="text-xl font-bold text-white mb-1">上帝视角：游戏已冻结</h2>
                 <p className="text-sm text-neutral-400">所有玩家端操作已锁定，可进行场外发药或裁决</p>
               </div>
            </div>
          )}

          <div className="p-6 border-b border-neutral-900 shrink-0">
            <h2 className="text-sm font-bold text-neutral-300 mb-4">全局进度控制</h2>
            <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
               <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 mr-4 mask-edge-r">
                 {GAME_PHASES.map((phase, index) => {
                   const isCurrent = phase.id === currentPhase;
                   const isPast = GAME_PHASES.findIndex(p => p.id === currentPhase) > index;
                   return (
                     <div key={phase.id} className="flex items-center">
                       <div className={cn("whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors border", isCurrent ? "bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]" : isPast ? "bg-neutral-800 text-neutral-400 border-neutral-700" : "bg-neutral-950 text-neutral-600 border-neutral-800")}>
                         {phase.name}
                       </div>
                       {index < GAME_PHASES.length - 1 && <div className={cn("w-4 h-[2px] mx-1", isPast ? "bg-red-900" : "bg-neutral-800")} />}
                     </div>
                   );
                 })}
               </div>
               <button
                 onClick={handleAdvancePhase}
                 className="shrink-0 px-4 py-2 bg-white text-black font-bold text-sm rounded-lg active:scale-95 transition-transform flex items-center gap-1 shadow-lg shadow-white/10"
               >
                 强制进入下一阶段 <FastForward className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-300">线索库上帝视图</h2>
              <span className="text-xs text-neutral-500">直接点击线索将其群发或定点发放</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 group hover:border-neutral-600 transition-colors">
                   <img src={`https://picsum.photos/seed/c${i}/300/200`} className="w-full h-24 object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="clue"/>
                   <div className="p-3">
                     <div className="text-xs font-bold text-white mb-1 truncate">案发现场血迹照片 #{i}</div>
                     <div className="text-[10px] text-neutral-500 mb-3 truncate">带有奇怪图案的干涸血迹...</div>
                     <div className="flex gap-2">
                       <button className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded transition-colors flex items-center justify-center gap-1" onClick={() => alert('已将线索全服广播公屏！')}>
                         <Eye className="w-3 h-3"/> 公开
                       </button>
                       <button className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded transition-colors flex items-center justify-center gap-1" onClick={() => alert('请在玩家列表中选择目标')}>
                         <Send className="w-3 h-3"/> 私发
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
