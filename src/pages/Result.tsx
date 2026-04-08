import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Star, MessageSquare, ChevronRight, Home, Users, CheckCircle2, XCircle, Coins, Zap, BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scripts } from '@/src/data/scripts';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const script = scripts.find(s => s.id === id) || scripts[0];

  const queryParams = new URLSearchParams(location.search);
  const initialTab = (queryParams.get('tab') as 'voting' | 'truth' | 'mvp' | 'review') || 'voting';

  const [activeTab, setActiveTab] = useState<'voting' | 'truth' | 'mvp' | 'review'>(initialTab);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [mvpVote, setMvpVote] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock data for voting results
  const votingResults = [
    { id: 'u1', name: '推理狂人', avatar: 'https://picsum.photos/seed/u1/100/100', votedFor: 'char2', isCorrect: true },
    { id: 'u2', name: '戏精本精', avatar: 'https://picsum.photos/seed/u2/100/100', votedFor: 'char3', isCorrect: false },
    { id: 'u3', name: '划水怪', avatar: 'https://picsum.photos/seed/u3/100/100', votedFor: 'char2', isCorrect: true },
    { id: 'local', name: '我', avatar: 'https://picsum.photos/seed/local/100/100', votedFor: 'char2', isCorrect: true },
  ];

  const realKillerId = 'char2'; // Mock real killer

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">对局结算</h1>
          <button 
            onClick={() => navigate('/')}
            className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6 max-w-md mx-auto">
        {/* Game Info */}
        <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
          <img src={script.cover} alt={script.title} className="w-16 h-20 object-cover rounded-lg" />
          <div>
            <h2 className="font-bold text-white text-lg">{script.title}</h2>
            <p className="text-xs text-neutral-400 mt-1">难度: {script.difficulty} | 评分: {script.rating}</p>
            <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 游戏已结束
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-neutral-900 rounded-xl overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('voting')}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 text-sm font-bold rounded-lg transition-colors", activeTab === 'voting' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400")}
          >
            投票结果
          </button>
          <button
            onClick={() => setActiveTab('truth')}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 text-sm font-bold rounded-lg transition-colors", activeTab === 'truth' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400")}
          >
            剧本复盘
          </button>
          <button
            onClick={() => setActiveTab('mvp')}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 text-sm font-bold rounded-lg transition-colors", activeTab === 'mvp' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400")}
          >
            MVP评选
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={cn("flex-1 whitespace-nowrap px-3 py-2 text-sm font-bold rounded-lg transition-colors", activeTab === 'review' ? "bg-neutral-700 text-white shadow-sm" : "text-neutral-400")}
          >
            剧本评价
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {/* Voting Results */}
          {activeTab === 'voting' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"></div>
                <h3 className="text-neutral-400 text-sm mb-2">真凶是</h3>
                <div className="text-2xl font-bold text-red-500 mb-4">
                  {script.characters?.find(c => c.id === realKillerId)?.name || '未知'}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-green-400 font-bold">逃脱失败</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-neutral-300">好人阵营胜利</span>
                </div>
              </div>

              {/* Score and EXP */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 rounded-2xl border border-neutral-700 flex items-center justify-between">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm text-neutral-400 mb-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    本局得分
                  </div>
                  <div className="text-2xl font-black text-yellow-500">+150</div>
                </div>
                <div className="w-px h-12 bg-neutral-700"></div>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-sm text-neutral-400 mb-1">
                    <Zap className="w-4 h-4 text-blue-400" />
                    获得经验
                  </div>
                  <div className="text-2xl font-black text-blue-400">+300</div>
                </div>
              </div>

              <h3 className="font-bold text-white mb-3 px-1 mt-6">玩家投票详情</h3>
              <div className="space-y-3">
                {votingResults.map(result => {
                  const votedChar = script.characters?.find(c => c.id === result.votedFor);
                  return (
                    <div key={result.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={result.avatar} alt={result.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <div className="font-bold text-neutral-200 text-sm">{result.name}</div>
                          <div className="text-xs text-neutral-500 mt-0.5">投给了 {votedChar?.name}</div>
                        </div>
                      </div>
                      <div>
                        {result.isCorrect ? (
                          <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 投对
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">
                            <XCircle className="w-3.5 h-3.5" /> 投错
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Truth Reveal */}
          {activeTab === 'truth' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  案件真相
                </h3>
                <div className="text-sm text-neutral-300 leading-relaxed space-y-4">
                  <p>
                    <strong className="text-red-400">杀人动机：</strong>
                    凶手发现死者其实是当年陷害自己家族的幕后黑手，为了复仇，策划了这起密室杀人案。
                  </p>
                  <p>
                    <strong className="text-red-400">作案手法：</strong>
                    凶手利用冰块制作了延时装置，将毒药藏在冰块中。当冰块融化时，毒药滴入死者的酒杯中。随后凶手利用钓鱼线从门外反锁了房门，制造了密室的假象。
                  </p>
                  <p>
                    <strong className="text-red-400">关键线索解析：</strong>
                    现场发现的“水渍”并非打翻的水杯，而是融化的冰块。窗台上的“划痕”是钓鱼线摩擦留下的痕迹。
                  </p>
                </div>
              </div>

              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  时间线梳理
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-700 before:to-transparent">
                  {[
                    { time: '19:00', event: '晚宴开始，所有人齐聚大厅。' },
                    { time: '20:15', event: '死者声称身体不适，返回房间休息。' },
                    { time: '20:30', event: '凶手借口去洗手间，潜入死者房间布置延时毒药装置。' },
                    { time: '21:00', event: '冰块融化，毒药滴入水杯。死者饮水后毒发身亡。' },
                    { time: '21:30', event: '众人发现死者尸体。' }
                  ].map((item, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-400 group-[.is-active]:text-red-500 group-[.is-active]:border-red-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-red-400 text-sm">{item.time}</div>
                        </div>
                        <div className="text-neutral-300 text-sm leading-relaxed">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  角色解析
                </h3>
                <div className="space-y-6">
                  {script.characters?.map((char) => (
                    <div key={char.id} className="flex gap-4 border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                      <img src={char.avatar} alt={char.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-neutral-200">{char.name}</h4>
                          {char.id === realKillerId && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">真凶</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed text-justify">
                          {char.id === realKillerId 
                            ? "本案的真凶。多年来一直隐忍，寻找复仇的机会。利用停电和冰块延时装置完成了完美的密室杀人。" 
                            : `${char.description} 虽然有作案动机，但案发时并没有作案时间，且其关注点在于寻找当年事件的真相，而非杀人。`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MVP Voting */}
          {activeTab === 'mvp' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gradient-to-br from-yellow-900/40 to-neutral-900 p-6 rounded-2xl border border-yellow-900/30 text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-yellow-500 mb-2">评选全场 MVP</h3>
                <p className="text-xs text-neutral-400">谁的推理最精彩？谁的演技最逼真？投出你宝贵的一票！</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {votingResults.filter(v => v.id !== 'local').map(player => (
                  <button
                    key={player.id}
                    onClick={() => setMvpVote(player.id)}
                    className={cn(
                      "p-4 rounded-xl border flex flex-col items-center gap-3 transition-all",
                      mvpVote === player.id 
                        ? "bg-yellow-900/20 border-yellow-500" 
                        : "bg-neutral-900 border-neutral-800 hover:border-neutral-600"
                    )}
                  >
                    <img src={player.avatar} alt={player.name} className="w-14 h-14 rounded-full" />
                    <span className="font-bold text-sm text-neutral-200">{player.name}</span>
                    {mvpVote === player.id && (
                      <div className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 已选择
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Review */}
          {activeTab === 'review' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800">
                <h3 className="font-bold text-white mb-4 text-center">给剧本打个分吧</h3>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={cn(
                          "w-8 h-8", 
                          rating >= star ? "fill-yellow-500 text-yellow-500" : "text-neutral-600"
                        )} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="写下你的无剧透评价，帮助其他玩家避坑或种草..."
                  className="w-full h-32 bg-neutral-800 rounded-xl p-4 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none border border-neutral-700"
                />
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(true);
                  setTimeout(() => navigate('/'), 1500);
                }}
                disabled={rating === 0 || isSubmitted}
                className="w-full py-3.5 bg-red-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    提交成功，即将返回...
                  </>
                ) : (
                  '提交评价并返回首页'
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Bar (if not in review tab) */}
      {activeTab !== 'review' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800">
          <div className="max-w-md mx-auto flex gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors"
            >
              返回首页
            </button>
            <button 
              onClick={() => {
                if (activeTab === 'voting') setActiveTab('truth');
                else if (activeTab === 'truth') setActiveTab('mvp');
                else if (activeTab === 'mvp') setActiveTab('review');
              }}
              className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              下一步 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
