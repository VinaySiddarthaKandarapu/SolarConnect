import React, { useState } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus, SolarApplication } from '../types';
import {
  ShieldAlert,
  PlusCircle,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  FileText
} from 'lucide-react';

interface ComplaintDeskProps {
  complaints: Complaint[];
  applications: SolarApplication[];
  onCreateComplaint: (newComplaint: Complaint) => void;
}

export const ComplaintDesk: React.FC<ComplaintDeskProps> = ({
  complaints,
  applications,
  onCreateComplaint,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || 'SC10245');
  const [applicantName, setApplicantName] = useState('Priya Sundaram');
  const [phone, setPhone] = useState('+91 91234 56789');
  const [category, setCategory] = useState<ComplaintCategory>('subsidy_delay');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newCmpId = `CMP-${Math.floor(80000 + Math.random() * 19000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newComplaint: Complaint = {
      id: newCmpId,
      applicationId: selectedAppId,
      applicantName,
      phone,
      category,
      subject,
      description,
      status: 'registered',
      assignedOfficer: 'Auto-Assigned to DISCOM Grievance Desk',
      createdAt: now,
      updatedAt: now,
      resolutionNotes: 'Complaint received and logged into official MNRE Grievance Portal. Response guaranteed within 48 hours.',
    };

    onCreateComplaint(newComplaint);
    setShowForm(false);
    setSubject('');
    setDescription('');
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'registered':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3 text-slate-600" /> Complaint Registered</span>;
      case 'assigned':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-full text-xs flex items-center gap-1"><UserCheck className="w-3 h-3 text-blue-600" /> Officer Assigned</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-full text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3 text-purple-600" /> Under Review</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Transparent Issue Resolution Desk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Complaint Tracking & Grievance Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Register issues regarding subsidy delays, DISCOM net-metering, or vendor installation. Track resolution steps with guaranteed 48-hour SLA.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-rose-500/20 transition-all shrink-0 self-start sm:self-center flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? 'Cancel Form' : 'File New Complaint'}</span>
          </button>
        </div>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Register New Complaint
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Select Solar Application ID</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-mono"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>{a.id} - {a.applicantName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Complaint Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                <option value="subsidy_delay">Subsidy Disbursement Delay</option>
                <option value="meter_installation">DISCOM Net-Meter Installation Issue</option>
                <option value="vendor_issue">Vendor Installation Quality / Delay</option>
                <option value="ocr_verification">Document Verification Discrepancy</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Complainant Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Subject / Title</label>
              <input
                type="text"
                placeholder="e.g. Net Meter installation delay exceeding 15 days"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Detailed Complaint Description</label>
              <textarea
                rows={3}
                placeholder="Describe what happened, dates, and what assistance is needed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow"
            >
              Log Complaint & Generate ID
            </button>
          </div>
        </form>
      )}

      {/* Existing Complaints List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active Grievances & History</h2>

        {complaints.map((cmp) => (
          <div key={cmp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-extrabold text-sm text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  {cmp.id}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cmp.subject}</h3>
                  <div className="text-[11px] text-slate-500">App ID: <span className="font-mono font-bold text-slate-700">{cmp.applicationId}</span> • {cmp.applicantName}</div>
                </div>
              </div>

              {getStatusBadge(cmp.status)}
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {cmp.description}
            </p>

            {/* Workflow Progress Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-semibold text-center">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                1. Complaint Registered
              </div>
              <div className={`p-2 rounded-lg border ${cmp.status !== 'registered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                2. Assigned
              </div>
              <div className={`p-2 rounded-lg border ${cmp.status === 'under_review' || cmp.status === 'resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                3. Under Review
              </div>
              <div className={`p-2 rounded-lg border ${cmp.status === 'resolved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                4. Resolved
              </div>
            </div>

            {/* Resolution Note & Officer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-700">Officer:</span> {cmp.assignedOfficer}
              </div>
              <div className="text-[11px] font-mono">Created: {cmp.createdAt}</div>
            </div>

            {cmp.resolutionNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold block mb-0.5">Resolution Notes:</span>
                {cmp.resolutionNotes}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
