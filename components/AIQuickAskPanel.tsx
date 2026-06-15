import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  SquarePen, 
  History, 
  MessageSquare, 
  ArrowUp,
  ChevronDown,
  Info,
  Mic,
  Plus,
  Shield,
  TrendingUp,
  BarChart3,
  Zap,
  Brain,
  Lock,
  ArrowRight
} from 'lucide-react';
import { IconAIAgent } from '../constants';

interface AIQuickAskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAgent: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const AIQuickAskPanel: React.FC<AIQuickAskPanelProps> = ({ isOpen, onClose, onOpenAgent }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPlanEnabled, setIsPlanEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [cloudAgentsPreview, setCloudAgentsPreview] = useState(false);
  const [isHistoryView, setIsHistoryView] = useState(false);

  // Extract username elegantly
  const [username, setUsername] = useState('Sameer');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('anavsan_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name) {
          setUsername(parsed.name);
        }
      }
    } catch (e) {
      // safe fallback
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => panelRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const query = text.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const userMsg: Message = {
      role: 'user',
      text: query,
      timestamp: timeStr,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulated AI Response with professional contextual triggers
    setTimeout(() => {
      let aiText = '';
      const lowerTheme = query.toLowerCase();

      if (lowerTheme.includes('cost') || lowerTheme.includes('budget') || lowerTheme.includes('spend')) {
        aiText = `Our calculations indicate that cost is currently under evaluation for Snowflake account EVC54287.

**Key Highlights:**
- **Current Spend:** $245.51 in currency (97.77 in credits).
- **Average daily cost:** Approximately $2.64.
- **Top Spenders:** The **ANAVSAN_WH** warehouse remains the highest optimization target, absorbing roughly **46%** of all compute credits.

To check dynamic anomalies or configure live safeguards, try navigating to the **Budgets** or **Resource Monitors** tab in your dashboard preview.`;
      } else if (lowerTheme.includes('warehouse') || lowerTheme.includes('wh') || lowerTheme.includes('compute')) {
        aiText = `Analyzing Snowflake warehouses for account **EVC54287**:

1. **ANAVSAN_WH:** Spent $112.80 (46% of total compute). Recommended auto-suspend set to 60 seconds (currently 300s).
2. **COMPUTE_WH:** Spent $8.63. Operates at 92.1% efficiency.
3. **DBT_TPCDS_WH:** Spent $2.50. Under-utilized.

Would you like me to generate an optimized \`ALTER WAREHOUSE <name> SET AUTO_SUSPEND = 60;\` command template for these nodes?`;
      } else if (lowerTheme.includes('table') || lowerTheme.includes('storage') || lowerTheme.includes('query')) {
        aiText = `Based on last sync statistics for security schemas and storage logs:
- **Total Tables analyzed:** 156.
- **Storage used:** 1,250 GB.
- **Unused tables identified:** 12 tables have not had a single scan in 90 days. Deleting these would reclaim **450GB** of staging storage resources.
- **Query performance:** Average query compilation time is *145ms*.

You can inspect expensive patterns details inside the **Queries overview** tab!`;
      } else {
        aiText = `Hello! I'm APEX, your Snowflake intelligence assistant.

Based on active Snowflake connection endpoints, your environment looks stable, but there are a few active cost anomalies:
1. **ANAVSAN_WH** is running continuously during off-peak hours.
2. Inefficient join patterns are detected on the **CORTEX** tables list.

I can help you review performance, construct queries, or optimize warehouse sizing. What would you like to investigate next?`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 750);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Mock Recent Chats actions
  const handleLoadRecentChat = (title: string, triggerQuery: string) => {
    setChatMessages([
      {
        role: 'user',
        text: triggerQuery,
        timestamp: '10:15 AM'
      },
      {
        role: 'model',
        text: `Here is the loaded archived session for **"${title}"**:

I have inspected the cost trajectory for active workloads. The ANAVSAN_WH warehouse had high concurrency load spikes. I suggest implementing multi-cluster auto-scaling or scaling up to an 'L' edition for brief durations to eliminate resource queuing. This will keep queries fast and cost-controlled!`,
        timestamp: '10:16 AM'
      }
    ]);
  };

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 440, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 220 }}
      className="bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 flex flex-col h-full focus:outline-none border-l border-slate-150 dark:border-slate-800 font-sans flex-shrink-0 relative overflow-hidden shadow-none"
    >
      <div className="w-[440px] h-full flex flex-col flex-shrink-0">
        {/* Panel Header */}
        <header className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-1.5">
            {/* Elegant APEX AI icon */}
            <IconAIAgent className="w-5 h-5" />
            <span className="text-sm font-black text-slate-900 hover:text-[#5829D6] transition-colors cursor-pointer select-none tracking-wide">
              APEX
            </span>
          </div>

          <div className="flex items-center text-slate-400">
            {/* Fold side arrow icon */}
            <button 
              onClick={onClose} 
              className="p-1 px-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Panel Body */}
        <div className="flex-grow flex flex-col overflow-hidden relative">
          
          {/* History view overlay */}
          {isHistoryView && chatMessages.length > 0 && (
            <div className="absolute inset-0 bg-white z-10 p-5 space-y-4 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
              <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest mb-4">Current Session Active</h4>
              <div 
                onClick={() => setIsHistoryView(false)}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:border-[#5829D6]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[#5829D6]" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{chatMessages[0].text}</span>
                    <span className="text-[10px] text-slate-500">Active conversation ({chatMessages.length} messages)</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#5829D6] font-bold">Resume →</span>
              </div>
            </div>
          )}

          {/* Core Chat Timeline / Interface Content */}
          {chatMessages.length === 0 ? (
            /* Home Welcome screen matching visual style of Anavsan Design */
            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between bg-white dark:bg-[#111827]">
              
              <div className="flex flex-col items-center">
                
                {/* Centered Sparkles Star Icon */}
                <div className="relative w-12 h-12 flex items-center justify-center mb-3 mt-4">
                  {/* Ambient breathing halo glow and interactive scale */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6CA7FF]/25 to-[#5A07FF]/25 rounded-full blur-xl animate-[pulse_3.5s_infinite_ease-in-out]" />
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="w-11 h-11 relative z-10 flex items-center justify-center bg-purple-50 dark:bg-purple-950/20 rounded-2xl shadow-sm text-primary"
                  >
                    <Sparkles className="w-6 h-6 text-[#5829D6] dark:text-[#818CF8]" />
                  </motion.div>
                </div>

                {/* Heading */}
                <h2 className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6CA7FF] to-[#5A07FF] tracking-tight leading-[1.1] pb-1 text-center"
                    style={{
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    How can I help you today?
                </h2>
                
                {/* Subtitle */}
                <p className="text-[#8E8EA8] dark:text-slate-400 mt-1 max-w-[280px] text-[10.5px] font-semibold opacity-90 leading-relaxed text-center">
                    Apex is ready to secure and optimize your Snowflake Data Cloud environment.
                </p>

                {/* Prompt Cards - 1-column layout for side panel */}
                <div className="w-full mt-6 space-y-2.5">
                  {[
                    {
                      category: 'ENFORCEMENT',
                      title: 'Audit Accountability',
                      description: "Identify the owner of last night's credit spike and route it.",
                      prompt: "Identify the owner of last night's credit spike and route it to the Enforcement Desk.",
                      icon: Shield,
                      badgeColor: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-900',
                    },
                    {
                      category: 'INTELLIGENCE',
                      title: 'Cortex Workload Analysis',
                      description: 'Predict AI token consumption and credit impact.',
                      prompt: 'Predict AI token consumption and credit impact for my next LLM deployment using Cortex Workload Analysis.',
                      icon: TrendingUp,
                      badgeColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 border-purple-100 dark:border-purple-900',
                    },
                    {
                      category: 'COST ANALYSIS',
                      title: 'Storage Intelligence',
                      description: 'Detect unused time-travel snapshots to reduce bloat.',
                      prompt: 'Detect unused time-travel snapshots and unoptimized tables to reduce bloat using Storage Intelligence.',
                      icon: BarChart3,
                      badgeColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-900',
                    },
                    {
                      category: 'OPTIMIZATION',
                      title: 'Warehouse Right-Sizing',
                      description: 'Analyze concurrency patterns to identify idle runtimes.',
                      prompt: 'Analyze memory, cache, and concurrency patterns to identify over-provisioned or idle warehouses for Optimization.',
                      icon: Zap,
                      badgeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900',
                    }
                  ].map((p, idx) => {
                    const CardIcon = p.icon;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage(p.prompt)}
                        className="w-full p-3 bg-slate-50 dark:bg-[#1F2937] border border-slate-100 dark:border-slate-800 rounded-xl hover:border-[#5829D6]/30 dark:hover:border-[#5829D6]/50 hover:bg-slate-50/50 dark:hover:bg-[#111827] shadow-xs cursor-pointer transition-all duration-200 text-left flex flex-col justify-between group"
                      >
                        <div className="flex justify-between items-center w-full mb-1">
                          <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-extrabold border ${p.badgeColor}`}>
                            {p.category}
                          </span>
                          <CardIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5829D6] transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#111827] dark:text-[#F3F4F6] text-xs leading-none">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-405 mt-1 leading-snug font-medium">
                            {p.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Suggestion Chips */}
                <div className="w-full mt-6">
                  <span className="text-[10px] font-black tracking-widest text-[#8E8EA8] dark:text-slate-500 uppercase mb-3 block leading-none select-none text-center">
                    QUICK ACTIONS
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {[
                      { text: "Optimize compute clusters", icon: Zap },
                      { text: "Summarize Cortex usage", icon: Brain },
                      { text: "Check for PII violations", icon: Lock }
                    ].map((chip, idx) => {
                      const ChipIcon = chip.icon;
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage(chip.text)}
                          className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#1F2937] hover:bg-purple-50/50 dark:hover:bg-purple-950/20 border border-slate-100 dark:border-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#5829D6] dark:hover:text-[#818CF8] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <ChipIcon className="w-3 h-3 text-[#5829D6] dark:text-[#818CF8]" />
                          <span>{chip.text}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* Active Dialogue Messages View */
            <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col bg-slate-50/30">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  {/* Avatar wrapper for APEX model messages */}
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-md bg-purple-50 text-[#5829D6] border border-purple-100 flex items-center justify-center text-xs font-black mr-2.5 flex-shrink-0 mt-0.5 shadow-xs">
                      ✦
                    </div>
                  )}

                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#5829D6] text-white rounded-br-none shadow-sm font-medium' 
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-xs'
                    }`}
                  >
                    {/* Render helper text lines */}
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text}
                    </div>
                    
                    <span 
                      className={`block text-[9px] mt-1 text-right ${
                        msg.role === 'user' ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* Panel bottom interactive controls card */}
        <footer className="p-4 border-t border-border-color bg-background/50 flex-shrink-0">
          
          {/* Main luxurious chat Input Area styled in complete consistency with Anavsan's design */}
          <div className="relative bg-surface p-2 rounded-[28px] border border-border-color shadow-sm hover:border-primary/30 focus-within:border-primary/50 focus-within:bg-surface focus-within:shadow-md transition-all duration-300 flex items-center gap-3">
            <div className="flex items-center gap-1 flex-shrink-0">
              <button 
                type="button" 
                onClick={() => setInputValue(prev => prev + ' @context ')}
                className="p-2 ml-1 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors flex-shrink-0 flex items-center justify-center cursor-pointer" 
                title="Attach Context"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setChatMessages([]);
                  setInputValue('');
                  setIsHistoryView(false);
                }}
                className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-all duration-200 flex items-center justify-center cursor-pointer"
                title="Start a new chat"
              >
                <SquarePen className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsHistoryView(!isHistoryView);
                }}
                className={`p-2 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer ${
                  isHistoryView 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-surface-hover text-text-muted hover:text-primary'
                }`}
                title="Toggle recent conversations"
              >
                <History className="w-4 h-4" />
              </button>
            </div>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Ask Anything..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2.5 px-1 text-xs resize-none max-h-24 overflow-y-auto placeholder:text-text-muted text-text-primary leading-[1.5]"
            />

            <div className="flex items-center gap-2 flex-shrink-0 pr-1">
              <button 
                type="button" 
                className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors cursor-pointer" 
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#6932D5] to-[#8B5CF6] text-white transition-all shadow-md group ${
                  inputValue.trim() 
                    ? 'from-primary to-primary-hover active:scale-95 hover:scale-105 opacity-100 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {inputValue.trim() ? (
                  <ArrowUp className="w-4 h-4 text-white" />
                ) : (
                  /* High-fidelity responsive micro-wave animation of Voice input */
                  <div className="flex items-center gap-0.5 justify-center h-3">
                    <span className="w-0.5 h-1.5 bg-white rounded-full animate-[pulse_1s_infinite_0ms]" />
                    <span className="w-0.5 h-2.5 bg-white rounded-full animate-[pulse_1s_infinite_150ms]" />
                    <span className="w-0.5 h-1 bg-white rounded-full animate-[pulse_1s_infinite_300ms]" />
                    <span className="w-0.5 h-2 bg-white rounded-full animate-[pulse_1s_infinite_450ms]" />
                    <span className="w-0.5 h-1.5 bg-white rounded-full animate-[pulse_1s_infinite_600ms]" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Under big input row matching screenshot style */}
          <p className="text-[10px] text-center text-text-muted mt-3 font-medium opacity-80 select-none">
            Apex may provide inaccurate info. Verify important Snowflake Data Cloud changes.
          </p>

          {/* Shortcut hint button styled exactly with Anavsan interactive violet styles */}
          <button 
            onClick={onOpenAgent}
            className="mt-4 text-[11.5px] text-[#5829D6] hover:text-[#4B1FC0] transition-colors bg-purple-50 hover:bg-purple-100 border border-purple-150 hover:border-purple-200 rounded-xl py-2.5 px-3 text-center w-full font-bold block cursor-pointer"
          >
            Want deep autonomous work? → Open Ask APEX Agent
          </button>

        </footer>
      </div>
    </motion.div>
  );
};

export default AIQuickAskPanel;
