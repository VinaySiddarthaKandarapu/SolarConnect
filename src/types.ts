export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  consumerNumber: string;
  discomName: string;
  isLoggedIn: boolean;
  avatarInitials: string;
}

export type ApplicationStage =
  | 'submitted'
  | 'verified'
  | 'approved'
  | 'installation'
  | 'inspected'
  | 'subsidy_processed'
  | 'payment_sent';

export type NavigationTab =
  | 'dashboard'
  | 'calculator'
  | 'apply'
  | 'my_applications'
  | 'blockchain_ledger'
  | 'complaints';

export interface BlockRecord {
  blockIndex: number;
  timestamp: string;
  stage: ApplicationStage;
  stageTitle: string;
  description: string;
  blockHash: string;
  previousHash: string;
  verifierNode: string;
  txHash: string;
  gasUsed: number;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: 'electricity_bill' | 'govt_id' | 'roof_ownership' | 'bank_proof';
  uploadedAt: string;
  verified: boolean;
  fileSize?: string;
  ocrExtracted?: {
    consumerId?: string;
    consumerName?: string;
    address?: string;
    sanctionedLoadKw?: string;
    monthlyConsumptionKwh?: string;
    monthlyBillAmount?: string;
    discomName?: string;
    confidenceScore?: string;
  };
}

export interface SolarApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  consumerNumber: string;
  discomName: string;
  sanctionedLoadKw: number;
  capacityKw: number;
  estimatedSystemCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  netCustomerContribution: number;
  annualSavingsEst: number;
  paybackPeriodYears: number;
  currentStage: ApplicationStage;
  submittedAt: string;
  updatedAt: string;
  vendorName: string;
  bankAccountLast4: string;
  uploadedDocs: UploadedDoc[];
  blockchainLedger: BlockRecord[];
}

export type ComplaintCategory =
  | 'subsidy_delay'
  | 'meter_installation'
  | 'vendor_issue'
  | 'ocr_verification'
  | 'billing_discrepancy'
  | 'other';

export type ComplaintStatus = 'registered' | 'assigned' | 'under_review' | 'resolved';

export interface Complaint {
  id: string;
  applicationId: string;
  applicantName: string;
  phone: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  assignedOfficer: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export interface CalculationInput {
  monthlyBillAmount: number;
  monthlyKwhUsage: number;
  desiredCapacityKw: number;
  stateRegion: string;
  roofType: 'concrete_flat' | 'tin_shed' | 'slanted_tile';
  roofAreaSqFt: number;
  useNetMetering: boolean;
}

export interface CalculationResult {
  recommendedKw: number;
  estimatedSystemCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netOutofPocketCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackPeriodYears: number;
  lifetime25YrSavings: number;
  co2OffsetTonnesPerYr: number;
  equivalentTreesPlanted: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string;
  actionPrompt?: {
    label: string;
    tab: NavigationTab;
  };
}
