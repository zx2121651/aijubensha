import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scripts } from '@/src/data/scripts';
import { ArrowLeft, Search, Filter, Users, Clock, Star, Zap, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Lobby() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('全部');
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedData, setMatchedData] = useState<any | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        setActiveRooms(res.data || []);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
      }
    };
    fetchRooms();
  }, []);

  const handleAutoMatch = async () => {
    setIsMatching(true);
    setMatchedData(null);
    try {
      // 故意延迟1-2秒，让雷达动画转一会儿，增强仪式感
      const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
      const [res] = await Promise.all([autoMatchRoom(), minDelay]);

      if (res.data?.roomId) {
         setMatchedData(res.data); // 这会触发 MatchRadar 进入 locked 状态
      } else {
         setIsMatching(false);
      }
    } catch (error: any) {
      setIsMatching(false);
      alert(error.response?.data?.message || '匹配失败');
    }
  };

  // Mock active rooms data


  const filters = ['全部', '缺男', '缺女', '新手友好', '硬核推理', '情感沉浸'];

  return (
    <>
      <MatchRadar
        isMatching={isMatching}
        matchedData={matchedData}
        onAnimationComplete={() => {
          setIsMatching(false);
          setMatchedData(null);
          navigate(`/room/${matchedData.roomId}`);
        }}
      />
    <div className="min-h-screen bg-neutral-50 pb-8">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">组局大厅</h1>
        </div>
        <button className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* Search & Filters */}
      <div className="bg-white px-4 pb-4 shadow-sm mb-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="搜索剧本名称或房间号..." 
            className="w-full bg-neutral-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeFilter === filter 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Room List */}
      <div className="px-4 space-y-4">
        {activeRooms.map(room => {
          const script = scripts.find(s => s.id === room.scriptId);
          if (!script) return null;

          const isFull = room.currentPlayers === room.targetPlayers;

          return (
            <div key={room.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <div className="flex gap-4">
                {/* Script Cover */}
                <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 relative">
                  <img src={script.cover} alt={script.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-center gap-1 text-white text-[10px] font-bold">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {script.rating}
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-neutral-900 text-base truncate">{script.title}</h3>
                    <span className="text-xs text-neutral-400 shrink-0">{room.createdAt}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {script.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span>{script.players.male}男{script.players.female}女</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-auto">
                    {(room.tags || []).map(tag => (
                      <span 
                        key={tag} 
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-md font-medium",
                          tag.includes('缺') ? "bg-red-50 text-red-600" : 
                          tag === '游戏中' ? "bg-neutral-100 text-neutral-500" :
                          "bg-blue-50 text-blue-600"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Host & Action */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <img src={`https://picsum.photos/seed/${room.id}/100/100`} alt={room.id.substring(0, 5)} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <span className="text-xs text-neutral-600 truncate max-w-[80px]">{room.id.substring(0, 5)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold flex items-center gap-1">
                        <Users className={cn("w-4 h-4", isFull ? "text-neutral-400" : "text-red-500")} />
                        <span className={isFull ? "text-neutral-500" : "text-red-600"}>{room._count?.players || 0}</span>
                        <span className="text-neutral-400">/{room.script?.minPlayers || 6}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/room/${script.id}`)}
                        disabled={isFull}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1",
                          isFull 
                            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" 
                            : "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200"
                        )}
                      >
                        {isFull ? '已满员' : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            上车
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Floating Action Button for creating room */}
      <button 
        onClick={() => navigate('/discover')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200 hover:bg-red-700 transition-colors z-40"
      >
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
    </>
  );
}
