import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Users, Clock, Filter, ChevronDown, Sparkles, Loader2, TrendingUp, ListMusic, Building2, Award, CalendarClock, Mic, Map, Clapperboard, Heart } from 'lucide-react';
import { scripts, Script } from '@/src/data/scripts';
import { cn } from '@/lib/utils';
import { GoogleGenAI, Type } from '@google/genai';

const FILTER_TYPES = ['全部', '悬疑', '惊悚', '古风', '现代', '情感', '欢乐', '阵营', '机制'];
const FILTER_PLAYERS = ['全部', '5人及以下', '6人', '7人', '8人及以上'];
const FILTER_DIFFICULTIES = ['全部', '新手', '进阶', '烧脑'];

export default function Discover() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('全部');
  const [activePlayers, setActivePlayers] = useState('全部');
  const [activeDifficulty, setActiveDifficulty] = useState('全部');
  const [showFilters, setShowFilters] = useState(false);

  // Initialize filter from query params
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && FILTER_TYPES.includes(typeParam)) {
      setActiveType(typeParam);
    }
  }, [searchParams]);

  // AI Recommendation State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<{script: Script, reason: string}[]>([]);

  const isFiltering = searchQuery !== '' || activeType !== '全部' || activePlayers !== '全部' || activeDifficulty !== '全部';

  const filteredScripts = useMemo(() => {
    return scripts.filter(script => {
      // Search filter
      if (searchQuery && !script.title.includes(searchQuery) && !script.tags.some(t => t.includes(searchQuery))) {
        return false;
      }
      
      // Type filter
      if (activeType !== '全部' && !script.tags.includes(activeType)) {
        return false;
      }

      // Difficulty filter
      if (activeDifficulty !== '全部' && script.difficulty !== activeDifficulty) {
        return false;
      }

      // Players filter
      if (activePlayers !== '全部') {
        const total = script.players.male + script.players.female + script.players.any;
        if (activePlayers === '5人及以下' && total > 5) return false;
        if (activePlayers === '6人' && total !== 6) return false;
        if (activePlayers === '7人' && total !== 7) return false;
        if (activePlayers === '8人及以上' && total < 8) return false;
      }

      return true;
    });
  }, [searchQuery, activeType, activePlayers, activeDifficulty]);

  const handleAiRecommend = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      // Mock user profile (in a real app, this would come from the backend)
      const userProfile = {
        recentHistory: ['第七号病房'],
        favorites: ['长安夜行'],
        preferredTags: ['推理', '悬疑', '烧脑'],
        preferredDifficulty: ['进阶', '烧脑']
      };

      const availableScripts = scripts.map(s => ({
        id: s.id,
        title: s.title,
        tags: s.tags,
        difficulty: s.difficulty,
        rating: s.rating,
        description: s.description
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一个专业的剧本杀DM和推荐助手。请根据用户的偏好和当前可用的剧本库，为用户推荐2个最适合的剧本。
        
        用户信息：
        ${JSON.stringify(userProfile)}
        
        可用剧本库：
        ${JSON.stringify(availableScripts)}
        
        请返回JSON数组，包含推荐的剧本ID和一段简短的、个性化的推荐理由（中文，约30字，说明为什么适合该用户）。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "推荐的剧本ID" },
                reason: { type: Type.STRING, description: "个性化推荐理由" }
              },
              required: ["id", "reason"]
            }
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        const recs = result.map((r: any) => ({
          script: scripts.find(s => s.id === r.id),
          reason: r.reason
        })).filter((r: any) => r.script);
        
        setAiRecommendations(recs);
      }
    } catch (error) {
      console.error("AI Recommendation failed:", error);
      alert("AI推荐生成失败，请稍后再试。");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header & Search */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">剧本库</h1>
          <Link to="/leaderboard" className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-bold hover:bg-yellow-100 transition-colors">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            排行榜
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="搜索剧本名称、类型..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "px-3 rounded-xl flex items-center justify-center transition-colors",
              showFilters ? "bg-red-50 text-red-600" : "bg-neutral-100 text-neutral-600"
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4 pt-4 border-t border-neutral-100 animate-in slide-in-from-top-2 duration-200">
            {/* Types */}
            <div>
              <h3 className="text-xs font-bold text-neutral-500 mb-2">题材类型</h3>
              <div className="flex flex-wrap gap-2">
                {FILTER_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      activeType === type 
                        ? "bg-neutral-900 text-white" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Players */}
            <div>
              <h3 className="text-xs font-bold text-neutral-500 mb-2">人数配置</h3>
              <div className="flex flex-wrap gap-2">
                {FILTER_PLAYERS.map(player => (
                  <button
                    key={player}
                    onClick={() => setActivePlayers(player)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      activePlayers === player 
                        ? "bg-neutral-900 text-white" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {player}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="text-xs font-bold text-neutral-500 mb-2">难度级别</h3>
              <div className="flex flex-wrap gap-2">
                {FILTER_DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      activeDifficulty === diff 
                        ? "bg-neutral-900 text-white" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Results */}
      <div className="p-4">
        {/* AI Recommendation Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-2xl shadow-sm">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold flex items-center gap-2 text-neutral-900">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI 懂你推荐
                </h2>
                {!isAiLoading && (
                  <button 
                    onClick={handleAiRecommend}
                    className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium hover:bg-purple-100 transition-colors flex items-center gap-1"
                  >
                    {aiRecommendations.length > 0 ? (
                      <>
                        <Sparkles className="w-3 h-3" />
                        重新生成推荐
                      </>
                    ) : (
                      '生成专属推荐'
                    )}
                  </button>
                )}
              </div>
              
              {isAiLoading && (
                <div className="flex flex-col items-center justify-center py-6 text-purple-500">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-xs font-medium">AI 正在深度分析您的喜好...</span>
                </div>
              )}

              {aiRecommendations.length > 0 && !isAiLoading && (
                <div className="space-y-3">
                  {aiRecommendations.map((rec, idx) => (
                    <Link key={idx} to={`/script/${rec.script.id}`} className="block bg-purple-50/50 rounded-xl p-3 border border-purple-100 hover:bg-purple-50 transition-colors">
                      <div className="flex gap-3">
                        <img src={rec.script.cover} alt={rec.script.title} className="w-16 h-20 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-neutral-900 mb-1">{rec.script.title}</h3>
                          <p className="text-xs text-purple-700 leading-relaxed bg-purple-100/50 p-2 rounded-md">
                            <span className="font-bold">AI推荐语：</span>{rec.reason}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {!aiRecommendations.length && !isAiLoading && (
                <p className="text-xs text-neutral-500 leading-relaxed">
                  根据您的浏览历史、收藏记录和评价偏好，AI将为您从海量剧本中精准匹配最适合您的下一个剧本。
                </p>
              )}
            </div>
          </div>
        </div>

        {!isFiltering && (
          <>
            {/* Hot Searches (热门搜索) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <TrendingUp className="w-4 h-4 text-red-500" />
                热门搜索
              </h2>
              <div className="flex flex-wrap gap-2">
                {['病娇男孩的精分日记', '情感本推荐', '硬核推理', '欢乐机制', '适合新手的本'].map((tag, i) => (
                  <button 
                    key={i}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-xs text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Playlists (精选剧本单) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <ListMusic className="w-4 h-4 text-blue-500" />
                精选剧本单
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '2025年度必玩榜单', count: 50, cover: 'https://picsum.photos/seed/list1/200/200' },
                  { title: '哭到崩溃的情感本', count: 12, cover: 'https://picsum.photos/seed/list2/200/200' },
                  { title: '新手入坑第一本', count: 8, cover: 'https://picsum.photos/seed/list3/200/200' },
                ].map((list, i) => (
                  <div key={i} className="min-w-[140px] relative rounded-xl overflow-hidden aspect-video shadow-sm">
                    <img src={list.cover} alt={list.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-2">
                      <h3 className="text-white font-bold text-xs truncate">{list.title}</h3>
                      <p className="text-white/80 text-[10px]">{list.count}个剧本</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publisher Spotlight (发行专区) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Building2 className="w-4 h-4 text-teal-500" />
                发行专区
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: '灰烬工作室', tags: ['硬核', '推理'], logo: 'https://picsum.photos/seed/pub1/100/100' },
                  { name: '剧盟', tags: ['情感', '沉浸'], logo: 'https://picsum.photos/seed/pub2/100/100' },
                  { name: '老玉米', tags: ['欢乐', '机制'], logo: 'https://picsum.photos/seed/pub3/100/100' },
                  { name: 'FB', tags: ['恐怖', '惊悚'], logo: 'https://picsum.photos/seed/pub4/100/100' },
                ].map((pub, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm flex items-center gap-3">
                    <img src={pub.logo} alt={pub.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-neutral-900 truncate">{pub.name}</h3>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">{pub.tags.join(' · ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Award Winners (展会高分) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Award className="w-4 h-4 text-amber-500" />
                展会高分
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '苍歧', award: '2023年度最佳情感', cover: 'https://picsum.photos/seed/award1/120/160' },
                  { title: '病娇男孩', award: '最佳悬疑推理', cover: 'https://picsum.photos/seed/award2/120/160' },
                  { title: '拆迁', award: '最佳欢乐机制', cover: 'https://picsum.photos/seed/award3/120/160' },
                ].map((item, i) => (
                  <div key={i} className="min-w-[120px] bg-white rounded-xl p-2 border border-neutral-100 shadow-sm">
                    <img src={item.cover} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                    <h3 className="font-bold text-xs text-neutral-900 truncate">{item.title}</h3>
                    <p className="text-[9px] text-amber-600 mt-0.5 truncate bg-amber-50 px-1 rounded">{item.award}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Releases (即将上线) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <CalendarClock className="w-4 h-4 text-indigo-500" />
                即将上线
              </h2>
              <div className="space-y-3">
                {[
                  { title: '长相思·破阵子', date: '4月15日', tags: ['古风', '情感'], cover: 'https://picsum.photos/seed/up1/100/100' },
                  { title: '第七号病房2', date: '4月20日', tags: ['现代', '惊悚'], cover: 'https://picsum.photos/seed/up2/100/100' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-neutral-100 shadow-sm flex items-center gap-3">
                    <img src={item.cover} alt={item.title} className="w-12 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-neutral-900 truncate">{item.title}</h3>
                      <p className="text-[10px] text-neutral-500 mt-1">{item.tags.join(' · ')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-indigo-600">{item.date}</div>
                      <button className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full mt-1 font-medium">预约</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DM's Choice (金牌DM推荐) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Mic className="w-4 h-4 text-pink-500" />
                金牌DM推荐
              </h2>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src="https://picsum.photos/seed/dm1/40/40" alt="DM" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <div className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                      阿白 <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-[10px] text-neutral-500">情感本天花板DM</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="flex gap-3">
                    <img src={scripts[2]?.cover} alt={scripts[2]?.title} className="w-12 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{scripts[2]?.title}</h4>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">"带了不下50车，每一车都有人哭到崩溃。文笔极其细腻，非常考验DM的演绎，强烈推荐！"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* City Exclusives (城限独家) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Map className="w-4 h-4 text-orange-500" />
                城限独家
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { title: '极昼', store: '迷雾推理馆', cover: 'https://picsum.photos/seed/ce1/120/160' },
                  { title: '深渊的呼唤', store: '夜行者剧本探案', cover: 'https://picsum.photos/seed/ce2/120/160' },
                  { title: '无名之辈', store: 'NINES推理馆', cover: 'https://picsum.photos/seed/ce3/120/160' },
                ].map((item, i) => (
                  <div key={i} className="min-w-[140px] bg-white rounded-xl p-2 border border-neutral-100 shadow-sm relative">
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl z-10 shadow-sm">城限</div>
                    <img src={item.cover} alt={item.title} className="w-full h-36 object-cover rounded-lg mb-2" referrerPolicy="no-referrer" />
                    <h3 className="font-bold text-sm text-neutral-900 truncate">{item.title}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5 truncate flex items-center gap-1">
                      <Map className="w-3 h-3" /> {item.store}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* IP Adaptations (热门IP改编) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Clapperboard className="w-4 h-4 text-purple-500" />
                热门IP改编
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: '流浪地球', ip: '同名科幻巨作', cover: 'https://picsum.photos/seed/ip1/150/100' },
                  { title: '甄嬛传', ip: '经典宫斗剧', cover: 'https://picsum.photos/seed/ip2/150/100' },
                  { title: '盗墓笔记', ip: '南派三叔原著', cover: 'https://picsum.photos/seed/ip3/150/100' },
                  { title: '仙剑奇侠传', ip: '国民级RPG', cover: 'https://picsum.photos/seed/ip4/150/100' },
                ].map((item, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/2] shadow-sm group">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                      <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                      <p className="text-white/80 text-[10px] truncate">{item.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-Player / Couples (双人微剧本) */}
            <div className="mb-6">
              <h2 className="text-sm font-bold flex items-center gap-2 text-neutral-900 mb-3">
                <Heart className="w-4 h-4 text-rose-500" />
                双人微剧本
              </h2>
              <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-rose-900 text-sm mb-1">情侣/闺蜜专属</h3>
                  <p className="text-xs text-rose-700 mb-2">随时随地，两人成局</p>
                  <button className="text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-lg shadow-sm hover:bg-rose-600 transition-colors">
                    去挑选
                  </button>
                </div>
                <div className="flex -space-x-4">
                  <img src="https://picsum.photos/seed/c1/60/80" alt="cover 1" className="w-12 h-16 rounded-lg object-cover border-2 border-white shadow-sm rotate-[-10deg]" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/c2/60/80" alt="cover 2" className="w-12 h-16 rounded-lg object-cover border-2 border-white shadow-sm rotate-[10deg] z-10" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-neutral-500">共找到 {filteredScripts.length} 个剧本</span>
          <button className="text-sm text-neutral-600 flex items-center gap-1">
            综合排序 <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {filteredScripts.map(script => (
            <Link key={script.id} to={`/script/${script.id}`} className="block bg-white rounded-2xl p-3 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="relative w-24 h-32 shrink-0">
                  <img 
                    src={script.cover} 
                    alt={script.title} 
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{script.rating}</span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col py-1">
                  <h3 className="font-bold text-neutral-900 text-lg leading-tight mb-1">{script.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {script.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-2 flex-1">
                    {script.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-auto">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {script.players.male + script.players.female + script.players.any}人</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {script.duration}</span>
                    <span className="ml-auto text-red-600 font-medium">{script.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {filteredScripts.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>没有找到符合条件的剧本</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
