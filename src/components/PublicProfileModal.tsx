import { X, UserPlus, MessageSquare, Star, Award, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    bio?: string;
    stats: {
      gamesPlayed: number;
      mvpCount: number;
      winRate: string;
    };
    favoriteRoles: string[];
    achievements?: {
      name: string;
      icon: string;
      color: string;
    }[];
  };
}

export default function PublicProfileModal({ isOpen, onClose, user }: PublicProfileModalProps) {
  if (!isOpen) return null;

  const displayAchievements = user.achievements || [
    { name: '逻辑鬼才', icon: '🧠', color: 'bg-blue-100 text-blue-600' },
    { name: '戏精附体', icon: '🎭', color: 'bg-yellow-100 text-yellow-600' },
    { name: '百局老司机', icon: '👑', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-br from-red-500 to-orange-500 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                Lv.{user.level}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="px-4 h-10 rounded-full bg-red-500 text-white font-bold flex items-center gap-2 hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30">
                <UserPlus className="w-4 h-4" />
                加好友
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
          <p className="text-sm text-neutral-500 mt-1">{user.bio || '这个人很懒，什么都没写~'}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 py-4 border-y border-neutral-100">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-neutral-900">{user.stats.gamesPlayed}</span>
              <span className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> 游戏局数</span>
            </div>
            <div className="flex flex-col items-center border-x border-neutral-100">
              <span className="text-2xl font-bold text-yellow-500">{user.stats.mvpCount}</span>
              <span className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><Award className="w-3 h-3" /> MVP次数</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-red-500">{user.stats.winRate}</span>
              <span className="text-xs text-neutral-500 mt-1 flex items-center gap-1"><Star className="w-3 h-3" /> 胜率</span>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-500" />
                成就徽章
              </h3>
              <span className="text-xs text-neutral-400">已解锁 15 个</span>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {displayAchievements.map((ach, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/50", ach.color)}>
                    {ach.icon}
                  </div>
                  <span className="text-[10px] font-medium text-neutral-600">{ach.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">常玩角色类型</h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteRoles.map((role, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-100">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
