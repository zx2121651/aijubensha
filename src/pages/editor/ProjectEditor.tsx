import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PlayCircle, Plus, Eye, Share2, MousePointer2, Move, Type, HelpCircle, Activity, FileJson, Users, Map, Settings, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';
import AssetManagerDrawer from '@/src/pages/editor/AssetManagerDrawer';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const [activeTool, setActiveTool] = useState('select');
  const [nodes, setNodes] = useState([
    { id: '1', type: 'text', x: 50, y: 50, label: '【开场】苏管家自述' },
    { id: '2', type: 'choice', x: 250, y: 150, label: '抉择：是否搜寻后院' },
    { id: '3', type: 'event', x: 450, y: 50, label: '触发特殊线索池' }
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (activeTool !== 'select') return;
    setDraggingNode(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNode) return;
    setNodes(prev => prev.map(n => {
      if (n.id === draggingNode) {
        return { ...n, x: n.x + e.movementX, y: n.y + e.movementY };
      }
      return n;
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingNode(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select') return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let newNode = { id: Date.now().toString(), type: 'text', x, y, label: '新节点' };
    if (activeTool === 'choice') newNode.type = 'choice';
    if (activeTool === 'event') newNode.type = 'event';

    setNodes(prev => [...prev, newNode]);
    setActiveTool('select');
  };

  const getNodeColor = (type: string) => {
    if (type === 'text') return 'bg-blue-600 border-blue-400';
    if (type === 'choice') return 'bg-yellow-600 border-yellow-400 text-black';
    if (type === 'event') return 'bg-purple-600 border-purple-400';
    return 'bg-neutral-600 border-neutral-400';
  };

  const showPublishModal = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-center text-white mb-2">发布项目</h2>
        <p className="text-sm text-neutral-400 text-center mb-4">
          发布前系统将自动执行【死循环】及【线索未闭环】的静态检测。通过后即可提交至官方审核。
        </p>
        <button className="py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors active:scale-95" onClick={() => { alert('模拟测试通过，已提交审核。'); hideBottomSheet(); navigate('/editor'); }}>
          执行检测并提交
        </button>
        <button className="py-4 rounded-xl bg-neutral-800 text-neutral-400 font-bold transition-colors active:scale-95 mt-2" onClick={hideBottomSheet}>
          取消
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden select-none">
      {/* Top Navigation */}
      <header className="h-14 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/editor')} className="p-1 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-sm">第七号嫌疑人</span>
            <span className="text-[10px] text-neutral-500">自动保存于 10:24</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1 active:scale-95">
            <PlayCircle className="w-3 h-3"/> 本地试玩
          </button>
          <button onClick={showPublishModal} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors flex items-center gap-1 active:scale-95">
            <Share2 className="w-3 h-3"/> 提审发布
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <aside className="w-16 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-4 gap-4 z-10">
          <button title="选择与拖拽" onClick={() => setActiveTool('select')} className={`p-3 rounded-xl transition-colors ${activeTool === 'select' ? 'bg-red-600/20 text-red-500' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            <MousePointer2 className="w-5 h-5" />
          </button>
          <div className="w-8 h-[1px] bg-neutral-800" />
          <button title="添加剧情文本节点" onClick={() => setActiveTool('text')} className={`p-3 rounded-xl transition-colors ${activeTool === 'text' ? 'bg-blue-500/20 text-blue-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            <Type className="w-5 h-5" />
          </button>
          <button title="添加分支选择节点" onClick={() => setActiveTool('choice')} className={`p-3 rounded-xl transition-colors ${activeTool === 'choice' ? 'bg-yellow-500/20 text-yellow-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            <HelpCircle className="w-5 h-5" />
          </button>
          <button title="添加事件触发节点" onClick={() => setActiveTool('event')} className={`p-3 rounded-xl transition-colors ${activeTool === 'event' ? 'bg-purple-500/20 text-purple-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            <Activity className="w-5 h-5" />
          </button>
          <div className="w-8 h-[1px] bg-neutral-800" />
          <button title="角色管理" onClick={() => alert('打开角色配置抽屉')} className="p-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mt-auto">
            <Users className="w-5 h-5" />
          </button>
          <button title="线索与地图管理" onClick={() => alert('打开地图搜证配置')} className="p-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <Map className="w-5 h-5" />
          </button>
          <button title="多媒体素材库" onClick={() => showBottomSheet(<AssetManagerDrawer />)} className="p-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mt-4">
            <FolderOpen className="w-5 h-5" />
          </button>
        </aside>

        {/* Canvas Area (Node Editor Mock) */}
        <main
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-neutral-950 cursor-crosshair"
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        >
          {/* Render Nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              onPointerDown={(e) => handlePointerDown(e, node.id)}
              className={`absolute px-4 py-2 rounded-lg border shadow-xl cursor-grab active:cursor-grabbing text-xs font-bold transition-shadow hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] select-none flex items-center justify-center min-w-[120px] ${getNodeColor(node.type)}`}
              style={{
                left: node.x,
                top: node.y,
                touchAction: 'none'
              }}
            >
              {node.label}
              {/* Node connection anchors (Mock) */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 border-2 border-neutral-400 rounded-full" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-900 border-2 border-neutral-400 rounded-full" />
            </div>
          ))}

          {activeTool !== 'select' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1.5 rounded-full text-xs font-bold text-white border border-neutral-800 backdrop-blur-sm pointer-events-none z-10">
              请在画布上点击放置新节点
            </div>
          )}
        </main>

        {/* Right Properties Panel */}
        <aside className="w-64 bg-neutral-900 border-l border-neutral-800 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-3 border-b border-neutral-800 font-bold text-sm flex items-center gap-2 text-neutral-300">
            <Settings className="w-4 h-4" /> 节点属性
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="text-center text-xs text-neutral-500 py-10">
               请选择一个节点进行编辑
            </div>
            {/* 模拟属性栏 */}
            <div className="opacity-30 pointer-events-none">
              <label className="text-xs text-neutral-400 block mb-1">节点名称</label>
              <input type="text" disabled className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white mb-3" value="【开场】苏管家自述"/>
              <label className="text-xs text-neutral-400 block mb-1">文本内容</label>
              <textarea disabled className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-sm text-white h-32 resize-none" value="那是一个风雨交加的夜晚..."/>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
