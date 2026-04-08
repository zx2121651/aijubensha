import { useState } from 'react';
import { X, Users, Clock, Lock, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RoomLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptId: string;
  scriptTitle: string;
}

export default function RoomLobbyModal({ isOpen, onClose, scriptId, scriptTitle }: RoomLobbyModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [password, setPassword] = useState('');
  
  if (!isOpen) return null;

  const mockRooms = [
    { id: 'r1', name: '新手发车，DM耐心带', host: '推理小白', players: 4, maxPlayers: 6, hasPassword: false, tags: ['新手友好', '语音车'] },
    { id: 'r2', name: '硬核推理，缺2高配', host: '剧本杀老司机', players: 4, maxPlayers: 6, hasPassword: true, tags: ['进阶', '硬核'] },
    { id: 'r3', name: '情感本，猛男落泪', host: '情感天后', players: 5, maxPlayers: 6, hasPassword: false, tags: ['情感', '沉浸'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full sm:max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">房间大厅</h2>
            <p className="text-xs text-neutral-500">{scriptTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-neutral-50 border-b border-neutral-100">
          <button 
            onClick={() => setActiveTab('list')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-colors", activeTab === 'list' ? "bg-white text-red-600 shadow-sm" : "text-neutral-500")}
          >
            加入房间
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-colors", activeTab === 'create' ? "bg-white text-red-600 shadow-sm" : "text-neutral-500")}
          >
            创建房间
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              {mockRooms.map(room => (
                <div key={room.id} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                        {room.hasPassword && <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                        {room.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">房主: {room.host}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5" />
                      {room.players}/{room.maxPlayers}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {room.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/room/${scriptId}`)}
                    className="w-full py-2.5 mt-1 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    加入房间 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-2">房间名称</label>
                <input type="text" placeholder="给你的房间起个吸引人的名字" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-2">房间密码 (选填)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="不设置则为公开房间" 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-2">房间标签</label>
                <div className="flex flex-wrap gap-2">
                  {['新手友好', '进阶', '硬核', '情感', '欢乐', '机制', '语音车', '视频车'].map(tag => (
                    <button key={tag} className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/room/${scriptId}`)}
                className="w-full py-3.5 mt-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                <Plus className="w-4 h-4" />
                创建并进入房间
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
