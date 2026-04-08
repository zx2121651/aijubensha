import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Crown, Gem, Heart, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

type BoardType = 'mvp' | 'reasoning' | 'wealth' | 'charm';

const mockLeaderboards = {
  mvp: [
    { id: 'u1', name: '推理狂魔', avatar: 'https://picsum.photos/seed/p1/100/100', value: '1,245', label: '次 MVP' },
    { id: 'u2', name: '戏精本精', avatar: 'https://picsum.photos/seed/p2/100/100', value: '982', label: '次 MVP' },
    { id: 'u3', name: '剧本杀老司机', avatar: 'https://picsum.photos/seed/p3/100/100', value: '845', label: '次 MVP' },
    { id: 'u4', name: '情感本爱好者', avatar: 'https://picsum.photos/seed/p4/100/100', value: '721', label: '次 MVP' },
    { id: 'u5', name: '硬核玩家', avatar: 'https://picsum.photos/seed/p5/100/100', value: '654', label: '次 MVP' },
  ],
  reasoning: [
    { id: 'u5', name: '硬核玩家', avatar: 'https://picsum.photos/seed/p5/100/100', value: '9,845', label: '推理分' },
    { id: 'u1', name: '推理狂魔', avatar: 'https://picsum.photos/seed/p1/100/100', value: '9,210', label: '推理分' },
    { id: 'u6', name: '逻辑大师', avatar: 'https://picsum.photos/seed/p6/100/100', value: '8,750', label: '推理分' },
    { id: 'u7', name: '名侦探', avatar: 'https://picsum.photos/seed/p7/100/100', value: '8,120', label: '推理分' },
    { id: 'u3', name: '剧本杀老司机', avatar: 'https://picsum.photos/seed/p3/100/100', value: '7,980', label: '推理分' },
  ],
  wealth: [
    { id: 'u8', name: '氪金大佬', avatar: 'https://picsum.photos/seed/p8/100/100', value: '999.9w', label: '金币' },
    { id: 'u9', name: '首富', avatar: 'https://picsum.photos/seed/p9/100/100', value: '854.2w', label: '金币' },
    { id: 'u2', name: '戏精本精', avatar: 'https://picsum.photos/seed/p2/100/100', value: '621.5w', label: '金币' },
    { id: 'u10', name: '土豪', avatar: 'https://picsum.photos/seed/p10/100/100', value: '540.1w', label: '金币' },
    { id: 'u4', name: '情感本爱好者', avatar: 'https://picsum.photos/seed/p4/100/100', value: '420.8w', label: '金币' },
  ],
  charm: [
    { id: 'u4', name: '情感本爱好者', avatar: 'https://picsum.photos/seed/p4/100/100', value: '5.2w', label: '朵鲜花' },
    { id: 'u11', name: '万人迷', avatar: 'https://picsum.photos/seed/p11/100/100', value: '4.8w', label: '朵鲜花' },
    { id: 'u2', name: '戏精本精', avatar: 'https://picsum.photos/seed/p2/100/100', value: '4.1w', label: '朵鲜花' },
    { id: 'u12', name: '小仙女', avatar: 'https://picsum.photos/seed/p12/100/100', value: '3.5w', label: '朵鲜花' },
    { id: 'u1', name: '推理狂魔', avatar: 'https://picsum.photos/seed/p1/100/100', value: '2.9w', label: '朵鲜花' },
  ]
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState<BoardType>('mvp');

  const currentList = mockLeaderboards[activeBoard];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">排行榜</h1>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 pt-2 pb-4 shadow-sm mb-4 sticky top-[64px] z-20">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveBoard('mvp')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              activeBoard === 'mvp' ? "bg-yellow-100 text-yellow-700" : "bg-neutral-100 text-neutral-600"
            )}
          >
            <Crown className="w-4 h-4" />
            MVP榜
          </button>
          <button
            onClick={() => setActiveBoard('reasoning')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              activeBoard === 'reasoning' ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-600"
            )}
          >
            <Medal className="w-4 h-4" />
            推理大神
          </button>
          <button
            onClick={() => setActiveBoard('wealth')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              activeBoard === 'wealth' ? "bg-orange-100 text-orange-700" : "bg-neutral-100 text-neutral-600"
            )}
          >
            <Gem className="w-4 h-4" />
            富豪榜
          </button>
          <button
            onClick={() => setActiveBoard('charm')}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
              activeBoard === 'charm' ? "bg-pink-100 text-pink-700" : "bg-neutral-100 text-neutral-600"
            )}
          >
            <Heart className="w-4 h-4" />
            魅力榜
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 mb-8 mt-8">
        <div className="flex items-end justify-center gap-2">
          {/* 2nd Place */}
          {currentList[1] && (
            <div className="flex flex-col items-center w-28">
              <div className="relative mb-2">
                <img src={currentList[1].avatar} alt={currentList[1].name} className="w-16 h-16 rounded-full border-4 border-[#C0C0C0] object-cover" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#C0C0C0] rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm">2</div>
              </div>
              <div className="text-sm font-bold text-neutral-900 truncate w-full text-center">{currentList[1].name}</div>
              <div className="text-xs text-neutral-500">{currentList[1].value}</div>
            </div>
          )}

          {/* 1st Place */}
          {currentList[0] && (
            <div className="flex flex-col items-center w-32 -mt-8">
              <div className="relative mb-2">
                <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500 drop-shadow-md" />
                <img src={currentList[0].avatar} alt={currentList[0].name} className="w-20 h-20 rounded-full border-4 border-[#FFD700] object-cover" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#FFD700] rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">1</div>
              </div>
              <div className="text-sm font-bold text-neutral-900 truncate w-full text-center">{currentList[0].name}</div>
              <div className="text-xs text-neutral-500">{currentList[0].value}</div>
            </div>
          )}

          {/* 3rd Place */}
          {currentList[2] && (
            <div className="flex flex-col items-center w-28">
              <div className="relative mb-2">
                <img src={currentList[2].avatar} alt={currentList[2].name} className="w-16 h-16 rounded-full border-4 border-[#CD7F32] object-cover" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#CD7F32] rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-sm">3</div>
              </div>
              <div className="text-sm font-bold text-neutral-900 truncate w-full text-center">{currentList[2].name}</div>
              <div className="text-xs text-neutral-500">{currentList[2].value}</div>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-3">
        {currentList.slice(3).map((user, index) => (
          <div key={user.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-6 text-center font-bold text-neutral-400 text-lg">
              {index + 4}
            </div>
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-neutral-900 truncate">{user.name}</h3>
            </div>
            <div className="text-right">
              <div className="font-bold text-neutral-900">{user.value}</div>
              <div className="text-[10px] text-neutral-500">{user.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
