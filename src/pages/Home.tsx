import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scripts } from '@/src/data/scripts';
import { Search, Flame, Star, Clock, Users, Bell, User, Zap, ChevronRight, Sparkles, MessageSquare, Shield, Gift, Crown, Calendar, PlayCircle, BookOpen, Heart, Mic, MapPin, Box, Trophy, Unlock, Hash, UserPlus, Lightbulb, Award, ThumbsUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string, avatar: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">谜案寻踪</h1>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Link>
            <button 
              onClick={() => navigate(user ? '/profile' : '/auth')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-all active:scale-95"
            >
              {user ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-5 h-5 text-neutral-400" />
              )}
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="搜索剧本、作者、发行..." 
            className="w-full bg-neutral-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
      </header>

      {/* Top Banner Carousel */}
      <section className="px-4 py-4 bg-white">
        <Link to={`/script/${scripts[0]?.id || '1'}`} className="block relative w-full h-40 rounded-2xl overflow-hidden shadow-sm group">
          <img 
            src="https://picsum.photos/seed/banner2/800/400" 
            alt="Featured" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-5">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit mb-2">独家首发</span>
            <h2 className="text-white font-bold text-xl mb-1">长相思 · 破阵子</h2>
            <p className="text-white/80 text-xs mb-3">古风 / 情感 / 沉浸 / 6人</p>
            <div className="flex items-center gap-1 text-xs text-white font-medium bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm">
              <PlayCircle className="w-3.5 h-3.5" /> 立即查看
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-2 bg-white mb-2">
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => navigate('/lobby')} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-500 flex items-center justify-center shadow-sm border border-red-100">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-neutral-700">组局大厅</span>
          </button>
          <button onClick={() => navigate('/leaderboard')} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm border border-yellow-100">
              <Crown className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-neutral-700">排行榜</span>
          </button>
          <button onClick={() => navigate('/clubs')} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500 flex items-center justify-center shadow-sm border border-blue-100">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-neutral-700">俱乐部</span>
          </button>
          <button onClick={() => navigate('/store')} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-500 flex items-center justify-center shadow-sm border border-purple-100">
              <Gift className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-neutral-700">装扮商城</span>
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-4 bg-white mb-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['全部', '悬疑', '惊悚', '古风', '现代', '情感', '欢乐', '阵营', '机制'].map((cat, i) => (
            <button 
              key={cat}
              onClick={() => {
                if (cat === '全部') {
                  navigate('/discover');
                } else {
                  navigate(`/discover?type=${encodeURIComponent(cat)}`);
                }
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0 ? 'bg-neutral-900 text-white shadow-sm' : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* My Active Games (我的对局) */}
      {user && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              我的对局
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={scripts[0]?.cover} alt="cover" className="w-12 h-16 object-cover rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 mb-1">{scripts[0]?.title}</h3>
                <p className="text-[10px] text-neutral-500">正在进行中 · 搜证阶段</p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/game/${scripts[0]?.id}`)}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
            >
              继续游戏
            </button>
          </div>
        </section>
      )}

      {/* Daily Recommendation (每日推荐) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            每日推荐
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex gap-4">
          <img src={scripts[1]?.cover} alt={scripts[1]?.title} className="w-24 h-32 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-neutral-900 text-base">{scripts[1]?.title}</h3>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-500" /> 9.8
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-2">{scripts[1]?.tags.join(' · ')}</p>
            <div className="bg-neutral-50 p-2 rounded-lg mb-3">
              <p className="text-xs text-neutral-600 italic line-clamp-2">"年度最佳情感本，没有之一。逻辑严密，情感细腻，玩完后劲太大了..."</p>
            </div>
            <button 
              onClick={() => navigate(`/script/${scripts[1]?.id}`)}
              className="mt-auto w-full py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              查看详情
            </button>
          </div>
        </div>
      </section>

      {/* Starting Soon (即将发车) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            即将发车
          </h2>
          <Link to="/lobby" className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {scripts.slice(0, 3).map((script, idx) => (
            <div key={script.id} className="min-w-[240px] bg-white rounded-xl p-3 shadow-sm border border-neutral-100 flex gap-3">
              <img src={script.cover} alt={script.title} className="w-16 h-20 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <h3 className="font-bold text-sm text-neutral-900 truncate">{script.title}</h3>
                <div className="text-[10px] text-red-600 font-medium bg-red-50 w-fit px-1.5 py-0.5 rounded">
                  缺 {idx === 0 ? '1女' : idx === 1 ? '2男' : '1人'}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-neutral-500 font-medium">
                    {idx === 0 ? '5/6' : idx === 1 ? '4/6' : '6/7'}人
                  </span>
                  <button 
                    onClick={() => navigate(`/room/${script.id}`)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full font-bold transition-colors shadow-sm shadow-red-200"
                  >
                    上车
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limited Time Events (限时活动) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            限时活动
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full mb-2 inline-block">周末狂欢</span>
              <h3 className="font-bold text-blue-900 text-sm mb-1">全场剧本 8 折</h3>
              <p className="text-xs text-blue-700 mb-3">仅限本周末</p>
              <button className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm">去逛逛</button>
            </div>
            <Gift className="absolute -bottom-4 -right-4 w-20 h-20 text-blue-500/20" />
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-white bg-purple-500 px-2 py-0.5 rounded-full mb-2 inline-block">新人专享</span>
              <h3 className="font-bold text-purple-900 text-sm mb-1">首充送头像框</h3>
              <p className="text-xs text-purple-700 mb-3">绝版限定装扮</p>
              <button className="text-xs font-bold text-white bg-purple-600 px-3 py-1.5 rounded-lg shadow-sm">去充值</button>
            </div>
            <Crown className="absolute -bottom-4 -right-4 w-20 h-20 text-purple-500/20" />
          </div>
        </div>
      </section>

      {/* Weekly Free (本周限免) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Unlock className="w-5 h-5 text-green-500" />
            本周限免
          </h2>
          <span className="text-xs text-neutral-500">距结束 2天 14:00:00</span>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 flex gap-4 items-center">
          <img src={scripts[3]?.cover} alt={scripts[3]?.title} className="w-16 h-20 object-cover rounded-lg shadow-sm" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <h3 className="font-bold text-neutral-900 text-sm mb-1">{scripts[3]?.title}</h3>
            <p className="text-xs text-neutral-500 mb-2">{scripts[3]?.tags.slice(0,2).join(' · ')}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-green-600">免费</span>
              <span className="text-xs text-neutral-400 line-through">¥28.00</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/room/${scripts[3]?.id}`)}
            className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 shadow-sm transition-colors"
          >
            立即开局
          </button>
        </div>
      </section>

      {/* Beginner's Guide (新手指南) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            新手指南
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">黑话大全</h3>
              <p className="text-[10px] text-neutral-500">菠萝头是什么？</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">组局礼仪</h3>
              <p className="text-[10px] text-neutral-500">如何优雅地跳车</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections (主题精选) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            主题精选
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-[160px] h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 relative overflow-hidden flex flex-col justify-end shadow-sm">
            <div className="absolute top-2 right-2 opacity-20"><BookOpen className="w-10 h-10 text-white" /></div>
            <h3 className="text-white font-bold text-sm relative z-10">新手入坑必玩</h3>
            <p className="text-white/80 text-[10px] relative z-10">0门槛 轻松上手</p>
          </div>
          <div className="min-w-[160px] h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-3 relative overflow-hidden flex flex-col justify-end shadow-sm">
            <div className="absolute top-2 right-2 opacity-20"><Flame className="w-10 h-10 text-white" /></div>
            <h3 className="text-white font-bold text-sm relative z-10">硬核推土机</h3>
            <p className="text-white/80 text-[10px] relative z-10">烧脑风暴 细节拉满</p>
          </div>
          <div className="min-w-[160px] h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3 relative overflow-hidden flex flex-col justify-end shadow-sm">
            <div className="absolute top-2 right-2 opacity-20"><Heart className="w-10 h-10 text-white" /></div>
            <h3 className="text-white font-bold text-sm relative z-10">水龙头专区</h3>
            <p className="text-white/80 text-[10px] relative z-10">极致情感 备好纸巾</p>
          </div>
        </div>
      </section>

      {/* New Arrivals (新本速递) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            新本速递
          </h2>
          <Link to="/discover" className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {scripts.slice(2, 6).map(script => (
            <Link key={script.id} to={`/script/${script.id}`} className="min-w-[120px] group">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                <img src={script.cover} alt={script.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm">NEW</div>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 truncate">{script.title}</h3>
              <p className="text-xs text-neutral-500 truncate mt-0.5">{script.tags.slice(0, 2).join(' · ')}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Star DMs (金牌DM) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mic className="w-5 h-5 text-pink-500" />
            金牌 DM
          </h2>
          <button className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { name: '阿白', tags: ['情感演绎', '声优音'], avatar: 'https://picsum.photos/seed/dm1/100/100', rating: '4.9' },
            { name: '老黑', tags: ['硬核控场', '逻辑严密'], avatar: 'https://picsum.photos/seed/dm2/100/100', rating: '5.0' },
            { name: '小七', tags: ['欢乐搞怪', '气氛组'], avatar: 'https://picsum.photos/seed/dm3/100/100', rating: '4.8' },
          ].map((dm, i) => (
            <div key={i} className="min-w-[120px] bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-2">
                <img src={dm.avatar} alt={dm.name} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /> {dm.rating}
                </div>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 mt-1">{dm.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                {dm.tags.map(tag => (
                  <span key={tag} className="text-[9px] text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Publishers (知名发行) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Box className="w-5 h-5 text-teal-500" />
            知名发行
          </h2>
          <button className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            更多 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { name: '灰烬工作室', desc: '硬核推理天花板', logo: 'https://picsum.photos/seed/pub1/100/100' },
            { name: '剧盟', desc: '爆款情感本制造机', logo: 'https://picsum.photos/seed/pub2/100/100' },
            { name: '老玉米', desc: '欢乐机制领跑者', logo: 'https://picsum.photos/seed/pub3/100/100' },
          ].map((pub, i) => (
            <div key={i} className="min-w-[140px] bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex flex-col items-center text-center">
              <img src={pub.logo} alt={pub.name} className="w-12 h-12 rounded-xl object-cover mb-2" referrerPolicy="no-referrer" />
              <h3 className="font-bold text-sm text-neutral-900">{pub.name}</h3>
              <p className="text-[10px] text-neutral-500 mt-1">{pub.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Detectives (明星侦探) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500" />
            明星侦探
          </h2>
          <button className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            榜单 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { name: '福尔摩斯', title: '推理之神', avatar: 'https://picsum.photos/seed/det1/100/100', score: '9999+' },
            { name: '柯南本南', title: '无情推土机', avatar: 'https://picsum.photos/seed/det2/100/100', score: '8500' },
            { name: '菠萝头', title: '没有感情', avatar: 'https://picsum.photos/seed/det3/100/100', score: '7200' },
          ].map((det, i) => (
            <div key={i} className="min-w-[100px] bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex flex-col items-center text-center relative">
              {i === 0 && <Crown className="w-5 h-5 text-yellow-500 absolute -top-2 -right-1 rotate-12" />}
              <img src={det.avatar} alt={det.name} className="w-12 h-12 rounded-full object-cover mb-2 border-2 border-rose-100" referrerPolicy="no-referrer" />
              <h3 className="font-bold text-xs text-neutral-900">{det.name}</h3>
              <p className="text-[10px] text-rose-500 font-medium mt-0.5">{det.title}</p>
              <div className="text-[9px] text-neutral-400 mt-1">战力 {det.score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Scripts */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            热门剧本
          </h2>
          <button className="text-sm text-neutral-500">查看全部</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {scripts.map((script) => (
            <Link key={script.id} to={`/script/${script.id}`} className="group">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={script.cover} 
                  alt={script.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>9.8</span>
                </div>
              </div>
              <h3 className="font-bold text-neutral-900 truncate">{script.title}</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {script.players.male + script.players.female + script.players.any}人</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {script.duration}</span>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {script.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated Charts (口碑榜单) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            口碑榜单
          </h2>
          <button className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            完整榜单 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black italic text-yellow-500 w-12">TOP 1</span>
              <span className="font-bold text-neutral-900">{scripts[1]?.title}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-xs font-bold">9.8</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black italic text-neutral-400 w-12">TOP 2</span>
              <span className="font-bold text-neutral-900">{scripts[0]?.title}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-xs font-bold">9.5</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black italic text-orange-400 w-12">TOP 3</span>
              <span className="font-bold text-neutral-900">{scripts[2]?.title}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-xs font-bold">9.2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights (社区热评) */}
      <section className="px-4 mt-8 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            社区热评
          </h2>
          <Link to="/community" className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            去围观 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div 
          onClick={() => navigate('/post/p1')} 
          className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-3">
            <img src="https://picsum.photos/seed/p1/32/32" alt="user" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div>
              <div className="text-xs font-bold text-neutral-900">推理狂魔</div>
              <div className="text-[10px] text-neutral-400">评《林家大院》</div>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-600">9.5</span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 line-clamp-2 text-justify leading-relaxed">
            这个本真的太棒了！剧情反转再反转，完全猜不到结局。而且没有边缘角色，每个人的故事线都很饱满。强烈推荐给大家！
          </p>
        </div>
      </section>

      {/* Trending Topics (热门话题) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            热门话题
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['# 第一次玩情感本是什么体验', '# 那些年我们盘错的凶手', '# 剧本杀黑话大赏', '# 寻找神仙DM'].map((topic, i) => (
            <div key={i} className="min-w-[200px] bg-white rounded-xl p-3 border border-neutral-100 shadow-sm">
              <h3 className="font-bold text-sm text-neutral-900 mb-1">{topic}</h3>
              <p className="text-[10px] text-neutral-500">{1000 + i * 234} 人正在讨论</p>
            </div>
          ))}
        </div>
      </section>

      {/* Looking for Group (组队扩列) */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            组队扩列
          </h2>
          <button className="text-sm text-neutral-500 flex items-center">
            发布 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: '熬夜小王子', avatar: 'https://picsum.photos/seed/u4/40/40', text: '坐标北京，周末求硬核车，不鸽不跳车。', tags: ['硬核', '菠萝头'] },
            { name: '戏精本精', avatar: 'https://picsum.photos/seed/u5/40/40', text: '找几个情感本搭子，最好能一起哭的。', tags: ['情感', '水龙头'] }
          ].map((user, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-neutral-900">{user.name}</h3>
                  <button className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold">打招呼</button>
                </div>
                <p className="text-xs text-neutral-600 mb-2">{user.text}</p>
                <div className="flex gap-1.5">
                  {user.tags.map(tag => (
                    <span key={tag} className="text-[9px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Stores (附近门店) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            附近门店
          </h2>
          <button className="text-sm text-neutral-500 flex items-center hover:text-neutral-900 transition-colors">
            查看地图 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: '迷雾推理馆 (旗舰店)', distance: '1.2km', address: '朝阳区三里屯SOHO', tags: ['独家本多', '实景搜证'] },
            { name: '夜行者剧本探案', distance: '2.5km', address: '海淀区中关村步行街', tags: ['环境极佳', '免费换装'] },
          ].map((store, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm flex items-center gap-3">
              <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-neutral-900 truncate">{store.name}</h3>
                  <span className="text-xs font-bold text-neutral-500">{store.distance}</span>
                </div>
                <p className="text-xs text-neutral-500 truncate mb-1.5">{store.address}</p>
                <div className="flex gap-1.5">
                  {store.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guess You Like (猜你喜欢) */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="h-[1px] bg-neutral-200 flex-1"></div>
          <h2 className="text-sm font-bold flex items-center gap-1 px-3 text-neutral-400">
            <ThumbsUp className="w-4 h-4" />
            猜你喜欢
          </h2>
          <div className="h-[1px] bg-neutral-200 flex-1"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {scripts.slice().reverse().map((script) => (
            <Link key={`guess-${script.id}`} to={`/script/${script.id}`} className="group">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={script.cover} 
                  alt={script.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 truncate">{script.title}</h3>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {script.players.male + script.players.female + script.players.any}人</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
