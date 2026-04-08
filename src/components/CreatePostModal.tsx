import { useState } from 'react';
import { X, Image as ImageIcon, MapPin, Hash, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'lfg';
}

export default function CreatePostModal({ isOpen, onClose, type }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-100">
          <button onClick={onClose} className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-neutral-900">
            {type === 'post' ? '发布动态' : '发起拼车'}
          </h2>
          <button 
            disabled={!content.trim()}
            className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            发布
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === 'post' ? "分享你的剧本杀体验、测评或吐槽..." : "描述你想组的局，比如：缺1女，新手车，今晚8点发车..."}
            className="w-full flex-1 min-h-[150px] resize-none outline-none text-neutral-900 placeholder:text-neutral-400 text-base"
            autoFocus
          />
          
          {/* Toolbar */}
          <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-xs font-medium transition-colors">
              <ImageIcon className="w-4 h-4" />
              添加图片
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-xs font-medium transition-colors">
              <Hash className="w-4 h-4" />
              关联剧本
            </button>
            {type === 'lfg' && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-xs font-medium transition-colors">
                <MapPin className="w-4 h-4" />
                线下门店
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
