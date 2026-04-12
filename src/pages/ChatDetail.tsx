import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Send, Image as ImageIcon, Smile, Mic } from 'lucide-react';
import { useBottomSheet } from '@/src/context/BottomSheetContext';

export default function ChatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: '你好！今天有空拼车打本吗？', time: '14:23' },
    { id: 2, sender: 'me', text: '有空的，你们缺几个人？', time: '14:25' },
    { id: 3, sender: 'other', text: '缺一个男位，打《死光法则》，上车不？', time: '14:26' },
  ]);
  const [inputText, setInputText] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
  };

  const showMoreOptions = () => {
    showBottomSheet(
      <div className="p-4 flex flex-col gap-2">
        <div className="w-full text-center text-white font-bold mb-4">聊天设置</div>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-white w-full text-left" onClick={() => { navigate(`/user/${id}`); hideBottomSheet(); }}>
          查看个人主页
        </button>
        <button className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl active:scale-[0.98] transition-transform text-red-500 w-full text-left" onClick={() => { alert('已清空聊天记录'); hideBottomSheet(); }}>
          清空聊天记录
        </button>
        <button className="w-full p-4 mt-2 bg-neutral-800 text-white rounded-xl active:scale-[0.98] transition-transform" onClick={hideBottomSheet}>取消</button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="bg-neutral-950 px-4 py-3 sticky top-0 z-40 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-base">推理大师_Seven</span>
        </div>
        <button onClick={showMoreOptions} className="p-2 -mr-2 text-neutral-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[75%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
              <img
                src={msg.sender === 'me' ? 'https://picsum.photos/seed/me/40/40' : `https://picsum.photos/seed/${id}/40/40`}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                alt="avatar"
              />
              <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-red-600 text-white rounded-tr-sm' : 'bg-neutral-800 text-white rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-neutral-600 mt-1 mx-1">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-neutral-900 px-4 py-3 shrink-0 pb-safe">
        <div className="flex items-end gap-3">
          <button className="p-2 text-neutral-400 shrink-0">
            <Mic className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-neutral-950 rounded-2xl flex items-center pr-2 border border-neutral-800">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="发消息..."
              className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none text-white"
            />
            <button className="p-2 text-neutral-400">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-400">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          {inputText.trim() ? (
             <button onClick={handleSend} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform">
               <Send className="w-4 h-4 ml-0.5" />
             </button>
          ) : (
             <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 shrink-0">
               <MoreHorizontal className="w-5 h-5" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
