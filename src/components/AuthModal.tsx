import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Lock,
  Phone,
  Mail,
  KeyRound,
  ShieldCheck,
  Sun,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginType, setLoginType] = useState<'otp' | 'password'>('otp');

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedState, setSelectedState] = useState('Delhi (NCR)');
  const [consumerNo, setConsumerNo] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  if (!isOpen) return null;

  // Derive Initials from Name or Email
  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'SC';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Trigger OTP Generation
  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your Email or Mobile Phone number.');
      return;
    }
    setErrorMessage('');
    setIsSendingOtp(true);

    setTimeout(() => {
      // Generate a friendly 6-digit OTP
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomCode);
      setOtpSent(true);
      setIsSendingOtp(false);
      setOtpTimer(30);
    }, 600);
  };

  // Submit Login / Registration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Email or Mobile Number is required.');
      return;
    }

    if (authMode === 'login' && loginType === 'otp') {
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (enteredOtp.trim() !== generatedOtp && enteredOtp.trim() !== '123456') {
        setErrorMessage('Invalid OTP code. Please use the generated code or 123456.');
        return;
      }
    }

    if (authMode === 'login' && loginType === 'password') {
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    // Determine derived user details
    const derivedName = fullName.trim() || (identifier.includes('@') ? identifier.split('@')[0] : 'Solar Citizen');
    const isEmail = identifier.includes('@');

    const newUser: UserProfile = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: derivedName,
      email: isEmail ? identifier.trim() : `${derivedName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: !isEmail ? identifier.trim() : '+91 98765 43210',
      state: selectedState,
      consumerNumber: consumerNo || `DISCOM-${selectedState.slice(0, 3).toUpperCase()}-98412`,
      discomName: `${selectedState} Power Distribution`,
      isLoggedIn: true,
      avatarInitials: getInitials(derivedName),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  // Quick Demo Login Helper
  const handleDemoLogin = (demoName: string, demoEmail: string, demoPhone: string, demoState: string) => {
    const newUser: UserProfile = {
      id: `USR-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      name: demoName,
      email: demoEmail,
      phone: demoPhone,
      state: demoState,
      consumerNumber: `DISCOM-${demoState.substring(0, 3).toUpperCase()}-77319`,
      discomName: `${demoState} Electricity Board`,
      isLoggedIn: true,
      avatarInitials: getInitials(demoName),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Modal Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">SolarConnect Portal</h3>
              <p className="text-xs text-emerald-300/80 font-medium">PM Surya Ghar & DISCOM Unified Sign-In</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-white text-emerald-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name field (Only during Registration) */}
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Applicant Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ananya Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* Email or Phone Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address or Mobile Phone
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. user@example.com or 9876543210"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (otpSent) setOtpSent(false);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                required
              />
              {identifier.includes('@') ? (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              ) : (
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              )}
            </div>
          </div>

          {/* Login Type Selection (OTP vs Password) */}
          {authMode === 'login' && (
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-600">Verification Mode:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLoginType('otp')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    loginType === 'otp'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  6-Digit OTP
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('password')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    loginType === 'password'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Password
                </button>
              </div>
            </div>
          )}

          {/* Password Mode Fields */}
          {(authMode === 'register' || (authMode === 'login' && loginType === 'password')) && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {/* OTP Mode Fields */}
          {authMode === 'login' && loginType === 'otp' && (
            <div className="space-y-3">
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !identifier.trim()}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Generating OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span>Send 6-Digit OTP Code</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  {/* Generated Code Simulation Toast Banner */}
                  <div className="flex items-center justify-between text-emerald-900 font-extrabold text-xs">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> OTP Sent:
                    </span>
                    <span className="font-mono text-sm tracking-widest bg-emerald-200/80 px-2.5 py-0.5 rounded-lg text-emerald-950">
                      {generatedOtp}
                    </span>
                  </div>

                  <p className="text-[10px] text-emerald-700">
                    Verification code sent to <strong className="text-emerald-900">{identifier}</strong>. Enter code below or test with <code className="bg-emerald-100 px-1 font-bold">123456</code>.
                  </p>

                  <div className="relative pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-center text-lg tracking-widest font-mono py-2 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Code expires in {otpTimer}s</span>
                    <button
                      type="button"
                      disabled={otpTimer > 0}
                      onClick={handleSendOtp}
                      className="font-bold text-emerald-800 hover:underline disabled:opacity-40"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Registration Extra Fields */}
          {authMode === 'register' && (
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select State / Region
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Delhi (NCR)">Delhi (NCR)</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Electricity Consumer Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. DISCOM-DEL-8839120"
                  value={consumerNo}
                  onChange={(e) => setConsumerNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all text-xs"
          >
            <span>{authMode === 'login' ? 'Authenticate & Sign In' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Demo One-Click Logins */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Or Instant One-Click Demo Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Ananya Verma', 'ananya.verma@example.com', '+91 98412 34567', 'Delhi (NCR)')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all group"
              >
                <div className="font-bold text-slate-800 group-hover:text-emerald-900">Ananya Verma</div>
                <div className="text-[9px] text-slate-500">Delhi • Tata Power</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Vikram Reddy', 'vikram.reddy@example.com', '+91 97123 88410', 'Telangana')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all group"
              >
                <div className="font-bold text-slate-800 group-hover:text-emerald-900">Vikram Reddy</div>
                <div className="text-[9px] text-slate-500">Telangana • TSSPDCL</div>
              </button>
            </div>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Encrypted Session
          </span>
          <span>PM Surya Ghar Portal</span>
        </div>

      </div>
    </div>
  );
};
