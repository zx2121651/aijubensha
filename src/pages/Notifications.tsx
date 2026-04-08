import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Heart, UserPlus, MessageSquare, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Notifications Data
const initialNotifications = [
  {
    id: '1',
    type: 'system',
    title: '系统更新',
    content: '版本 1.2.0 已发布！新增了私聊和道具系统，快去体验吧。',
    time: '10分钟前',
    isRead: false,
    icon: Bell,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: '2',
    type: 'friend',
    title: '好友申请',
    content: '玩家「戏精本精」请求添加你为好友。',
    time: '2小时前',
    isRead: false,
    icon: UserPlus,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    action: true
  },
  {
    id: '3',
    type: 'like',
    title: '收到点赞',
    content: '「推理狂人」赞了你的剧本评价《长相思·破阵子》。',
    time: '昨天',
    isRead: true,
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  {
    id: '4',
    type: 'comment',
    title: '收到评论',
    content: '「阿白」评论了你的动态："这个本真的太好哭了！"',
    time: '昨天',
    isRead: true,
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleAcceptFriend = (id: string) => {
    // Mock accept
    handleMarkRead(id);
    alert('已同意好友申请');
  };

  const filteredNotifications = notifications.filter(n => activeTab === 'all' || !n.isRead);

  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900">通知中心</h1>
        <button 
          onClick={handleMarkAllRead}
          className="text-sm text-neutral-500 hover:text-neutral-900 font-medium"
        >
          全部已读
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 py-2 border-b border-neutral-200 flex gap-6">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            "pb-2 text-sm font-bold transition-colors relative",
            activeTab === 'all' ? "text-red-600" : "text-neutral-500"
          )}
        >
          全部
          {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={cn(
            "pb-2 text-sm font-bold transition-colors relative flex items-center gap-1",
            activeTab === 'unread' ? "text-red-600" : "text-neutral-500"
          )}
        >
          未读
          {notifications.some(n => !n.isRead) && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
          {activeTab === 'unread' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>}
        </button>
      </div>

      <main className="p-4 max-w-md mx-auto space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              onClick={() => handleMarkRead(notification.id)}
              className={cn(
                "bg-white p-4 rounded-2xl shadow-sm border transition-all cursor-pointer",
                notification.isRead ? "border-neutral-100 opacity-70" : "border-red-100 bg-red-50/30"
              )}
            >
              <div className="flex gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notification.bgColor)}>
                  <notification.icon className={cn("w-5 h-5", notification.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("text-sm font-bold", notification.isRead ? "text-neutral-700" : "text-neutral-900")}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-neutral-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-2">
                    {notification.content}
                  </p>
                  
                  {notification.action && !notification.isRead && (
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAcceptFriend(notification.id); }}
                        className="flex-1 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        同意
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(notification.id); }}
                        className="flex-1 py-1.5 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        忽略
                      </button>
                    </div>
                  )}
                </div>
                {!notification.isRead && (
                  <div className="shrink-0 pt-1">
                    <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">暂无通知</p>
          </div>
        )}
      </main>
    </div>
  );
}
