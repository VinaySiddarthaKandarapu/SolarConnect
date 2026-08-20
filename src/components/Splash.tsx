import React, { useEffect, useState } from 'react';
import { Sun, Link2, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0); // 0: Logo, 1: Name, 2: Tagline, 3: Fade out

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 2700);
    const t4 = setTimeout(() => onComplete(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-700 ${step === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/15 via-slate-950/90 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Animated Branding Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        
        {/* Step 0+: Stylized Logo Symbol */}
        <div className={`transition-all duration-700 transform ${step >= 0 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-emerald-400 p-0.5 shadow-2xl shadow-emerald-900/40">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              {/* Solar Panel grid pattern overlay */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              {/* Sun & Connectivity node graphic */}
              <div className="relative z-10 flex items-center justify-center">
                <Sun className="w-12 h-12 text-emerald-400 animate-[spin_12s_linear_infinite]" />
                <Link2 className="w-7 h-7 text-emerald-200 absolute stroke-[2.5]" />
              </div>
              
              <div className="absolute bottom-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-500/20 rounded text-[9px] font-medium text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-2.5 h-2.5" /> AI + Chain
              </div>
            </div>
          </div>
        </div>

        {/* Step 1+: Project Name */}
        <div className={`mt-8 transition-all duration-700 transform ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-400 bg-clip-text text-transparent font-sans">
            SOLARCONNECT
          </h1>
        </div>

        {/* Step 2+: Tagline */}
        <div className={`mt-3 transition-all duration-700 transform ${step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <p className="text-base sm:text-lg font-medium text-emerald-200/90 tracking-wide">
            Smart Solar. Simple Subsidy. Transparent Future.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> PM Surya Ghar Scheme
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI OCR Verified
            </span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="mt-10 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-800 transition-colors"
        >
          <span>Skip to Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
