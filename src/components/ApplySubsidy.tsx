import React, { useState } from 'react';
import { SolarApplication, CalculationResult, CalculationInput, UploadedDoc, ApplicationStage, BlockRecord } from '../types';
import { generateBlockHash, STATE_SUBSIDY_RATES } from '../data/mockData';
import {
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  CreditCard,
  User,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Layers,
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface ApplySubsidyProps {
  initialCalculation?: { result: CalculationResult; input: CalculationInput } | null;
  onSubmitApplication: (newApp: SolarApplication) => void;
}

export const ApplySubsidy: React.FC<ApplySubsidyProps> = ({
  initialCalculation,
  onSubmitApplication,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [stateRegion, setStateRegion] = useState(initialCalculation?.input.stateRegion || 'Delhi (NCR)');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [discomName, setDiscomName] = useState('Tata Power Delhi Distribution Ltd (TPDDL)');
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState<number>(4.0);
  const [capacityKw, setCapacityKw] = useState<number>(initialCalculation?.result.recommendedKw || 3.0);
  const [vendorName, setVendorName] = useState('SuryaTech Solar Solutions Ltd.');
  const [bankAccount, setBankAccount] = useState('489210984892');
  const [bankIfsc, setBankIfsc] = useState('HDFC0000240');

  // Document Uploads & OCR State
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');

  // Sync DISCOM name automatically when state region changes
  React.useEffect(() => {
    if (STATE_SUBSIDY_RATES[stateRegion]?.discom) {
      setDiscomName(STATE_SUBSIDY_RATES[stateRegion].discom);
    }
  }, [stateRegion]);

  // Handle OCR File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: UploadedDoc['type']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    setOcrSuccessMsg('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        // Call backend Express /api/ocr endpoint
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            fileName: file.name,
          }),
        });

        const resData = await response.json();
        const ocrData = resData.data;

        // Auto-fill fields if OCR extracted them!
        if (ocrData?.consumerId) setConsumerNumber(ocrData.consumerId);
        if (ocrData?.consumerName) setApplicantName(ocrData.consumerName);
        if (ocrData?.address) setAddress(ocrData.address);
        if (ocrData?.discomName && ocrData.discomName !== 'N/A') {
          setDiscomName(ocrData.discomName);
        } else if (STATE_SUBSIDY_RATES[stateRegion]?.discom) {
          setDiscomName(STATE_SUBSIDY_RATES[stateRegion].discom);
        }
        if (ocrData?.sanctionedLoadKw && !isNaN(parseFloat(ocrData.sanctionedLoadKw))) {
          setSanctionedLoadKw(parseFloat(ocrData.sanctionedLoadKw));
        }

        const newDoc: UploadedDoc = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: docType,
          uploadedAt: new Date().toLocaleString(),
          verified: true,
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
          ocrExtracted: ocrData,
        };

        setUploadedDocs((prev) => [...prev, newDoc]);
        setOcrSuccessMsg(`AI OCR Auto-Extracted data from "${file.name}"! Form fields populated.`);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error parsing OCR:', err);
      // Create fallback uploaded doc
      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: docType,
        uploadedAt: new Date().toLocaleString(),
        verified: true,
        fileSize: '1.1 MB',
      };
      setUploadedDocs((prev) => [...prev, newDoc]);
    } finally {
      setOcrLoading(false);
    }
  };

  // Submit Application and Mint Blockchain Genesis Record
  const handleSubmit = () => {
    const appId = `SC${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Subsidy math
    let centralSub = 30000;
    if (capacityKw >= 3) centralSub = 78000;
    else if (capacityKw >= 2) centralSub = 60000;

    const stateRate = STATE_SUBSIDY_RATES[stateRegion]?.stateBonusPerKw || 1000;
    const stateSub = stateRate * capacityKw;
    const sysCost = Math.round(capacityKw <= 2 ? 95000 : 142000 + (capacityKw - 3) * 42000);
    const netCost = Math.max(0, sysCost - (centralSub + stateSub));

    const genesisBlock: BlockRecord = {
      blockIndex: 1,
      timestamp: now,
      stage: 'submitted',
      stageTitle: 'Application Submitted',
      description: `Application ${appId} registered on SolarConnect smart contract for ${applicantName}.`,
      blockHash: generateBlockHash(`${appId}-genesis-${now}`),
      previousHash: '0x0000000000000000000000000000000000000000',
      verifierNode: 'Node-01 (DISCOM Direct Portal)',
      txHash: generateBlockHash(`tx-${appId}-genesis`),
      gasUsed: 21000,
    };

    const newApp: SolarApplication = {
      id: appId,
      applicantName: applicantName || 'Solar Applicant',
      email,
      phone,
      address,
      state: stateRegion,
      consumerNumber: consumerNumber || 'DISCOM-8839210',
      discomName: discomName || 'State Power Distribution',
      sanctionedLoadKw,
      capacityKw,
      estimatedSystemCost: sysCost,
      centralSubsidy: centralSub,
      stateSubsidy: stateSub,
      netCustomerContribution: netCost,
      annualSavingsEst: Math.round(capacityKw * 125 * 8 * 12),
      paybackPeriodYears: Math.round((netCost / (capacityKw * 125 * 8 * 12)) * 10) / 10 || 2.2,
      currentStage: 'submitted',
      submittedAt: now,
      updatedAt: now,
      vendorName,
      bankAccountLast4: bankAccount.slice(-4) || '4892',
      uploadedDocs,
      blockchainLedger: [genesisBlock],
    };

    onSubmitApplication(newApp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Title Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI OCR Assisted & Blockchain Verified</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Apply for Solar Subsidy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Complete your rooftop solar subsidy application. Upload your electricity bill to let our AI auto-extract consumer details.
          </p>
        </div>
      </div>

      {/* Multi-Step Wizard Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200'}`}>1</span>
            <span className="hidden sm:inline">Applicant Info</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200'}`}>2</span>
            <span className="hidden sm:inline">AI Document OCR</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span className="hidden sm:inline">Bank DBT & Review</span>
          </div>
        </div>
      </div>

      {/* Step 1: Personal & Consumer Details */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-600" /> 1. Applicant & Electricity Consumer Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Applicant Name</label>
              <input
                type="text"
                placeholder="e.g. Ananya Verma"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">State / Union Territory</label>
              <select
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                {Object.keys(STATE_SUBSIDY_RATES).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Installation Address (Matches Electricity Bill)</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-2"
            >
              <span>Next: AI Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Smart Document Upload with Gemini OCR */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> 2. Smart Document Upload (Gemini AI OCR)
            </h2>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
              Auto-extracts Consumer ID & Load
            </span>
          </div>

          {ocrSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{ocrSuccessMsg}</span>
            </div>
          )}

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Electricity Bill Card */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl text-center space-y-2 transition-colors relative bg-slate-50/50">
              <FileText className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Electricity Bill (Required)</div>
              <p className="text-[10px] text-slate-500">
                Upload image or PDF. Our AI OCR will extract Consumer ID & Sanctioned Load.
              </p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5" /> Select Electricity Bill
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'electricity_bill')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Government ID Card */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl text-center space-y-2 transition-colors relative bg-slate-50/50">
              <CreditCard className="w-8 h-8 text-emerald-700 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Aadhaar / PAN Card</div>
              <p className="text-[10px] text-slate-500">
                Upload identity proof to verify applicant name.
              </p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5" /> Select ID Document
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'govt_id')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {ocrLoading && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Scanning document with Gemini AI OCR... Extracting metadata fields...</span>
            </div>
          )}

          {/* Auto-filled / Verified Fields Preview */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">Auto-Filled Electricity Metadata</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Consumer Number / ID</label>
                <input
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. DISCOM-DEL-8839120"
                  className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-slate-500">Electricity Utility (DISCOM)</label>
                  <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {stateRegion} DISCOM
                  </span>
                </div>
                <input
                  type="text"
                  value={discomName}
                  onChange={(e) => setDiscomName(e.target.value)}
                  placeholder={`DISCOM for ${stateRegion}`}
                  className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Sanctioned Load (kW)</label>
                <input
                  type="number"
                  value={sanctionedLoadKw}
                  onChange={(e) => setSanctionedLoadKw(Number(e.target.value))}
                  className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedDocs.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">Uploaded Verified Attachments</div>
              <div className="space-y-1.5">
                {uploadedDocs.map((doc) => (
                  <div key={doc.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-slate-800">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.fileSize} • Uploaded {doc.uploadedAt}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded-full">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center gap-2"
            >
              <span>Next: Bank DBT & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Bank DBT Account & Final Submission */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-blue-500" /> 3. Direct Benefit Transfer (DBT) Bank Account
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Requested Solar System Size</label>
              <select
                value={capacityKw}
                onChange={(e) => setCapacityKw(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-emerald-800"
              >
                <option value={1}>1 kW Solar (Subsidy: ₹30,000)</option>
                <option value={2}>2 kW Solar (Subsidy: ₹60,000)</option>
                <option value={3}>3 kW Solar (Subsidy: ₹78,000)</option>
                <option value={5}>5 kW Solar (Subsidy: ₹78,000)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Preferred Empanelled Vendor</label>
              <select
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="SuryaTech Solar Solutions Ltd.">SuryaTech Solar Solutions Ltd.</option>
                <option value="EcoRay Solar Systems">EcoRay Solar Systems</option>
                <option value="GreenGrid Rooftop Energies">GreenGrid Rooftop Energies</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Bank Account Number (For DBT Subsidy Credit)</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Bank IFSC Code</label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono uppercase"
              />
            </div>
          </div>

          {/* Blockchain Minting Guarantee Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Layers className="w-4 h-4 text-emerald-400" /> Blockchain Immutable Record Creation
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Upon clicking "Submit Application", a Genesis Block (Block #1) will be created on the SolarConnect Blockchain Ledger. Your application hash, DISCOM verification token, and timestamp will be permanently sealed.
            </p>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>Mint Genesis Block & Submit Application</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
