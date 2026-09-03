// ============================================================
// ChatAssistantDrawer.jsx — Slide-out AI travel assistant
// drawer with typing indicators and conversation history.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Sparkles, RotateCcw,
  Compass, MapPin, ShoppingBag, UtensilsCrossed
} from 'lucide-react';
import { askTravelAssistant } from '../../services/geminiService';

const QUICK_PROMPTS = [
  { icon: Compass,         text: 'Best 3-day plan in Kyoto?' },
  { icon: ShoppingBag,     text: 'What should I pack for Iceland?' },
  { icon: UtensilsCrossed, text: 'Must-try foods in Bali' },
  { icon: MapPin,          text: 'Budget tips for Paris?' },
];

const TypingIndicator = () => (
  <div className="flex items-end gap-2" aria-label="AI is typing" role="status">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
      <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
    </div>
    <div className="glass-light rounded-2xl rounded-bl-none px-4 py-3">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="typing-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-br-none'
            : 'glass-light text-slate-200 rounded-bl-none'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};

const ChatAssistantDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      content: "✈️ Hello! I'm WanderLux AI — your personal travel concierge. Ask me anything about destinations, packing lists, local culture, budgets, or let me help plan your perfect trip!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
      const response = await askTravelAssistant(content, history);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        content: response,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'model',
        content: "I'm having trouble connecting right now. Please try again in a moment!",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleReset = () => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      content: "✈️ Conversation reset! I'm WanderLux AI — your personal travel concierge. What adventure can I help you plan?",
    }]);
    setInput('');
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onClose === undefined ? undefined : () => {}}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow cursor-pointer animate-pulse-ring"
            aria-label="Open AI travel assistant"
            style={{ display: isOpen ? 'none' : 'flex' }}
          >
            <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-60"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-70 flex flex-col glass-card border-l border-white/8 shadow-card"
            role="dialog"
            aria-modal="true"
            aria-label="WanderLux AI Travel Assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">WanderLux AI</h2>
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" aria-hidden="true" />
                    Online — Ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
                  aria-label="Close AI assistant"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-2">Try asking:</p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => sendMessage(text)}
                      className="flex items-center gap-2 text-left px-3 py-2 rounded-xl glass-light text-slate-300 hover:text-white hover:bg-white/10 text-xs transition-all"
                      aria-label={`Ask: ${text}`}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" aria-hidden="true" />
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/8"
              aria-label="Send a message"
            >
              <div className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">Ask WanderLux AI</label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about any destination..."
                  className="input-field flex-1 text-sm"
                  disabled={isTyping}
                  aria-label="Type your travel question"
                  aria-disabled={isTyping}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="btn btn-primary px-4 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistantDrawer;
