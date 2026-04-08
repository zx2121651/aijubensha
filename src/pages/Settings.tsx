import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, Mic, Video, Bell, Trash2, LogOut, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(80);
  const [micDevice, setMicDevice] = useState('default');
  const [cameraDevice, setCameraDevice] = useState('default');
  const [notifications, setNotifications] = useState({
    system: true,
    friends: true,
    likes: false,
  });
  const [showToast, setShowToast] = useState(false);

  const handleClearCache = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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
        <h1 className="text-lg font-bold text-neutral-900">系统设置</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="p-4 space-y-6 max-w-md mx-auto">
        {/* Audio & Video */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-neutral-500" />
            音视频设置
          </h2>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-700">主音量</span>
                <span className="text-neutral-500">{volume}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-neutral-700 mb-2">
                <Mic className="w-4 h-4 text-neutral-500" />
                麦克风设备
              </label>
              <select 
                value={micDevice}
                onChange={(e) => setMicDevice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="default">系统默认麦克风</option>
                <option value="mic1">外接麦克风 (USB Audio)</option>
                <option value="mic2">内置麦克风 (Built-in)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-neutral-700 mb-2">
                <Video className="w-4 h-4 text-neutral-500" />
                摄像头设备
              </label>
              <select 
                value={cameraDevice}
                onChange={(e) => setCameraDevice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="default">系统默认摄像头</option>
                <option value="cam1">前置摄像头 (FaceTime HD)</option>
                <option value="cam2">外接摄像头 (1080p WebCam)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-500" />
            消息通知
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">系统消息</div>
                <div className="text-xs text-neutral-500 mt-0.5">活动、更新及重要通知</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.system} onChange={() => setNotifications(p => ({...p, system: !p.system}))} />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">好友申请</div>
                <div className="text-xs text-neutral-500 mt-0.5">有人请求添加你为好友时</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.friends} onChange={() => setNotifications(p => ({...p, friends: !p.friends}))} />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">互动提醒</div>
                <div className="text-xs text-neutral-500 mt-0.5">被点赞、评论或@时</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={notifications.likes} onChange={() => setNotifications(p => ({...p, likes: !p.likes}))} />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Other */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
          <div className="space-y-1">
            <button 
              onClick={handleClearCache}
              className="w-full flex items-center justify-between py-3 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg px-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-neutral-500" />
                清除缓存
              </div>
              <span className="text-xs text-neutral-400">128 MB</span>
            </button>
            <button className="w-full flex items-center justify-between py-3 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg px-2 transition-colors">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-neutral-500" />
                关于我们
              </div>
              <span className="text-xs text-neutral-400">v1.2.0</span>
            </button>
          </div>
        </section>

        {/* Logout */}
        <button className="w-full py-3.5 bg-white border border-red-100 text-red-600 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </main>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          缓存已清除
        </div>
      )}
    </div>
  );
}
