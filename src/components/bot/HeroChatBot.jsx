// src/components/bot/HeroChatBot.jsx
// Komponen Chatbot Khusus Hero: Mendukung perintah /test, /nama, /id, /help, /info, dll.

import React, { useState, useRef, useEffect } from 'react';

export default function HeroChatBot({ hero }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Halo! Saya bot asisten untuk hero ${hero?.name || 'ini'}. Coba ketik perintah /test, /nama, atau /id`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Proses perintah bot
    setTimeout(() => {
      let botResponse = '';
      const cmd = trimmed.toLowerCase();

      if (cmd === '/test') {
        botResponse = `Nama hero: ${hero?.name || 'Unknown'}`;
      } else if (cmd === '/nama') {
        botResponse = `${hero?.name || 'Unknown'}`;
      } else if (cmd === '/id') {
        botResponse = `Hero ID: #${hero?.heroId || '-'}`;
      } else if (cmd === '/info' || cmd === '/role') {
        const roles = hero?.roles?.map(r => r.rawTitle || r.title).join(', ') || 'Tidak ada data role';
        const lanes = hero?.lanes?.map(l => l.rawTitle || l.title).join(', ') || 'Tidak ada data lane';
        botResponse = `${hero?.name} adalah hero dengan Role [${roles}] dan biasa bermain di [${lanes}].`;
      } else if (cmd === '/help') {
        botResponse = `Perintah yang tersedia:\n• /test - Balas nama hero\n• /nama - Balas nama hero\n• /id - Balas ID hero\n• /info - Info role & lane`;
      } else {
        botResponse = `Perintah tidak dikenali. Gunakan perintah:\n• /test\n• /nama\n• /id`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleQuickCommand = (cmd) => {
    setInputText(cmd);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/95 overflow-hidden flex flex-col h-[520px] shadow-2xl">
      {/* Bot Header */}
      <div className="px-4 py-3 bg-gray-950 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-sm shadow">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{hero?.name} Bot Asisten</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>
            <p className="text-[10px] text-gray-400">Siap merespons perintah /test, /nama, /id</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 border border-white/10 text-amber-400">
            ID: #{hero?.heroId}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs shrink-0 mb-1">
                  <i className="fa-solid fa-robot"></i>
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-amber-400 text-gray-950 font-medium rounded-br-none shadow-md'
                    : 'bg-gray-800 text-gray-100 rounded-bl-none border border-white/5'
                }`}
              >
                <div className="whitespace-pre-line font-mono">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isUser ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-gray-800 text-gray-300 flex items-center justify-center text-xs shrink-0 mb-1 border border-white/10">
                  <i className="fa-solid fa-user"></i>
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-1.5 text-gray-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Command Buttons */}
      <div className="px-3 py-1.5 bg-gray-950/80 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-gray-500 uppercase font-semibold shrink-0 mr-1">Coba:</span>
        {['/test', '/nama', '/id', '/info', '/help'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleQuickCommand(cmd)}
            className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-gray-800 hover:bg-gray-700 text-amber-300 border border-amber-400/20 transition-colors whitespace-nowrap shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-gray-950 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik /test, /nama, atau /id..."
          className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition font-mono"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-gray-950 font-bold flex items-center justify-center transition-colors shrink-0"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  );
}
