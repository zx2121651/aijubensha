import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scripts, Clue } from '@/src/data/scripts';
import { Mic, MicOff, MessageSquare, BookOpen, Search, Settings, ChevronLeft, PhoneOff, ChevronDown, ChevronUp, ClipboardList, Volume2, VolumeX, Eye, Lock, Unlock, Zap, MapPin, User, Box, Crown, Play, Pause, Music, CheckCircle2, Edit3, Gift, Send, Clock, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { cn } from '@/lib/utils';
import PublicProfileModal from '@/src/components/PublicProfileModal';

interface RoomUser {
  id: string;
  peerId: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  status?: 'online' | 'away' | 'inactive';
}

// 游戏核心组件：负责整个剧本杀游戏环节（阅读剧本、搜证、讨论、复盘），管理实时通讯与状态
export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const script = scripts.find(s => s.id === id);
  
  const [activeTab, setActiveTab] = useState<'script' | 'clues' | 'inventory' | 'chat' | 'summary' | 'dm'>('script');
  const [expandedActs, setExpandedActs] = useState<string[]>(
    script?.acts ? [script.acts[0].id] : []
  );
  const [expandedSummary, setExpandedSummary] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clueSearchQuery, setClueSearchQuery] = useState('');
  const [clueFilterType, setClueFilterType] = useState<'all' | 'location' | 'item' | 'character'>('all');
  
  // ================== 游戏流程控制状态 ==================
  // 管理当前的进度阶段、是否房主、投票数据、倒计时等
  // Game Flow States
  const [isHost, setIsHost] = useState(false); // Toggle for testing DM mode
  const [gamePhase, setGamePhase] = useState<'reading' | 'searching' | 'discussing' | 'voting' | 'reveal'>('reading');
  const [votes, setVotes] = useState<Record<string, string>>({}); // voterId -> votedCharacterId
  const [isPlayingBGM, setIsPlayingBGM] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<any | null>(null);
  
  // ================== 线索与搜证系统 ==================
  // 控制搜证行动点数(AP)、拥有的线索、公开的线索以及搜证视图
  // Clue System States
  const [clueSubTab, setClueSubTab] = useState<'search' | 'mine' | 'public'>('search');
  const [searchMode, setSearchMode] = useState<'map' | 'list'>('map');
  const [actionPoints, setActionPoints] = useState(5);
  const [myClues, setMyClues] = useState<Clue[]>([]);
  const [publicClues, setPublicClues] = useState<Clue[]>(script?.clues?.filter(c => c.isPublic) || []);
  const [showGiftModal, setShowGiftModal] = useState<string | null>(null); // clueId
  
  // Inventory System
  const [inventory] = useState([
    { id: 'i1', name: '万能钥匙', description: '可以打开普通的锁。', icon: '🔑', count: 1 },
    { id: 'i2', name: '毒药', description: '无色无味，见血封喉。', icon: '🧪', count: 1 }
  ]);
  const [showUseItemModal, setShowUseItemModal] = useState<string | null>(null); // itemId

  // Notepad System
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isMapModeOpen, setIsMapModeOpen] = useState(false);

  // Whisper System
  const [chatRecipient, setChatRecipient] = useState<string | null>(null); // null = all
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', senderId: 'sys', senderName: '系统', text: '欢迎来到剧本杀房间！', isPrivate: false }
  ]);
  
  // 使用 useMemo 对原始剧本中的线索进行预处理，提取出不重复的可搜证目标点（如某人、某地、某物）
  // Extract unique targets from script clues
  const initialTargets = useMemo(() => {
    if (!script?.clues) return [];
    const targetsMap = new Map<string, { id: string, name: string, type: string, clues: Clue[], remaining: number }>();
    script.clues.forEach((clue, index) => {
      const [targetName] = clue.title.split(' - ');
      if (!targetsMap.has(targetName)) {
        targetsMap.set(targetName, { id: `target_${index}`, name: targetName, type: clue.type, clues: [], remaining: 0 });
      }
      const target = targetsMap.get(targetName)!;
      target.clues.push(clue);
      target.remaining += 1;
    });
    return Array.from(targetsMap.values());
  }, [script]);

  const [searchableTargets, setSearchableTargets] = useState(initialTargets);
  
  // ================== 实时通讯服务状态 ==================
  // 维护 Socket 连接、Peer 实例以及在线用户列表
  // Real-time states
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [localMutedUsers, setLocalMutedUsers] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);
  
  // Status and speaking states
  const myStatusRef = useRef<'online' | 'away' | 'inactive'>('online');
  const [speakingUsers, setSpeakingUsers] = useState<Record<string, boolean>>({});
  const speakingUsersRef = useRef<Record<string, boolean>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const analysersRef = useRef<Map<string, AnalyserNode>>(new Map());
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Volume state
  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});
  const userVolumesRef = useRef<Record<string, number>>({});

  // Media streams
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const callsRef = useRef<Map<string, MediaConnection>>(new Map());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handleVolumeChange = (peerId: string, volume: number) => {
    setUserVolumes(prev => ({ ...prev, [peerId]: volume }));
    userVolumesRef.current[peerId] = volume;
    const audioEl = audioRefs.current.get(peerId);
    if (audioEl) {
      audioEl.volume = volume;
    }
  };

  const setupAudioAnalyser = (peerId: string, stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Check if there are audio tracks
    if (stream.getAudioTracks().length === 0) return;
    
    try {
      const audioStream = new MediaStream(stream.getAudioTracks());
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analysersRef.current.set(peerId, analyser);
    } catch (e) {
      console.error('Error setting up audio analyser:', e);
    }
  };

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let inactiveTimer: NodeJS.Timeout;

    const resetTimers = () => {
      if (myStatusRef.current !== 'online') {
        myStatusRef.current = 'online';
        socket?.emit('update-status', 'online');
      }
      clearTimeout(idleTimer);
      clearTimeout(inactiveTimer);

      idleTimer = setTimeout(() => {
        myStatusRef.current = 'away';
        socket?.emit('update-status', 'away');
      }, 5 * 60 * 1000); // 5 minutes

      inactiveTimer = setTimeout(() => {
        myStatusRef.current = 'inactive';
        socket?.emit('update-status', 'inactive');
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimers));
    resetTimers();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers));
      clearTimeout(idleTimer);
      clearTimeout(inactiveTimer);
    };
  }, [socket]);

  useEffect(() => {
    const checkAudioLevels = () => {
      const newSpeakingUsers: Record<string, boolean> = {};
      let hasChanges = false;

      analysersRef.current.forEach((analyser, peerId) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const isSpeaking = average > 10; // Threshold
        
        if (speakingUsersRef.current[peerId] !== isSpeaking) {
          hasChanges = true;
        }
        newSpeakingUsers[peerId] = isSpeaking;
      });

      if (hasChanges) {
        setSpeakingUsers(newSpeakingUsers);
        speakingUsersRef.current = newSpeakingUsers;
      }

      animationFrameRef.current = requestAnimationFrame(checkAudioLevels);
    };

    animationFrameRef.current = requestAnimationFrame(checkAudioLevels);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!script) return;

    // Initialize Socket.io
    const newSocket = io();
    setSocket(newSocket);

    // Initialize PeerJS
    const newPeer = new Peer();
    setPeer(newPeer);

    const setupPeer = (stream?: MediaStream) => {
      newPeer.on('open', (peerId) => {
        // Join room via socket
        const myProfile = {
          peerId,
          name: `玩家_${Math.floor(Math.random() * 1000)}`,
          avatar: `https://picsum.photos/seed/${peerId}/32/32`
        };
        newSocket.emit('join-room', id, myProfile);
        setIsConnected(true);
      });

      // Answer incoming calls
      newPeer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          remoteStreamsRef.current.set(call.peer, remoteStream);
          playRemoteStream(call.peer, remoteStream);
        });
        callsRef.current.set(call.peer, call);
      });
    };

    // Get local audio stream
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      }, 
      video: false 
    })
      .then(stream => {
        // Mute local stream track initially
        stream.getAudioTracks().forEach(track => {
          track.enabled = false;
        });
        localStreamRef.current = stream;
        setupAudioAnalyser('local', stream);
        setupPeer(stream);
      })
      .catch(err => {
        console.error('Failed to get local stream', err);
        setStreamError('无法获取麦克风权限，您将只能收听其他玩家的语音。请确保已授予麦克风权限。');
        setupPeer(undefined);
      });

    // Socket events
    newSocket.on('room-users', (roomUsers: RoomUser[]) => {
      setUsers(roomUsers);
      // Call existing users
      if (newPeer) {
        roomUsers.forEach(user => {
          if (user.id !== newSocket.id && user.peerId) {
            // If we don't have a local stream, we can still call, but we won't send audio
            // PeerJS allows calling without a stream, but we need to pass something or omit it
            const call = localStreamRef.current 
              ? newPeer.call(user.peerId, localStreamRef.current)
              : newPeer.call(user.peerId, new MediaStream()); // Send empty stream if no local stream
              
            call.on('stream', (remoteStream) => {
              remoteStreamsRef.current.set(user.peerId, remoteStream);
              playRemoteStream(user.peerId, remoteStream);
            });
            callsRef.current.set(user.peerId, call);
          }
        });
      }
    });

    const addToast = (message: string) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    newSocket.on('user-joined', (user: RoomUser) => {
      setUsers(prev => [...prev, user]);
      addToast(`${user.name} 加入了房间`);
    });

    newSocket.on('publicize-clue', (clue: Clue) => {
      setPublicClues(prev => {
        if (!prev.some(c => c.id === clue.id)) {
          return [...prev, clue];
        }
        return prev;
      });
      addToast(`有玩家公开了新线索：【${clue.title}】`);
    });

    newSocket.on('user-left', (userId: string) => {
      setUsers(prev => {
        const user = prev.find(u => u.id === userId);
        if (user) {
          addToast(`${user.name} 离开了房间`);
          const call = callsRef.current.get(user.peerId);
          if (call) {
            call.close();
            callsRef.current.delete(user.peerId);
          }
          remoteStreamsRef.current.delete(user.peerId);
          
          const audioEl = audioRefs.current.get(user.peerId);
          if (audioEl) {
            audioEl.srcObject = null;
            audioRefs.current.delete(user.peerId);
          }
        }
        return prev.filter(u => u.id !== userId);
      });
    });

    newSocket.on('user-muted', ({ userId, isMuted }: { userId: string, isMuted: boolean }) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isMuted } : u));
    });

    newSocket.on('user-status-changed', ({ userId, status }: { userId: string, status: 'online' | 'away' | 'inactive' }) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      callsRef.current.forEach(call => call.close());
      newPeer.destroy();
      newSocket.disconnect();
    };
  }, [id, script]);

  // Timer effect
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(t => t! - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (searchQuery.trim() && script?.acts) {
      const query = searchQuery.toLowerCase();
      const matchingActs = script.acts.filter(act => 
        act.title.toLowerCase().includes(query) ||
        act.content.some(p => p.toLowerCase().includes(query)) ||
        act.tasks?.some(t => t.toLowerCase().includes(query))
      ).map(a => a.id);
      
      if (matchingActs.length > 0) {
        setExpandedActs(prev => Array.from(new Set([...prev, ...matchingActs])));
      }
    }
  }, [searchQuery, script]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-red-500/50 text-white rounded px-0.5">{part}</span> 
        : part
    );
  };

  const playRemoteStream = (peerId: string, stream: MediaStream) => {
    // Create audio element if it doesn't exist
    if (!audioRefs.current.has(peerId)) {
      const audio = new Audio();
      audio.autoplay = true;
      audio.volume = userVolumesRef.current[peerId] ?? 1;
      audioRefs.current.set(peerId, audio);
    }
    const audioEl = audioRefs.current.get(peerId)!;
    audioEl.srcObject = stream;
    setupAudioAnalyser(peerId, stream);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted; // If currently muted, enable it
        setIsMuted(!isMuted);
        if (socket) {
          socket.emit('toggle-mute', !isMuted);
        }
      }
    }
  };

  const leaveRoom = () => {
    navigate(-1);
  };

  const toggleAct = (actId: string) => {
    setExpandedActs(prev => 
      prev.includes(actId) 
        ? prev.filter(id => id !== actId)
        : [...prev, actId]
    );
  };

  const toggleSummarySection = (section: string) => {
    setExpandedSummary(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSearch = (targetId: string) => {
    if (actionPoints <= 0) {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message: '行动点不足！' }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
      return;
    }

    setSearchableTargets(prev => prev.map(target => {
      if (target.id === targetId && target.remaining > 0) {
        const unsearchedClues = target.clues.filter(c => !myClues.some(mc => mc.id === c.id) && !publicClues.some(pc => pc.id === c.id));
        
        if (unsearchedClues.length > 0) {
          const randomClue = unsearchedClues[Math.floor(Math.random() * unsearchedClues.length)];
          setMyClues(prevClues => [...prevClues, { ...randomClue, isPublic: false }]);
          setActionPoints(prevAP => prevAP - 1);
          
          const id = Date.now() + Math.random();
          setToasts(prev => [...prev, { id, message: `搜证成功：获得线索【${randomClue.title}】` }]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
          
          return { ...target, remaining: target.remaining - 1 };
        }
      }
      return target;
    }));
  };

  const handleMakePublic = (clueId: string) => {
    const clueToPublicize = myClues.find(c => c.id === clueId);
    if (!clueToPublicize) return;

    setMyClues(prev => prev.filter(c => c.id !== clueId));
    const publicClue = { ...clueToPublicize, isPublic: true };
    setPublicClues(prev => [...prev, publicClue]);
    
    socket?.emit('publicize-clue', publicClue);
    
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: `已公开线索：【${clueToPublicize.title}】` }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleGiftClue = (targetUserId: string) => {
    if (!showGiftModal) return;
    const clueToGift = myClues.find(c => c.id === showGiftModal);
    if (!clueToGift) return;

    setMyClues(prev => prev.filter(c => c.id !== showGiftModal));
    // In a real app, emit socket event to send to specific user
    
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: `已将线索【${clueToGift.title}】赠送给玩家` }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    setShowGiftModal(null);
  };

  const handleUseItem = (targetId: string) => {
    if (!showUseItemModal) return;
    const item = inventory.find(i => i.id === showUseItemModal);
    if (!item) return;

    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message: `对目标使用了【${item.name}】` }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    setShowUseItemModal(null);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: socket?.id || 'local',
      senderName: '我',
      text: chatInput,
      isPrivate: chatRecipient !== null,
      recipientId: chatRecipient
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    // In a real app, emit to socket
  };

  const currentCluesList = clueSubTab === 'mine' ? myClues : publicClues;
  const filteredClues = currentCluesList.filter(clue => {
    const matchesSearch = clue.title.toLowerCase().includes(clueSearchQuery.toLowerCase()) || 
                          clue.description.toLowerCase().includes(clueSearchQuery.toLowerCase());
    const matchesType = clueFilterType === 'all' || clue.type === clueFilterType;
    return matchesSearch && matchesType;
  }) || [];

  if (!script) return <div>剧本未找到</div>;

  return (
    <div className="h-screen bg-neutral-900 text-white flex flex-col font-sans overflow-hidden">
      {/* Toast Notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-neutral-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 text-center border border-neutral-700">
            {toast.message}
          </div>
        ))}
      </div>

      {/* Game Header */}
      <header className="bg-neutral-950 px-4 py-3 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button onClick={leaveRoom} className="text-neutral-400 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-sm">{script.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] flex items-center gap-1 text-green-400">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></span>
                {isConnected ? '已连接' : '连接中...'}
              </span>
              <span className="text-[10px] text-neutral-500">|</span>
              <span className="text-[10px] font-bold text-red-400">
                {gamePhase === 'reading' ? '阅读阶段' : 
                 gamePhase === 'searching' ? '搜证阶段' : 
                 gamePhase === 'discussing' ? '集中讨论' : 
                 gamePhase === 'voting' ? '指凶投票' : '真相复盘'}
              </span>
              {timeLeft !== null && (
                <>
                  <span className="text-[10px] text-neutral-500">|</span>
                  <span className={cn("text-[10px] font-bold flex items-center gap-0.5", timeLeft <= 60 && timeLeft > 0 ? "text-red-500 animate-pulse" : "text-blue-400")}>
                    <Clock className="w-3 h-3" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isHost && (
            <button 
              onClick={() => {
                const id = Date.now() + Math.random();
                setToasts(prev => [...prev, { id, message: `小黑屋模式已开启，仅被选中的玩家可互相听见` }]);
                setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
              }}
              className="px-2 py-1 text-[10px] rounded border bg-purple-500/20 text-purple-400 border-purple-500/50 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> 小黑屋
            </button>
          )}
          <button 
            onClick={() => setIsHost(!isHost)}
            className={cn("px-2 py-1 text-[10px] rounded border", isHost ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" : "text-neutral-500 border-neutral-700")}
          >
            测试DM
          </button>
          <button 
            onClick={toggleMute} 
            className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button onClick={leaveRoom} className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Players Bar */}
      <div className="bg-neutral-950/50 p-4 flex gap-4 overflow-x-auto scrollbar-hide border-b border-neutral-800">
        {users.map((user) => {
          const isMe = user.id === socket?.id;
          const isSpeaking = isMe ? speakingUsers['local'] && !isMuted : speakingUsers[user.peerId] && !user.isMuted;
          const status = isMe ? myStatusRef.current : (user.status || 'online');
          const volume = userVolumes[user.peerId] ?? 1;
          
          return (
            <div key={user.id} className="flex flex-col items-center gap-2 min-w-[70px] group relative">
              {/* Avatar with Speaking Ring */}
              <div 
                className={cn(
                  "relative w-14 h-14 rounded-full p-0.5 transition-all duration-300 cursor-pointer",
                  isSpeaking && !localMutedUsers[user.id]
                    ? "ring-4 ring-green-500 ring-offset-2 ring-offset-neutral-900 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                    : "ring-2 ring-neutral-700",
                  (status === 'inactive' || localMutedUsers[user.id]) && "opacity-40 grayscale"
                )}
                onClick={() => setSelectedProfileUser({
                  id: user.id,
                  name: user.name,
                  avatar: user.avatar,
                  level: Math.floor(Math.random() * 20) + 1,
                  bio: '剧本杀重度爱好者，推理机器。',
                  stats: { gamesPlayed: Math.floor(Math.random() * 100) + 10, mvpCount: Math.floor(Math.random() * 20), winRate: `${Math.floor(Math.random() * 40) + 40}%` },
                  favoriteRoles: ['凶手', '侦探', '边缘位']
                })}
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover border-2 border-neutral-900" 
                  referrerPolicy="no-referrer" 
                />
                
                {/* Status Indicators Overlay */}
                <div className="absolute -bottom-1 -right-1 flex flex-col gap-0.5">
                  {localMutedUsers[user.id] ? (
                    <div className="bg-neutral-700 rounded-full p-1 shadow-lg border border-neutral-900 animate-in zoom-in duration-200">
                      <VolumeX className="w-2.5 h-2.5 text-white" />
                    </div>
                  ) : user.isMuted ? (
                    <div className="bg-red-600 rounded-full p-1 shadow-lg border border-neutral-900 animate-in zoom-in duration-200">
                      <MicOff className="w-2.5 h-2.5 text-white" />
                    </div>
                  ) : (
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full border-2 border-neutral-900 shadow-lg animate-in zoom-in duration-200",
                      status === 'online' ? "bg-green-500" : 
                      status === 'away' ? "bg-yellow-500" : "bg-neutral-500"
                    )} />
                  )}
                </div>

                {/* Speaking Waveform Animation */}
                {isSpeaking && !localMutedUsers[user.id] && (
                  <div className="absolute -inset-1 rounded-full border border-green-500/50 animate-ping pointer-events-none" />
                )}
              </div>
              
              {/* Name and Status Label */}
              <div className="flex flex-col items-center w-full">
                <span className={cn(
                  "text-[10px] font-bold truncate w-full text-center transition-colors",
                  isSpeaking && !localMutedUsers[user.id] ? "text-green-400" : "text-neutral-200"
                )}>
                  {isMe ? '我' : user.name}
                </span>
                
                <span className={cn(
                  "text-[8px] uppercase tracking-tighter font-medium",
                  localMutedUsers[user.id] ? "text-red-500" :
                  user.isMuted ? "text-red-500" : 
                  isSpeaking ? "text-green-500 animate-pulse" : "text-neutral-500"
                )}>
                  {localMutedUsers[user.id] ? '已屏蔽' : user.isMuted ? '已静音' : isSpeaking ? '正在发言' : (status === 'away' ? '离开' : (status === 'inactive' ? '不活跃' : '在线'))}
                </span>
              </div>

              {/* Volume Control Popover (Remote Users Only) */}
              {!isMe && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-neutral-800 px-3 py-2 rounded-xl shadow-2xl border border-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-20 scale-90 group-hover:scale-100 flex flex-col gap-2">
                  <div className="flex items-center gap-3 min-w-[100px]">
                    {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-neutral-500" /> : <Volume2 className="w-3.5 h-3.5 text-red-500" />}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(user.peerId, parseFloat(e.target.value))}
                      className="flex-1 h-1.5 accent-red-500 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-neutral-400 w-6 text-right font-mono">
                      {Math.round(volume * 100)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setLocalMutedUsers(prev => ({ ...prev, [user.id]: !prev[user.id] }));
                      const id = Date.now();
                      setToasts(prev => [...prev, { id, message: !localMutedUsers[user.id] ? `已屏蔽 ${user.name} 的语音` : `已恢复 ${user.name} 的语音` }]);
                      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                    }}
                    className={cn(
                      "w-full py-1 text-[10px] font-bold rounded transition-colors",
                      localMutedUsers[user.id] ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                    )}
                  >
                    {localMutedUsers[user.id] ? '解除屏蔽' : '屏蔽语音'}
                  </button>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 border-r border-b border-neutral-700 rotate-45" />
                </div>
              )}
            </div>
          )})}
        {users.length === 0 && (
          <div className="text-xs text-neutral-500 py-4 w-full text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-neutral-700 border-t-red-500 rounded-full animate-spin" />
            正在加入语音房间...
          </div>
        )}
      </div>

      {streamError && (
        <div className="bg-red-900/50 text-red-200 text-xs px-4 py-2 flex items-center justify-between border-b border-red-800/50">
          <span>{streamError}</span>
          <button onClick={() => setStreamError(null)} className="text-red-400 hover:text-red-200">
            &times;
          </button>
        </div>
      )}

      {/* Notepad Modal */}
      {isNotepadOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsNotepadOpen(false)}>
          <div 
            className="w-full sm:max-w-md h-[80vh] sm:h-[600px] bg-neutral-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 flex flex-col border border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">草稿本</h2>
              </div>
              <button onClick={() => setIsNotepadOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 bg-neutral-950">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="在这里记录你的推理、时间线、可疑人物..."
                className="w-full h-full bg-transparent text-neutral-200 placeholder:text-neutral-600 resize-none outline-none text-sm leading-relaxed"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {/* Tab Navigation */}
        <div className="flex bg-neutral-900 border-b border-neutral-800 overflow-x-auto scrollbar-hide">
          <button 
            className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'script' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('script')}
          >
            <BookOpen className="w-4 h-4" />剧本
          </button>
          <button 
            className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'clues' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('clues')}
          >
            <Search className="w-4 h-4" />线索
          </button>
          <button 
            className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'inventory' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Box className="w-4 h-4" />背包
          </button>
          <button 
            className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'summary' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('summary')}
          >
            <ClipboardList className="w-4 h-4" />复盘
          </button>
          <button 
            className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-400'}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="w-4 h-4" />公聊
          </button>
          {isHost && (
            <button 
              className={`flex-none px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'dm' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-yellow-700'}`}
              onClick={() => setActiveTab('dm')}
            >
              <Crown className="w-4 h-4" />DM控制台
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-900">
          <div className={cn("space-y-6 pb-6", activeTab === 'script' ? "block" : "hidden")}>
            {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="在剧本中搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-red-500 border border-neutral-700"
                />
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Synopsis */}
              <div className="bg-neutral-800/30 p-5 rounded-2xl border border-neutral-800">
                <h2 className="text-lg font-bold text-neutral-100 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  剧本简介
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed text-justify indent-6">
                  {highlightText(script.description, searchQuery)}
                </p>
              </div>

              {/* Acts */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-400 px-1">剧本章节</h3>
                {script.acts ? script.acts.map((act) => {
                  const isExpanded = expandedActs.includes(act.id);
                  return (
                    <div key={act.id} className="bg-neutral-800/50 rounded-2xl border border-neutral-700 overflow-hidden transition-all">
                      <button 
                        onClick={() => toggleAct(act.id)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700/80 transition-colors"
                      >
                        <span className="font-bold text-neutral-100">{highlightText(act.title, searchQuery)}</span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                      </button>
                      
                      <div className={cn(
                        "p-5 border-t border-neutral-700/50",
                        isExpanded ? "block animate-in slide-in-from-top-2 duration-200" : "hidden"
                      )}>
                        <div className="space-y-4">
                          {act.content.map((paragraph, i) => (
                            <p key={i} className="text-sm text-neutral-300 leading-relaxed text-justify indent-6">
                              {highlightText(paragraph, searchQuery)}
                            </p>
                          ))}
                        </div>
                        
                        {act.tasks && act.tasks.length > 0 && (
                          <div className="mt-6 bg-red-950/20 p-4 rounded-xl border border-red-900/30">
                            <h4 className="text-red-400 font-bold mb-3 text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              本幕任务
                            </h4>
                            <ul className="list-disc list-inside text-sm text-neutral-300 space-y-2">
                              {act.tasks.map((task, i) => (
                                <li key={i}>{highlightText(task, searchQuery)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-neutral-500 text-sm">
                    暂无章节内容
                  </div>
                )}
              </div>
          </div>

          <div className={cn("flex-col gap-4 pb-6", activeTab === 'clues' ? "flex" : "hidden")}>
            {/* Clue Sub-tabs & AP */}
            <div className="flex items-center justify-between bg-neutral-800/50 p-1.5 rounded-xl border border-neutral-700/50">
              <div className="flex gap-1 flex-1">
                <button
                  onClick={() => setClueSubTab('search')}
                  className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors", clueSubTab === 'search' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200")}
                >
                  搜证
                </button>
                <button
                  onClick={() => setClueSubTab('mine')}
                  className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors relative", clueSubTab === 'mine' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200")}
                >
                  我的
                  {myClues.length > 0 && (
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => setClueSubTab('public')}
                  className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors", clueSubTab === 'public' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200")}
                >
                  公开
                </button>
              </div>
              <div className="ml-3 px-3 py-1.5 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs font-bold text-red-100">AP: {actionPoints}</span>
              </div>
            </div>

            {clueSubTab === 'search' ? (
              <div className="space-y-4">
                <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-neutral-400">消耗行动点 (AP) 对地点或人物进行搜证，获取关键线索。</p>
                    <button 
                      onClick={() => setIsMapModeOpen(true)}
                      className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-950/30 px-2 py-1 rounded-lg border border-red-900/50"
                    >
                      <MapPin className="w-3 h-3" />
                      地图模式
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {searchableTargets.map(target => (
                      <button
                        key={target.id}
                        onClick={() => handleSearch(target.id)}
                        disabled={target.remaining === 0 || actionPoints <= 0}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                          target.remaining > 0 && actionPoints > 0
                            ? "bg-neutral-800 border-neutral-700 hover:border-red-500/50 hover:bg-neutral-700 cursor-pointer"
                            : "bg-neutral-900/50 border-neutral-800 opacity-50 cursor-not-allowed"
                        )}
                      >
                        {target.type === 'location' ? <MapPin className="w-6 h-6 text-blue-400 mb-2" /> :
                         target.type === 'character' ? <User className="w-6 h-6 text-purple-400 mb-2" /> :
                         <Box className="w-6 h-6 text-yellow-400 mb-2" />}
                        <span className="text-sm font-bold text-neutral-200">{target.name}</span>
                        <span className="text-[10px] text-neutral-500 mt-1">剩余线索: {target.remaining}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search and Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索线索..."
                      value={clueSearchQuery}
                      onChange={(e) => setClueSearchQuery(e.target.value)}
                      className="w-full bg-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-red-500 border border-neutral-700"
                    />
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <button
                      onClick={() => setClueFilterType('all')}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", clueFilterType === 'all' ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700")}
                    >
                      全部
                    </button>
                    <button
                      onClick={() => setClueFilterType('location')}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", clueFilterType === 'location' ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700")}
                    >
                      地点
                    </button>
                    <button
                      onClick={() => setClueFilterType('item')}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", clueFilterType === 'item' ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700")}
                    >
                      物品
                    </button>
                    <button
                      onClick={() => setClueFilterType('character')}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", clueFilterType === 'character' ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700")}
                    >
                      人物
                    </button>
                  </div>
                </div>

                {/* Clues Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {filteredClues.length > 0 ? filteredClues.map(clue => (
                    <div key={clue.id} className="bg-neutral-800 rounded-xl p-3 border border-neutral-700 flex flex-col group">
                      <div className="aspect-square bg-neutral-900 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                        <Search className="w-8 h-8 text-neutral-600" />
                        {!clue.isPublic ? (
                          <div className="absolute top-1 right-1 bg-red-900/80 text-red-200 text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-2 h-2" /> 私密
                          </div>
                        ) : (
                          <div className="absolute top-1 right-1 bg-green-900/80 text-green-200 text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Unlock className="w-2 h-2" /> 公开
                          </div>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-neutral-200 line-clamp-1">{highlightText(clue.title, clueSearchQuery)}</h4>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 flex-1">{highlightText(clue.description, clueSearchQuery)}</p>
                      
                      {clueSubTab === 'mine' && !clue.isPublic && (
                        <div className="mt-2 flex gap-2">
                          <button 
                            onClick={() => handleMakePublic(clue.id)}
                            className="flex-1 py-1.5 bg-neutral-700 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            公开
                          </button>
                          <button 
                            onClick={() => setShowGiftModal(clue.id)}
                            className="flex-1 py-1.5 bg-neutral-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Gift className="w-3 h-3" />
                            赠送
                          </button>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-8 text-neutral-500 text-sm">
                      {clueSubTab === 'mine' ? '你还没有搜集到任何线索，快去搜证吧！' : '目前还没有公开的线索'}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className={cn("space-y-4 pb-6", activeTab === 'inventory' ? "block" : "hidden")}>
            <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800">
              <p className="text-xs text-neutral-400 mb-3">使用道具可以改变游戏进程或获取额外信息。</p>
              <div className="grid grid-cols-1 gap-3">
                {inventory.map(item => (
                  <div key={item.id} className="bg-neutral-800 rounded-xl p-3 border border-neutral-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-neutral-200">{item.name}</h4>
                        <span className="text-xs text-neutral-500">x{item.count}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => setShowUseItemModal(item.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      使用
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={cn("space-y-4 pb-6", activeTab === 'summary' ? "block" : "hidden")}>
            <h2 className="text-lg font-bold text-neutral-100 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-red-500" />
                案件复盘
              </h2>

              {/* Plot Points */}
              <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 overflow-hidden transition-all">
                <button
                  onClick={() => toggleSummarySection('plot')}
                  className="w-full px-5 py-4 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700/80 transition-colors"
                >
                  <span className="font-bold text-neutral-100">关键剧情点</span>
                  {expandedSummary.includes('plot') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </button>
                <div className={cn(
                  "p-5 border-t border-neutral-700/50",
                  expandedSummary.includes('plot') ? "block animate-in slide-in-from-top-2 duration-200" : "hidden"
                )}>
                  <ul className="list-disc list-inside text-sm text-neutral-300 space-y-2">
                    {script.summary?.plotPoints ? (
                      script.summary.plotPoints.map((point, i) => <li key={i}>{point}</li>)
                    ) : (
                      <li className="text-neutral-500 list-none text-center">暂无剧情点记录</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Relationships */}
              <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 overflow-hidden transition-all">
                <button
                  onClick={() => toggleSummarySection('relationships')}
                  className="w-full px-5 py-4 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700/80 transition-colors"
                >
                  <span className="font-bold text-neutral-100">人物关系</span>
                  {expandedSummary.includes('relationships') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </button>
                <div className={cn(
                  "p-5 border-t border-neutral-700/50",
                  expandedSummary.includes('relationships') ? "block animate-in slide-in-from-top-2 duration-200" : "hidden"
                )}>
                  <div className="space-y-3">
                    {script.summary?.relationships ? (
                      script.summary.relationships.map((rel, i) => (
                        <div key={i} className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                          <span className="text-red-400 font-bold mr-2">{rel.character}:</span>
                          <span className="text-sm text-neutral-300">{rel.relation}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-neutral-500 text-center text-sm">暂无人物关系记录</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700 overflow-hidden transition-all">
                <button
                  onClick={() => toggleSummarySection('evidence')}
                  className="w-full px-5 py-4 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700/80 transition-colors"
                >
                  <span className="font-bold text-neutral-100">已搜集证据</span>
                  {expandedSummary.includes('evidence') ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </button>
                <div className={cn(
                  "p-5 border-t border-neutral-700/50",
                  expandedSummary.includes('evidence') ? "block animate-in slide-in-from-top-2 duration-200" : "hidden"
                )}>
                  <ul className="list-disc list-inside text-sm text-neutral-300 space-y-2">
                    {script.summary?.evidence ? (
                      script.summary.evidence.map((ev, i) => <li key={i}>{ev}</li>)
                    ) : (
                      <li className="text-neutral-500 list-none text-center">暂无证据记录</li>
                    )}
                  </ul>
                </div>
              </div>
          </div>

          <div className={cn("flex-col h-full", activeTab === 'chat' ? "flex" : "hidden")}>
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2">
                {chatMessages.map(msg => {
                  const isMe = msg.senderId === (socket?.id || 'local');
                  return (
                    <div key={msg.id} className={cn("flex gap-3", isMe ? "flex-row-reverse" : "")}>
                      <img 
                        src={`https://picsum.photos/seed/${msg.senderId}/32/32`} 
                        className="w-8 h-8 rounded-full shrink-0 cursor-pointer" 
                        alt="avatar" 
                        onClick={() => setSelectedProfileUser({
                          id: msg.senderId,
                          name: msg.senderName,
                          avatar: `https://picsum.photos/seed/${msg.senderId}/150/150`,
                          level: Math.floor(Math.random() * 20) + 1,
                          bio: '剧本杀重度爱好者，推理机器。',
                          stats: { gamesPlayed: Math.floor(Math.random() * 100) + 10, mvpCount: Math.floor(Math.random() * 20), winRate: `${Math.floor(Math.random() * 40) + 40}%` },
                          favoriteRoles: ['凶手', '侦探', '边缘位']
                        })}
                      />
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <div className={cn("flex items-center gap-2", isMe ? "flex-row-reverse" : "")}>
                          <span className="text-[10px] text-neutral-500">{msg.senderName}</span>
                          {msg.isPrivate && <span className="text-[10px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">私聊</span>}
                        </div>
                        <div className={cn(
                          "p-3 text-sm",
                          isMe 
                            ? (msg.isPrivate ? "bg-purple-600 text-white rounded-2xl rounded-tr-none" : "bg-red-600 text-white rounded-2xl rounded-tr-none")
                            : (msg.isPrivate ? "bg-purple-900/40 text-purple-100 rounded-2xl rounded-tl-none border border-purple-800/50" : "bg-neutral-800 text-neutral-200 rounded-2xl rounded-tl-none")
                        )}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  <button
                    onClick={() => setChatRecipient(null)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", chatRecipient === null ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400")}
                  >
                    所有人
                  </button>
                  {users.filter(u => u.id !== socket?.id).map(u => (
                    <button
                      key={u.id}
                      onClick={() => setChatRecipient(u.id)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors", chatRecipient === u.id ? "bg-purple-600 text-white" : "bg-neutral-800 text-neutral-400")}
                    >
                      私聊: {u.name}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={chatRecipient ? "发送私聊消息..." : "发送公共消息..."} 
                    className={cn(
                      "w-full rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 transition-colors",
                      chatRecipient ? "bg-purple-900/20 border border-purple-800/50 focus:ring-purple-500 text-purple-100" : "bg-neutral-800 border border-neutral-700 focus:ring-red-500 text-neutral-200"
                    )}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors",
                      chatRecipient ? "bg-purple-600 hover:bg-purple-700" : "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
          </div>

          <div className={cn("space-y-6 pb-6", activeTab === 'dm' ? "block" : "hidden")}>
            <h2 className="text-lg font-bold text-neutral-100 mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              DM 控制台
            </h2>

            {/* Phase Control */}
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-300 mb-3">游戏阶段控制</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'reading', label: '阅读阶段' },
                  { id: 'searching', label: '搜证阶段' },
                  { id: 'discussing', label: '集中讨论' },
                  { id: 'voting', label: '指凶投票' },
                  { id: 'reveal', label: '真相复盘' }
                ].map(phase => (
                  <button
                    key={phase.id}
                    onClick={() => {
                      setGamePhase(phase.id as any);
                      socket?.emit('change-phase', phase.id);
                      const id = Date.now() + Math.random();
                      setToasts(prev => [...prev, { id, message: `已切换至：${phase.label}` }]);
                      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                    }}
                    className={cn(
                      "py-2 px-3 rounded-xl text-sm font-medium transition-colors",
                      gamePhase === phase.id ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                    )}
                  >
                    {phase.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Secret Room Control */}
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                小黑屋管理 (局部语音)
              </h3>
              <p className="text-xs text-neutral-400 mb-4">选择玩家拉入小黑屋，仅被选中的玩家可以互相听见语音。</p>
              <div className="space-y-2 mb-4">
                {users.filter(u => u.id !== socket?.id).map(u => (
                  <label key={u.id} className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-neutral-800 cursor-pointer hover:border-purple-500/50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-700 text-purple-600 focus:ring-purple-500 bg-neutral-800" />
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-bold text-neutral-200">{u.name}</span>
                  </label>
                ))}
              </div>
              <button 
                onClick={() => {
                  const id = Date.now() + Math.random();
                  setToasts(prev => [...prev, { id, message: `已开启小黑屋` }]);
                  setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                开启小黑屋
              </button>
            </div>

            {/* Timer Control */}
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                阶段倒计时
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTimeLeft(prev => (prev || 0) + 300)} 
                  className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  +5分钟
                </button>
                <button 
                  onClick={() => setTimeLeft(prev => (prev || 0) + 600)} 
                  className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  +10分钟
                </button>
                <button 
                  onClick={() => setTimeLeft(0)} 
                  className="flex-1 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-xl text-sm font-bold transition-colors"
                >
                  清零
                </button>
              </div>
            </div>

            {/* Music Control */}
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Music className="w-4 h-4 text-blue-400" />
                背景音乐
              </h3>
              <div className="flex items-center justify-between bg-neutral-900 p-3 rounded-xl">
                <span className="text-sm text-neutral-400">悬疑背景音.mp3</span>
                <button 
                  onClick={() => setIsPlayingBGM(!isPlayingBGM)}
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors"
                >
                  {isPlayingBGM ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* AP Control */}
            <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                行动点发放
              </h3>
              <button 
                onClick={() => {
                  socket?.emit('give-ap', 2);
                  setActionPoints(prev => prev + 2); // Also give to self for testing
                  const id = Date.now() + Math.random();
                  setToasts(prev => [...prev, { id, message: `已向全员发放 2 点 AP` }]);
                  setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
                }}
                className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                全员发放 2 AP
              </button>
            </div>
          </div>
        </div>

        {/* Voting Overlay */}
        {gamePhase === 'voting' && (
          <div className="absolute inset-0 z-40 bg-neutral-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-red-500 mb-2">指凶投票</h2>
            <p className="text-neutral-400 text-sm mb-8 text-center">请根据线索和讨论，选出你认为的真凶。</p>
            
            <div className="w-full max-w-md space-y-3 mb-8">
              {script.characters?.map(char => {
                const isSelected = votes['local'] === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => setVotes(prev => ({ ...prev, local: char.id }))}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
                      isSelected ? "bg-red-900/30 border-red-500" : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                    )}
                  >
                    <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-neutral-100">{char.name}</h3>
                      <p className="text-xs text-neutral-400">{char.description.substring(0, 20)}...</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-red-500" />}
                  </button>
                );
              })}
            </div>
            
            <button 
              disabled={!votes['local']}
              className="w-full max-w-md py-4 bg-red-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-2xl transition-colors"
              onClick={() => {
                const id = Date.now() + Math.random();
                setToasts(prev => [...prev, { id, message: `投票成功！等待其他玩家...` }]);
                setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
              }}
            >
              {votes['local'] ? '确认投票' : '请选择一名嫌疑人'}
            </button>

            {votes['local'] && (
              <button 
                onClick={() => navigate(`/result/${id}?tab=truth`)}
                className="w-full max-w-md mt-4 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-colors border border-neutral-700"
              >
                查看剧本复盘
              </button>
            )}
          </div>
        )}

        {/* Reveal Overlay */}
        {gamePhase === 'reveal' && (
          <div className="absolute inset-0 z-40 bg-neutral-900/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto animate-in fade-in duration-300">
            <div className="max-w-2xl mx-auto w-full py-8">
              <h2 className="text-3xl font-bold text-red-500 mb-6 text-center">真相大白</h2>
              
              <div className="bg-neutral-800/50 p-6 rounded-3xl border border-neutral-700 mb-8">
                <h3 className="text-xl font-bold text-neutral-100 mb-4">案件复盘</h3>
                <div className="space-y-4 text-neutral-300 leading-relaxed text-justify">
                  <p>其实，真正的凶手就是——<span className="text-red-400 font-bold text-lg">林少爷</span>。</p>
                  <p>当年林老爷为了夺取家产，害死了林少爷的生母。林少爷隐忍多年，终于在今晚找到了机会。他利用书房的密道，在停电的瞬间完成了作案，并将凶器藏在了后院的枯井中。</p>
                  <p>而管家虽然也心怀鬼胎，但他只是偷走了账本，并未杀人。丫鬟小翠则是无意中目睹了林少爷的行动，因此一直神色慌张。</p>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/result/${id}?tab=truth`)}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors"
              >
                查看剧本复盘
              </button>
            </div>
          </div>
        )}
      </main>
      {/* Notepad FAB */}
      <button 
        onClick={() => setIsNotepadOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-neutral-800 text-neutral-300 rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-700 hover:text-white transition-colors z-40 border border-neutral-700"
      >
        <Edit3 className="w-5 h-5" />
      </button>

      {/* Notepad Drawer/Modal */}
      {isNotepadOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-neutral-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-neutral-800">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <h3 className="font-bold text-neutral-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-red-500" />
                玩家笔记
              </h3>
              <button onClick={() => setIsNotepadOpen(false)} className="text-neutral-500 hover:text-white p-2">
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="在这里记录时间线、嫌疑人动机、疑点..."
                className="w-full h-full bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Mode Modal */}
      {isMapModeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMapModeOpen(false)}>
          <div 
            className="w-[90vw] max-w-4xl h-[80vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col border border-neutral-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">地图搜证模式</h2>
                <div className="ml-4 px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-lg flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-bold text-red-100">AP: {actionPoints}</span>
                </div>
              </div>
              <button onClick={() => setIsMapModeOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative bg-neutral-950 overflow-hidden">
              {/* Mock Map Image */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover bg-center mix-blend-luminosity"></div>
              
              {/* Interactive Map Points */}
              <div className="absolute inset-0 p-8">
                <div className="relative w-full h-full border-2 border-dashed border-neutral-800 rounded-2xl">
                  {searchableTargets.map((target, index) => {
                    // Generate pseudo-random positions based on index
                    const top = `${20 + (index * 37) % 60}%`;
                    const left = `${15 + (index * 43) % 70}%`;
                    
                    return (
                      <button
                        key={target.id}
                        onClick={() => {
                          handleSearch(target.id);
                          if (target.remaining === 1) {
                            // If this was the last clue, maybe close map or show toast
                          }
                        }}
                        disabled={target.remaining === 0 || actionPoints <= 0}
                        className={cn(
                          "absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 transition-all group",
                          target.remaining > 0 && actionPoints > 0 ? "cursor-pointer hover:scale-110 hover:z-10" : "opacity-50 cursor-not-allowed"
                        )}
                        style={{ top, left }}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 transition-colors",
                          target.remaining > 0 && actionPoints > 0 ? "bg-neutral-900 border-red-500 text-red-400 group-hover:bg-red-950" : "bg-neutral-900 border-neutral-700 text-neutral-600"
                        )}>
                          {target.type === 'location' ? <MapPin className="w-6 h-6" /> :
                           target.type === 'character' ? <User className="w-6 h-6" /> :
                           <Box className="w-6 h-6" />}
                        </div>
                        <div className="bg-neutral-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-800 shadow-lg text-center">
                          <div className="text-sm font-bold text-white whitespace-nowrap">{target.name}</div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">剩余: {target.remaining}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gift Clue Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-800 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-100 mb-2 text-center">赠送线索</h3>
              <p className="text-xs text-neutral-400 text-center mb-6">选择你要将线索赠送给哪位玩家</p>
              
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {users.filter(u => u.id !== socket?.id).map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleGiftClue(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors text-left"
                  >
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <span className="font-bold text-neutral-200">{user.name}</span>
                  </button>
                ))}
                {users.length <= 1 && (
                  <div className="text-center text-neutral-500 text-sm py-4">房间内没有其他玩家</div>
                )}
              </div>
            </div>
            <div className="p-4 bg-neutral-950 border-t border-neutral-800">
              <button 
                onClick={() => setShowGiftModal(null)}
                className="w-full py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Item Modal */}
      {showUseItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-800 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-100 mb-2 text-center">使用道具</h3>
              <p className="text-xs text-neutral-400 text-center mb-6">选择你要对谁使用该道具</p>
              
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                {users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUseItem(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-800 hover:bg-red-900/30 hover:border-red-900/50 border border-neutral-700 transition-colors text-left"
                  >
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <span className="font-bold text-neutral-200">{user.id === socket?.id ? '自己' : user.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-neutral-950 border-t border-neutral-800">
              <button 
                onClick={() => setShowUseItemModal(null)}
                className="w-full py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <PublicProfileModal 
        isOpen={!!selectedProfileUser} 
        onClose={() => setSelectedProfileUser(null)} 
        user={selectedProfileUser} 
      />
    </div>
  );
}
