import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Bot, 
  User, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Database, 
  Zap, 
  CreditCard,
  AlertTriangle, 
  Trash2,
  Settings,
  Info,
  Clock,
  ArrowLeft,
  Sparkles,
  Calendar,
  X,
  Play,
  Check,
  Loader2,
  Globe,
  Tag,
  Shield,
  ChevronDown
} from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  targetScope: string;
  governanceMode: 'Autonomous' | 'Guided';
  lastExecution: string;
  status: 'Active' | 'Paused';
  // Relevant metrics requested by the user
  totalTriggersCount: number;
  creditsSaved: number;
  metricLabel: string;
  metricValue: string;
}

const mockPoliciesList: Policy[] = [
  {
    id: 'p1',
    name: 'Idle Warehouse Suppression',
    targetScope: 'Dev Warehouses',
    governanceMode: 'Autonomous',
    lastExecution: '2 mins ago',
    status: 'Active',
    totalTriggersCount: 142,
    creditsSaved: 485,
    metricLabel: 'Success Rate',
    metricValue: '98.4%'
  },
  {
    id: 'p2',
    name: 'High-Cost Query Prevention',
    targetScope: 'Analyst Role',
    governanceMode: 'Autonomous',
    lastExecution: '15 mins ago',
    status: 'Active',
    totalTriggersCount: 8,
    creditsSaved: 1200,
    metricLabel: 'Credit Limit',
    metricValue: '180 credits'
  },
  {
    id: 'p3',
    name: 'Surgical Rightsizing',
    targetScope: 'ETL Warehouses',
    governanceMode: 'Guided',
    lastExecution: '1 hour ago',
    status: 'Active',
    totalTriggersCount: 34,
    creditsSaved: 320,
    metricLabel: 'Avg Size Reduce',
    metricValue: '2.4x'
  },
  {
    id: 'p4',
    name: 'Storage Lifecycle Cleanup',
    targetScope: 'Staging Tables',
    governanceMode: 'Guided',
    lastExecution: 'Daily at 08:00',
    status: 'Active',
    totalTriggersCount: 91,
    creditsSaved: 154,
    metricLabel: 'Space Reclaimed',
    metricValue: '4.2 TB'
  },
  {
    id: 'p5',
    name: 'Cortex Spend Guardrail',
    targetScope: 'Marketing Account',
    governanceMode: 'Guided',
    lastExecution: '30 mins ago',
    status: 'Active',
    totalTriggersCount: 19,
    creditsSaved: 230,
    metricLabel: 'Spend Control Cap',
    metricValue: '$1,200/mo'
  }
];

interface TriggerLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'Success' | 'Action Taken' | 'Pending Review' | 'Blocked';
  saving: string;
  details: string;
}

