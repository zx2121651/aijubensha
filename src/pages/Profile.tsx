import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, History, Heart, Star, Users, Clock, Edit3, LogOut, Trophy, Target, User } from 'lucide-react';
import { scripts } from '@/src/data/scripts';
import { cn } from '@/lib/utils';

// Mock User Data
const defaultUserProfile = {
  name: '剧本杀老司机',
  id: 'ID: 839201',
  avatar: 'https://picsum.photos/seed/u1/150/150',
  bio: '推理无情，沉浸有爱。',
  stats: {
    played: 42,
    favorites: 15,
    reviews: 8
  }
};

// Mock History Data
const playHistory = [
  { id: 'h1', scriptId: '1', role: '林少爷', date: '2023-10-01', dm: '小黑', location: '线上车队' },
  { id: 'h2', scriptId: '3', role: '神秘人', date: '2023-09-15', dm: '阿白', location: '迷雾推理馆' }
];

// Mock Favorites Data
const favoriteIds = ['2', '5'];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [user, setUser] = useState<{ email: string, username: string, avatar: string } | null>(null);
  const [avatar, setAvatar] = useState(defaultUserProfile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setAvatar(parsedUser.avatar || defaultUserProfile.avatar);
    }
    
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('user_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const favoriteScripts = scripts.filter(s => favoriteIds.includes(s.id));
  const historyScripts = playHistory.map(h => ({
    ...h,
    script: scripts.find(s => s.id === h.scriptId)
  })).filter(h => h.script);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white px-4 pt-8 pb-6 shadow-sm relative">
        <div className="absolute top-4 right-4 flex gap-3">
          {user && (
            <button onClick={handleLogout} className="text-neutral-600 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <Link to="/settings" className="text-neutral-600 hover:text-neutral-900">
            <Settings className="w-6 h-6" />
          </Link>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4 mt-4">
            <div className="relative cursor-pointer" onClick={handleAvatarClick}>
              <img 
                src={avatar} 
                alt="avatar" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <button className="absolute bottom-0 right-0 bg-neutral-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-neutral-800 transition-colors">
                <Edit3 className="w-3 h-3" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-neutral-900">{user.username}</h1>
              <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
              <p className="text-sm text-neutral-600 mt-2">{defaultUserProfile.bio}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">未登录</h2>
            <p className="text-sm text-neutral-500 mb-6">登录后可查看游戏记录和收藏</p>
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
            >
              去登录 / 注册
            </button>
          </div>
        )}

        {/* Stats */}
        {user && (
          <div className="flex justify-between mt-6 px-4 py-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="text-center">
              <p className="text-2xl font-black text-neutral-900">{defaultUserProfile.stats.played}</p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">已玩剧本</p>
            </div>
            <div className="w-px bg-neutral-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-neutral-900">12</p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">MVP次数</p>
            </div>
            <div className="w-px bg-neutral-200" />
            <div className="text-center">
              <p className="text-2xl font-black text-neutral-900">85%</p>
              <p className="text-xs text-neutral-500 mt-1 font-medium">逃脱率</p>
            </div>
          </div>
        )}
      </div>

      {user && (
        <>
          {/* Achievements & Wallet */}
          <div className="px-4 mt-4 flex gap-3">
            <Link to="/achievements" className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">成就徽章</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5">已解锁 15/42</p>
                </div>
              </div>
            </Link>
            
            <Link to="/wallet" className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">¥</div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">我的钱包</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5 text-red-600 font-bold">12,500 金币</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="px-4 mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <Link to="/inventory" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                  </div>
                  <span className="font-bold text-neutral-900 text-sm">我的背包</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link to="/clubs" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  </div>
                  <span className="font-bold text-neutral-900 text-sm">我的俱乐部</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-0 z-30 bg-white border-b border-neutral-100 flex mt-4">
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative",
            activeTab === 'history' ? "text-red-600" : "text-neutral-500"
          )}
        >
          <History className="w-4 h-4" />
          我的战绩
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={cn(
            "flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative",
            activeTab === 'favorites' ? "text-red-600" : "text-neutral-500"
          )}
        >
          <Heart className="w-4 h-4" />
          我的收藏
          {activeTab === 'favorites' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyScripts.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-neutral-100">
                  <span className="text-xs text-neutral-500">{item.date}</span>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">已完成</span>
                </div>
                <Link to={`/script/${item.scriptId}`} className="flex gap-4">
                  <img 
                    src={item.script!.cover} 
                    alt={item.script!.title} 
                    className="w-16 h-24 object-cover rounded-lg shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 mb-1">{item.script!.title}</h3>
                    <div className="text-xs text-neutral-600 space-y-1">
                      <p><span className="text-neutral-400">扮演角色：</span>{item.role}</p>
                      <p><span className="text-neutral-400">组局地点：</span>{item.location}</p>
                      <p><span className="text-neutral-400">主持人：</span>{item.dm}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 self-center" />
                </Link>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-neutral-50 text-neutral-600 text-xs font-bold rounded-lg hover:bg-neutral-100 transition-colors">
                    写评价
                  </button>
                  <button className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                    再组一局
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteScripts.map(script => (
              <Link key={script.id} to={`/script/${script.id}`} className="block bg-white rounded-2xl p-3 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="relative w-20 h-28 shrink-0">
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
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-neutral-900 text-base leading-tight mb-1">{script.title}</h3>
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {script.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-auto">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {script.players.male + script.players.female + script.players.any}人</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {script.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {favoriteScripts.length === 0 && (
              <div className="text-center py-12 text-neutral-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>暂无收藏剧本</p>
              </div>
            )}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
