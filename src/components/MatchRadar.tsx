import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Radar, CheckCircle2 } from 'lucide-react';

interface MatchRadarProps {
  isMatching: boolean;
  matchedData: any | null; // e.g. { roomName: string, scriptTitle: string, matchScore: number }
  onAnimationComplete: () => void;
}

export default function MatchRadar({ isMatching, matchedData, onAnimationComplete }: MatchRadarProps) {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'locked'>('idle');

  useEffect(() => {
    if (isMatching && !matchedData) {
      setPhase('scanning');
    } else if (matchedData) {
      setPhase('locked');
      // 定格展示匹配结果，1.5 秒后触发跳转
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setPhase('idle');
    }
  }, [isMatching, matchedData, onAnimationComplete]);

  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden">
      {/* 动态星球/星星背景模拟 */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 animate-pulse"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 2 + 1 + 's',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        {/* 雷达波纹动画圈 */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          {phase === 'scanning' && (
            <>
              <div className="absolute inset-0 border-2 border-red-500/50 rounded-full animate-ping [animation-duration:2s]" />
              <div className="absolute inset-4 border-2 border-red-500/30 rounded-full animate-ping [animation-duration:2s] [animation-delay:0.5s]" />
              <div className="absolute inset-8 border-2 border-red-500/20 rounded-full animate-ping [animation-duration:2s] [animation-delay:1s]" />
            </>
          )}

          {/* 中心雷达图标或匹配成功图标 */}
          <div className={cn(
            "z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_50px_rgba(220,38,38,0.5)]",
            phase === 'scanning' ? "bg-red-600/80 animate-pulse" : "bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.8)] scale-110"
          )}>
            {phase === 'scanning' ? (
              <Radar className="w-12 h-12 text-white animate-spin-slow" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        {/* 提示文案与匹配结果卡片 */}
        <div className="text-center transition-all duration-500">
          {phase === 'scanning' ? (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-widest animate-pulse">
                正在寻找灵魂车队...
              </h3>
              <p className="text-sm text-neutral-400">正在分析您的剧本偏好与社交雷达</p>
            </div>
          ) : (
            <div className="bg-neutral-900/80 border border-green-500/30 p-6 rounded-2xl shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-black text-white mb-2 tracking-wide">
                匹配成功！
              </h3>
              <div className="space-y-1 text-left bg-black/50 p-4 rounded-xl border border-neutral-800">
                <p className="text-neutral-300 text-sm">
                  房间: <span className="text-white font-bold">{matchedData?.roomName}</span>
                </p>
                <p className="text-neutral-300 text-sm">
                  剧本: <span className="text-red-400 font-bold">{matchedData?.scriptTitle}</span>
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
                    契合度 {matchedData?.matchScore}%
                  </span>
                  <span className="text-xs text-neutral-500">马上为您发车...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
