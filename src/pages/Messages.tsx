import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, MessageSquare, Users, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import PublicProfileModal from '@/src/components/PublicProfileModal';

const mockChats = [
  {
    id: 'c1',
    user: '推理狂魔',
    avatar: 'https://picsum.photos/seed/p1/40/40',
    lastMessage: '今晚8点的车，别迟到啊！',
    time: '14:30',
    unread: 2,
    isOnline: true
  },
  {
    id: 'c2',
    user: '情感本爱好者',
    avatar: 'https://picsum.photos/seed/p2/40/40',
    lastMessage: '上次那个本真的太好哭了...',
    time: '昨天',
    unread: 0,
    isOnline: false
  },
  {
    id: 'c3',
    user: '硬核玩家',
    avatar: 'https://picsum.photos/seed/u3/40/40',
    lastMessage: '[组局邀请] 邀请你加入《林家大院》',
    time: '星期二',
    unread: 0,
    isOnline: true
  }
];

const mockFriends = [
  { id: 'f1', name: '推理狂魔', avatar: 'https://picsum.photos/seed/p1/40/40', status: '在线', isPlaying: true },
  { id: 'f2', name: '情感本爱好者', avatar: 'https://picsum.photos/seed/p2/40/40', status: '离线', isPlaying: false },
  { id: 'f3', name: '硬核玩家', avatar: 'https://picsum.photos/seed/u3/40/40', status: '在线', isPlaying: false },
  { id: 'f4', name: '剧本杀老司机', avatar: 'https://picsum.photos/seed/u1/40/40', status: '在线', isPlaying: true },
];

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');
  const [selectedProfileUser, setSelectedProfileUser] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 relative">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">消息</h1>
          <div className="flex gap-3">
            <button className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-6 border-b border-neutral-100">
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors flex items-center gap-1", activeTab === 'chats' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('chats')}
          >
            聊天
            <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">2</span>
            {activeTab === 'chats' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors", activeTab === 'friends' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('friends')}
          >
            好友
            {activeTab === 'friends' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'chats' ? "搜索聊天记录..." : "搜索好友..."}
            className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        {activeTab === 'chats' ? (
          <div className="space-y-2">
            {mockChats.map(chat => (
              <div key={chat.id} className="bg-white p-3 rounded-2xl flex items-center gap-3 active:bg-neutral-50 transition-colors cursor-pointer">
                <div className="relative shrink-0">
                  <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-neutral-900 truncate">{chat.user}</h3>
                    <span className="text-[10px] text-neutral-400 shrink-0">{chat.time}</span>
                  </div>
                  <p className={cn("text-xs truncate", chat.unread > 0 ? "text-neutral-900 font-medium" : "text-neutral-500")}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="shrink-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="p-3 flex items-center gap-3 border-b border-neutral-100 active:bg-neutral-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="font-bold text-neutral-900 text-sm">新的朋友</span>
              </div>
              <div className="p-3 flex items-center gap-3 active:bg-neutral-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-bold text-neutral-900 text-sm">我的群组</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 px-2 uppercase">在线好友 ({mockFriends.filter(f => f.status === '在线').length})</h3>
              {mockFriends.map(friend => (
                <div 
                  key={friend.id} 
                  onClick={() => setSelectedProfileUser({
                    id: friend.id,
                    name: friend.name,
                    avatar: friend.avatar,
                    level: 12,
                    bio: '这个人很懒，什么都没写。',
                    stats: { played: 45, mvps: 12, winRate: '85%' },
                    achievements: ['逻辑鬼才', '戏精附体'],
                    favoriteRoles: ['凶手', '侦探']
                  })}
                  className="bg-white p-3 rounded-2xl flex items-center gap-3 active:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <img src={friend.avatar} alt={friend.name} className={cn("w-10 h-10 rounded-full object-cover", friend.status === '离线' && "grayscale")} referrerPolicy="no-referrer" />
                    <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full", friend.status === '在线' ? "bg-green-500" : "bg-neutral-300")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 text-sm truncate">{friend.name}</h3>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                      {friend.isPlaying ? (
                        <span className="text-purple-600 font-medium">游戏中 - 剧本杀</span>
                      ) : friend.status === '在线' ? (
                        <span className="text-green-600 font-medium">在线</span>
                      ) : (
                        <span>离线</span>
                      )}
                    </p>
                  </div>
                  {friend.status === '在线' && !friend.isPlaying && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('邀请已发送！');
                      }}
                      className="shrink-0 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      邀请组局
                    </button>
                  )}
                  {friend.isPlaying && (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 px-3 py-1.5 bg-neutral-100 text-neutral-500 text-xs font-bold rounded-lg cursor-not-allowed"
                    >
                      游戏中
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Public Profile Modal */}
      <PublicProfileModal 
        isOpen={!!selectedProfileUser}
        onClose={() => setSelectedProfileUser(null)}
        user={selectedProfileUser}
      />
    </div>
  );
}
