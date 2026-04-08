import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, MessageSquare, Users, Bell, Megaphone, ShieldAlert, Check, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import PublicProfileModal from '@/src/components/PublicProfileModal';

const mockChats = [
  {
    id: 'sys_1',
    user: '系统通知',
    avatar: 'sys', // Special indicator for system icon
    lastMessage: '您的账号在异地登录，请注意账号安全。',
    time: '刚刚',
    unread: 1,
    isOnline: false,
    isSystem: true
  },
  {
    id: 'sys_2',
    user: '官方公告',
    avatar: 'announcement', // Special indicator for announcement
    lastMessage: 'V1.2.0 版本更新：全新《良辰吉日》剧本上线！',
    time: '10:00',
    unread: 0,
    isOnline: false,
    isSystem: true
  },
  {
    id: 'group_1',
    user: '硬核推土机交流群 (128)',
    avatar: 'group', // Special indicator for group
    lastMessage: '玩家A: 这个密室的设计绝了！',
    time: '14:30',
    unread: 5,
    isOnline: false,
    isGroup: true
  },
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

const mockVisitors = [
  { id: 'v1', name: '访客A', avatar: 'https://picsum.photos/seed/v1/40/40', time: '10分钟前' },
  { id: 'v2', name: '访客B', avatar: 'https://picsum.photos/seed/v2/40/40', time: '1小时前' },
  { id: 'v3', name: '访客C', avatar: 'https://picsum.photos/seed/v3/40/40', time: '昨天' },
  { id: 'v4', name: '访客D', avatar: 'https://picsum.photos/seed/v4/40/40', time: '3天前' },
];

const mockFriendRequests = [
  { id: 'req1', name: '小白求带', avatar: 'https://picsum.photos/seed/req1/40/40', message: '大佬带带我，刚玩这个APP' },
  { id: 'req2', name: '夜行者', avatar: 'https://picsum.photos/seed/req2/40/40', message: '上次一起玩过《诡影》，加个好友' },
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
              <div key={chat.id} className={cn("bg-white p-3 rounded-2xl flex items-center gap-3 active:bg-neutral-50 transition-colors cursor-pointer", chat.isSystem && "bg-blue-50/30 border border-blue-100")}>
                <div className="relative shrink-0">
                  {chat.avatar === 'sys' ? (
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  ) : chat.avatar === 'announcement' ? (
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Megaphone className="w-6 h-6" />
                    </div>
                  ) : chat.avatar === 'group' ? (
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Users className="w-6 h-6" />
                    </div>
                  ) : (
                    <img src={chat.avatar} alt={chat.user} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  )}
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full translate-x-1 translate-y-1" />
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
          <div className="space-y-6">
            {/* 最近访客 (Horizontal Scroll) */}
            <div>
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  最近访客
                </h3>
                <span className="text-[10px] text-neutral-400">全部</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x hide-scrollbar">
                {mockVisitors.map(visitor => (
                  <div key={visitor.id} className="flex flex-col items-center gap-1.5 snap-start shrink-0">
                    <img src={visitor.avatar} alt={visitor.name} className="w-12 h-12 rounded-full object-cover border border-neutral-100 shadow-sm" referrerPolicy="no-referrer" />
                    <span className="text-[10px] text-neutral-600 font-medium w-12 truncate text-center">{visitor.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 好友请求 */}
            {mockFriendRequests.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-neutral-500 px-2 mb-3 uppercase flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  好友请求
                </h3>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                  {mockFriendRequests.map((req, i) => (
                    <div key={req.id} className={cn("p-3 flex items-center gap-3", i !== mockFriendRequests.length - 1 && "border-b border-neutral-50")}>
                      <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-neutral-900 text-sm truncate">{req.name}</h4>
                        <p className="text-[10px] text-neutral-500 truncate">{req.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-neutral-50 text-neutral-400 flex items-center justify-center hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 在线好友列表 */}
            <div>
              <h3 className="text-xs font-bold text-neutral-500 px-2 mb-3 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                在线好友 ({mockFriends.filter(f => f.status === '在线').length})
              </h3>
              <div className="space-y-2">
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
                    className="bg-white p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-neutral-100 active:bg-neutral-50 transition-colors cursor-pointer"
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
