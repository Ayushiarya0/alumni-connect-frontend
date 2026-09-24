import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Compass,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatMessageItem {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  action?: {
    label: string;
    view: 'explore' | 'map' | 'mentors';
    query?: string;
  };
}

export const AIChatbotWidget: React.FC = () => {
  const { setCurrentView, setGlobalSearchQuery, alumniList, setAuthModalOpen, setAuthModalMode, isAuthenticated } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [context, setContext] = useState<{
    lastIntent?: 'mentor_search' | 'alumni_search' | 'greeting' | 'faq';
    desiredRole?: string;
    desiredCompany?: string;
    desiredUniversity?: string;
  }>({});

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! 👋 I'm your Alumni Connect Assistant. I can help you find verified alumni, connect with experienced mentors, explore university networks, or guide you through platform features. How can I help you today?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "Hello",
    "How are you?",
    "I need a machine learning mentor",
    "Show me alumni from IIT Roorkee",
    "How do I connect with an alumni?",
    "What can you do?"
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Conversational multi-turn engine
    setTimeout(() => {
      const q = query.toLowerCase().trim();
      let reply: ChatMessageItem;

      // 1. Direct Greetings
      if (q === 'hello' || q === 'hi' || q === 'hey' || q === 'namaste') {
        setContext(prev => ({ ...prev, lastIntent: 'greeting' }));
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Hello! 👋 How are you? I'm here to help you explore Alumni Connect."
        };
      }
      // 2. "How are you?"
      else if (q.includes('how are you') || q.includes('how r u')) {
        setContext(prev => ({ ...prev, lastIntent: 'greeting' }));
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I'm doing great, thank you! How can I help you today?"
        };
      }
      // 3. "What can you do?"
      else if (q.includes('what can you do') || q.includes('help me') || q.includes('features')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I can assist you with:\n• Finding verified alumni by company, role, or university\n• Matching with 1-on-1 career mentors\n• Guiding you on how to send connection requests\n• Exploring alumni distribution across Indian tech corridors\n• Explaining our student & alumni verification process.",
          action: {
            label: "Explore Network",
            view: "explore"
          }
        };
      }
      // 4. "I need a machine learning mentor" / ML mentor requests
      else if (
        (q.includes('machine learning') || q.includes('ml') || q.includes('ai')) &&
        (q.includes('mentor') || q.includes('need') || q.includes('find') || q.includes('looking'))
      ) {
        setContext(prev => ({ ...prev, lastIntent: 'mentor_search', desiredRole: 'Machine Learning' }));
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Sure! I can help you find one. Tell me your preferred university, company, location, or experience level.",
          action: {
            label: "View ML Mentors",
            view: "mentors"
          }
        };
      }
      // 5. Contextual follow-up: "I want someone from Microsoft"
      else if (q.includes('microsoft')) {
        if (context.lastIntent === 'mentor_search' || context.desiredRole) {
          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "I'll help you look for verified Machine Learning professionals associated with Microsoft. We have Rahul Sharma (Machine Learning Engineer, 7 yrs exp, IIT Roorkee) and Priya Patel (Senior SDE, Cloud & Distributed Systems, IIT Roorkee). You can view their profiles and book mentorship sessions.",
            action: {
              label: "Explore Microsoft Alumni",
              view: "explore",
              query: "Microsoft Machine Learning"
            }
          };
        } else {
          reply = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: "Here are verified alumni working at Microsoft across Azure, Machine Learning, and Cloud Systems:",
            action: {
              label: "View Microsoft Alumni",
              view: "explore",
              query: "Microsoft"
            }
          };
        }
      }
      // 6. Contextual follow-up: "Google"
      else if (q.includes('google')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "We have verified alumni at Google, including Rohan Malhotra (Staff ML Engineer, IIT Roorkee) and Ananya Verma (Data Scientist, Tula's Institute).",
          action: {
            label: "View Google Alumni",
            view: "explore",
            query: "Google"
          }
        };
      }
      // 7. University Queries: IIT Roorkee
      else if (q.includes('iit roorkee') || q.includes('roorkee')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "We have multiple verified IIT Roorkee alumni on Alumni Connect, including Priya Patel (Senior SDE at Microsoft), Rahul Sharma (ML Engineer at Microsoft), and Rohan Malhotra (Staff ML Engineer at Google).",
          action: {
            label: "Explore IIT Roorkee Alumni",
            view: "explore",
            query: "IIT Roorkee"
          }
        };
      }
      // 8. University Queries: Tula's Institute
      else if (q.includes('tula') || q.includes("tula's")) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Verified alumni from Tula's Institute, Dehradun include Aditya Negi (Tech Lead at Zomato, Gurgaon) and Ananya Verma (Data Scientist at Google, Bengaluru).",
          action: {
            label: "Explore Tula's Alumni",
            view: "explore",
            query: "Tula's Institute"
          }
        };
      }
      // 9. University Queries: Graphic Era
      else if (q.includes('graphic era') || q.includes('geu')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Verified alumni from Graphic Era University include Sneha Rawat (Lead Frontend Architect at Razorpay) and Vikram Joshi (Machine Learning Engineer at Amazon).",
          action: {
            label: "Explore Graphic Era Alumni",
            view: "explore",
            query: "Graphic Era"
          }
        };
      }
      // 10. Connection guidance: "How do I connect with an alumni?"
      else if (q.includes('how do i connect') || q.includes('how to connect')) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "To connect with an alumni:\n1. Open the Explore directory or Alumni Network.\n2. Click 'View Profile' to inspect their career path and skills.\n3. Click 'Connect' to send a personalized introduction note.\n\nNote: If you are browsing without logging in, clicking Connect will prompt you to log in or create an account with your college email.",
          action: {
            label: "Go to Explore",
            view: "explore"
          }
        };
      }
      // 11. Policy explanation: "Why can't I send a connection request?"
      else if (q.includes("why can't i") || q.includes("cannot send") || q.includes("login required")) {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Networking actions—such as sending connection requests, requesting 1-on-1 mentorship calls, and direct messaging—require a verified university account. This protects our alumni and students from unsolicited spam and ensures a trusted, professional environment."
        };
      }
      // 12. General fallback
      else {
        reply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `I understand you're interested in "${query}". You can search our verified database of alumni across Indian tech hubs or browse by company and domain.`,
          action: {
            label: `Search "${query}" in Explore`,
            view: "explore",
            query: query
          }
        };
      }

      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const handleActionClick = (action: ChatMessageItem['action']) => {
    if (!action) return;
    if (action.query) {
      setGlobalSearchQuery(action.query);
    }
    setCurrentView(action.view);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button with attention pulse */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="ai-trigger-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-shadow border border-slate-700 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <div className="relative w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span className="absolute -inset-1 rounded-full bg-blue-500/40 animate-ping" />
              <Sparkles className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="text-xs font-bold tracking-tight pr-1">Ask AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Responsive Chatbot Window with Spring Physics */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-chat-window"
            initial={{ opacity: 0, scale: 0.88, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className="w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <span>Alumni Connect AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  </div>
                  <div className="text-[10px] text-slate-300">Conversational Campus Guide</div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950/40 text-xs">
              {messages.map(m => {
                const isAi = m.sender === 'ai';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
                  >
                    {isAi ? (
                      <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                    <div className="max-w-[82%] space-y-1.5">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isAi
                            ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                            : 'bg-blue-600 text-white font-medium shadow-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.text}</p>
                      </div>

                      {/* Interactive Action Deep Link Chip */}
                      {m.action && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleActionClick(m.action)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          <span>{m.action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Chips */}
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar">
              {quickPrompts.slice(0, 4).map(p => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-[10px] font-medium transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
                >
                  {p}
                </motion.button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about mentors, alumni, or colleges..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 outline-none text-slate-800 dark:text-slate-100 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all cursor-pointer flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
