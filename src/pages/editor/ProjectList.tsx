import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Edit3, Trash2, Globe, Clock, Settings, FileText } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

const MOCK_PROJECTS = [
  { id: '1', title: '第七号嫌疑人', type: '推理/硬核', status: 'PUBLISHED', lastModified: '2024-05-12' },
  { id: '2', title: '迷雾山庄的钟声', type: '恐怖/微恐', status: 'DRAFT', lastModified: '昨天 14:30' },
  { id: '3', title: '未命名的新剧本', type: '欢乐/机制', status: 'DRAFT', lastModified: '刚刚' },
];

export default function ProjectList() {
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  const showOptions = (project: any) => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-center text-white mb-4">项目：{project.title}</h3>
        <button
          className="flex items-center gap-3 p-4 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform text-left"
          onClick={() => { hideBottomSheet(); navigate(`/editor/project/${project.id}`); }}
        >
          <Edit3 className="w-5 h-5 text-neutral-400" /> 进入编辑器
        </button>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform text-left">
          <Settings className="w-5 h-5 text-neutral-400" /> 基础属性设置
        </button>
        {project.status === 'DRAFT' && (
          <button className="flex items-center gap-3 p-4 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform text-left">
            <Globe className="w-5 h-5 text-neutral-400" /> 提交发布审核
          </button>
        )}
        <button
          className="flex items-center gap-3 p-4 bg-neutral-800 text-red-500 rounded-xl active:scale-[0.98] transition-transform text-left"
          onClick={() => {
             if (confirm('确定要删除该项目吗？此操作不可逆。')) {
               setProjects(prev => prev.filter(p => p.id !== project.id));
               hideBottomSheet();
             }
          }}
        >
          <Trash2 className="w-5 h-5 text-red-500" /> 删除项目
        </button>
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-black text-lg">创作者中心</h1>
            <span className="text-[10px] text-neutral-500">我的剧本工作台</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex flex-col gap-4">
        {/* Create Button */}
        <div
          onClick={() => alert('创建新剧本')}
          className="bg-neutral-900/50 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-all text-neutral-500 hover:text-white mb-2"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3 group-hover:bg-red-600 transition-colors">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-sm">创建新剧本</span>
        </div>

        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-2 mb-1">
          我的项目库 ({projects.length})
        </div>

        {/* Project List */}
        {projects.map(proj => (
          <div key={proj.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 relative">
             <div className="w-16 h-20 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-neutral-600" />
             </div>
             <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base text-white truncate max-w-[70%]">{proj.title}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${proj.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                    {proj.status === 'PUBLISHED' ? '已发布' : '草稿'}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mb-2">{proj.type}</div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-auto">
                  <Clock className="w-3 h-3" /> 修改于 {proj.lastModified}
                </div>
             </div>

             <button onClick={() => showOptions(proj)} className="p-2 absolute top-2 right-2 text-neutral-500 hover:text-white transition-colors">
               <MoreVertical className="w-5 h-5" />
             </button>

             <button
               onClick={() => navigate(`/editor/project/${proj.id}`)}
               className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-500 active:scale-95 transition-all px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg shadow-red-600/20"
             >
               编辑
             </button>
          </div>
        ))}
      </main>
    </div>
  );
}
