import React, { useState, useEffect } from 'react';
import { NavigationTab, SolarApplication, Complaint, CalculationResult, CalculationInput, BlockRecord, ApplicationStage, UserProfile } from './types';
import { INITIAL_APPLICATIONS, INITIAL_COMPLAINTS, generateBlockHash } from './data/mockData';
import { Splash } from './components/Splash';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { SolarCalculator } from './components/SolarCalculator';
import { ApplySubsidy } from './components/ApplySubsidy';
import { BlockchainTracker } from './components/BlockchainTracker';
import { ApplicationHistory } from './components/ApplicationHistory';
import { ComplaintDesk } from './components/ComplaintDesk';
import { AIChatbot } from './components/AIChatbot';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('solar_connect_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Applications & Complaints State
  const [applications, setApplications] = useState<SolarApplication[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<SolarApplication | null>(INITIAL_APPLICATIONS[0]);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  
  // Calculator Quote transfer state
  const [calcQuote, setCalcQuote] = useState<{ result: CalculationResult; input: CalculationInput } | null>(null);

  // Floating AI Chatbot state
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);

  // Sync logged in user to LocalStorage
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('solar_connect_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    // Check if user has an application, otherwise associate or create a linked application
    const userApp = applications.find(
      (a) => a.applicantName.toLowerCase() === user.name.toLowerCase() || a.email.toLowerCase() === user.email.toLowerCase()
    );

    if (userApp) {
      setSelectedApp(userApp);
    } else {
      // Create a personalized application for the logged in user
      const newLinkedApp: SolarApplication = {
        id: `SC${Math.floor(10000 + Math.random() * 90000)}`,
        applicantName: user.name,
        email: user.email,
        phone: user.phone,
        address: `${user.state} Residential Premises`,
        state: user.state,
        consumerNumber: user.consumerNumber,
        discomName: user.discomName,
        sanctionedLoadKw: 3.5,
        capacityKw: 3.0,
        estimatedSystemCost: 145000,
        centralSubsidy: 78000,
        stateSubsidy: 5000,
        netCustomerContribution: 62000,
        annualSavingsEst: 27500,
        paybackPeriodYears: 2.25,
        currentStage: 'submitted',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        vendorName: 'SuryaTech Solar Solutions Ltd.',
        bankAccountLast4: '7721',
        uploadedDocs: [
          {
            id: 'doc-user-bill',
            name: 'Electricity_Bill_Verified.pdf',
            type: 'electricity_bill',
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            verified: true,
            ocrExtracted: {
              consumerId: user.consumerNumber,
              consumerName: user.name,
              discomName: user.discomName,
              confidenceScore: '99.1%',
            },
          },
        ],
        blockchainLedger: [
          {
            blockIndex: 1,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            stage: 'submitted',
            stageTitle: 'APPLICATION SUBMITTED',
            description: `Rooftop Solar Subsidy application submitted by ${user.name} on PM Surya Ghar Smart Contract.`,
            blockHash: generateBlockHash(`user-${user.id}-sub`),
            previousHash: '0x0000000000000000000000000000000000000000',
            verifierNode: `Node-01 (${user.discomName} Gateway)`,
            txHash: generateBlockHash(`tx-user-${user.id}`),
            gasUsed: 21500,
          },
        ],
      };

      setApplications((prev) => [newLinkedApp, ...prev]);
      setSelectedApp(newLinkedApp);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('solar_connect_user');
    } catch (e) {
      console.error(e);
    }
  };

  // Replay splash screen handler
  const handleReplaySplash = () => {
    setShowSplash(true);
  };

  // Add new application from Apply form
  const handleNewApplication = (newApp: SolarApplication) => {
    // Override applicant details if user logged in
    const finalApp = currentUser
      ? {
          ...newApp,
          applicantName: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          consumerNumber: currentUser.consumerNumber || newApp.consumerNumber,
        }
      : newApp;

    setApplications((prev) => [finalApp, ...prev]);
    setSelectedApp(finalApp);
    setActiveTab('blockchain_ledger');
  };

  // Advance application stage simulation
  const handleAdvanceStage = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const stages: ApplicationStage[] = [
          'submitted',
          'verified',
          'approved',
          'installation',
          'inspected',
          'subsidy_processed',
          'payment_sent',
        ];

        const currIdx = stages.indexOf(app.currentStage);
        if (currIdx >= stages.length - 1) return app;

        const nextStage = stages[currIdx + 1];
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const lastBlock = app.blockchainLedger[app.blockchainLedger.length - 1];
        const nextIndex = (lastBlock?.blockIndex || 0) + 1;

        const stageDescriptions: Record<ApplicationStage, string> = {
          submitted: 'Application registered on SolarConnect smart contract.',
          verified: 'AI OCR validation & DISCOM sanction load verified.',
          approved: 'Central MNRE quota ₹78,000 allocated.',
          installation: 'Empanelled vendor installed rooftop solar panels.',
          inspected: 'Bi-directional Net Meter audit signed by DISCOM.',
          subsidy_processed: 'Central & State subsidy payment queue authorized.',
          payment_sent: 'Direct Benefit Transfer (DBT) credited to bank account.',
        };

        const newBlock: BlockRecord = {
          blockIndex: nextIndex,
          timestamp: now,
          stage: nextStage,
          stageTitle: nextStage.replace('_', ' ').toUpperCase(),
          description: stageDescriptions[nextStage],
          blockHash: generateBlockHash(`${app.id}-${nextIndex}-${nextStage}-${now}`),
          previousHash: lastBlock?.blockHash || '0x0000000000000000000000000000000000000000',
          verifierNode: 'Node-02 (PFMS Direct Benefit Transfer)',
          txHash: generateBlockHash(`tx-${app.id}-${nextIndex}`),
          gasUsed: 28000 + nextIndex * 1500,
        };

        return {
          ...app,
          currentStage: nextStage,
          updatedAt: now,
          blockchainLedger: [...app.blockchainLedger, newBlock],
        };
      })
    );
  };

  // Direct search application ID
  const handleSearchApp = (appId: string) => {
    const found = applications.find(
      (a) => a.id.toLowerCase() === appId.toLowerCase()
    );
    if (found) {
      setSelectedApp(found);
      setActiveTab('my_applications');
    } else {
      alert(`Application ID "${appId}" not found. Try searching for "SC10245" or "SC10198".`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-900 flex flex-col lg:flex-row">
      
      {/* 🚀 Opening / Splash Screen */}
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {/* 🔑 Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Main Website Sidebar & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchApp={handleSearchApp}
        onReplaySplash={handleReplaySplash}
        selectedAppId={selectedApp?.id || 'SC10245'}
        currentUser={currentUser}
        onOpenLogin={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Content Body */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 lg:pt-20">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <HomeDashboard
              setActiveTab={setActiveTab}
              applications={applications}
              onSelectApplication={(app) => setSelectedApp(app)}
              onOpenAIChat={() => setAiChatOpen(true)}
            />
          )}

          {activeTab === 'calculator' && (
            <SolarCalculator
              onApplyWithCalculation={(result, input) => {
                setCalcQuote({ result, input });
                setActiveTab('apply');
              }}
            />
          )}

          {activeTab === 'apply' && (
            <ApplySubsidy
              initialCalculation={calcQuote}
              onSubmitApplication={handleNewApplication}
            />
          )}

          {activeTab === 'blockchain_ledger' && (
            <BlockchainTracker
              application={selectedApp}
              allApplications={applications}
              onSelectApplication={(app) => setSelectedApp(app)}
            />
          )}

          {activeTab === 'my_applications' && (
            <ApplicationHistory
              applications={applications}
              onSelectApplication={(app) => {
                setSelectedApp(app);
                setActiveTab('blockchain_ledger');
              }}
              onAdvanceStage={handleAdvanceStage}
              onNavigateToApply={() => setActiveTab('apply')}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintDesk
              complaints={complaints}
              applications={applications}
              onCreateComplaint={(newCmp) => setComplaints((prev) => [newCmp, ...prev])}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto bg-slate-900 text-slate-400 py-6 text-xs border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">SOLAR<span className="text-amber-400">CONNECT</span></span>
              <span className="hidden sm:inline text-slate-500">— AI-Powered Solar Subsidy & Blockchain Transparency</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Compliant with PM Surya Ghar Rooftop Solar Portal & MNRE Guidelines
            </p>
          </div>
        </footer>
      </div>

      {/* 💬 Floating SolarConnect AI Chatbot in Bottom-Right Corner */}
      <AIChatbot
        isOpen={aiChatOpen}
        onToggle={() => setAiChatOpen(!aiChatOpen)}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

