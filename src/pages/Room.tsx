import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { scripts } from '@/src/data/scripts';
import { ArrowLeft, Users, Check, Clock, ShieldAlert, Play, UserPlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface RoomPlayer {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  selectedCharacterId: string | null;
  isHost?: boolean;
}

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const script = scripts.find(s => s.id === id);
  
  // Mock current user
  const currentUser = {
    id: 'me',
    name: '我',
    avatar: 'https://picsum.photos/seed/me/150/150',
  };

  const [players, setPlayers] = useState<RoomPlayer[]>([
    { id: 'me', name: '我', avatar: currentUser.avatar, isReady: false, selectedCharacterId: null, isHost: true },
    { id: 'p1', name: '推理大师', avatar: 'https://picsum.photos/seed/p1/150/150', isReady: true, selectedCharacterId: script?.characters?.[1]?.id || null },
    { id: 'p2', name: '戏精本精', avatar: 'https://picsum.photos/seed/p2/150/150', isReady: false, selectedCharacterId: null },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);

  const mockFriends = [
    { id: 'f1', name: '推理狂魔', avatar: 'https://picsum.photos/seed/p1/40/40', status: '在线', isPlaying: true },
    { id: 'f2', name: '情感本爱好者', avatar: 'https://picsum.photos/seed/p2/40/40', status: '离线', isPlaying: false },
    { id: 'f3', name: '硬核玩家', avatar: 'https://picsum.photos/seed/u3/40/40', status: '在线', isPlaying: false },
    { id: 'f4', name: '剧本杀老司机', avatar: 'https://picsum.photos/seed/u1/40/40', status: '在线', isPlaying: true },
  ];

  if (!script) return <div className="p-8 text-center">剧本未找到</div>;

  const characters = script.characters || [];
  const targetPlayers = script.players.male + script.players.female + script.players.any;

  const myPlayer = players.find(p => p.id === 'me');
  const isHost = myPlayer?.isHost;
  const allReady = players.every(p => p.isHost || p.isReady) && players.length === targetPlayers;

  const handleSelectCharacter = (charId: string) => {
    if (myPlayer?.isReady) return; // Cannot change if ready
    
    // Check if taken by others
    if (players.some(p => p.id !== 'me' && p.selectedCharacterId === charId)) {
      return;
    }

    setPlayers(prev => prev.map(p => 
      p.id === 'me' ? { ...p, selectedCharacterId: p.selectedCharacterId === charId ? null : charId } : p
    ));
  };

  const toggleReady = () => {
    if (!myPlayer?.selectedCharacterId) return; // Must select character first
    
    setPlayers(prev => prev.map(p => 
      p.id === 'me' ? { ...p, isReady: !p.isReady } : p
    ));
  };

  const startGame = () => {
    navigate(`/game/${script.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between bg-neutral-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight">{script.title}</h1>
            <p className="text-xs text-neutral-400">准备房间 · {players.length}/{targetPlayers} 人</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-neutral-400">
          <ShieldAlert className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Players List */}
        <section>
          <h2 className="text-sm font-bold text-neutral-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            玩家列表
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {Array.from({ length: targetPlayers }).map((_, i) => {
              const player = players[i];
              return (
                <div key={i} className="snap-start shrink-0 w-20 flex flex-col items-center gap-2">
                  <div className="relative">
                    {player ? (
                      <img src={player.avatar} alt={player.name} className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700" referrerPolicy="no-referrer" />
                    ) : (
                      <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center bg-neutral-800/50 hover:bg-neutral-700 transition-colors"
                      >
                        <UserPlus className="w-6 h-6 text-neutral-400" />
                      </button>
                    )}
                    {player?.isHost && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        房主
                      </div>
                    )}
                    {player?.isReady && !player?.isHost && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-neutral-900">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <p className="text-xs font-medium truncate">{player ? player.name : '邀请好友'}</p>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {player?.selectedCharacterId 
                        ? characters.find(c => c.id === player.selectedCharacterId)?.name 
                        : player ? '未选角' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Character Selection */}
        <section>
          <h2 className="text-sm font-bold text-neutral-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            选择角色
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {characters.map(char => {
              const selectedBy = players.find(p => p.selectedCharacterId === char.id);
              const isMine = selectedBy?.id === 'me';
              const isTaken = !!selectedBy && !isMine;

              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char.id)}
                  disabled={isTaken || myPlayer?.isReady}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border text-left transition-all relative overflow-hidden",
                    isMine ? "bg-red-900/30 border-red-500" : 
                    isTaken ? "bg-neutral-800/50 border-neutral-800 opacity-60 cursor-not-allowed" : 
                    "bg-neutral-800 border-neutral-700 hover:border-red-500/50"
                  )}
                >
                  <img src={char.avatar} alt={char.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-neutral-100 truncate">{char.name}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 shrink-0">
                        {char.gender === 'male' ? '男' : char.gender === 'female' ? '女' : '不限'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-1">{char.description}</p>
                  </div>
                  
                  {isMine && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  {isTaken && (
                    <div className="absolute top-2 right-2 text-[10px] bg-neutral-700 px-2 py-1 rounded text-neutral-300">
                      已被 {selectedBy.name} 选择
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-900/95 backdrop-blur-md border-t border-white/10">
        <div className="max-w-md mx-auto flex gap-3">
          {isHost ? (
            <button
              onClick={startGame}
              disabled={!myPlayer?.selectedCharacterId}
              className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {!myPlayer?.selectedCharacterId ? '请先选择角色' : allReady ? '开始游戏' : '强制开始 (测试)'}
            </button>
          ) : (
            <button
              onClick={toggleReady}
              disabled={!myPlayer?.selectedCharacterId}
              className={cn(
                "flex-1 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2",
                myPlayer?.isReady 
                  ? "bg-neutral-700 text-white hover:bg-neutral-600" 
                  : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {myPlayer?.isReady ? (
                <>取消准备</>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  准备就绪
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Invite Friends Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsInviteModalOpen(false)}>
          <div 
            className="w-full sm:w-[90vw] sm:max-w-md bg-neutral-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 flex flex-col border border-neutral-800 max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-500" />
                邀请好友
              </h2>
              <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 px-1 uppercase">在线好友 ({mockFriends.filter(f => f.status === '在线').length})</h3>
              <div className="space-y-2">
                {mockFriends.map(friend => {
                  const isInvited = invitedFriends.includes(friend.id);
                  return (
                    <div key={friend.id} className="bg-neutral-800/50 p-3 rounded-2xl flex items-center gap-3 border border-neutral-800">
                      <div className="relative shrink-0">
                        <img src={friend.avatar} alt={friend.name} className={cn("w-10 h-10 rounded-full object-cover", friend.status === '离线' && "grayscale")} referrerPolicy="no-referrer" />
                        <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-neutral-900 rounded-full", friend.status === '在线' ? "bg-green-500" : "bg-neutral-500")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-200 text-sm truncate">{friend.name}</h3>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                          {friend.isPlaying ? (
                            <span className="text-purple-400 font-medium">游戏中 - 剧本杀</span>
                          ) : friend.status === '在线' ? (
                            <span className="text-green-400 font-medium">在线</span>
                          ) : (
                            <span>离线</span>
                          )}
                        </p>
                      </div>
                      
                      {friend.status === '在线' && (
                        <button 
                          onClick={() => {
                            if (isInvited) return;
                            setInvitedFriends(prev => [...prev, friend.id]);
                            const toastId = Date.now();
                            setToasts(prev => [...prev, { id: toastId, message: `已向 ${friend.name} 发送邀请` }]);
                            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 3000);
                          }}
                          disabled={isInvited}
                          className={cn(
                            "shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border",
                            isInvited 
                              ? "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed" 
                              : friend.isPlaying
                                ? "bg-purple-900/30 text-purple-400 border-purple-900/50 hover:bg-purple-900/50"
                                : "bg-red-900/30 text-red-400 border-red-900/50 hover:bg-red-900/50"
                          )}
                        >
                          {isInvited ? '已邀请' : friend.isPlaying ? '强行邀请' : '邀请'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-neutral-800 text-white px-4 py-2 rounded-full shadow-lg border border-neutral-700 text-sm animate-in slide-in-from-top-4 fade-in duration-300">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
