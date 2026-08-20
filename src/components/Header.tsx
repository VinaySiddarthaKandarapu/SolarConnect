import React, { useState } from 'react';
import { NavigationTab, UserProfile } from '../types';
import {
  Sun,
  Calculator,
  FileText,
  History,
  ShieldAlert,
  Search,
  RotateCcw,
  ShieldCheck,
  Menu,
  X,
  Layers,
  LayoutDashboard,
  HelpCircle,
  User,
  CheckCircle2,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onSearchApp: (appId: string) => void;
  onReplaySplash: () => void;
  selectedAppId?: string;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSearchApp,
  onReplaySplash,
  selectedAppId = 'SC10245',
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchApp(searchInput.trim());
      setSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'calculator', label: 'Solar Calculator', icon: <Calculator className="w-5 h-5" /> },
    { id: 'apply', label: 'Apply for Subsidy', icon: <FileText className="w-5 h-5" /> },
    { id: 'my_applications', label: 'My Applications', icon: <History className="w-5 h-5" /> },
    { id: 'blockchain_ledger', label: 'Blockchain Ledger', icon: <Layers className="w-5 h-5" /> },
    { id: 'complaints', label: 'Support Center', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* ================= DESKTOP SLEEK SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0 fixed top-0 bottom-0 left-0 z-30 shadow-xs">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 via-orange-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/10 shrink-0">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900">
              SOLAR<span className="text-emerald-700">CONNECT</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Smart Subsidy AI
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-6 bg-emerald-600 absolute left-0 rounded-r-full" />
                )}
                <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System Status Box */}
        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-100/80 shadow-2xs">
            <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mb-1">
              System Status
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs font-semibold text-emerald-900">Blockchain Mainnet Live</p>
            </div>
            <p className="text-[10px] text-emerald-700/80 mt-1 font-mono">MNRE & DISCOM Synced</p>
          </div>
        </div>
      </aside>

      {/* ================= DESKTOP SLEEK TOP HEADER ================= */}
      <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-8 fixed top-0 right-0 left-64 z-20 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {currentUser ? `Welcome, ${currentUser.name}` : 'Welcome, Guest'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentUser
              ? `${currentUser.discomName} • ${currentUser.consumerNumber}`
              : 'Log in to manage rooftop solar applications & subsidy disbursements.'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Application ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-52 pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Active ID Badge */}
          <div className="text-right px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-200/80">
            <p className="text-xs font-extrabold text-emerald-950 font-mono">{selectedAppId}</p>
            <p className="text-[9px] text-emerald-700 uppercase font-bold tracking-tight">Active Application</p>
          </div>

          {/* Replay Splash Button */}
          <button
            onClick={onReplaySplash}
            title="Replay Opening Splash Animation"
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Authentication State: Log In Button vs User Avatar Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all border border-slate-800 shadow-sm"
              >
                <div className="text-left hidden xl:block">
                  <div className="text-[11px] font-bold leading-tight text-emerald-300">{currentUser.name}</div>
                  <div className="text-[9px] text-slate-400 font-mono leading-none">{currentUser.consumerNumber.split('-').slice(0, 2).join('-')}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-emerald-400/30">
                  {currentUser.avatarInitials || 'SC'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-2 border-b border-slate-100">
                    <p className="font-extrabold text-slate-900 text-sm">{currentUser.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                    <p className="text-emerald-700 text-[10px] font-semibold mt-0.5">{currentUser.phone}</p>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">State:</span>
                      <span className="font-semibold text-slate-800">{currentUser.state}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Consumer No:</span>
                      <span className="font-mono font-bold text-slate-800">{currentUser.consumerNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setActiveTab('my_applications');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-xl font-semibold transition-colors flex items-center gap-2"
                    >
                      <History className="w-4 h-4 text-emerald-600" /> My Applications
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-600" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In / OTP</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= MOBILE NAVIGATION HEADER ================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-2xs px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 bg-gradient-to-br from-amber-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/10">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900">
              SOLAR<span className="text-emerald-700">CONNECT</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Smart Subsidy AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                {currentUser.avatarInitials}
              </div>
              <span className="truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" /> Log In
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] z-30 bg-white border-b border-slate-200 shadow-xl p-4 space-y-3">
          {currentUser && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-xs">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500">{currentUser.email || currentUser.phone}</p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold"
              >
                Log Out
              </button>
            </div>
          )}

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Application ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                  activeTab === item.id
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => {
                onReplaySplash();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Replay Splash Intro
            </button>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Mainnet Live
            </span>
          </div>
        </div>
      )}
    </>
  );
};


