import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getScriptDetail, getScriptReviews, createRoom } from '@/src/api/room';
import { buyScript, getWalletBalance } from '@/src/api/user';
import { scripts } from '@/src/data/scripts';
import { ArrowLeft, Star, Clock, Users, Share2, Heart, Play, MessageSquare, Video, Download, Sparkles, X, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenAI } from '@google/genai';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'motion/react';
import RoomLobbyModal from '@/src/components/RoomLobbyModal';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

declare const process: any;

export default function ScriptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [script, setScript] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false); // 假设返回状态里包含或根据订单推断

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  // Room Creation Form State
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const [resDetail, resReviews] = await Promise.all([
          getScriptDetail(id as string),
          getScriptReviews(id as string).catch(() => ({ data: [] }))
        ]);
        setScript(resDetail.data);
        setReviews(resReviews.data || []);
        // mock purchased status for now if price is 0
        if (resDetail.data.price === 0) setHasPurchased(true);
      } catch (err) {
        console.error('Failed to load script', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchBalance = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id && isBuyModalOpen) {
        try {
          const res = await getWalletBalance(user.id);
          setBalance(res.data.balance || 0);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchBalance();
  }, [isBuyModalOpen]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState(false);

  // Load favorite status from localStorage
  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`favorite_${id}`);
      setIsFavorited(saved === 'true');
    }
  }, [id]);

  // Share Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Mock Friends Data
  const mockFriends = [
    { id: 'f1', name: '推理大师_小王', avatar: 'https://picsum.photos/seed/f1/100/100', status: 'online' },
    { id: 'f2', name: '情感本天后', avatar: 'https://picsum.photos/seed/f2/100/100', status: 'offline' },
    { id: 'f3', name: '菠萝头老李', avatar: 'https://picsum.photos/seed/f3/100/100', status: 'online' },
    { id: 'f4', name: '戏精本精', avatar: 'https://picsum.photos/seed/f4/100/100', status: 'playing' },
  ];

  // Video Generation States
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // AI Summary States
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Image Viewer States
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Tutorial Video State
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  if (!script) return <div>剧本未找到</div>;

  const allCovers = scripts.map(s => ({ id: s.id, cover: s.cover, title: s.title }));
  const initialIndex = allCovers.findIndex(s => s.id === id);

  const openImageViewer = () => {
    setCurrentImageIndex(initialIndex >= 0 ? initialIndex : 0);
    setIsImageViewerOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allCovers.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allCovers.length) % allCovers.length);
  };

  const totalPlayers = script.players.male + script.players.female + script.players.any;

  const handleFavorite = () => {
    const newStatus = !isFavorited;
    setIsFavorited(newStatus);
    if (id) {
      localStorage.setItem(`favorite_${id}`, String(newStatus));
    }
    setToastMessage(newStatus ? '已添加到收藏' : '已取消收藏');
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleShare = () => {
    if (selectedFriends.length === 0) {
      setToastMessage('请先选择要分享的好友');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    
    // In a real app, this would call an API to send the share message
    setIsShareModalOpen(false);
    setSelectedFriends([]);
    setToastMessage(`已成功分享给 ${selectedFriends.length} 位好友`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const generateTrailer = async () => {
    try {
      setIsGeneratingVideo(true);
      setVideoError(null);

      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `A cinematic movie trailer for a murder mystery story titled "${script.title}". ${script.description}. High quality, dramatic lighting, suspenseful atmosphere.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey,
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUri(url);
      } else {
        setVideoError('视频生成失败，请重试。');
      }
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
         if (window.aistudio) await window.aistudio.openSelectKey();
      }
      setVideoError(error.message || '生成视频时发生错误');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateAISummary = async () => {
    try {
      setIsGeneratingSummary(true);
      setSummaryError(null);

      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `请根据以下剧本简介，生成一个30字以内的精炼摘要：\n\n${script.description}`,
      });

      setAiSummary(response.text || '无法生成摘要');
    } catch (error: any) {
      setSummaryError(error.message || '生成摘要时发生错误');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 bg-neutral-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm shadow-xl z-50 flex items-center gap-2"
          >
            <Heart className={cn("w-4 h-4", isFavorited ? "fill-red-500 text-red-500" : "text-white")} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Cover */}
      <div className="relative h-72 cursor-zoom-in" onClick={openImageViewer}>
        <div className="absolute inset-0">
          <img 
            src={script.cover} 
            alt={script.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-black/30" />
        </div>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleFavorite}
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Heart className={cn("w-5 h-5 transition-colors", isFavorited ? "fill-red-500 text-red-500" : "")} />
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent pt-20">
          <h1 className="text-3xl font-extrabold mb-3 drop-shadow-md">{script.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4 pointer-events-auto">
            {script.tags.map(tag => (
              <button 
                key={tag} 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/discover?type=${encodeURIComponent(tag)}`);
                }}
                className="text-[11px] font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5 text-sm font-medium text-white/90 bg-black/30 backdrop-blur-md w-fit px-4 py-2.5 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" /> 
              <span>{script.rating || '暂无'}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-400" /> 
              <span>{totalPlayers}人 <span className="text-white/60 text-xs">({script.players.male}男{script.players.female}女)</span></span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-green-400" /> 
              <span>{script.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {isImageViewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {allCovers.length}
              </span>
              <button 
                onClick={() => setIsImageViewerOpen(false)}
                className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={allCovers[currentImageIndex].cover}
                  alt={allCovers[currentImageIndex].title}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) prevImage();
                    else if (info.offset.x < -100) nextImage();
                  }}
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl cursor-grab active:cursor-grabbing"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden sm:flex"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors hidden sm:flex"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center px-6">
              <h3 className="text-white font-bold text-lg mb-1">{allCovers[currentImageIndex].title}</h3>
              <p className="text-white/60 text-xs">左右滑动切换剧本封面</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-neutral-900">分享给好友</h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-600 bg-neutral-100 rounded-full"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              <div className="space-y-3">
                {mockFriends.map(friend => (
                  <div 
                    key={friend.id} 
                    onClick={() => toggleFriendSelection(friend.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                      selectedFriends.includes(friend.id) 
                        ? "border-red-500 bg-red-50" 
                        : "border-neutral-100 hover:bg-neutral-50"
                    )}
                  >
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                      <span className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        friend.status === 'online' ? "bg-green-500" : 
                        friend.status === 'playing' ? "bg-yellow-500" : "bg-neutral-300"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-neutral-900">{friend.name}</h4>
                      <p className="text-xs text-neutral-500">
                        {friend.status === 'online' ? '在线' : 
                         friend.status === 'playing' ? '游戏中' : '离线'}
                      </p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center",
                      selectedFriends.includes(friend.id) 
                        ? "border-red-500 bg-red-500" 
                        : "border-neutral-300"
                    )}>
                      {selectedFriends.includes(friend.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 bg-neutral-50">
              <button 
                onClick={handleShare}
                disabled={selectedFriends.length === 0}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享 {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6 space-y-8">
        {/* Synopsis */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              剧本简介
            </h2>
            <button
              onClick={generateAISummary}
              disabled={isGeneratingSummary}
              className="text-xs flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1.5 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingSummary ? '生成中...' : 'AI 总结'}
            </button>
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {script.description}
          </p>
          {aiSummary && (
            <div className="mt-4 p-3.5 bg-red-50/50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-700">AI 精炼摘要</span>
              </div>
              <p className="text-sm text-red-900/80 leading-relaxed">{aiSummary}</p>
            </div>
          )}
          {summaryError && (
            <p className="text-xs text-red-500 mt-2">{summaryError}</p>
          )}
          
          <div className="mt-4 flex">
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <PlayCircle className="w-4 h-4" />
              观看视频教程
            </button>
          </div>
        </section>

        {/* Tutorial Video Modal */}
        <AnimatePresence>
          {isTutorialOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            >
              <div className="w-full max-w-4xl relative">
                <button 
                  onClick={() => setIsTutorialOpen(false)}
                  className="absolute -top-12 right-0 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <ReactPlayer
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    width="100%"
                    height="100%"
                    controls
                    playing
                  />
                </div>
                <h3 className="text-white font-bold text-lg mt-4 text-center">《{script.title}》- 新手教学指南</h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Trailer */}
        <section>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
            AI 预告片
          </h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
            {videoUri ? (
              <div className="space-y-3">
                <div className="rounded-lg overflow-hidden bg-black aspect-video relative">
                  <ReactPlayer
                    src={videoUri}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    onError={(e) => {
                      console.error('Video playback error:', e);
                      setPlaybackError('视频播放出错，请尝试下载后观看。');
                    }}
                  />
                  {playbackError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center text-sm z-10">
                      {playbackError}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <a 
                    href={videoUri} 
                    download={`${script.title}-预告片.mp4`}
                    className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    下载预告片
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-1">生成专属预告片</h3>
                <p className="text-xs text-neutral-500 mb-4 max-w-[200px]">
                  使用 Veo AI 为《{script.title}》生成一段电影级的高清预告片
                </p>
                <button 
                  onClick={generateTrailer}
                  disabled={isGeneratingVideo}
                  className="px-6 py-2 bg-neutral-900 text-white text-sm font-bold rounded-full disabled:opacity-50 flex items-center gap-2 transition-opacity"
                >
                  {isGeneratingVideo ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      正在生成 (约需几分钟)...
                    </>
                  ) : (
                    '立即生成'
                  )}
                </button>
                {videoError && (
                  <p className="text-xs text-red-500 mt-3">{videoError}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Characters */}
        {script.characters && script.characters.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              人物介绍
            </h2>
            <div className="flex flex-col gap-3">
              {script.characters.map(char => (
                <div key={char.id} className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 flex gap-4 items-start">
                  <img 
                    src={char.avatar} 
                    alt={char.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-neutral-50 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-sm text-neutral-900">{char.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${char.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                        {char.gender === 'male' ? '男' : '女'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {char.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              玩家评价
            </h2>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
            >
              写评价
            </button>
          </div>
          
          {/* Rating Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mb-4 flex items-center gap-6">
            <div className="flex flex-col items-center shrink-0">
              <div className="text-4xl font-black text-neutral-900">{script.rating || '9.5'}</div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">128 人评分</div>
            </div>
            <div className="flex-1 space-y-1.5">
              {[
                { stars: 5, percent: 75 },
                { stars: 4, percent: 15 },
                { stars: 3, percent: 5 },
                { stars: 2, percent: 3 },
                { stars: 1, percent: 2 },
              ].map(row => (
                <div key={row.stars} className="flex items-center gap-2 text-[10px] text-neutral-500">
                  <span className="w-2">{row.stars}</span>
                  <Star className="w-2.5 h-2.5 text-neutral-400 fill-neutral-400" />
                  <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {[
              { id: 1, user: '推理狂魔', avatar: 'https://picsum.photos/seed/r1/40/40', rating: 5, date: '2023-10-15', content: '剧本逻辑非常严密，没有明显的bug。搜证环节的设计很巧妙，需要玩家之间充分交流才能还原真相。', likes: 45 },
              { id: 2, user: '情感本天后', avatar: 'https://picsum.photos/seed/r2/40/40', rating: 4, date: '2023-10-10', content: '虽然是个硬核本，但是人物之间的情感羁绊也写得很感人。最后复盘的时候大家都沉默了。', likes: 32 },
              { id: 3, user: '菠萝头老李', avatar: 'https://picsum.photos/seed/r3/40/40', rating: 5, date: '2023-10-05', content: '作为老玩家，这个本的诡计设计确实让我眼前一亮。凶手位体验极佳，操作空间很大。', likes: 18 },
            ].map(review => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{review.user}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-2.5 h-2.5", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200 fill-neutral-200")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-400">{review.date}</div>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed text-justify mb-3">
                  {review.content}
                </p>
                <div className="flex items-center justify-end">
                  <button className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-xs">{review.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Character Relationships */}
        {script.summary?.relationships && script.summary.relationships.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              人物关系网
            </h2>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
              <div className="relative border-l-2 border-neutral-100 ml-5 space-y-6">
                {script.summary.relationships.map((rel, index) => {
                  const char = script.characters.find(c => c.name === rel.character);
                  return (
                    <div key={index} className="relative pl-6">
                      <div className="absolute -left-[21px] top-1 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        {char ? (
                          <img src={char.avatar} alt={char.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-white shadow-sm">
                            <Users className="w-4 h-4 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100 ml-2">
                        <h4 className="text-sm font-bold text-neutral-900 mb-1">{rel.character}</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rel.relation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full"></span>
              玩家评价 ({script.reviewCount || 0})
            </h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm text-red-600 font-medium flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4" />
              写评价
            </button>
          </div>

          {showReviewForm && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    onClick={() => setReviewRating(star)}
                    className={cn("w-6 h-6 cursor-pointer transition-colors", star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200 hover:text-yellow-400 hover:fill-yellow-400")} 
                  />
                ))}
              </div>
              <textarea 
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="分享你的游玩体验（不含剧透）..."
                className="w-full bg-neutral-50 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[80px] mb-3"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewContent('');
                    setReviewRating(5);
                  }}
                  className="px-4 py-1.5 text-sm text-neutral-500 font-medium"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (!reviewContent.trim()) {
                      setToastMessage('评价内容不能为空');
                      setTimeout(() => setToastMessage(null), 2000);
                      return;
                    }
                    setToastMessage('评价提交成功！');
                    setTimeout(() => setToastMessage(null), 2000);
                    setShowReviewForm(false);
                    setReviewContent('');
                    setReviewRating(5);
                  }}
                  className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg"
                >
                  发布
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {script.reviews && script.reviews.length > 0 ? (
              script.reviews.map(review => (
                <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-sm font-bold text-neutral-900 block">{review.user}</span>
                        <span className="text-[10px] text-neutral-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400 text-sm">
                暂无评价，快来抢沙发吧！
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 flex gap-3 z-50">
        <button 
          onClick={() => setIsLobbyModalOpen(true)}
          className="flex-1 bg-neutral-100 text-neutral-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
        >
          <Users className="w-5 h-5" />
          加入房间
        </button>
        <button 
          onClick={() => setIsLobbyModalOpen(true)}
          className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors"
        >
          <Play className="w-5 h-5" />
          创建房间
        </button>
      </div>

      <RoomLobbyModal 
        isOpen={isLobbyModalOpen} 
        onClose={() => setIsLobbyModalOpen(false)} 
        scriptId={script.id}
        scriptTitle={script.title}
      />

      {/* ================= 半屏收银台抽屉 ================= */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsBuyModalOpen(false)} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-neutral-900 border-t border-neutral-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">确认订单</h3>
              <button onClick={() => setIsBuyModalOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6 flex gap-4">
              <img src={script.cover} alt={script.title} className="w-16 h-24 object-cover rounded-lg shadow-lg" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <h4 className="font-bold text-lg leading-tight">{script.title}</h4>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-neutral-400">剧本购买</span>
                  <span className="text-xl font-bold text-red-500">¥{script.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400">我的钱包余额</span>
                <span className={cn("font-medium", balance < script.price ? "text-red-400" : "text-white")}>
                  ¥{balance}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-400">支付后余额</span>
                <span className="font-medium text-white">¥{Math.max(0, balance - script.price)}</span>
              </div>
            </div>

            {balance < script.price ? (
              <button
                onClick={() => navigate('/wallet')}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2"
              >
                余额不足，去充值
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await buyScript(script.id);
                    setHasPurchased(true);
                    setIsBuyModalOpen(false);
                    setToastMessage('剧本购买成功，准备开启你的推理之旅吧！');
                    setTimeout(() => setToastMessage(null), 3000);
                  } catch (e: any) {
                    alert(e.response?.data?.message || '购买失败');
                  }
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2"
              >
                确认支付 ¥{script.price}
              </button>
            )}
          </motion.div>
        </div>
      )}


      {/* ================= 发起组局抽屉 ================= */}
      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateRoomModalOpen(false)} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-neutral-900 border-t border-neutral-800 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" /> 发起组局
              </h3>
              <button onClick={() => setIsCreateRoomModalOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800 mb-6 flex gap-3">
              <img src={script.cover} alt={script.title} className="w-12 h-16 object-cover rounded shadow" />
              <div>
                <h4 className="font-bold text-base">{script.title}</h4>
                <p className="text-xs text-neutral-400 mt-1">{script.minPlayers}-{script.maxPlayers}人 · {script.duration}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 ml-1">房间名称</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  placeholder="给车队起个响亮的名字吧"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                <div>
                  <h4 className="text-sm font-medium">私密房间</h4>
                  <p className="text-xs text-neutral-500">开启后将不会在大厅中公开显示</p>
                </div>
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={cn("w-12 h-6 rounded-full transition-colors relative", isPrivate ? "bg-red-600" : "bg-neutral-700")}
                >
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow", isPrivate ? "left-7" : "left-1")} />
                </button>
              </div>

              {isPrivate && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-medium text-neutral-300 ml-1">房间密码 (可选)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={roomPassword}
                      onChange={e => setRoomPassword(e.target.value)}
                      placeholder="设置加入密码"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={async () => {
                if (!roomName.trim()) return alert('请输入房间名称');
                try {
                  const res = await createRoom({
                    scriptId: script.id,
                    name: roomName,
                    isPrivate,
                    password: roomPassword || undefined
                  } as any);
                  setIsCreateRoomModalOpen(false);
                  navigate(`/room/${res.data.id}`);
                } catch (e: any) {
                  alert(e.response?.data?.message || '组局失败，请重试');
                }
              }}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 tracking-widest"
            >
              立即发车
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
