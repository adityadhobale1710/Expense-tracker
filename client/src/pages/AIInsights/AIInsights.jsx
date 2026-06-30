import { useState } from 'react';
import toast from 'react-hot-toast';

const MOCK_INSIGHTS = {
  audit: [
    { id: "ai-1", title: "Duplicate streaming items detected", desc: "You are maintaining active memberships on Netflix Premium and Amazon Prime. Canceling Netflix could save you ₹22,900 annually.", savings: "₹22,900/year", actionLabel: "Cancel Subscription" },
    { id: "ai-2", title: "Gym Membership underutilized", desc: "No gym check-ins detected in the last 30 days. Consider pausing or switching to a pay-as-you-go tier.", savings: "₹5,400/month", actionLabel: "Review Contract" }
  ],
  waste: [
    { id: "ai-3", title: "High surge Uber trips", desc: "You took 4 rides during peak times this week. Pre-booking or waiting 10 mins could have saved you around ₹1,500.", savings: "₹1,500/week", actionLabel: "Show Ride History" },
    { id: "ai-4", title: "Unoptimized electricity consumption", desc: "Your baseline home usage remains high overnight. Smart outlet scheduling is recommended.", savings: "₹800/month", actionLabel: "Eco Integration" }
  ],
  goals: [
    { id: "ai-5", title: "Boost Emergency Savings rate", desc: "Transferring an extra ₹2,000 this month will shave 3 months off your milestone target timeline.", savings: "Accelerates target", actionLabel: "Increase Target" },
    { id: "ai-6", title: "Compound interest forecast", desc: "Increasing recurring index fund deposits by 10% leverages compounding to yield an extra ₹140,000 over 10 years.", savings: "₹140,000 growth", actionLabel: "Open Calculator" }
  ]
};

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('audit');

  const handleAction = (item) => {
    toast.success(`Simulation: Action '${item.actionLabel}' triggered for '${item.title}'`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤖 AI Spending Advisor</h1>
          <p className="page-subtitle">Smart savings recommendations, subscription audits, and financial waste analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full text-left p-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'audit'
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-md'
                : 'bg-dark-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            🛡️ Subscription Audit
          </button>
          <button
            onClick={() => setActiveTab('waste')}
            className={`w-full text-left p-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'waste'
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-md'
                : 'bg-dark-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            💸 Waste Detection
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full text-left p-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'goals'
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-md'
                : 'bg-dark-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            🎯 Goal Optimization
          </button>
        </div>

        {/* Content Card */}
        <div className="xl:col-span-3 card">
          <div className="mb-6 pb-4 border-b border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
              {activeTab === 'audit' && 'Subscription Audit Logs'}
              {activeTab === 'waste' && 'Financial Leak Analysis'}
              {activeTab === 'goals' && 'XP & Goal Accelerators'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'audit' && 'Identifies double-billing, overlapping memberships, and silent subscription contracts.'}
              {activeTab === 'waste' && 'Audits spending spikes, premium rates, and inefficient household utilities.'}
              {activeTab === 'goals' && 'Calculates optimization ratios to unlock badges, boost XP, and save faster.'}
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_INSIGHTS[activeTab].map((item) => (
              <div key={item.id} className="p-5 bg-dark-900/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-primary-500 animate-pulse" />
                    <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <span className="text-xs font-bold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
                    Est. Saving: {item.savings}
                  </span>
                  <button
                    onClick={() => handleAction(item)}
                    className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    {item.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-primary-600/5 border border-primary-500/10 rounded-2xl flex items-center gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h5 className="text-xs font-semibold text-primary-400">Did you know?</h5>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                Standard users save an average of 12.4% more monthly after acting on AI Auditing alerts. Set up custom preferences in Settings to automate this auditing sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
