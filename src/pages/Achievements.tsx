import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Star, Zap, Brain, Shield, Flame, Crown, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievements = [
  { id: 'a1', name: '逻辑鬼才', desc: '在10局游戏中成功投出真凶', icon: Brain, color: 'text-blue-500', bg: 'bg-blue-100', unlocked: true, progress: 10, total: 10, date: '2023-10-15' },
  { id: 'a2', name: '戏精附体', desc: '获得5次MVP评价', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', unlocked: true, progress: 5, total: 5, date: '2023-09-20' },
  { id: 'a3', name: '百局老司机', desc: '累计完成100局游戏', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', unlocked: false, progress: 42, total: 100 },
  { id: 'a4', name: '天眼玩家', desc: '单局游戏中找到所有关键线索', icon: Target, color: 'text-red-500', bg: 'bg-red-100', unlocked: true, progress: 1, total: 1, date: '2023-08-05' },
  { id: 'a5', name: '完美伪装', desc: '作为凶手成功逃脱3次', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-100', unlocked: false, progress: 1, total: 3 },
  { id: 'a6', name: '节奏大师', desc: '担任DM主持10局游戏', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', unlocked: false, progress: 2, total: 10 },
];

export default function Achievements() {
  const navigate = useNavigate();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">成就徽章</h1>
        </div>
      </header>

      {/* Summary Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">成就达人</h2>
              <p className="text-neutral-400 text-sm mt-1">已解锁 {unlockedCount} / {achievements.length} 个徽章</p>
            </div>
          </div>
          
          <div className="mt-6 bg-black/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievement List */}
      <div className="px-4 pb-4 space-y-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div 
              key={achievement.id} 
              className={cn(
                "bg-white p-4 rounded-2xl border transition-all",
                achievement.unlocked ? "border-neutral-200 shadow-sm" : "border-neutral-100 opacity-60 grayscale"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", achievement.bg)}>
                  <Icon className={cn("w-6 h-6", achievement.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-neutral-900 truncate pr-2">{achievement.name}</h3>
                    {achievement.unlocked && (
                      <span className="text-[10px] text-neutral-400 shrink-0">{achievement.date}</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">{achievement.desc}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", achievement.unlocked ? "bg-green-500" : "bg-neutral-300")}
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-neutral-500 shrink-0">
                      {achievement.progress} / {achievement.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
