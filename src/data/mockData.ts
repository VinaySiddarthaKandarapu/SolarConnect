import { SolarApplication, Complaint, CalculationResult, CalculationInput, BlockRecord } from '../types';

// Helper to simulate SHA-256 block hash generation
export function generateBlockHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs((hash ^ 0x5a5a5a5a)).toString(16).padStart(8, '0');
  const hex3 = Math.abs((hash * 31)).toString(16).padStart(8, '0');
  const hex4 = Math.abs((hash + 0x12345678)).toString(16).padStart(8, '0');
  return `0x${hex}${hex2}${hex3}${hex4}`.toLowerCase();
}

export function formatBlockchainDate(dateString: string): string {
  try {
    const d = new Date(dateString.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

export const STATE_SUBSIDY_RATES: Record<string, { stateBonusPerKw: number; discom: string }> = {
  'Andhra Pradesh': { stateBonusPerKw: 2500, discom: 'APEPDCL / APSPDCL / APCPDCL' },
  'Telangana': { stateBonusPerKw: 2000, discom: 'TSSPDCL / TSNPDCL' },
  'Karnataka': { stateBonusPerKw: 2500, discom: 'BESCOM / HESCOM / GESCOM / CESC' },
  'Tamil Nadu': { stateBonusPerKw: 1500, discom: 'TANGEDCO' },
  'Kerala': { stateBonusPerKw: 1000, discom: 'KSEB Kerala' },
  'Maharashtra': { stateBonusPerKw: 1500, discom: 'MSEDCL (Mahadiscom) / BEST' },
  'Gujarat': { stateBonusPerKw: 3000, discom: 'UGVCL / DGVCL / Torrent Power' },
  'Delhi (NCR)': { stateBonusPerKw: 2000, discom: 'Tata Power DDL / BSES Yamuna' },
  'Uttar Pradesh': { stateBonusPerKw: 1500, discom: 'UPPCL (MVVNL / DVVNL / PVVNL)' },
  'Rajasthan': { stateBonusPerKw: 2000, discom: 'JVVNL / AVVNL / JdVVNL' },
  'West Bengal': { stateBonusPerKw: 1000, discom: 'WBSEDCL / CESC' },
  'Madhya Pradesh': { stateBonusPerKw: 1500, discom: 'MPPKVVCL / MPWZ' },
  'Bihar': { stateBonusPerKw: 1000, discom: 'SBPDCL / NBPDCL' },
  'Odisha': { stateBonusPerKw: 1200, discom: 'TPCODL / TPWODL / TPSODL' },
  'Punjab': { stateBonusPerKw: 1500, discom: 'PSPCL' },
  'Haryana': { stateBonusPerKw: 2000, discom: 'UHBVN / DHBVN' },
  'Assam': { stateBonusPerKw: 2000, discom: 'APDCL' },
  'Jharkhand': { stateBonusPerKw: 1000, discom: 'JBVNL' },
  'Chhattisgarh': { stateBonusPerKw: 1500, discom: 'CSPDCL' },
  'Himachal Pradesh': { stateBonusPerKw: 2000, discom: 'HPSEBL' },
  'Uttarakhand': { stateBonusPerKw: 1500, discom: 'UPCL' },
  'Goa': { stateBonusPerKw: 2000, discom: 'Goa Electricity Department' },
  'Jammu & Kashmir': { stateBonusPerKw: 2500, discom: 'JPDCL / KPDCL' },
  'Ladakh': { stateBonusPerKw: 3000, discom: 'Ladakh Power Development Department' },
  'Puducherry': { stateBonusPerKw: 1500, discom: 'Puducherry Electricity Dept' },
  'Chandigarh': { stateBonusPerKw: 2000, discom: 'Chandigarh Electricity Dept' },
  'Tripura': { stateBonusPerKw: 1500, discom: 'TSECL' },
  'Meghalaya': { stateBonusPerKw: 1500, discom: 'MePDCL' },
  'Manipur': { stateBonusPerKw: 1500, discom: 'MSPDCL' },
  'Nagaland': { stateBonusPerKw: 1500, discom: 'Department of Power Nagaland' },
  'Arunachal Pradesh': { stateBonusPerKw: 2000, discom: 'Department of Power AP' },
  'Mizoram': { stateBonusPerKw: 1500, discom: 'P&E Department Mizoram' },
  'Sikkim': { stateBonusPerKw: 2000, discom: 'Energy & Power Dept Sikkim' },
  'Andaman & Nicobar Islands': { stateBonusPerKw: 2500, discom: 'Electricity Dept A&N' },
  'Dadra & Nagar Haveli and Daman & Diu': { stateBonusPerKw: 1500, discom: 'DNHPDCL' },
  'Lakshadweep': { stateBonusPerKw: 2500, discom: 'Lakshadweep Electricity Dept' },
  'Other / Central Direct': { stateBonusPerKw: 0, discom: 'National Grid Provider' },
};

export const INITIAL_APPLICATIONS: SolarApplication[] = [
  {
    id: 'SC10245',
    applicantName: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '+91 98412 34567',
    address: 'Flat 402, Green Enclave, Sector 14, New Delhi',
    state: 'Delhi (NCR)',
    consumerNumber: 'DISCOM-DEL-8839120',
    discomName: 'Tata Power DDL',
    sanctionedLoadKw: 4.0,
    capacityKw: 3.0,
    estimatedSystemCost: 145000,
    centralSubsidy: 78000,
    stateSubsidy: 6000,
    netCustomerContribution: 61000,
    annualSavingsEst: 28400,
    paybackPeriodYears: 2.1,
    currentStage: 'subsidy_processed',
    submittedAt: '2026-07-12 10:15:00',
    updatedAt: '2026-08-05 16:30:00',
    vendorName: 'SuryaTech Solar Solutions Ltd.',
    bankAccountLast4: '4892',
    uploadedDocs: [
      {
        id: 'doc-101',
        name: 'Electricity_Bill_June2026.pdf',
        type: 'electricity_bill',
        uploadedAt: '2026-07-12 10:16:00',
        verified: true,
        fileSize: '1.2 MB',
        ocrExtracted: {
          consumerId: 'DISCOM-DEL-8839120',
          consumerName: 'Ananya Verma',
          address: 'Flat 402, Green Enclave, Sector 14, New Delhi',
          sanctionedLoadKw: '4.0',
          monthlyConsumptionKwh: '410',
          monthlyBillAmount: '3650',
          discomName: 'Tata Power DDL',
          confidenceScore: '98.5%',
        },
      },
      {
        id: 'doc-102',
        name: 'Aadhaar_Card_Verified.pdf',
        type: 'govt_id',
        uploadedAt: '2026-07-12 10:18:00',
        verified: true,
        fileSize: '850 KB',
      },
      {
        id: 'doc-103',
        name: 'Terrace_Rights_Proof.pdf',
        type: 'roof_ownership',
        uploadedAt: '2026-07-12 10:20:00',
        verified: true,
        fileSize: '2.1 MB',
      },
    ],
    blockchainLedger: [
      {
        blockIndex: 1,
        timestamp: '2026-07-12 10:22:14',
        stage: 'submitted',
        stageTitle: 'Application Submitted',
        description: 'Application SC10245 registered on SolarConnect smart contract by Ananya Verma.',
        blockHash: generateBlockHash('SC10245-1-submitted-2026-07-12'),
        previousHash: '0x0000000000000000000000000000000000000000',
        verifierNode: 'Node-01 (Delhi DISCOM Portal)',
        txHash: '0xa4e98f12b73c4d091aef23456789abcd',
        gasUsed: 21000,
      },
      {
        blockIndex: 2,
        timestamp: '2026-07-14 14:05:30',
        stage: 'verified',
        stageTitle: 'Documents Verified',
        description: 'AI OCR validation & DISCOM sanction load verified automatically. Electricity Bill & ID matched.',
        blockHash: generateBlockHash('SC10245-2-verified-2026-07-14'),
        previousHash: generateBlockHash('SC10245-1-submitted-2026-07-12'),
        verifierNode: 'Node-03 (SolarConnect AI Validator)',
        txHash: '0xb892ef3410a7b45c2198d43210feebaa',
        gasUsed: 34500,
      },
      {
        blockIndex: 3,
        timestamp: '2026-07-18 11:20:10',
        stage: 'approved',
        stageTitle: 'Application Approved',
        description: 'Ministry of New & Renewable Energy (MNRE) sanction quota allocated for ₹78,000 subsidy.',
        blockHash: generateBlockHash('SC10245-3-approved-2026-07-18'),
        previousHash: generateBlockHash('SC10245-2-verified-2026-07-14'),
        verifierNode: 'Node-07 (MNRE Central Registry)',
        txHash: '0xc11234abcd7890ef1234567890abcdef',
        gasUsed: 42000,
      },
      {
        blockIndex: 4,
        timestamp: '2026-07-25 09:30:00',
        stage: 'installation',
        stageTitle: 'Vendor Installation Completed',
        description: 'Vendor SuryaTech installed 3kW Monocrystalline PERC panels & Grid-tied inverter.',
        blockHash: generateBlockHash('SC10245-4-installation-2026-07-25'),
        previousHash: generateBlockHash('SC10245-3-approved-2026-07-18'),
        verifierNode: 'Node-04 (SuryaTech Installer Oracle)',
        txHash: '0xd99887766554433221100aabbccddeeff',
        gasUsed: 28000,
      },
      {
        blockIndex: 5,
        timestamp: '2026-07-29 15:45:00',
        stage: 'inspected',
        stageTitle: 'DISCOM Net-Meter Audit Passed',
        description: 'Bi-directional Net Meter installed and commissioned by DISCOM inspector.',
        blockHash: generateBlockHash('SC10245-5-inspected-2026-07-29'),
        previousHash: generateBlockHash('SC10245-4-installation-2026-07-25'),
        verifierNode: 'Node-01 (Tata Power DISCOM Inspector)',
        txHash: '0xe1234567890abcdef1234567890abcde',
        gasUsed: 31000,
      },
      {
        blockIndex: 6,
        timestamp: '2026-08-05 16:30:00',
        stage: 'subsidy_processed',
        stageTitle: 'Subsidy Payment Processed',
        description: 'Central Subsidy ₹78,000 + State Subsidy ₹6,000 disbursed via DBT to HDFC Bank A/C ending in 4892.',
        blockHash: generateBlockHash('SC10245-6-subsidy-2026-08-05'),
        previousHash: generateBlockHash('SC10245-5-inspected-2026-07-29'),
        verifierNode: 'Node-02 (PFMS Direct Benefit Transfer)',
        txHash: '0xf9876543210fedcba9876543210fedcb',
        gasUsed: 48000,
      },
    ],
  },
  {
    id: 'SC10198',
    applicantName: 'Priya Sundaram',
    email: 'priya.sundaram@example.com',
    phone: '+91 91234 56789',
    address: 'Plot 88, Sunrise Avenue, Koramangala, Bengaluru',
    state: 'Karnataka',
    consumerNumber: 'BESCOM-KA-7720491',
    discomName: 'BESCOM Bengaluru',
    sanctionedLoadKw: 3.0,
    capacityKw: 2.0,
    estimatedSystemCost: 98000,
    centralSubsidy: 60000,
    stateSubsidy: 5000,
    netCustomerContribution: 33000,
    annualSavingsEst: 19800,
    paybackPeriodYears: 1.7,
    currentStage: 'installation',
    submittedAt: '2026-07-28 11:00:00',
    updatedAt: '2026-08-04 10:15:00',
    vendorName: 'EcoRay Solar Systems',
    bankAccountLast4: '1092',
    uploadedDocs: [
      {
        id: 'doc-201',
        name: 'BESCOM_Bill_July.pdf',
        type: 'electricity_bill',
        uploadedAt: '2026-07-28 11:02:00',
        verified: true,
      },
    ],
    blockchainLedger: [
      {
        blockIndex: 1,
        timestamp: '2026-07-28 11:05:00',
        stage: 'submitted',
        stageTitle: 'Application Submitted',
        description: 'Application SC10198 registered by Priya Sundaram.',
        blockHash: generateBlockHash('SC10198-1-submitted'),
        previousHash: '0x0000000000000000000000000000000000000000',
        verifierNode: 'Node-05 (Karnataka Renewable Agency)',
        txHash: '0x1234abcd5678ef901234567890abcdef',
        gasUsed: 21000,
      },
      {
        blockIndex: 2,
        timestamp: '2026-07-30 09:40:00',
        stage: 'verified',
        stageTitle: 'Documents Verified',
        description: 'Sanctioned load & consumer ID auto-verified via BESCOM API.',
        blockHash: generateBlockHash('SC10198-2-verified'),
        previousHash: generateBlockHash('SC10198-1-submitted'),
        verifierNode: 'Node-03 (SolarConnect AI Validator)',
        txHash: '0x5678ef901234abcd5678ef901234abcd',
        gasUsed: 33000,
      },
      {
        blockIndex: 3,
        timestamp: '2026-08-02 14:10:00',
        stage: 'approved',
        stageTitle: 'Subsidy Quota Approved',
        description: 'Central Subsidy ₹60,000 reserved under PM Surya Ghar scheme.',
        blockHash: generateBlockHash('SC10198-3-approved'),
        previousHash: generateBlockHash('SC10198-2-verified'),
        verifierNode: 'Node-07 (MNRE Central Registry)',
        txHash: '0x901234abcdef5678901234abcdef5678',
        gasUsed: 39000,
      },
      {
        blockIndex: 4,
        timestamp: '2026-08-04 10:15:00',
        stage: 'installation',
        stageTitle: 'Vendor Installation In Progress',
        description: 'EcoRay Solar assigned for 2kW panel mounting and roof wiring.',
        blockHash: generateBlockHash('SC10198-4-installation'),
        previousHash: generateBlockHash('SC10198-3-approved'),
        verifierNode: 'Node-08 (EcoRay Vendor Oracle)',
        txHash: '0xabcdef1234567890abcdef1234567890',
        gasUsed: 26000,
      },
    ],
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-88291',
    applicationId: 'SC10198',
    applicantName: 'Priya Sundaram',
    phone: '+91 91234 56789',
    category: 'meter_installation',
    subject: 'Net-Meter Installation Schedule Inquiry',
    description: 'Vendor completed solar panel mounting on roof 3 days ago. Requesting expedited DISCOM Net-metering inspection date.',
    status: 'assigned',
    assignedOfficer: 'Vikram Singh (Sr. Field Officer, BESCOM)',
    createdAt: '2026-08-05 09:30:00',
    updatedAt: '2026-08-05 11:00:00',
    resolutionNotes: 'Assigned to Area Inspector Ramesh Babu. Inspection slot confirmed for 2026-08-09.',
  },
  {
    id: 'CMP-87104',
    applicationId: 'SC10082',
    applicantName: 'Anil Deshmukh',
    phone: '+91 98220 11223',
    category: 'subsidy_delay',
    subject: 'Bank Name Mismatch Resolution for Subsidy DBT',
    description: 'Received alert regarding minor spelling difference between electricity bill and bank passbook name.',
    status: 'resolved',
    assignedOfficer: 'Sangeeta Rao (DBT Audit Manager)',
    createdAt: '2026-07-20 14:00:00',
    updatedAt: '2026-07-22 16:45:00',
    resolutionNotes: 'Applicant uploaded Aadhaar affidavit. Name discrepancy verified and subsidy ₹60,000 credited successfully.',
  },
];

export function calculateSolarMetrics(input: CalculationInput): CalculationResult {
  const { monthlyBillAmount, monthlyKwhUsage, desiredCapacityKw, stateRegion } = input;
  
  let recommendedKw = desiredCapacityKw;
  if (!recommendedKw || recommendedKw <= 0) {
    // Standard rule: 1kW generates ~120 kWh per month
    const estKwh = monthlyKwhUsage > 0 ? monthlyKwhUsage : (monthlyBillAmount / 8);
    recommendedKw = Math.max(1, Math.min(10, Math.round((estKwh / 120) * 2) / 2));
  }

  // Cost estimate: ~₹48,000 for 1kW, ₹92,000 for 2kW, ₹1,40,000 for 3kW, etc.
  const estimatedSystemCost = Math.round(
    recommendedKw <= 1 ? 50000 :
    recommendedKw <= 2 ? 95000 :
    recommendedKw <= 3 ? 142000 :
    142000 + (recommendedKw - 3) * 42000
  );

  // Central PM Surya Ghar Subsidy calculation
  let centralSubsidy = 0;
  if (recommendedKw >= 3) {
    centralSubsidy = 78000;
  } else if (recommendedKw >= 2) {
    centralSubsidy = 60000;
  } else {
    centralSubsidy = 30000;
  }

  // State subsidy rate
  const stateBonus = STATE_SUBSIDY_RATES[stateRegion]?.stateBonusPerKw || 1000;
  const stateSubsidy = Math.round(stateBonus * recommendedKw);
  const totalSubsidy = centralSubsidy + stateSubsidy;
  const netOutofPocketCost = Math.max(0, estimatedSystemCost - totalSubsidy);

  // Daily generation: ~4.2 kWh per kW
  const monthlyUnitsGen = recommendedKw * 4.2 * 30;
  const unitRate = 8.0; // Average ₹8 per unit
  const monthlySavings = Math.round(monthlyUnitsGen * unitRate);
  const annualSavings = monthlySavings * 12;

  const paybackPeriodYears = Math.max(0.8, Math.round((netOutofPocketCost / annualSavings) * 10) / 10);
  const lifetime25YrSavings = (annualSavings * 25) - netOutofPocketCost;

  const co2OffsetTonnesPerYr = Math.round(recommendedKw * 1.25 * 10) / 10;
  const equivalentTreesPlanted = Math.round(co2OffsetTonnesPerYr * 45);

  return {
    recommendedKw,
    estimatedSystemCost,
    centralSubsidy,
    stateSubsidy,
    totalSubsidy,
    netOutofPocketCost,
    monthlySavings,
    annualSavings,
    paybackPeriodYears,
    lifetime25YrSavings,
    co2OffsetTonnesPerYr,
    equivalentTreesPlanted,
  };
}
