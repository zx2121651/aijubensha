import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scripts } from '@/src/data/scripts';
import { Users, Clock, Search, Filter, Plus, Heart, MessageCircle, Share2, Star, Zap, MapPin, Flame, Hash, Trophy, ChevronRight, Mic, Baby, TrendingUp, HelpCircle, BarChart2, Timer, Camera, AlertTriangle, BookOpen, Headphones, Smile, BrainCircuit, MessageSquare, ShoppingBag, GraduationCap, Crown, UserPlus, Shirt, Beaker, Ticket, Award, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import CreatePostModal from '@/src/components/CreatePostModal';
import PublicProfileModal from '@/src/components/PublicProfileModal';

interface Team {
  id: string;
  scriptId: string;
  host: string;
  hostAvatar: string;
  time: string;
  currentPlayers: number;
  targetPlayers: number;
  isJoined: boolean;
  message?: string;
}

const initialTeams: Team[] = [
  { id: 't1', scriptId: '1', host: '剧本杀老司机', hostAvatar: 'https://picsum.photos/seed/u1/32/32', time: '今天 20:00 开局', currentPlayers: 4, targetPlayers: 6, isJoined: false, message: '等2人，缺女，今晚8点准时发车！' },
  { id: 't2', scriptId: '2', host: '推理小白', hostAvatar: 'https://picsum.photos/seed/u2/32/32', time: '明天 14:00 开局', currentPlayers: 2, targetPlayers: 7, isJoined: false, message: '新手车，欢迎萌新，DM耐心带。' },
  { id: 't3', scriptId: '3', host: '硬核玩家', hostAvatar: 'https://picsum.photos/seed/u3/32/32', time: '周五 19:30 开局', currentPlayers: 5, targetPlayers: 6, isJoined: false, message: '硬核推理，差1个高配玩家，速来！' },
];

const mockPosts = [
  {
    id: 'p1',
    user: '推理狂魔',
    avatar: 'https://picsum.photos/seed/p1/40/40',
    time: '2小时前',
    scriptId: '1',
    rating: 9.5,
    content: '《林家大院》这个本真的太棒了！剧情反转再反转，完全猜不到结局。而且没有边缘角色，每个人的故事线都很饱满。强烈推荐给大家！',
    likes: 128,
    comments: 32,
    images: ['https://picsum.photos/seed/post1/400/300']
  },
  {
    id: 'p2',
    user: '情感本爱好者',
    avatar: 'https://picsum.photos/seed/p2/40/40',
    time: '5小时前',
    scriptId: '2',
    rating: 8.0,
    content: '玩了一个情感本，哭得稀里哗啦的。虽然推理部分比较弱，但是沉浸感拉满。DM的演绎也很到位，推荐给喜欢沉浸体验的玩家。',
    likes: 85,
    comments: 15,
    images: []
  }
];

export default function Community() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<'lfg' | 'posts'>('lfg');
  const [activeLfgTab, setActiveLfgTab] = useState<'online' | 'offline'>('online');
  const [teams] = useState<Team[]>(initialTeams);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<any | null>(null);

  const handleJoin = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      navigate(`/room/${team.scriptId}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 relative">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">社区广场</h1>
          <button className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-6 border-b border-neutral-100">
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors", activeMainTab === 'lfg' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveMainTab('lfg')}
          >
            拼车大厅
            {activeMainTab === 'lfg' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors", activeMainTab === 'posts' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveMainTab('posts')}
          >
            剧本动态
            {activeMainTab === 'posts' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {activeMainTab === 'lfg' ? (
          <div className="space-y-4">
            <div className="flex bg-neutral-100 p-1 rounded-xl mb-2">
              <button 
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeLfgTab === 'online' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
                onClick={() => setActiveLfgTab('online')}
              >
                线上车队
              </button>
              <button 
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeLfgTab === 'offline' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
                onClick={() => setActiveLfgTab('offline')}
              >
                线下门店
              </button>
            </div>

            {/* Quick Match Banner */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4 fill-white" /> 极速匹配
                </h3>
                <p className="text-xs text-white/80">一键匹配全网空缺车队，马上开局</p>
              </div>
              <button className="bg-white text-red-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">
                开始匹配
              </button>
            </div>

            {/* Official Events (官方赛事/活动) */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold mb-2 inline-block">官方赛事</span>
                  <h3 className="font-bold text-base mb-1">2026 全国推理大师赛</h3>
                  <p className="text-xs text-white/80 mb-3">报名倒计时 3 天，赢取万元大奖</p>
                  <button className="bg-white text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform">
                    立即报名
                  </button>
                </div>
                <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
              </div>
            </div>

            {/* Featured DMs (明星DM发车) - Only show in online tab */}
            {activeLfgTab === 'online' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Mic className="w-4 h-4 text-pink-500" /> 明星DM发车
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { name: '阿白', tags: ['情感演绎', '声优音'], avatar: 'https://picsum.photos/seed/dm1/100/100', script: '苍歧', time: '今晚 20:00' },
                    { name: '老黑', tags: ['硬核控场', '逻辑严密'], avatar: 'https://picsum.photos/seed/dm2/100/100', script: '病娇男孩', time: '明晚 19:30' },
                  ].map((dm, i) => (
                    <div key={i} className="min-w-[200px] bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3 border border-pink-100 shadow-sm flex gap-3">
                      <img src={dm.avatar} alt={dm.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-xs text-neutral-900 truncate">{dm.name}</h3>
                          <span className="text-[9px] text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded font-bold">带车中</span>
                        </div>
                        <p className="text-[10px] text-neutral-600 truncate mb-1">开本: 《{dm.script}》</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-neutral-500">{dm.time}</span>
                          <button className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full shadow-sm hover:bg-pink-600 transition-colors">上车</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newbie Friendly (新手专车) - Only show in online tab */}
            {activeLfgTab === 'online' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Baby className="w-4 h-4 text-green-500" /> 新手专车
                  </h2>
                  <span className="text-[10px] text-neutral-500">DM耐心带，0门槛</span>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Baby className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-green-900">《拆迁》欢乐机制本</h3>
                      <p className="text-[10px] text-green-700 mt-0.5">缺2人 · 预计10分钟后开局</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold bg-green-500 text-white px-4 py-1.5 rounded-full shadow-sm hover:bg-green-600 transition-colors">
                    秒进
                  </button>
                </div>
              </div>
            )}

            {/* Voice Chat Rooms (语音闲聊房) - Only show in online tab */}
            {activeLfgTab === 'online' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Headphones className="w-4 h-4 text-purple-500" /> 语音交友房
                  </h2>
                  <span className="text-[10px] text-neutral-500">等车太无聊？来聊聊天</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: '情感本玩家聚集地', users: 12, max: 20, tags: ['走心', '扩列'] },
                    { title: '硬核推理复盘局', users: 8, max: 10, tags: ['烧脑', '剧透慎入'] },
                  ].map((room, i) => (
                    <div key={i} className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 border border-purple-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-xs text-purple-900 mb-1.5 truncate">{room.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {room.tags.map(tag => (
                          <span key={tag} className="text-[8px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-purple-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {room.users}/{room.max}
                        </div>
                        <span className="font-bold">加入</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Script Test Plays (新本内测招募) - Only show in online tab */}
            {activeLfgTab === 'online' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Beaker className="w-4 h-4 text-cyan-500" /> 新本内测招募
                  </h2>
                  <span className="text-[10px] text-neutral-500">抢先体验，免费打本</span>
                </div>
                <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <img src="https://picsum.photos/seed/test1/80/100" className="w-16 h-20 object-cover rounded-lg border border-cyan-200" referrerPolicy="no-referrer" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-xs text-cyan-900">《未命名代号X》</h3>
                          <span className="text-[9px] bg-cyan-500 text-white px-1.5 py-0.5 rounded font-bold">招募中</span>
                        </div>
                        <p className="text-[10px] text-cyan-700 mb-2 line-clamp-2">硬核/科幻/还原。作者亲自带车，寻找高配推土机玩家，打完需提交200字测评反馈。</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-cyan-600 font-medium">进度: 3/6 人</span>
                        <button className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full hover:bg-cyan-200 transition-colors">
                          申请上车
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Stores (Only show in offline tab) */}
            {activeLfgTab === 'offline' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <MapPin className="w-4 h-4 text-blue-500" /> 附近热门门店
                  </h2>
                  <button className="text-xs text-neutral-500 flex items-center">全部 <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { name: 'NINES推理馆', distance: '1.2km', rating: 4.9, cover: 'https://picsum.photos/seed/store1/150/100' },
                    { name: '夜行者剧本探案', distance: '2.5km', rating: 4.8, cover: 'https://picsum.photos/seed/store2/150/100' },
                    { title: '迷雾推理', distance: '3.1km', rating: 4.7, cover: 'https://picsum.photos/seed/store3/150/100' },
                  ].map((store, i) => (
                    <div key={i} className="min-w-[140px] bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
                      <img src={store.cover} alt={store.name || store.title} className="w-full h-20 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-2">
                        <h3 className="font-bold text-xs text-neutral-900 truncate">{store.name || store.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-neutral-500">{store.distance}</span>
                          <span className="text-[10px] text-yellow-600 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-yellow-500" />{store.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Minute Deals (尾单捡漏) - Only show in offline tab */}
            {activeLfgTab === 'offline' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Timer className="w-4 h-4 text-red-500" /> 尾单捡漏
                  </h2>
                  <span className="text-[10px] text-neutral-500">马上开局，超值特惠</span>
                </div>
                <div className="space-y-2">
                  {[
                    { script: '病娇男孩的精分日记', store: 'NINES推理馆', time: '15分钟后', price: 68, original: 128, missing: 1 },
                    { script: '拆迁', store: '迷雾推理', time: '半小时后', price: 58, original: 98, missing: 2 },
                  ].map((deal, i) => (
                    <div key={i} className="bg-red-50 rounded-xl p-3 border border-red-100 flex items-center justify-between shadow-sm">
                      <div>
                        <h3 className="font-bold text-xs text-red-900 mb-1">《{deal.script}》</h3>
                        <p className="text-[10px] text-red-700">{deal.store} · {deal.time}开局 · 缺{deal.missing}人</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black text-red-600">¥{deal.price}</span>
                          <span className="text-[9px] text-red-400 line-through">¥{deal.original}</span>
                        </div>
                        <button className="text-[10px] font-bold bg-red-500 text-white px-3 py-1 rounded-full mt-1 shadow-sm hover:bg-red-600 transition-colors">
                          抢位
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local City Groups (同城组局群) - Only show in offline tab */}
            {activeLfgTab === 'offline' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <MessageSquare className="w-4 h-4 text-green-500" /> 同城组局群
                  </h2>
                  <span className="text-[10px] text-neutral-500">找到你的组织</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: '北京朝阳修仙群', members: 456, active: true },
                    { name: '上海黄浦情感车', members: 328, active: true },
                    { name: '广州天河硬核群', members: 215, active: false },
                    { name: '成都武侯欢乐多', members: 489, active: true },
                  ].map((group, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-neutral-900 truncate">{group.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-neutral-500">{group.members}人</span>
                          {group.active && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Local DMs (金牌DM推荐) - Only show in offline tab */}
            {activeLfgTab === 'offline' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Crown className="w-4 h-4 text-yellow-500" /> 金牌DM推荐
                  </h2>
                  <button className="text-xs text-neutral-500 flex items-center">更多 <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { name: '七七', store: 'NINES推理馆', tags: ['水龙头杀手', '沉浸式演绎'], rating: 4.9, avatar: 'https://picsum.photos/seed/dm3/100/100' },
                    { name: '老K', store: '夜行者探案', tags: ['硬核推土机', '节奏大师'], rating: 4.9, avatar: 'https://picsum.photos/seed/dm4/100/100' },
                    { name: '阿泽', store: '迷雾推理', tags: ['欢乐机制', '气氛组'], rating: 4.8, avatar: 'https://picsum.photos/seed/dm5/100/100' },
                  ].map((dm, i) => (
                    <div key={i} className="min-w-[200px] bg-white rounded-xl p-3 border border-neutral-100 shadow-sm flex gap-3 cursor-pointer hover:shadow-md transition-shadow">
                      <img src={dm.avatar} alt={dm.name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-100 shadow-sm" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-xs text-neutral-900 truncate">{dm.name}</h3>
                          <span className="text-[9px] text-yellow-600 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-yellow-500" />{dm.rating}</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 truncate mb-1">所属: {dm.store}</p>
                        <div className="flex items-center gap-1">
                          {dm.tags.map(tag => (
                            <span key={tag} className="text-[8px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store Coupons (门店特惠福利) - Only show in offline tab */}
            {activeLfgTab === 'offline' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                    <Ticket className="w-4 h-4 text-orange-500" /> 门店特惠福利
                  </h2>
                  <button className="text-xs text-neutral-500 flex items-center">领券中心 <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { store: 'NINES推理馆', title: '工作日免单券', desc: '满6人同行1人免单', color: 'from-orange-400 to-red-500' },
                    { store: '夜行者探案', title: '新本尝鲜券', desc: '指定城限本立减50元', color: 'from-blue-400 to-indigo-500' },
                  ].map((coupon, i) => (
                    <div key={i} className={cn("min-w-[160px] bg-gradient-to-r rounded-xl p-3 text-white shadow-sm relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform", coupon.color)}>
                      <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/20 rounded-full"></div>
                      <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-white/20 rounded-full"></div>
                      <h3 className="font-bold text-xs mb-0.5 relative z-10">{coupon.title}</h3>
                      <p className="text-[9px] text-white/90 mb-2 relative z-10">{coupon.desc}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 relative z-10">
                        <span className="text-[8px]">{coupon.store}</span>
                        <button className="text-[9px] bg-white text-neutral-900 px-2 py-0.5 rounded-full font-bold shadow-sm">领取</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teams.map((team) => {
              const script = scripts.find(s => s.id === team.scriptId);
              if (!script) return null;
              
              const isFull = team.currentPlayers >= team.targetPlayers;
              const missingPlayers = team.targetPlayers - team.currentPlayers;

              return (
                <div key={team.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                  {team.message && (
                    <div className="mb-3 p-3 bg-red-50 rounded-xl text-sm text-red-900 font-medium">
                      "{team.message}"
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Link to={`/script/${script.id}`} className="shrink-0">
                      <img 
                        src={script.cover} 
                        alt={script.title} 
                        className="w-20 h-28 object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-neutral-900 line-clamp-1">{script.title}</h3>
                          {!isFull ? (
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-sm whitespace-nowrap ml-2">
                              缺{missingPlayers}人
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-sm whitespace-nowrap ml-2">
                              已满员
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mb-2">
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-sm">{script.difficulty}</span>
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-sm">语音车</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{team.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Users className="w-3.5 h-3.5" />
                          <span>已上车: {team.currentPlayers}/{team.targetPlayers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setSelectedProfileUser({
                        id: team.host,
                        name: team.host,
                        avatar: team.hostAvatar,
                        level: Math.floor(Math.random() * 20) + 1,
                        bio: '剧本杀重度爱好者，推理机器。',
                        stats: { gamesPlayed: Math.floor(Math.random() * 100) + 10, mvpCount: Math.floor(Math.random() * 20), winRate: `${Math.floor(Math.random() * 40) + 40}%` },
                        favoriteRoles: ['凶手', '侦探', '边缘位']
                      })}
                    >
                      <img src={team.hostAvatar} className="w-6 h-6 rounded-full object-cover" alt="host" referrerPolicy="no-referrer" />
                      <span className="text-xs text-neutral-600 hover:text-red-600 transition-colors">DM: {team.host}</span>
                    </div>
                    <button 
                      onClick={() => handleJoin(team.id)}
                      disabled={team.isJoined || isFull}
                      className={cn(
                        "text-sm font-bold px-6 py-2 rounded-full transition-colors flex items-center gap-1",
                        team.isJoined 
                          ? "bg-green-50 text-green-600" 
                          : isFull 
                            ? "bg-neutral-100 text-neutral-400" 
                            : "bg-neutral-900 text-white hover:bg-neutral-800"
                      )}
                    >
                      {team.isJoined ? '已加入' : isFull ? '已满员' : '加入车队'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Script Leaderboard (剧本风云榜) */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                  <Award className="w-4 h-4 text-yellow-500" /> 剧本风云榜
                </h2>
                <span className="text-[10px] text-neutral-500">每周一更新</span>
              </div>
              <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm">
                {[
                  { rank: 1, name: '苍歧', type: '古风/情感/阵营', score: 9.8, trend: 'up' },
                  { rank: 2, name: '病娇男孩的精分日记', type: '现代/惊悚/硬核', score: 9.6, trend: 'same' },
                  { rank: 3, name: '拆迁', type: '现代/欢乐/机制', score: 9.5, trend: 'up' },
                ].map((script, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0 cursor-pointer group">
                    <span className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0",
                      i === 0 ? "bg-yellow-500" : i === 1 ? "bg-neutral-400" : "bg-orange-400"
                    )}>{script.rank}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-neutral-900 truncate group-hover:text-red-600 transition-colors">{script.name}</h3>
                      <p className="text-[9px] text-neutral-500">{script.type}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-yellow-600">{script.score}</span>
                      <span className="text-[8px] text-neutral-400">评分</span>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-[10px] text-neutral-500 pt-2 mt-1 hover:text-red-600 transition-colors">查看完整榜单</button>
              </div>
            </div>

            {/* Popular Circles */}
            <div className="mb-2">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Hash className="w-4 h-4 text-purple-500" /> 热门圈子
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { name: '硬核推理圈', members: '12.5w', icon: '🧠' },
                  { name: '情感水龙头', members: '8.2w', icon: '😭' },
                  { name: '欢乐机制圈', members: '6.8w', icon: '🎲' },
                  { name: '恐怖惊悚圈', members: '4.5w', icon: '👻' },
                ].map((circle, i) => (
                  <div key={i} className="min-w-[110px] bg-white rounded-xl p-3 border border-neutral-100 shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-purple-200 transition-colors">
                    <span className="text-2xl mb-1">{circle.icon}</span>
                    <h3 className="font-bold text-xs text-neutral-900">{circle.name}</h3>
                    <p className="text-[9px] text-neutral-500">{circle.members} 成员</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="mb-4">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Trophy className="w-4 h-4 text-amber-500" /> 活跃达人
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                {[
                  { name: '推理狂魔', title: '硬核之神', avatar: 'https://picsum.photos/seed/p1/40/40' },
                  { name: '情感本爱好者', title: '水龙头', avatar: 'https://picsum.photos/seed/p2/40/40' },
                  { name: '老司机DM', title: '金牌DM', avatar: 'https://picsum.photos/seed/p3/40/40' },
                  { name: '机制王', title: '千层套路', avatar: 'https://picsum.photos/seed/p4/40/40' },
                  { name: '菠萝头', title: '无情推土机', avatar: 'https://picsum.photos/seed/p5/40/40' },
                ].map((user, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                      {i < 3 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-900 w-14 truncate text-center">{user.name}</span>
                    <span className="text-[8px] text-amber-600 bg-amber-50 px-1 rounded">{user.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics (社区热议) */}
            <div className="mb-4">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <TrendingUp className="w-4 h-4 text-red-500" /> 社区热议
              </h2>
              <div className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm space-y-3">
                {[
                  { title: '盘点那些年我们玩过的“神级反转”剧本', hot: '🔥 爆', replies: 342 },
                  { title: '求推荐！适合团建的欢乐机制本，10人左右', hot: '热', replies: 128 },
                  { title: '【避雷指南】这些本千万别和不熟的人玩...', hot: '新', replies: 56 },
                ].map((topic, i) => (
                  <div key={i} className="flex items-start gap-2 cursor-pointer group">
                    <span className="text-xs font-bold text-neutral-400 w-4 pt-0.5">{i + 1}.</span>
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-1">{topic.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[8px] px-1 rounded font-bold",
                          topic.hot.includes('爆') ? "bg-red-100 text-red-600" : topic.hot.includes('热') ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {topic.hot}
                        </span>
                        <span className="text-[9px] text-neutral-400">{topic.replies} 条讨论</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Poll (社区投票) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <BarChart2 className="w-4 h-4 text-indigo-500" /> 社区投票
              </h2>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-sm text-indigo-900">你最看重剧本杀的哪个方面？</h3>
                  <span className="text-[9px] text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded">进行中</span>
                </div>
                <div className="space-y-2">
                  {[
                    { option: '逻辑推理的严密性', percent: 45 },
                    { option: '情感沉浸的体验感', percent: 30 },
                    { option: '机制玩法的趣味性', percent: 15 },
                    { option: 'DM的控场和演绎', percent: 10 },
                  ].map((item, i) => (
                    <div key={i} className="relative h-8 bg-white rounded-lg overflow-hidden border border-indigo-50 cursor-pointer group">
                      <div 
                        className="absolute top-0 left-0 h-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors" 
                        style={{ width: `${item.percent}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-between px-3">
                        <span className="text-xs font-medium text-indigo-900 relative z-10">{item.option}</span>
                        <span className="text-[10px] font-bold text-indigo-600 relative z-10">{item.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-indigo-400 mt-3 text-right">已有 12,458 人参与投票</p>
              </div>
            </div>

            {/* Player Moments (玩家返图) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Camera className="w-4 h-4 text-pink-500" /> 精彩瞬间
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { img: 'https://picsum.photos/seed/m1/200/300', user: '小仙女', avatar: 'https://picsum.photos/seed/u11/32/32', likes: 342 },
                  { img: 'https://picsum.photos/seed/m2/200/300', user: '戏精本精', avatar: 'https://picsum.photos/seed/u12/32/32', likes: 218 },
                  { img: 'https://picsum.photos/seed/m3/200/300', user: '硬核老哥', avatar: 'https://picsum.photos/seed/u13/32/32', likes: 156 },
                  { img: 'https://picsum.photos/seed/m4/200/300', user: '情感喷泉', avatar: 'https://picsum.photos/seed/u14/32/32', likes: 98 },
                ].map((moment, i) => (
                  <div key={i} className="min-w-[120px] relative rounded-xl overflow-hidden aspect-[3/4] shadow-sm group cursor-pointer">
                    <img src={moment.img} alt="moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-2">
                      <div className="flex items-center gap-1.5">
                        <img src={moment.avatar} alt={moment.user} className="w-5 h-5 rounded-full border border-white/50" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-white font-medium truncate">{moment.user}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-white/90">
                        <Heart className="w-3 h-3 fill-white/90" />
                        <span className="text-[9px]">{moment.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Red/Black List (避雷红黑榜) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500" /> 避雷红黑榜
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-3 border border-red-100 shadow-sm">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">红</div>
                    <span className="text-xs font-bold text-red-900">闭眼冲</span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-[10px] text-neutral-700 truncate">1. 《苍歧》- 情感天花板</li>
                    <li className="text-[10px] text-neutral-700 truncate">2. 《病娇男孩》- 细思极恐</li>
                    <li className="text-[10px] text-neutral-700 truncate">3. 《拆迁》- 欢乐互撕</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-neutral-100 to-white rounded-xl p-3 border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px] font-bold">黑</div>
                    <span className="text-xs font-bold text-neutral-900">快避雷</span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="text-[10px] text-neutral-700 truncate">1. 《XXX》- 逻辑稀碎</li>
                    <li className="text-[10px] text-neutral-700 truncate">2. 《YYY》- 边缘角色多</li>
                    <li className="text-[10px] text-neutral-700 truncate">3. 《ZZZ》- 强行按头哭</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Q&A Bounties (悬赏问答) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <HelpCircle className="w-4 h-4 text-blue-500" /> 悬赏问答
              </h2>
              <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100 shadow-sm space-y-2">
                {[
                  { q: '求推荐适合5个纯新手的欢乐本，不要太难的！', bounty: 50, answers: 12 },
                  { q: '《病娇男孩》第二幕的密室手法到底是怎么做到的？', bounty: 100, answers: 34 },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 shadow-sm flex gap-2 items-start cursor-pointer hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 shrink-0">问</div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-neutral-900 mb-1 leading-relaxed">{item.q}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500">{item.answers} 个回答</span>
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-500" /> {item.bounty} 积分
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-depth Reviews (硬核测评) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <BookOpen className="w-4 h-4 text-emerald-500" /> 硬核测评
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '万字长文深度解析《苍歧》人物关系与情感内核', author: '情感大师', read: '1.2w', cover: 'https://picsum.photos/seed/r1/200/150' },
                  { title: '硬核玩家必看：2025年度十大烧脑密室盘点', author: '推土机', read: '8.5k', cover: 'https://picsum.photos/seed/r2/200/150' },
                ].map((review, i) => (
                  <div key={i} className="min-w-[200px] bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden group cursor-pointer">
                    <img src={review.cover} alt="cover" className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="p-3">
                      <h3 className="font-bold text-xs text-neutral-900 line-clamp-2 mb-2">{review.title}</h3>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500">
                        <span>{review.author}</span>
                        <span>{review.read} 阅读</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LARP Memes (剧本杀梗图) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Smile className="w-4 h-4 text-yellow-500" /> 今日份快乐源泉
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { img: 'https://picsum.photos/seed/meme1/200/200', text: '当DM问你盘出凶手没' },
                  { img: 'https://picsum.photos/seed/meme2/200/200', text: '菠萝头玩情感本的真实写照' },
                  { img: 'https://picsum.photos/seed/meme3/200/200', text: '机制本里被骗得裤衩都不剩' },
                ].map((meme, i) => (
                  <div key={i} className="min-w-[140px] bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden cursor-pointer group">
                    <img src={meme.img} alt="meme" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="p-2 bg-yellow-50">
                      <p className="text-[10px] font-bold text-yellow-900 text-center truncate">{meme.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Script Quiz (趣味答题) */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5 mb-1">
                    <BrainCircuit className="w-4 h-4 fill-white" /> 测测你的推理等级
                  </h3>
                  <p className="text-[10px] text-white/80">每日一题，赢取限定头像框</p>
                </div>
                <button className="bg-white text-teal-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">
                  去答题
                </button>
              </div>
            </div>

            {/* Second-hand Trading (闲置交易) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                  <ShoppingBag className="w-4 h-4 text-orange-500" /> 闲置交易
                </h2>
                <button className="text-xs text-neutral-500 flex items-center">更多 <ChevronRight className="w-3 h-3" /></button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '正版《苍歧》二手9新', price: 299, original: 498, type: '出售', img: 'https://picsum.photos/seed/trade1/100/100' },
                  { title: '求购《病娇男孩》城限版', price: 800, original: null, type: '求购', img: 'https://picsum.photos/seed/trade2/100/100' },
                  { title: '《拆迁》玩过一次出', price: 150, original: 298, type: '出售', img: 'https://picsum.photos/seed/trade3/100/100' },
                ].map((item, i) => (
                  <div key={i} className="min-w-[140px] bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden cursor-pointer group">
                    <div className="relative">
                      <img src={item.img} alt="trade" className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <span className={cn(
                        "absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white z-10",
                        item.type === '出售' ? "bg-orange-500" : "bg-blue-500"
                      )}>{item.type}</span>
                    </div>
                    <div className="p-2">
                      <h3 className="font-bold text-xs text-neutral-900 truncate mb-1">{item.title}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-orange-600">¥{item.price}</span>
                        {item.original && <span className="text-[9px] text-neutral-400 line-through">¥{item.original}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LARP Slang Dictionary (黑话百科) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> 黑话百科
              </h2>
              <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {[
                    { term: '菠萝头', desc: '指玩情感本时毫无波澜、绝不流泪的玩家。' },
                    { term: '水龙头', desc: '指玩情感本时极易共情、从头哭到尾的玩家。' },
                    { term: '推土机', desc: '指极其热衷于硬核推理、无情破解密室的玩家。' },
                    { term: '天眼玩家', desc: '指提前看过剧透或作弊的玩家，极度破坏体验。' },
                    { term: '坐牢', desc: '指游戏体验极差，如坐针毡，只想赶紧结束。' },
                  ].map((slang, i) => (
                    <div key={i} className="bg-white px-2 py-1.5 rounded-lg border border-indigo-50 shadow-sm flex-1 min-w-[120px] group cursor-pointer">
                      <div className="text-xs font-bold text-indigo-900 mb-0.5">{slang.term}</div>
                      <div className="text-[9px] text-indigo-600 line-clamp-2 group-hover:line-clamp-none transition-all">{slang.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Find a Partner (找搭子/CPdd) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900">
                  <UserPlus className="w-4 h-4 text-pink-500" /> 找搭子 / CPdd
                </h2>
                <span className="text-[10px] text-neutral-500">灵魂契合，一起打本</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { user: '一只小咸鱼', desc: '求个硬核车队带飞，我负责喊666', tags: ['坐标北京', '求带飞'], avatar: 'https://picsum.photos/seed/cp1/50/50' },
                  { user: '无情菠萝头', desc: '蹲一个能把我哭瞎的情感本搭子', tags: ['情感本', '缺1'], avatar: 'https://picsum.photos/seed/cp2/50/50' },
                ].map((cp, i) => (
                  <div key={i} className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-3 border border-pink-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={cp.avatar} alt={cp.user} className="w-8 h-8 rounded-full object-cover border border-pink-200" referrerPolicy="no-referrer" />
                      <h3 className="font-bold text-xs text-neutral-900 truncate">{cp.user}</h3>
                    </div>
                    <p className="text-[10px] text-neutral-600 line-clamp-2 mb-2">{cp.desc}</p>
                    <div className="flex items-center gap-1">
                      {cp.tags.map(tag => (
                        <span key={tag} className="text-[8px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LARP OOTD (剧本杀穿搭) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Shirt className="w-4 h-4 text-purple-500" /> 剧本杀OOTD
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { theme: '民国风', img: 'https://picsum.photos/seed/ootd1/150/200', user: '旗袍控' },
                  { theme: '古风汉服', img: 'https://picsum.photos/seed/ootd2/150/200', user: '仗剑走天涯' },
                  { theme: '赛博朋克', img: 'https://picsum.photos/seed/ootd3/150/200', user: '夜之城' },
                ].map((ootd, i) => (
                  <div key={i} className="min-w-[120px] relative rounded-xl overflow-hidden aspect-[3/4] shadow-sm group cursor-pointer border border-neutral-100">
                    <img src={ootd.img} alt="ootd" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                      #{ootd.theme}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-[10px] text-white font-medium truncate block">{ootd.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DM Diaries (DM的碎碎念) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-1.5 text-neutral-900 mb-3">
                <Coffee className="w-4 h-4 text-amber-700" /> DM的碎碎念
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '今天带了一车全是水龙头的《苍歧》，纸巾用了一整包...', author: 'DM老K', avatar: 'https://picsum.photos/seed/dm4/32/32' },
                  { title: '遇到天眼玩家怎么办？教你几招不动声色地反制！', author: 'DM七七', avatar: 'https://picsum.photos/seed/dm3/32/32' },
                  { title: '带欢乐本带到嗓子哑了，求推荐好用的润喉糖😭', author: 'DM阿泽', avatar: 'https://picsum.photos/seed/dm5/32/32' },
                ].map((diary, i) => (
                  <div key={i} className="min-w-[180px] bg-amber-50 rounded-xl p-3 border border-amber-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-xs text-amber-900 font-medium line-clamp-2 mb-3 leading-relaxed">"{diary.title}"</p>
                    <div className="flex items-center gap-1.5">
                      <img src={diary.avatar} alt={diary.author} className="w-5 h-5 rounded-full border border-amber-200" referrerPolicy="no-referrer" />
                      <span className="text-[10px] text-amber-700">{diary.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {mockPosts.map(post => {
              const script = scripts.find(s => s.id === post.scriptId);
              return (
                <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileUser({
                          id: post.user,
                          name: post.user,
                          avatar: post.avatar,
                          level: Math.floor(Math.random() * 20) + 1,
                          bio: '剧本杀重度爱好者，推理机器。',
                          stats: { gamesPlayed: Math.floor(Math.random() * 100) + 10, mvpCount: Math.floor(Math.random() * 20), winRate: `${Math.floor(Math.random() * 40) + 40}%` },
                          favoriteRoles: ['凶手', '侦探', '边缘位']
                        });
                      }}
                    >
                      <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-red-500/50 transition-all" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">{post.user}</h4>
                        <p className="text-[10px] text-neutral-500">{post.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="text-red-600 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                    >
                      + 关注
                    </button>
                  </div>
                  
                  <p className="text-sm text-neutral-700 leading-relaxed mb-3 text-justify line-clamp-3">
                    {post.content}
                  </p>
                  
                  {post.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                      {post.images.map((img, i) => (
                        <img key={i} src={img} alt="post" className="w-32 h-32 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                  )}
                  
                  {script && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/script/${script.id}`);
                      }}
                      className="flex items-center gap-3 bg-neutral-50 p-2 rounded-xl mb-4 border border-neutral-100 hover:bg-neutral-100 transition-colors"
                    >
                      <img src={script.cover} alt={script.title} className="w-10 h-14 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900">{script.title}</h5>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] text-yellow-600 font-bold">{post.rating}</span>
                          <span className="text-[10px] text-neutral-500 ml-1">玩家评分</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-neutral-500">
                    <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-red-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">分享</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        type={activeMainTab === 'posts' ? 'post' : 'lfg'} 
      />

      <PublicProfileModal 
        isOpen={!!selectedProfileUser} 
        onClose={() => setSelectedProfileUser(null)} 
        user={selectedProfileUser} 
      />
    </div>
  );
}
