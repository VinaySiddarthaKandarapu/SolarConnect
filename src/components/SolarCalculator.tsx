import React, { useState, useMemo } from 'react';
import { CalculationInput, CalculationResult, NavigationTab } from '../types';
import { calculateSolarMetrics, STATE_SUBSIDY_RATES } from '../data/mockData';
import {
  Sun,
  Calculator,
  DollarSign,
  TrendingUp,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Zap,
  Info,
  CheckCircle
} from 'lucide-react';

interface SolarCalculatorProps {
  onApplyWithCalculation: (calcResult: CalculationResult, input: CalculationInput) => void;
}

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({
  onApplyWithCalculation,
}) => {
  const [inputMode, setInputMode] = useState<'bill' | 'usage'>('bill');
  const [monthlyBill, setMonthlyBill] = useState<number>(3800);
  const [monthlyUsage, setMonthlyUsage] = useState<number>(450);
  const [capacityKw, setCapacityKw] = useState<number>(3);
  const [selectedState, setSelectedState] = useState<string>('Delhi (NCR)');
  const [roofType, setRoofType] = useState<CalculationInput['roofType']>('concrete_flat');
  const [roofArea, setRoofArea] = useState<number>(300);

  const calcInput: CalculationInput = useMemo(() => ({
    monthlyBillAmount: inputMode === 'bill' ? monthlyBill : monthlyUsage * 8,
    monthlyKwhUsage: inputMode === 'usage' ? monthlyUsage : Math.round(monthlyBill / 8),
    desiredCapacityKw: capacityKw,
    stateRegion: selectedState,
    roofType,
    roofAreaSqFt: roofArea,
    useNetMetering: true,
  }), [inputMode, monthlyBill, monthlyUsage, capacityKw, selectedState, roofType, roofArea]);

  const result: CalculationResult = useMemo(() => {
    return calculateSolarMetrics(calcInput);
  }, [calcInput]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Title */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>PM Surya Ghar Smart Estimator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Solar Cost & Subsidy Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Enter your monthly bill or power usage to calculate exact subsidy breakdown, net out-of-pocket expenses, and long-term savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Calculator Inputs Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-4 h-4 text-emerald-600" /> Input Electricity Parameters
          </h2>

          {/* Input Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Calculate By</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMode('bill')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  inputMode === 'bill'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Bill Amount (₹)
              </button>
              <button
                type="button"
                onClick={() => setInputMode('usage')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  inputMode === 'usage'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Electricity Units (kWh)
              </button>
            </div>
          </div>

          {/* Amount / Units Slider */}
          {inputMode === 'bill' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Average Monthly Bill</label>
                <span className="text-sm font-extrabold text-emerald-800 font-mono">₹{monthlyBill.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={800}
                max={25000}
                step={200}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹800</span>
                <span>₹12,000</span>
                <span>₹25,000+</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Monthly Usage (Units/kWh)</label>
                <span className="text-sm font-extrabold text-emerald-800 font-mono">{monthlyUsage} kWh</span>
              </div>
              <input
                type="range"
                min={100}
                max={3000}
                step={50}
                value={monthlyUsage}
                onChange={(e) => setMonthlyUsage(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>100 kWh</span>
                <span>1,500 kWh</span>
                <span>3,000 kWh</span>
              </div>
            </div>
          )}

          {/* Required Solar Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Required Solar System Size</label>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">{capacityKw} kW</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setCapacityKw(kw)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    capacityKw === kw
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {kw}kW
                </button>
              ))}
            </div>
          </div>

          {/* State / Region Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">State / Location (State Bonus Subsidy)</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-600"
            >
              {Object.keys(STATE_SUBSIDY_RATES).map((st) => (
                <option key={st} value={st}>
                  {st} (Top-up: +₹{STATE_SUBSIDY_RATES[st].stateBonusPerKw}/kW)
                </option>
              ))}
            </select>
          </div>

          {/* Roof Type & Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700">Roof Surface Type</label>
              <select
                value={roofType}
                onChange={(e) => setRoofType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="concrete_flat">Flat Concrete Roof</option>
                <option value="tin_shed">Industrial Tin Shed</option>
                <option value="slanted_tile">Slanted Roof Tile</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700">Roof Area (Sq. Ft.)</label>
              <input
                type="number"
                value={roofArea}
                onChange={(e) => setRoofArea(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              A <strong>{capacityKw} kW system</strong> requires approximately <strong>{capacityKw * 80} sq. ft.</strong> of shade-free rooftop area.
            </span>
          </div>
        </div>

        {/* Right Column: Computed Calculation Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Financial Summary Grid */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Solar Subsidy & Cost Estimate
                </h3>
                <p className="text-xs text-slate-500">
                  Based on PM Surya Ghar guidelines in {selectedState}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed Subsidy Scheme
              </span>
            </div>

            {/* Price Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Estimated Total Cost */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-semibold text-slate-500">Estimated Total Cost</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  ₹{result.estimatedSystemCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Complete Turnkey Setup</div>
              </div>

              {/* Total Subsidy */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-xs font-semibold text-emerald-800">Total Eligible Subsidy</div>
                <div className="text-xl font-extrabold text-emerald-700 font-mono">
                  -₹{result.totalSubsidy.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  Central: ₹{result.centralSubsidy.toLocaleString()} + State: ₹{result.stateSubsidy.toLocaleString()}
                </div>
              </div>

              {/* Customer Contribution */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs font-semibold text-slate-700">Your Net Contribution</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  ₹{result.netOutofPocketCost.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Out-of-pocket cost</div>
              </div>
            </div>

            {/* Monthly & Annual Savings Highlights */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300">Return on Investment (ROI)</span>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Payback in {result.paybackPeriodYears} Years
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-[11px] text-slate-400">Monthly Bill Savings</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    ₹{result.monthlySavings.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">~{capacityKw * 125} kWh generated/mo</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">Annual Savings</div>
                  <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
                    ₹{result.annualSavings.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Per year electricity bill cut</div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-400">25-Year Net Profit</div>
                  <div className="text-2xl font-black text-blue-300 font-mono mt-0.5">
                    ₹{result.lifetime25YrSavings.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">Lifetime financial gain</div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{result.co2OffsetTonnesPerYr} Tonnes CO2/yr</div>
                  <div className="text-[10px] text-slate-500">Clean Carbon Offset</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{result.equivalentTreesPlanted} Trees Equivalent</div>
                  <div className="text-[10px] text-slate-500">Environmental Benefit</div>
                </div>
              </div>
            </div>

            {/* Apply Button Action */}
            <div className="pt-4">
              <button
                onClick={() => onApplyWithCalculation(result, calcInput)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Apply for Subsidy with this Calculation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
