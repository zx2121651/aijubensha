import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Search, Plus, ChevronRight, Trophy, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Clubs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('discover');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');

  const myClub = {
    id: 'c1',
    name: '福尔摩斯探案集',
    logo: 'https://picsum.photos/seed/club1/100/100',
    level: 5,
    members: 42,
    maxMembers: 50,
    role: 'member',
    notice: '本周五晚8点组织《林家大院》发车，缺2人，速来报名！'
  };

  const discoverClubs = [
    { id: 'c2', name: '深夜推理局', logo: 'https://picsum.photos/seed/club2/100/100', level: 8, members: 89, tags: ['硬核', '修仙'] },
    { id: 'c3', name: '戏精学院', logo: 'https://picsum.photos/seed/club3/100/100', level: 4, members: 35, tags: ['情感', '欢乐'] },
    { id: 'c4', name: '阿加莎的茶话会', logo: 'https://picsum.photos/seed/club4/100/100', level: 6, members: 60, tags: ['本格', '新手友好'] },
  ];

  const handleCreateClub = () => {
    if (!newClubName.trim()) {
      alert('请输入俱乐部名称');
      return;
    }
    alert('俱乐部创建成功！');
    setIsCreateModalOpen(false);
    setNewClubName('');
    setNewClubDesc('');
    setActiveTab('my');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      {/* Header */}
      <header className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">俱乐部</h1>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="p-2 -mr-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white px-4 pt-2 pb-4 shadow-sm mb-4">
        <div className="flex gap-6 border-b border-neutral-100">
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors", activeTab === 'discover' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('discover')}
          >
            发现俱乐部
            {activeTab === 'discover' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
          <button 
            className={cn("pb-3 text-sm font-bold relative transition-colors", activeTab === 'my' ? "text-red-600" : "text-neutral-500")}
            onClick={() => setActiveTab('my')}
          >
            我的俱乐部
            {activeTab === 'my' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-t-full" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'my' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img src={myClub.logo} alt={myClub.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-neutral-900">{myClub.name}</h2>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Lv.{myClub.level}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {myClub.members}/{myClub.maxMembers} 人</span>
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 成员</span>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-xl mb-4">
                <div className="text-xs font-bold text-neutral-900 mb-1 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" /> 最新公告
                </div>
                <p className="text-sm text-neutral-600">{myClub.notice}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-bold rounded-xl transition-colors">
                  俱乐部大厅
                </button>
                <button className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-colors">
                  内部发车
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="搜索俱乐部名称或ID..." 
                className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
            
            {discoverClubs.map(club => (
              <div key={club.id} className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center gap-4">
                <img src={club.logo} alt={club.name} className="w-14 h-14 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-neutral-900 truncate">{club.name}</h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">Lv.{club.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <Users className="w-3.5 h-3.5" /> {club.members} 人
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {club.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-colors shrink-0">
                  申请加入
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Club Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
            <div className="px-4 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-neutral-900">创建俱乐部</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Logo Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex flex-col items-center justify-center text-neutral-400 border border-neutral-200 border-dashed cursor-pointer hover:bg-neutral-200 transition-colors">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">上传标志</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">俱乐部名称</label>
                  <input 
                    type="text" 
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    placeholder="给你的俱乐部起个响亮的名字" 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">俱乐部简介</label>
                  <textarea 
                    value={newClubDesc}
                    onChange={(e) => setNewClubDesc(e.target.value)}
                    placeholder="简单介绍一下你的俱乐部，吸引更多同好加入..." 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">加入条件</label>
                  <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                    <option value="any">任何人均可加入</option>
                    <option value="approval">需要管理员审批</option>
                    <option value="level">需要达到特定等级</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 bg-white">
              <button 
                onClick={handleCreateClub}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
              >
                确认创建 (消耗 500 金币)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