const mockTriggerLogs: Record<string, TriggerLog[]> = {
  p1: [
    {
      id: 'log-11',
      timestamp: 'June 08, 10:51 AM',
      action: 'Auto-suspended DEV_ANALYTICS_WH',
      status: 'Success',
      saving: '1.2 Credits/hr saved',
      details: 'System detected 10 minutes of inactivity. Compute node suspended to prevent idle credit consumption.'
    },
    {
      id: 'log-12',
      timestamp: 'June 08, 09:14 AM',
      action: 'Auto-suspended COMPUTE_WH_DEV',
      status: 'Success',
      saving: '2.4 Credits/hr saved',
      details: 'Inactivity threshold reached. Secondary developer warehouse was auto-terminated.'
    },
    {
      id: 'log-13',
      timestamp: 'June 07, 04:30 PM',
      action: 'Auto-suspended SANDBOX_ENGINE_WH',
      status: 'Success',
      saving: '4.0 Credits/hr saved',
      details: 'Inactivity threshold reached. Idle sandbox database engine was auto-suspended.'
    }
  ],
  p2: [
    {
      id: 'log-21',
      timestamp: 'June 08, 10:38 AM',
      action: 'Blocked High-Cost Join Query',
      status: 'Blocked',
      saving: '120.5 Credits prevented',
      details: 'Query ID: sf-92a0d1b breached threshold cost rules. Cross-join detected. Terminated query automatically to prevent overrun.'
    },
    {
      id: 'log-22',
      timestamp: 'June 05, 02:22 PM',
      action: 'Terminated Infinite Loop Query',
      status: 'Blocked',
      saving: '45.0 Credits prevented',
      details: 'Query ID: sf-098c114 exceeded time-bound credit budget. Infinite execution loop detected. Aborted automatically.'
    }
  ],
  p3: [
    {
      id: 'log-31',
      timestamp: 'June 08, 09:50 AM',
      action: 'Warehouse Downsize Recommended',
      status: 'Pending Review',
      saving: '16.0 Credits/day potential',
      details: 'DAILY_LOAD_WH CPU utilization averaged under 4.2% for 7 consecutive load cycles. Rightsizing recommended.'
    },
    {
      id: 'log-32',
      timestamp: 'June 06, 11:00 AM',
      action: 'Warehouse Downsize Enforced',
      status: 'Action Taken',
      saving: '8.0 Credits/hr saved',
      details: 'REPORTING_BIG_WH resized from Large to Medium based on guided optimization policy. Cluster reconfigured successfully.'
    }
  ],
  p4: [
    {
      id: 'log-41',
      timestamp: 'June 08, 08:00 AM',
      action: 'Archived Staging Tables under db_dev',
      status: 'Action Taken',
      saving: '1.2 TB storage optimized',
      details: 'Found 14 staging tables untouched for 120 days. Moved contents securely to cold archives.'
    },
    {
      id: 'log-42',
      timestamp: 'June 01, 08:00 AM',
      action: 'Cleanup Alert: db_staging_raw',
      status: 'Success',
      saving: '3.0 TB storage optimized',
      details: 'Completed scheduled monthly storage purge. Deleted transient schema backups active since Q3.'
    }
  ],
  p5: [
    {
      id: 'log-51',
      timestamp: 'June 08, 10:23 AM',
      action: 'Enforced Marketing Cap Guardrail',
      status: 'Action Taken',
      saving: '15.0 Credits throttled',
      details: 'Marketing campaign simulation warehouse reached its soft monthly cap of $1,200. Guided alert deployed.'
    },
    {
      id: 'log-52',
      timestamp: 'June 04, 05:10 PM',
      action: 'Throttled Adhoc Cortex ML Cluster',
      status: 'Blocked',
      saving: '60.0 Credits prevented',
      details: 'Terminated non-scheduled GPU-supported text-generation job on Snowflake. Breached marketing project allocations.'
    }
  ]
};

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);// --- COMPONENT: SPOTLIGHT POLICY CARD (ENFORCEMENT DESK DESIGN) ---
const PolicyCard: React.FC<{
  policy: Policy;
  isSelected?: boolean;
  onSettings: (policy: Policy) => void;
  onDelete: (id: string) => void;
}> = ({ policy, isSelected, onSettings, onDelete }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isAutonomous = policy.governanceMode === 'Autonomous';
  const hoverGlowColor = 'rgba(106, 56, 235, 0.08)';
  const activeHoverBorderClass = isSelected 
    ? 'border-[#6A38EB] shadow-[0_8px_30px_rgba(106,56,235,0.06)]' 
    : 'hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(106,56,235,0.06)]';

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.15 }}
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all text-left h-full flex flex-col justify-between overflow-hidden ${
        isSelected ? 'border-[#6A38EB] ring-2 ring-[#6A38EB]/10' : 'border-slate-200 dark:border-slate-800'
      } ${activeHoverBorderClass}`}
    >
      {/* Enterprise Spotlight Cursor Tracker Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${hoverGlowColor}, transparent 80%)`,
        }}
      />

      <div className="p-4 pb-3 relative z-10 flex-grow">
        {/* Top Metadata */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-full bg-[#6A38EB]/10 border border-[#6A38EB]/20 flex items-center justify-center shadow-xs text-[#6A38EB] shrink-0">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-extrabold text-slate-400">Target scope</span>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight mt-0.5">
                {policy.targetScope}
              </span>
            </div>
          </div>
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold rounded-full border uppercase tracking-wider ${
            policy.status === 'Active' 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' 
              : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${policy.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {policy.status}
          </span>
        </div>

        {/* Title and details */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
            {policy.name}
          </h3>

          {/* Relevant Metrics Grid Requested by User */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 p-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150/45 dark:border-slate-800/60 rounded-xl">
            <div className="flex flex-col justify-center">
              <span className="text-[14px] font-black text-slate-400">Occurrences</span>
              <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-200 mt-0.5">{policy.totalTriggersCount} runs</span>
            </div>
            <div className="flex flex-col justify-center border-l border-slate-150 dark:border-slate-800/70 pl-2">
              <span className="text-[14px] font-black text-slate-400">{policy.metricLabel ? (policy.metricLabel.charAt(0).toUpperCase() + policy.metricLabel.slice(1).toLowerCase()) : 'Kpi'}</span>
              <span className="text-[11.5px] font-black text-slate-800 dark:text-slate-250 mt-0.5">{policy.metricValue}</span>
            </div>
            <div className="flex flex-col justify-center border-l border-slate-150 dark:border-slate-800/70 pl-2">
              <span className="text-[14px] font-black text-slate-400">Saved</span>
              <span className="text-[11.5px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{policy.creditsSaved} Cr.</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            {/* Governance Mode Card Detail */}
            {isAutonomous ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-bold rounded border uppercase tracking-wider bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900/30">
                <Bot className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Autonomous
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-bold rounded border uppercase tracking-wider bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-405 border-blue-200 dark:border-blue-900/30">
                <User className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                Guided
              </span>
            )}

            {/* Last Execution Card Detail */}
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-500">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last: {policy.lastExecution}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Block with Actions */}
      <div className="px-4 py-2.5 bg-slate-50/45 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between relative z-10">
        <span className="text-[14px] font-extrabold text-slate-450 leading-none">
          Review Enforcement
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSettings(policy);
            }}
            className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-[#6A38EB]/5 dark:hover:bg-slate-700/50 transition-all shadow-xs"
            title="Configure policy settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(policy.id);
            }}
            className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-rose-50 dark:hover:bg-rose-955 hover:border-rose-205 transition-all shadow-xs"
            title="Delete custom trigger"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};const ActivePolicies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>(mockPoliciesList);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('p1');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [scopeFilter, setScopeFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [wizardStep, setWizardStep] = useState<'gallery' | 'config'>('gallery');
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);
  const [governanceMode, setGovernanceMode] = useState<'Autonomous' | 'Guided'>('Autonomous');
  const [allTriggerLogs, setAllTriggerLogs] = useState<Record<string, TriggerLog[]>>(mockTriggerLogs);
  const [isManualTriggering, setIsManualTriggering] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const blueprints = [
    {
      id: 'idle-guard',
      name: 'Warehouse Idle-Guard',
      description: 'Automatically suspend warehouses when they are not in use.',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      roi: 'High',
      roiColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'cost-cap',
      name: 'Query Cost Cap',
      description: 'Kill queries that exceed a specific credit threshold.',
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      roi: 'Medium',
      roiColor: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'janitor',
      name: 'Stale Data Janitor',
      description: 'Identify and archive tables that haven\'t been queried in 90 days.',
      icon: <Trash2 className="w-6 h-6 text-rose-500" />,
      roi: 'High',
      roiColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'custom',
      name: 'Custom Policy',
      description: 'Build your own logic from scratch using the condition builder.',
      icon: <Settings className="w-6 h-6 text-text-muted" />,
      roi: 'Variable',
      roiColor: 'text-text-muted bg-surface-subtle'
    }
  ];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          policy.targetScope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScope = scopeFilter === 'All' || policy.targetScope.toLowerCase().includes(scopeFilter.toLowerCase().replace(' warehouses', ''));
    const matchesMode = modeFilter === 'All' || policy.governanceMode === modeFilter;
    const matchesStatus = statusFilter === 'All' || policy.status === statusFilter;
    return matchesSearch && matchesScope && matchesMode && matchesStatus;
  });

  const handleOpenSidePanel = () => {
    setWizardStep('gallery');
    setSelectedBlueprint(null);
    setIsSidePanelOpen(true);
  };

  const handleSelectBlueprint = (id: string) => {
    setSelectedBlueprint(id);
    setWizardStep('config');
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (selectedPolicyId === id && filtered.length > 0) {
        setSelectedPolicyId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleActivateSkill = () => {
    if (!selectedBlueprint) return;
    const bp = blueprints.find(b => b.id === selectedBlueprint);
    if (!bp) return;

    const newPolId = `p-${Date.now()}`;
    const newPol: Policy = {
      id: newPolId,
      name: bp.name,
      targetScope: selectedBlueprint === 'idle-guard' ? 'COMPUTE_WH' : 'All warehouses',
      governanceMode: governanceMode,
      lastExecution: 'Just now',
      status: 'Active',
      totalTriggersCount: 0,
      creditsSaved: 0,
      metricLabel: selectedBlueprint === 'idle-guard' ? 'Idle Suspend Rate' : selectedBlueprint === 'cost-cap' ? 'Max Cost Limit' : selectedBlueprint === 'janitor' ? 'Space Reclaimed' : 'Impact',
      metricValue: selectedBlueprint === 'idle-guard' ? '100.0%' : selectedBlueprint === 'cost-cap' ? '0.0 credits' : selectedBlueprint === 'janitor' ? '0.0 TB' : 'N/A'
    };

    setPolicies([newPol, ...policies]);
    setSelectedPolicyId(newPolId); // Auto-focus on log list for newly created policy trigger
    setIsSidePanelOpen(false);
  };

  const handleManualTrigger = () => {
    if (isManualTriggering) return;
    setIsManualTriggering(true);
    setTriggerSuccess(false);

    setTimeout(() => {
      setIsManualTriggering(false);
      setTriggerSuccess(true);

      // Create a simulated log
      const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
      if (selectedPolicy) {
        const now = new Date();
        const timestampStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        let actionStr = 'Manual Suspend Executed';
        let detailStr = 'Successfully triggered warehouse evaluation. Compute nodes analyzed and verified as optimized.';
        let savingStr = '1.8 Credits saved';
        let savingNum = 2;

        if (selectedPolicy.id === 'p1') {
          actionStr = 'Manual Suspend: DEV_ANALYTICS_WH';
          detailStr = 'Warehouse was idle with 0 connections. Suspended manually via Details console.';
          savingStr = '1.2 Credits/hr saved';
          savingNum = 1;
        } else if (selectedPolicy.id === 'p2') {
          actionStr = 'Manual Query Kill: Infinite loop query in BI_WH';
          detailStr = 'Query ID: sf-918ff breached execution boundaries. Manually aborted query to avoid billing overrun.';
          savingStr = '45.0 Credits saved';
          savingNum = 45;
        } else if (selectedPolicy.id === 'p3') {
          actionStr = 'Manual Rightsizing Profile Applied: ETL_COMPUTE';
          detailStr = 'Submitted warehouse downsize configurations to active workloads successfully.';
          savingStr = '8.0 Credits saved';
          savingNum = 8;
        } else if (selectedPolicy.id === 'p4') {
          actionStr = 'Manual Lifecycle Janitor Run';
          detailStr = 'Scanned and archived 3 stale temporary sandboxes tables from Staging Scope.';
          savingStr = '0.5 TB Reclaimed';
          savingNum = 1;
        } else {
          actionStr = `Manual Execution: ${selectedPolicy.name}`;
          detailStr = 'Successfully invoked manual trigger dry run. Integrity constraints validated.';
          savingStr = '1.5 Credits saved';
          savingNum = 2;
        }

        const newLog: TriggerLog = {
          id: `manual-log-${Date.now()}`,
          timestamp: timestampStr,
          action: actionStr,
          status: 'Success',
          saving: savingStr,
          details: detailStr
        };

        setAllTriggerLogs(prev => ({
          ...prev,
          [selectedPolicy.id]: [newLog, ...(prev[selectedPolicy.id] || [])]
        }));

        setPolicies(prevPolicies => prevPolicies.map(p => {
          if (p.id === selectedPolicy.id) {
            return {
              ...p,
              totalTriggersCount: p.totalTriggersCount + 1,
              creditsSaved: p.creditsSaved + savingNum,
              lastExecution: 'Just now'
            };
          }
          return p;
        }));
      }

      setTimeout(() => {
        setTriggerSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleTogglePolicyStatus = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: p.status === 'Active' ? 'Paused' : 'Active'
        };
      }
      return p;
    }));
  };

  const handleUpdatePolicyGovernance = (id: string, mode: 'Autonomous' | 'Guided') => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          governanceMode: mode
        };
      }
      return p;
    }));
  };

  const renderLogContent = () => {
    const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
    if (!selectedPolicy) {
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[24px] p-8 text-center text-slate-400 dark:text-slate-500">
          <Info className="w-8 h-8 mx-auto text-slate-300 mb-3" />
          <p className="text-xs font-semibold leading-relaxed">Select a trigger from the left to view its execution occurrences audit logs.</p>
        </div>
      );
    }

    const logs = allTriggerLogs[selectedPolicy.id] || [];

    return (
      <div className="space-y-4">
        {/* Event Meta Header (desktop only) */}
        <div className="hidden lg:flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-black text-[#6A38EB] dark:text-purple-400 bg-[#6A38EB]/5 dark:bg-[#6A38EB]/10 px-2.5 py-1 rounded-md">
              Trigger logs & audit
            </span>
            <span className="text-xs font-black text-slate-500">
              {logs.length} Events Recorded
            </span>
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-2 leading-tight">
            {selectedPolicy.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-500">
              Target Scope: <span className="font-bold text-slate-700 dark:text-slate-300">{selectedPolicy.targetScope}</span>
            </span>
            <span className="text-slate-350 dark:text-slate-600">•</span>
            <span className="text-[11px] font-bold text-[#6A38EB] dark:text-purple-400 uppercase tracking-wide">
              {selectedPolicy.governanceMode} Mode
            </span>
          </div>
        </div>

        {/* Brand / Meta Subheader inside mobile Drawer Header displaying context */}
        <div className="lg:hidden">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
            {selectedPolicy.name}
          </h3>
          <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-500 font-medium pb-4 border-b border-slate-100 dark:border-slate-800">
            <span>Scope: <b className="text-slate-700 dark:text-slate-300">{selectedPolicy.targetScope}</b></span>
            <span>•</span>
            <span className="uppercase text-[#6A38EB] dark:text-purple-400 font-bold">{selectedPolicy.governanceMode} Mode</span>
          </div>
        </div>

        {/* Occurrence events log list */}
        <div className="space-y-3 max-h-[420px] lg:max-h-[500px] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No executions caught yet for this trigger.
            </div>
          ) : (
            logs.map((log) => {
              // Color schemes depending on status
              let statusBadgeClass = '';
              if (log.status === 'Success' || log.status === 'Action Taken') {
                statusBadgeClass = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
              } else if (log.status === 'Blocked') {
                statusBadgeClass = 'bg-rose-50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-450 border-rose-100 dark:border-rose-900/30';
              } else {
                statusBadgeClass = 'bg-amber-50 dark:bg-amber-955/20 text-amber-700 dark:text-[#E2B93B] border-amber-100 dark:border-amber-900/30';
              }

              return (
                <div 
                  key={log.id} 
                  className="group/log border border-slate-100 dark:border-slate-800/85 rounded-2xl p-4 bg-slate-50/25 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-205 dark:hover:border-slate-800 transition-all duration-200 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${statusBadgeClass}`}>
                      {log.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-2 hover:text-[#6A38EB] dark:hover:text-purple-400 transition-colors leading-snug">
                    {log.action}
                  </h4>

                  <div className="bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-150 dark:border-slate-800 mt-2 text-[10px] font-black text-emerald-650 dark:text-emerald-400 inline-block">
                    {log.saving}
                  </div>

                  <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 mt-2.5 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100/50 dark:border-slate-850">
                    {log.details}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background font-sans">
      {/* Scrollable Left Pane */}
      <div className="flex-1 overflow-y-auto bg-[#F4F1F9] dark:bg-slate-950 no-scrollbar animate-in fade-in duration-505">
        <div className="max-w-[1000px] w-full mx-auto px-4 py-8 flex flex-col gap-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[28px] font-bold text-text-strong tracking-tight flex items-center gap-2">
                Triggers
              </h1>
              <p className="text-text-secondary mt-1 text-sm md:text-base">
                Define and automate responses to performance and cost inefficiencies across your Snowflake environment.
              </p>
            </div>
            <button 
              onClick={handleOpenSidePanel}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6A38EB] hover:bg-[#582ed1] text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              <span>Create trigger</span>
            </button>
          </div>

          {/* Top Pills */}
          <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
            <KPILabel label="Total Triggers" value={`${policies.length}`} />
            <KPILabel label="Autonomous" value={`${policies.filter(p => p.governanceMode === 'Autonomous').length}`} />
            <KPILabel label="Guided" value={`${policies.filter(p => p.governanceMode === 'Guided').length}`} />
            <KPILabel label="Total Credits Saved" value="1,284" />
          </div>

          {/* Refined Filter and Search Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            {/* Filter Pills of target scope, mode, status */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Scope Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsScopeOpen(!isScopeOpen);
                    setIsModeOpen(false);
                    setIsStatusOpen(false);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700/80 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-[13px]">Scope: <span className="font-bold text-[#6A38EB] dark:text-purple-400">{scopeFilter}</span></span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>
                
                {isScopeOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsScopeOpen(false)} />
                    <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                      {['All', 'Dev Warehouses', 'Analyst Role', 'ETL Warehouses', 'Staging Tables', 'Marketing Account'].map((scope) => (
                        <button
                          key={scope}
                          onClick={() => {
                            setScopeFilter(scope);
                            setIsScopeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 first:rounded-t-xl last:rounded-b-xl transition-all ${
                            scopeFilter === scope ? 'text-[#6A38EB] dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {scope}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Mode Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsModeOpen(!isModeOpen);
                    setIsScopeOpen(false);
                    setIsStatusOpen(false);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700/80 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-[13px]">Mode: <span className="font-bold text-[#6A38EB] dark:text-purple-400">{modeFilter}</span></span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>
                
                {isModeOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsModeOpen(false)} />
                    <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                      {['All', 'Autonomous', 'Guided'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setModeFilter(mode);
                            setIsModeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 first:rounded-t-xl last:rounded-b-xl transition-all ${
                            modeFilter === mode ? 'text-[#6A38EB] dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setIsScopeOpen(false);
                    setIsModeOpen(false);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700/80 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span className="text-[13px]">Status: <span className="font-bold text-[#6A38EB] dark:text-purple-400">{statusFilter}</span></span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>
                
                {isStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                    <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
                      {['All', 'Active', 'Paused'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsStatusOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 first:rounded-t-xl last:rounded-b-xl transition-all ${
                            statusFilter === status ? 'text-[#6A38EB] dark:text-purple-400 bg-purple-50/40 dark:bg-purple-950/20' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Pill Search Button Right */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 cursor-text" />
              <input 
                type="text"
                placeholder="Search triggers..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6A38EB]/20 focus:border-[#6A38EB] placeholder:text-slate-400 w-full text-left font-sans text-slate-800 dark:text-white transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Section displaying policies as a stunning single-column stack */}
          <div className="pt-2">
            <div className="grid grid-cols-1 gap-6">
              {filteredPolicies.map((policy) => (
                <div 
                  key={policy.id} 
                  onClick={() => {
                    setSelectedPolicyId(policy.id);
                    setIsDetailsOpen(true);
                  }}
                  className="cursor-pointer font-sans transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <PolicyCard 
                    policy={policy} 
                    isSelected={selectedPolicyId === policy.id && isDetailsOpen}
                    onSettings={(p) => {
                      setSelectedBlueprint(p.id);
                      setGovernanceMode(p.governanceMode);
                      setWizardStep('config');
                      setIsSidePanelOpen(true);
                    }}
                    onDelete={handleDeletePolicy}
                  />
                </div>
              ))}
            </div>
            {filteredPolicies.length === 0 && (
              <div className="py-16 text-center text-text-muted text-sm font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-border-light dark:border-slate-850 shadow-sm">
                No policies found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over/Docked Details view depending on screen size */}
      <AnimatePresence>
        {isDetailsOpen && selectedPolicyId && (
          <>
            {/* Backdrop layer (Mobile-only) */}
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailsOpen(false)}
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[48]"
              />
            )}
            
            {/* Details panel layer (Docked side-panel on desktop, slide-over overlay on mobile) */}
            <motion.div 
              {...(isMobile 
                ? {
                    initial: { x: '100%' },
                    animate: { x: 0 },
                    exit: { x: '100%' },
                    transition: { type: 'spring', damping: 26, stiffness: 220 }
                  }
                : {
                    initial: { width: 0, opacity: 0 },
                    animate: { width: 500, opacity: 1 },
                    exit: { width: 0, opacity: 0 },
                    transition: { type: 'spring', damping: 30, stiffness: 220 }
                  })}
              className={`${
                isMobile 
                  ? 'fixed top-12 right-0 bottom-0 w-[550px] max-w-full z-[49] shadow-[-16px_0_40px_rgba(0,0,0,0.12)] border-l border-slate-150 dark:border-slate-900' 
                  : 'relative h-full z-auto border-l border-slate-150 dark:border-slate-900 shadow-none'
              } bg-white dark:bg-slate-950 flex flex-col overflow-hidden flex-shrink-0`}
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#F4F1F9] dark:border-slate-850 bg-slate-50/65 dark:bg-slate-900/40 flex items-center justify-between select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-widest text-[#6A38EB] dark:text-purple-400 bg-[#6A38EB]/8 dark:bg-[#6A38EB]/15 px-2.5 py-1 rounded">
                    Execution History
                  </span>
                  <span className={`w-2 h-2 rounded-full ${policies.find(p => p.id === selectedPolicyId)?.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-455'}`} />
                </div>
                
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-1 px-1.5 rounded-lg hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (Scrollable content) */}
              {(() => {
                const selectedPolicy = policies.find(p => p.id === selectedPolicyId);
                if (!selectedPolicy) return null;
                const logs = allTriggerLogs[selectedPolicy.id] || [];

                return (
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Title with metadata */}
                    <div className="space-y-2 text-left pb-4 border-b border-slate-100 dark:border-slate-850">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                        {selectedPolicy.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-505">
                        <span>Target Scope: <b className="text-slate-850 dark:text-slate-300 font-extrabold">{selectedPolicy.targetScope}</b></span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="uppercase text-[#6A38EB] dark:text-purple-400 font-black">{selectedPolicy.governanceMode} MODE</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-semibold">Last execution: {selectedPolicy.lastExecution}</span>
                      </div>
                    </div>

                    {/* Timeline History Segment (Events logs) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11.5px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-wider text-left">
                          Historical Executions Logs ({logs.length})
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold">
                          Auto-execution enabled
                        </span>
                      </div>

                      <div className="space-y-3 pr-0.5">
                        {logs.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20">
                            <Clock className="w-8 h-8 mx-auto text-slate-350 mb-2" />
                            No executions caught yet for this trigger.
                          </div>
                        ) : (
                          logs.map((log) => {
                            let statusBadgeClass = '';
                            if (log.status === 'Success' || log.status === 'Action Taken') {
                              statusBadgeClass = 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
                            } else if (log.status === 'Blocked') {
                              statusBadgeClass = 'bg-rose-50 dark:bg-rose-950/25 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
                            } else {
                              statusBadgeClass = 'bg-amber-50 dark:bg-amber-950/25 text-amber-750 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
                            }

                            return (
                              <div 
                                key={log.id} 
                                className="border border-slate-100 dark:border-slate-850 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-900/40 text-left space-y-2.5 animate-in fade-in duration-300"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    {log.timestamp}
                                  </span>
                                  <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded border ${statusBadgeClass}`}>
                                    {log.status}
                                  </span>
                                </div>

                                <div>
                                  <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug">
                                    {log.action}
                                  </h5>
                                  <div className="bg-white dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-dashed border-slate-150 dark:border-slate-800 mt-2 text-[10px] font-bold text-emerald-650 dark:text-emerald-400 inline-block">
                                    {log.saving}
                                  </div>
                                </div>

                                <p className="text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400 bg-white/75 dark:bg-slate-950/40 p-2 text-xs rounded-xl border border-slate-100/30 dark:border-slate-850 text-left">
                                  {log.details}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Policy Sidepanel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidePanelOpen(false)}
              className="fixed top-12 left-0 right-0 bottom-0 bg-slate-900/40 backdrop-blur-sm z-[44]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-12 right-0 bottom-0 w-[550px] bg-white dark:bg-slate-950 shadow-[-16px_0_40px_rgba(0,0,0,0.06)] z-[45] flex flex-col border-l border-slate-100 dark:border-slate-900 rounded-l-[24px]"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50 rounded-tl-[24px]">
                <div className="flex items-center gap-3">
                  {wizardStep === 'config' && (
                    <button 
                      onClick={() => setWizardStep('gallery')}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-text-secondary transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-[#6A38EB]" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      {wizardStep === 'gallery' ? 'Select a blueprint' : 'Configure trigger'}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {wizardStep === 'gallery' ? 'Choose a template to get started quickly.' : 'Refine the logic for your new trigger.'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wizardStep === 'gallery' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {blueprints.map((bp) => (
                      <button
                        key={bp.id}
                        onClick={() => handleSelectBlueprint(bp.id)}
                        className="flex flex-col text-left p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-[#6A38EB]/50 hover:shadow-[0_8px_30px_rgba(106,56,235,0.05)] transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 bg-[#6A38EB]/5 dark:bg-[#6A38EB]/10 rounded-xl group-hover:bg-[#6A38EB]/10 transition-colors">
                            {bp.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${bp.roiColor} border`}>
                            ROI: {bp.roi}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-[14px] text-slate-900 dark:text-white mb-1 group-hover:text-[#6A38EB] transition-colors">{bp.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{bp.description}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Step 1: Logic */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">1</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Trigger Logic</h3>
                      </div>
                      <div className="pl-11 space-y-4">
                        <div className="p-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-5">
                          <div className="flex items-center gap-2 text-[14px] font-black text-[#6A38EB]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ai suggested logic</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 leading-loose">
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">IF</span>
                            <span className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-extrabold shadow-sm">
                              {selectedBlueprint === 'idle-guard' ? 'Inactivity' : 
                               selectedBlueprint === 'cost-cap' ? 'Query Cost' : 
                               selectedBlueprint === 'janitor' ? 'Last Accessed' : 'Condition'}
                            </span>
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">IS GREATER THAN</span>
                            <div className="relative inline-block">
                              <input 
                                type="text" 
                                defaultValue={selectedBlueprint === 'idle-guard' ? '60 seconds' : 
                                             selectedBlueprint === 'cost-cap' ? '$100' : 
                                             selectedBlueprint === 'janitor' ? '90 days' : ''}
                                className="w-28 px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-[#6A38EB]/30 focus:border-[#6A38EB] rounded-xl text-center font-black text-[#6A38EB] dark:text-purple-400 focus:ring-2 focus:ring-[#6A38EB]/15 outline-none shadow-sm transition-all text-xs"
                              />
                            </div>
                            <span className="text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">THEN</span>
                            <span className="px-2.5 py-1.5 bg-[#6A38EB]/10 text-[#6A38EB] dark:text-purple-300 border border-[#6A38EB]/20 rounded-xl font-extrabold shadow-sm">
                              {selectedBlueprint === 'idle-guard' ? 'Execute Suspend' : 
                               selectedBlueprint === 'cost-cap' ? 'Abort Query' : 
                               selectedBlueprint === 'janitor' ? 'Archive Table' : 'Action'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Scope */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">2</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Target Scope</h3>
                      </div>
                      <div className="pl-11 space-y-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select which resources this trigger applies to.</p>
                        <div className="relative">
                          <select className="w-full pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6A38EB]/15 focus:border-[#6A38EB]/60 transition-all">
                            <option>All warehouses</option>
                            <option>Smart group: Development</option>
                            <option>Smart group: Production</option>
                            <option>Specific warehouse: COMPUTE_WH</option>
                            <option>Specific warehouse: ANALYST_WH</option>
                          </select>
                          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Governance Mode */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6A38EB]/10 dark:bg-[#6A38EB]/20 flex items-center justify-center text-[#6A38EB] dark:text-purple-405 font-black text-sm border border-[#6A38EB]/15">3</div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white">Governance Mode</h3>
                      </div>
                      <div className="pl-11 space-y-4">
                        <div className="flex p-1 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-2xl">
                          <button 
                            onClick={() => setGovernanceMode('Autonomous')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-extrabold text-xs transition-all ${
                              governanceMode === 'Autonomous' 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-[#6A38EB] dark:text-purple-400 border border-slate-200/60 dark:border-slate-700 font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            <Bot className={`w-3.5 h-3.5 ${governanceMode === 'Autonomous' ? 'text-[#6A38EB] dark:text-purple-400' : ''}`} />
                            <span>Autonomous</span>
                          </button>
                          <button 
                            onClick={() => setGovernanceMode('Guided')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full font-extrabold text-xs transition-all ${
                              governanceMode === 'Guided' 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-[#6A38EB] dark:text-purple-400 border border-slate-200/60 dark:border-slate-700 font-extrabold' 
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            <User className={`w-3.5 h-3.5 ${governanceMode === 'Guided' ? 'text-[#6A38EB] dark:text-purple-400' : ''}`} />
                            <span>Guided</span>
                          </button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={governanceMode}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`p-4 rounded-2xl flex gap-3 border ${
                              governanceMode === 'Autonomous' 
                                ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30' 
                                : 'bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30'
                            }`}
                          >
                            {governanceMode === 'Autonomous' ? (
                              <>
                                <Bot className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-semibold">
                                  <span className="font-extrabold">Autonomous mode:</span> Anavsan will execute the SQL command automatically in Snowflake. Recommended for low-risk guardrails like auto-suspending idle dev warehouses.
                                </p>
                              </>
                            ) : (
                              <>
                                <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-semibold">
                                  <span className="font-extrabold">Guided mode:</span> Anavsan will create a task for an engineer to review and approve before any action is taken. Recommended for production-critical changes.
                                </p>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 flex gap-3 rounded-bl-[24px]">
                <button 
                  onClick={() => setIsSidePanelOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={wizardStep === 'gallery'}
                  onClick={handleActivateSkill}
                  className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    wizardStep === 'gallery' 
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                      : 'bg-[#6A38EB] hover:bg-[#582ed1] text-white shadow-lg shadow-purple-500/10 active:scale-[0.98]'
                  }`}
                >
                  <span>Activate trigger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivePolicies;
