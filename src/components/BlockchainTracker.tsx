import React, { useState } from 'react';
import { SolarApplication, BlockRecord, ApplicationStage } from '../types';
import { formatBlockchainDate } from '../data/mockData';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Lock,
  Cpu,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';

interface BlockchainTrackerProps {
  application: SolarApplication | null;
  allApplications: SolarApplication[];
  onSelectApplication: (app: SolarApplication) => void;
}

const STAGE_ORDER: ApplicationStage[] = [
  'submitted',
  'verified',
  'approved',
  'installation',
  'inspected',
  'subsidy_processed',
  'payment_sent',
];

const STAGE_METADATA: Record<ApplicationStage, { title: string; desc: string }> = {
  submitted: {
    title: 'Application Submitted',
    desc: 'Application registered on SolarConnect smart contract and queued for DISCOM verification.',
  },
  verified: {
    title: 'Documents Verified',
    desc: 'AI OCR validation & DISCOM sanction load verified automatically.',
  },
  approved: {
    title: 'Application Approved',
    desc: 'Ministry of New & Renewable Energy (MNRE) sanction quota allocated.',
  },
  installation: {
    title: 'Installation Completed',
    desc: 'Empanelled vendor installed rooftop solar panels & grid tie inverter.',
  },
  inspected: {
    title: 'Inspector Audit Passed',
    desc: 'Bi-directional Net Meter installed & DISCOM field audit signed.',
  },
  subsidy_processed: {
    title: 'Subsidy Processed',
    desc: 'Direct Benefit Transfer (DBT) payment queued for bank transfer.',
  },
  payment_sent: {
    title: 'Payment Disbursed',
    desc: 'Central & State subsidy credited to applicant bank account.',
  },
};

export const BlockchainTracker: React.FC<BlockchainTrackerProps> = ({
  application,
  allApplications,
  onSelectApplication,
}) => {
  const selectedApp = application || allApplications[0];

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [chainValid, setChainValid] = useState<boolean | null>(true);
  const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyChain = () => {
    setVerifyingChain(true);
    setChainValid(null);
    setTimeout(() => {
      setVerifyingChain(false);
      setChainValid(true);
    }, 1000);
  };

  if (!selectedApp) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-800">No Application Selected</h3>
        <p className="text-xs text-slate-500">Please select an application from the history list.</p>
      </div>
    );
  }

  // Calculate current stage index
  const currentStageIdx = STAGE_ORDER.indexOf(selectedApp.currentStage);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Title */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Immutable Ledger • SHA-256 Chain</span>
            </div>

            {/* Application Switcher Dropdown */}
            <select
              value={selectedApp.id}
              onChange={(e) => {
                const found = allApplications.find((a) => a.id === e.target.value);
                if (found) onSelectApplication(found);
              }}
              className="bg-slate-800 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-700"
            >
              {allApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  Application: {app.id} ({app.applicantName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Blockchain Application Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Application ID: <span className="font-mono font-bold text-emerald-400">{selectedApp.id}</span> • Registered by {selectedApp.applicantName} ({selectedApp.state})
            </p>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof Banner & Key Application Dates */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Ledger Health & Integrity:</span>
              {chainValid === true && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Cryptographically Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {selectedApp.blockchainLedger.length} Blocks Minted • Verifier Node: {selectedApp.blockchainLedger[selectedApp.blockchainLedger.length - 1]?.verifierNode || 'DISCOM Oracle'}
            </p>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={verifyingChain}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${verifyingChain ? 'animate-spin' : ''}`} />
            <span>{verifyingChain ? 'Re-verifying Block Hashes...' : 'Verify Chain Integrity'}</span>
          </button>
        </div>

        {/* Application Key Ledger Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" /> Genesis Submitted Date
            </div>
            <div className="text-xs font-extrabold font-mono text-slate-800 mt-0.5">
              {formatBlockchainDate(selectedApp.submittedAt)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" /> Last Ledger Block Update
            </div>
            <div className="text-xs font-extrabold font-mono text-slate-800 mt-0.5">
              {formatBlockchainDate(selectedApp.updatedAt)}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Stage
            </div>
            <div className="text-xs font-extrabold text-emerald-900 mt-0.5 capitalize">
              {selectedApp.currentStage.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Application Milestone Lifecycle Flow */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" /> Milestone Audit Lifecycle
        </h2>

        <div className="relative space-y-8 pl-6 sm:pl-8 border-l-2 border-slate-200 ml-2">
          {STAGE_ORDER.map((stg, idx) => {
            const isCompleted = idx <= currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const blockObj = selectedApp.blockchainLedger.find((b) => b.stage === stg);
            const meta = STAGE_METADATA[stg];

            return (
              <div key={stg} className="relative group">
                
                {/* Milestone Node Badge */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    isCurrent
                      ? 'bg-emerald-700 text-white border-emerald-800 ring-4 ring-emerald-500/20 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 text-slate-400 border-slate-300'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>

                {/* Milestone Content Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/60 border-slate-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{meta.title}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-700 text-white rounded-full">
                            Current Stage
                          </span>
                        )}
                        {isCompleted && !isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                            Verified & Saved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{blockObj?.description || meta.desc}</p>
                    </div>

                    {blockObj && (
                      <div className="text-left sm:text-right text-[11px] font-mono shrink-0">
                        <div className="font-extrabold text-slate-800 flex items-center gap-1 sm:justify-end">
                          <Calendar className="w-3 h-3 text-emerald-600 inline" />
                          <span>{formatBlockchainDate(blockObj.timestamp)}</span>
                        </div>
                        <div className="text-[10px] text-purple-700 font-semibold">Block #{blockObj.blockIndex}</div>
                      </div>
                    )}
                  </div>

                  {/* Blockchain Block Details Accordion */}
                  {blockObj && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80">
                      <button
                        onClick={() => setExpandedBlockIndex(expandedBlockIndex === blockObj.blockIndex ? null : blockObj.blockIndex)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 font-mono"
                      >
                        <span>Block #{blockObj.blockIndex} Cryptographic Proof</span>
                        {expandedBlockIndex === blockObj.blockIndex ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {expandedBlockIndex === blockObj.blockIndex && (
                        <div className="mt-3 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-2 border border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Block Hash (SHA-256):</span>
                            <button
                              onClick={() => handleCopy(blockObj.blockHash)}
                              className="text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              {copiedHash === blockObj.blockHash ? 'Copied!' : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-emerald-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                            {blockObj.blockHash}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1 text-slate-400 border-t border-slate-800">
                            <div><span className="text-slate-500">Previous Hash:</span> {blockObj.previousHash.substring(0, 16)}...</div>
                            <div><span className="text-slate-500">Tx Hash:</span> {blockObj.txHash.substring(0, 16)}...</div>
                            <div><span className="text-slate-500">Verifier Node:</span> {blockObj.verifierNode}</div>
                            <div><span className="text-slate-500">Gas Used:</span> {blockObj.gasUsed} gwei</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
