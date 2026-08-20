import React, { useState } from 'react';
import { SolarApplication, ApplicationStage } from '../types';
import {
  History,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  ChevronRight,
  ShieldCheck,
  Building2,
  Download,
  Play,
  User
} from 'lucide-react';

interface ApplicationHistoryProps {
  applications: SolarApplication[];
  onSelectApplication: (app: SolarApplication) => void;
  onAdvanceStage?: (appId: string) => void;
  onNavigateToApply: () => void;
}

export const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({
  applications,
  onSelectApplication,
  onAdvanceStage,
  onNavigateToApply,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedAppModal, setSelectedAppModal] = useState<SolarApplication | null>(null);

  const filteredApps = applications.filter((a) => {
    const q = searchFilter.toLowerCase();
    return (
      a.id.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q) ||
      a.consumerNumber.toLowerCase().includes(q)
    );
  });

  const getStageBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case 'subsidy_processed':
      case 'payment_sent':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Subsidy Processed</span>;
      case 'inspected':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-full text-xs flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> DISCOM Audit Passed</span>;
      case 'installation':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold rounded-full text-xs flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-purple-600" /> Solar Installation</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Approved for Quota</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 font-bold rounded-full text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-600" /> Submitted / Under Review</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Complete Lifetime Application History</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Solar Applications & History
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Never lose access to your application journey. Every record is stored permanently on the SolarConnect Ledger.
            </p>
          </div>

          <button
            onClick={onNavigateToApply}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition-all shrink-0 self-start sm:self-center"
          >
            + Apply New Solar Subsidy
          </button>
        </div>
      </div>

      {/* Search Bar & Stats Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Application ID, Name, Address, or Consumer No..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredApps.length}</span> records
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold font-mono text-base border border-emerald-200">
                  {app.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{app.applicantName}</h3>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {app.capacityKw} kW Solar
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{app.address} • {app.discomName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStageBadge(app.currentStage)}
              </div>
            </div>

            {/* Financial & Status Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Central + State Subsidy</span>
                <span className="font-extrabold text-emerald-700 font-mono text-sm">₹{(app.centralSubsidy + app.stateSubsidy).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Customer Contribution</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm">₹{app.netCustomerContribution.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Submitted Date</span>
                <span className="font-semibold text-slate-700 font-mono text-xs">{app.submittedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Vendor Installer</span>
                <span className="font-semibold text-slate-800 text-xs truncate block">{app.vendorName}</span>
              </div>
            </div>

            {/* Application Event Timeline Progress */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Verification & Approval Event History</span>
                <span className="text-[10px] text-slate-400">{app.blockchainLedger.length} Verified Events</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px]">
                {['submitted', 'verified', 'approved', 'installation', 'inspected', 'subsidy_processed'].map((stg, i) => {
                  const hasPassed = app.blockchainLedger.some((b) => b.stage === stg);
                  return (
                    <div
                      key={stg}
                      className={`p-2 rounded-lg text-center border font-semibold ${
                        hasPassed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider">{stg.replace('_', ' ')}</div>
                      <div className="text-[10px] font-mono mt-0.5">{hasPassed ? '✓ Done' : 'Pending'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectApplication(app);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>View Blockchain Audit Ledger</span>
                </button>

                {onAdvanceStage && app.currentStage !== 'subsidy_processed' && (
                  <button
                    onClick={() => onAdvanceStage(app.id)}
                    title="Simulate DISCOM/MNRE advancing next stage for demonstration"
                    className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 text-amber-600" />
                    <span>Advance Next Stage</span>
                  </button>
                )}
              </div>

              <span className="text-[10px] text-slate-400 font-mono">DBT Bank A/C: ****{app.bankAccountLast4}</span>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No applications match your search query.</p>
          </div>
        )}
      </div>

    </div>
  );
};
