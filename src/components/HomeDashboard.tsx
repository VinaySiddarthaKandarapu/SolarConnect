import React, { useState } from 'react';
import { NavigationTab, SolarApplication } from '../types';
import {
  Sun,
  Calculator,
  FileText,
  History,
  ShieldAlert,
  Bot,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HomeDashboardProps {
  setActiveTab: (tab: NavigationTab) => void;
  applications: SolarApplication[];
  onSelectApplication: (app: SolarApplication) => void;
  onOpenAIChat: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveTab,
  applications,
  onSelectApplication,
  onOpenAIChat,
}) => {
  const [quickSearchId, setQuickSearchId] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const found = applications.find(
      (a) => a.id.toLowerCase() === quickSearchId.trim().toLowerCase()
    );
    if (found) {
      onSelectApplication(found);
      setActiveTab('my_applications');
    } else {
      setSearchError(`No application found for ID "${quickSearchId}". Try "SC10245" or "SC10198".`);
    }
  };

  const mainOptions = [
    {
      id: 'calculator' as NavigationTab,
      title: 'Solar Calculator',
      description: 'Calculate system cost, estimated central & state subsidies, out-of-pocket contribution & monthly savings.',
      icon: <Calculator className="w-8 h-8 text-amber-500" />,
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200 hover:border-amber-400',
      tag: 'Instant Estimate',
    },
    {
      id: 'apply' as NavigationTab,
      title: 'Apply for Subsidy',
      description: 'Submit new solar subsidy application with AI OCR document auto-fill for electricity bill and identity proof.',
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      tag: 'AI OCR Assisted',
    },
    {
      id: 'my_applications' as NavigationTab,
      title: 'My Applications',
      description: 'Track real-time status of current and past rooftop solar applications across DISCOM and MNRE portals.',
      icon: <History className="w-8 h-8 text-blue-500" />,
      bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-200 hover:border-blue-400',
      tag: `${applications.length} Active Records`,
    },
    {
      id: 'blockchain_ledger' as NavigationTab,
      title: 'Blockchain Ledger',
      description: 'Explore tamper-evident cryptographic block hashes, verifier nodes, and immutable event history.',
      icon: <Layers className="w-8 h-8 text-purple-500" />,
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-200 hover:border-purple-400',
      tag: 'Cryptographic Audit',
    },
    {
      id: 'complaints' as NavigationTab,
      title: 'Complaints',
      description: 'File and track grievances regarding subsidy delays, DISCOM net-metering, or vendor service issues.',
      icon: <ShieldAlert className="w-8 h-8 text-rose-500" />,
      bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-200 hover:border-rose-400',
      tag: '48h SLA Desk',
    },
    {
      id: 'ai_chat' as any,
      title: 'SolarConnect AI',
      description: 'Ask instant questions regarding costs, required documents, state policies, and subsidy eligibility.',
      icon: <Bot className="w-8 h-8 text-cyan-500" />,
      bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-200 hover:border-cyan-400',
      tag: '24/7 Virtual Guide',
      actionOverride: onOpenAIChat,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>National Solar Rooftop Scheme • PM Surya Ghar 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-white leading-tight">
            Welcome to <span className="text-emerald-400">SolarConnect</span>
          </h1>

          <p className="text-base sm:text-xl font-normal text-slate-300 leading-relaxed max-w-2xl">
            “Your smart assistant for solar installation, subsidy and application tracking.”
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Your Subsidy</span>
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Apply Now (AI Auto-Fill)</span>
            </button>
          </div>
        </div>

        {/* Live National Impact Stats Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Total Subsidies Disbursed</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">₹4,280 Cr+</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Verified Installations</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">540,000+</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Avg Processing Time</div>
            <div className="text-xl sm:text-2xl font-black text-blue-300">12 Days <span className="text-[10px] text-slate-400 font-normal">(vs 45d national)</span></div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Blockchain Audit Nodes</div>
            <div className="text-xl sm:text-2xl font-black text-purple-300">12 Nodes <span className="text-[10px] text-emerald-400 font-normal">Active</span></div>
          </div>
        </div>
      </div>

      {/* Quick Application Search Widget */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" /> Quick Application Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Enter your SolarConnect Application ID to view live stage & blockchain ledger
            </p>
          </div>

          <form onSubmit={handleQuickSearch} className="flex items-center gap-2 sm:w-80">
            <input
              type="text"
              placeholder="e.g. SC10245"
              value={quickSearchId}
              onChange={(e) => setQuickSearchId(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 uppercase font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {searchError && (
          <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
            {searchError}
          </p>
        )}
      </div>

      {/* Main Options Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Platform Capabilities & Services
          </h2>
          <span className="text-xs text-slate-500 font-medium">Click any card to start</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mainOptions.map((opt) => (
            <div
              key={opt.title}
              onClick={() => {
                if (opt.actionOverride) {
                  opt.actionOverride();
                } else {
                  setActiveTab(opt.id);
                }
              }}
              className={`group cursor-pointer rounded-2xl p-6 bg-white border ${opt.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${opt.bgGradient} pointer-events-none opacity-60`} />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform">
                    {opt.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {opt.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                    {opt.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-slate-950">
                <span>Explore Feature</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PM Surya Ghar Subsidy Tier Guide Banner */}
      <div className="bg-gradient-to-r from-emerald-900/5 via-teal-900/5 to-emerald-900/10 rounded-2xl p-6 border border-emerald-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Official 2026 Subsidy Rules
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              Government Central Rooftop Solar Subsidy Matrix
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under PM Surya Ghar scheme, residential rooftop installations receive direct benefit transfer (DBT) subsidies based on installed capacity:
            </p>
          </div>

          <button
            onClick={() => setActiveTab('calculator')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition-colors whitespace-nowrap self-start md:self-center"
          >
            Calculate Exact Amount
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-800">1 kW System</div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">₹30,000 Subsidy</div>
            <div className="text-[10px] text-slate-500 mt-1">Generates ~120 units/mo</div>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 shadow-2xs">
            <div className="text-xs font-bold text-slate-800">2 kW System</div>
            <div className="text-lg font-black text-emerald-700 mt-0.5">₹60,000 Subsidy</div>
            <div className="text-[10px] text-slate-500 mt-1">Generates ~240 units/mo</div>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-emerald-300 shadow-2xs bg-emerald-50/30">
            <div className="text-xs font-bold text-slate-800">3 kW to 10 kW System</div>
            <div className="text-lg font-black text-emerald-800 mt-0.5">₹78,000 Maximum</div>
            <div className="text-[10px] text-slate-500 mt-1">Generates 360+ units/mo</div>
          </div>
        </div>
      </div>

      {/* Live Recent Applications Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Active Registered Applications
            </h3>
            <p className="text-xs text-slate-500">
              Live status on the SolarConnect Blockchain Ledger
            </p>
          </div>
          <button
            onClick={() => setActiveTab('my_applications')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All ({applications.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              onClick={() => {
                onSelectApplication(app);
                setActiveTab('my_applications');
              }}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold font-mono text-sm border border-emerald-200">
                  {app.id}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{app.applicantName}</div>
                  <div className="text-[11px] text-slate-500">{app.address} • <span className="font-semibold">{app.capacityKw} kW Solar</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {app.currentStage.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Updated: {app.updatedAt}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
