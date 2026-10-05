import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  User,
  Zap,
  Minimize2
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import {
  fetchGenericQuestions,
  sendChatQuery,
  ChatMessage,
  GenericQuestionCategory
} from '@/utils/chatbotApi';

const AIChatbot: React.FC = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [genericCategories, setGenericCategories] = useState<GenericQuestionCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial setup: fetch generic questions & set welcome message
  useEffect(() => {
    fetchGenericQuestions().then((categories) => {
      setGenericCategories(categories);
    });

    const initialWelcomeMsg: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 Hi ${user?.firstName || 'there'}! I'm **nexaBot**, your personal AI Health & Nutrition Coach.\n\nHow can I help you today? Select a **suggested question** below or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        "How accurate is the Calorie Predictor in nexaFit?",
        "What are some high-protein vegetarian meals for muscle recovery?",
        "How does nexaFit generate personalized meal plans?",
        "How much water should I drink daily when exercising?"
      ]
    };
    setMessages([initialWelcomeMsg]);
  }, [user?.firstName]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatQuery(queryText, messages, user?.id || 'guest');
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: response.category,
        suggestedQuestions: response.suggested_questions
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Failed to query chatbot:", error);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "⚠️ Sorry, I ran into an issue connecting to the AI assistant server. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `👋 Chat reset! I'm **nexaBot**. Pick a question below or type a custom question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          "How accurate is the Calorie Predictor in nexaFit?",
          "How does nexaFit generate personalized meal plans?",
          "What is the best workout split for building lean muscle?"
        ]
      }
    ]);
  };

  // Format message text with basic bold and bullet support
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-nexafit-accent">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-nexafit-green font-bold">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {formattedParts}
        </p>
      );
    });
  };

  // Filter generic questions by category
  const filteredQuestions = activeCategory === 'All'
    ? genericCategories.flatMap(c => c.questions)
    : genericCategories.find(c => c.category === activeCategory)?.questions || [];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-nexafit-navbar to-nexafit-accent text-white shadow-2xl hover:shadow-nexafit-accent/40 transition-all duration-300 group"
            aria-label="Open AI Fitness Chatbot"
          >
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </div>

            <div className="flex items-center gap-2 px-1">
              <Bot className="w-7 h-7 text-white animate-bounce-slow" />
              <span className="hidden sm:inline font-semibold text-sm pr-1">Ask nexaBot</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-nexafit-accent/20 overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-nexafit-navbar via-[#1F3E32] to-nexafit-accent text-white">
              <div className="flex items-center gap-3">
                <div className="relative p-2.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Bot className="w-6 h-6 text-emerald-300" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-nexafit-navbar rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base tracking-wide">nexaBot AI</h3>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-500/30 text-emerald-300 rounded-full border border-emerald-400/30">
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/80">Your AI Fitness & Nutrition Guide</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Categories Bar */}
            <div className="bg-nexafit-accent/5 px-4 py-2 border-b border-nexafit-accent/10 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2">
              <button
                onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                className="flex items-center gap-1.5 font-medium text-nexafit-navbar hover:text-nexafit-accent transition-colors shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showQuickQuestions ? "Hide Suggestions" : "Show Suggestions"}</span>
              </button>

              <div className="flex gap-1 overflow-x-auto py-0.5 no-scrollbar">
                <button
                  onClick={() => { setActiveCategory('All'); setShowQuickQuestions(true); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                    activeCategory === 'All'
                      ? 'bg-nexafit-accent text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {genericCategories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => { setActiveCategory(cat.category); setShowQuickQuestions(true); }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 shrink-0 ${
                      activeCategory === cat.category
                        ? 'bg-nexafit-accent text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.category.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Generic Questions Chips Dropdown (if toggled) */}
            <AnimatePresence>
              {showQuickQuestions && filteredQuestions.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-emerald-50/60 px-4 py-2.5 border-b border-emerald-100 max-h-36 overflow-y-auto"
                >
                  <p className="text-[11px] font-semibold text-emerald-900 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Click any generic question to ask instantly:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {filteredQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q)}
                        disabled={isLoading}
                        className="text-left text-xs bg-white hover:bg-nexafit-accent hover:text-white text-gray-700 border border-emerald-200/80 px-2.5 py-1 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-98 disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.role === 'assistant' && (
                      <div className="p-1.5 bg-nexafit-accent/10 rounded-full text-nexafit-navbar shrink-0 mb-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-nexafit-navbar to-nexafit-accent text-white rounded-br-xs'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {renderFormattedContent(msg.content)}

                      <div
                        className={`text-[10px] mt-1.5 text-right ${
                          msg.role === 'user' ? 'text-white/70' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="p-1.5 bg-nexafit-navbar/10 rounded-full text-nexafit-navbar shrink-0 mb-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Assistant Suggested Follow-up Questions */}
                  {msg.role === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="mt-2 ml-8 space-y-1.5 max-w-[85%]">
                      <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Suggested follow-ups:
                      </p>
                      <div className="flex flex-col gap-1">
                        {msg.suggestedQuestions.map((sq, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sq)}
                            disabled={isLoading}
                            className="text-left text-xs bg-nexafit-accent/5 hover:bg-nexafit-accent hover:text-white text-nexafit-navbar border border-nexafit-accent/20 px-3 py-1.5 rounded-lg transition-all flex items-center justify-between group disabled:opacity-50"
                          >
                            <span>{sq}</span>
                            <ChevronRight className="w-3 h-3 text-nexafit-accent group-hover:text-white shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Loading State */}
              {isLoading && (
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="p-1.5 bg-nexafit-accent/10 rounded-full text-nexafit-navbar shrink-0 mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-nexafit-accent rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-nexafit-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-nexafit-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask nexaBot a question..."
                disabled={isLoading}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-nexafit-accent focus:bg-white text-sm text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 focus:outline-none transition-all disabled:opacity-60"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-nexafit-navbar to-nexafit-accent hover:opacity-90 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot;
