import React, { useState, useRef } from 'react';
import { X, UploadCloud, PlayCircle, Image as ImageIcon, Music, Video, PauseCircle, CheckCircle2 } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

interface Asset {
  id: string;
  name: string;
  type: 'IMAGE' | 'AUDIO' | 'VIDEO';
  url: string;
  duration?: string;
}

export default function AssetManagerDrawer() {
  const { hideBottomSheet } = useBottomSheet();
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'AUDIO' | 'VIDEO'>('IMAGE');
  const [isDragging, setIsDragging] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: '血迹.png', type: 'IMAGE', url: 'https://picsum.photos/seed/a1/200/200' },
    { id: '2', name: '遗书_背面.jpg', type: 'IMAGE', url: 'https://picsum.photos/seed/a2/200/200' },
    { id: '3', name: '恐怖惊悚_BGM_1.mp3', type: 'AUDIO', url: '#', duration: '03:20' },
    { id: '4', name: '尖叫声.wav', type: 'AUDIO', url: '#', duration: '00:04' },
  ]);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(a => a.type === activeTab);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) simulateUpload(files);
  };

  const simulateUpload = (files: File[]) => {
    const newAssets = files.map(file => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      type: file.type.startsWith('audio') ? 'AUDIO' as const : file.type.startsWith('video') ? 'VIDEO' as const : 'IMAGE' as const,
      url: URL.createObjectURL(file),
      duration: file.type.startsWith('audio') ? '00:15' : undefined
    }));

    // Switch tab to the type of the first uploaded file
    if (newAssets[0].type === 'AUDIO') setActiveTab('AUDIO');
    else if (newAssets[0].type === 'VIDEO') setActiveTab('VIDEO');
    else setActiveTab('IMAGE');

    setAssets(prev => [...newAssets, ...prev]);
  };

  return (
    <div className="flex flex-col h-[85vh] bg-neutral-900 text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 shrink-0">
        <h2 className="font-bold text-lg">项目多媒体素材库</h2>
        <button onClick={hideBottomSheet} className="p-2 hover:bg-neutral-800 rounded-full transition-colors active:scale-95">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Upload Dropzone */}
      <div className="p-4 shrink-0">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
            isDragging
              ? 'border-red-500 bg-red-500/10 text-red-500'
              : 'border-neutral-700 bg-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-6 h-6 mb-2" />
          <span className="text-xs font-bold">点击选择文件，或将素材拖拽到此处上传</span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,audio/*,video/*"
            onChange={(e) => {
               if (e.target.files) simulateUpload(Array.from(e.target.files));
               e.target.value = '';
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-4 mb-2 shrink-0">
        <button onClick={() => setActiveTab('IMAGE')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 border ${activeTab === 'IMAGE' ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'}`}>
          <ImageIcon className="w-3 h-3" /> 图片
        </button>
        <button onClick={() => setActiveTab('AUDIO')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 border ${activeTab === 'AUDIO' ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'}`}>
          <Music className="w-3 h-3" /> 音频
        </button>
        <button onClick={() => setActiveTab('VIDEO')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 border ${activeTab === 'VIDEO' ? 'bg-red-600 border-red-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'}`}>
          <Video className="w-3 h-3" /> 视频
        </button>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 opacity-50">
             {activeTab === 'IMAGE' ? <ImageIcon className="w-12 h-12 mb-2" /> : activeTab === 'AUDIO' ? <Music className="w-12 h-12 mb-2" /> : <Video className="w-12 h-12 mb-2" />}
             <span className="text-sm">暂无此类素材</span>
          </div>
        ) : (
          <div className={activeTab === 'IMAGE' ? "grid grid-cols-3 md:grid-cols-4 gap-3" : "flex flex-col gap-3"}>
            {filteredAssets.map(asset => (
              activeTab === 'IMAGE' ? (
                // Image Card
                <div key={asset.id} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 hover:border-red-500 transition-colors cursor-pointer" title={asset.name}>
                  <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={asset.name}/>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1 text-[10px] truncate">
                    {asset.name}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1 backdrop-blur-md hover:bg-red-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                // Audio/Video Card
                <div key={asset.id} className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:border-neutral-500 transition-colors group cursor-pointer">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPlayingId(playingId === asset.id ? null : asset.id); }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingId === asset.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse' : 'bg-neutral-900 text-neutral-400 group-hover:text-white'}`}
                  >
                    {playingId === asset.id ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate mb-1">{asset.name}</div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-neutral-500 font-mono">{asset.duration}</span>
                       <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
                         {playingId === asset.id && (
                           <div className="h-full bg-red-500 w-full origin-left animate-[pulse_2s_ease-in-out_infinite]" />
                         )}
                       </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-neutral-700 hover:bg-red-600 active:scale-95 transition-all text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100">
                    插入节点
                  </button>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
