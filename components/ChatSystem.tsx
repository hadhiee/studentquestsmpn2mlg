import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Competitor, PlayerStats } from '../types';
import { generateStudentResponse } from '../services/geminiService';

interface ChatSystemProps {
  competitors: Competitor[];
  playerStats: PlayerStats;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ competitors, playerStats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting: ChatMessage = {
        id: 'init-1',
        senderId: 'system',
        senderName: 'Temporal System',
        text: 'Koneksi Comm-Link Aktif. Selamat datang di saluran SMPN 2 Malang.',
        timestamp: Date.now(),
        isMe: false
      };
      setMessages([greeting]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Random bot messages to make it feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const bot = competitors[Math.floor(Math.random() * competitors.length)];
        const botMsgs = [
          "Gila, Cordoba keren banget visualnya!",
          "Ada yang tau jawaban soal Al-Zahrawi?",
          "Skor gue dikit lagi nyalip nih, siap-siap ya!",
          "Misi Damaskus kelar, lanjut ke Afrika Utara!",
          "Semangat rek, SMPN 2 Malang pasti bisa!"
        ];
        const randomMsg: ChatMessage = {
          id: `bot-msg-${Date.now()}`,
          senderId: bot.id,
          senderName: bot.name,
          text: botMsgs[Math.floor(Math.random() * botMsgs.length)],
          timestamp: Date.now(),
          isMe: false,
          avatarUrl: bot.avatarUrl
        };
        setMessages(prev => [...prev.slice(-49), randomMsg]);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [competitors]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const myMsg: ChatMessage = {
      id: `me-${Date.now()}`,
      senderId: 'me',
      senderName: playerStats.name,
      text: inputText,
      timestamp: Date.now(),
      isMe: true,
      avatarUrl: playerStats.avatarUrl
    };

    setMessages(prev => [...prev, myMsg]);
    setInputText('');
    
    // Trigger bot response
    setIsTyping(true);
    const respondingBot = competitors[Math.floor(Math.random() * competitors.length)];
    const aiResponse = await generateStudentResponse(respondingBot.name, inputText);
    
    setTimeout(() => {
      const botReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: respondingBot.id,
        senderName: respondingBot.name,
        text: aiResponse,
        timestamp: Date.now(),
        isMe: false,
        avatarUrl: respondingBot.avatarUrl
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border-2 border-holo-blue/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/10">
          {/* Header */}
          <div className="p-4 bg-slate-800/80 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <h3 className="text-white font-sci-fi text-[10px] tracking-widest uppercase font-bold">TEMPORAL COMM-LINK</h3>
                <p className="text-[9px] text-slate-500 uppercase font-mono">Channel: SMPN 2 Malang</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.05)_0%,transparent_70%)]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.avatarUrl && (
                    <img src={msg.avatarUrl} className="w-6 h-6 rounded-full border border-slate-700" alt="" />
                  )}
                  <div className={`p-3 rounded-2xl text-sm font-content shadow-lg ${
                    msg.isMe 
                      ? 'bg-holo-blue text-white rounded-br-none' 
                      : msg.senderId === 'system' 
                        ? 'bg-slate-800 text-slate-400 italic text-[11px] border border-slate-700'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                  }`}>
                    {msg.senderId !== 'system' && !msg.isMe && (
                      <span className="block text-[10px] font-bold text-gold-dust mb-1 uppercase tracking-tighter">{msg.senderName}</span>
                    )}
                    {msg.text}
                  </div>
                </div>
                <span className="text-[9px] text-slate-600 mt-1 font-mono px-8">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1 p-2 bg-slate-800/40 rounded-full w-12 justify-center items-center">
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/50 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pesan temporal..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-holo-blue text-white placeholder:text-slate-600"
            />
            <button 
              type="submit"
              className="w-10 h-10 bg-holo-blue rounded-full flex items-center justify-center text-white hover:bg-sky-400 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-holo-blue rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all hover:scale-110 active:scale-90"
        >
          <div className="absolute inset-0 bg-holo-blue rounded-full animate-ping opacity-20"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-void-dark flex items-center justify-center text-[10px] font-bold">2</div>
        </button>
      )}
    </div>
  );
};