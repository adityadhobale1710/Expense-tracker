import { useEffect, useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import toast from 'react-hot-toast';

// Mock Data from the Login Page project converted into React equivalents
const BADGES = [
  { id: "b1", name: "Budget Boss", icon: "👑", desc: "Kept all spending within budget for 30 consecutive days", unlocked: true },
  { id: "b2", name: "Saving Spark", icon: "🔥", desc: "Saved 30% of monthly income for the first time", unlocked: true },
  { id: "b3", name: "Eco Guardian", icon: "🍃", desc: "Low carbon footprint index under 50kg for a week", unlocked: true },
  { id: "b4", name: "Compound King", icon: "💎", desc: "Invested ₹50,000 total in mutual index funds", unlocked: false },
  { id: "b5", name: "Streak Legend", icon: "📅", desc: "Log transactions 50 days in a row", unlocked: false }
];

const FAMILY_MEMBERS = [
  { id: "f-1", name: "You (Aditya)", role: "Owner", spent: 9200, limit: 25000, avatar: "A", color: "from-indigo-500 to-blue-500" },
  { id: "f-2", name: "Sarah (Spouse)", role: "Member", spent: 7400, limit: 15000, avatar: "S", color: "from-pink-500 to-purple-500" },
  { id: "f-3", name: "Leo (Son)", role: "Member", spent: 1800, limit: 5000, avatar: "L", color: "from-amber-500 to-orange-500" }
];

const LEADERBOARD = [
  { rank: 1, name: "Kabir Mehta", rate: "42.8%", score: "92 XP" },
  { rank: 2, name: "You (Aditya)", rate: "38.2%", score: "82 XP" },
  { rank: 3, name: "Rohan Das", rate: "31.5%", score: "78 XP" },
  { rank: 4, name: "Neha Sharma", rate: "28.1%", score: "64 XP" }
];

const WEALTH_HOLDINGS = [
  { name: "Nifty 50 Index Fund", type: "Mutual Fund", amount: 120000, returns: "+14.2%", color: "text-green-400" },
  { name: "Reliance Industries", type: "Stock", amount: 45000, returns: "-2.4%", color: "text-red-400" },
  { name: "Bitcoin ETF", type: "Crypto", amount: 35000, returns: "+28.1%", color: "text-green-400" }
];

const NET_WORTH_HISTORY = [
  { name: "Jan", Wealth: 120000 },
  { name: "Feb", Wealth: 135000 },
  { name: "Mar", Wealth: 150000 },
  { name: "Apr", Wealth: 165000 },
  { name: "May", Wealth: 180000 },
  { name: "Jun", Wealth: 200000 }
];

const WIDGET_LABELS = {
  health: "Financial Health Score",
  gamified: "Achievements & XP Level",
  heatmap: "Monthly Spending Heatmap",
  aiInsights: "AI spending recommendations",
  transactions: "Recent transactions",
  bills: "Upcoming obligations",
  eco: "Eco emission tracker",
  family: "Shared family wallet",
  leaderboard: "Savings leaderboard",
  wealth: "👑 Wealth & Investment tracker"
};

export default function Dashboard() {
  const { summary, fetchSummary, expenses, fetchExpenses, incomes, fetchIncomes, categories, fetchCategories, addExpense, addIncome } = useExpense();
  const { user, updateUser } = useAuth();

  // Widget Order state
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('dashboard_widget_order');
    return saved ? JSON.parse(saved) : ['health', 'gamified', 'heatmap', 'aiInsights', 'transactions', 'bills', 'eco', 'family', 'leaderboard', 'wealth'];
  });

  // Simulator Modals state
  const [activeModal, setActiveModal] = useState(null); // 'ocr' | 'voice' | 'qr' | 'addTx'
  const [ocrLoading, setOcrLoading] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('"Your voice transcript will appear here..."');
  const [qrScanning, setQrScanning] = useState(false);
  const [qrMerchant, setQrMerchant] = useState('');

  // Add Transaction Form (from voice/ocr/qr pre-fills)
  const [txForm, setTxForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'upi',
    description: ''
  });

  // Slider compound simulator state
  const [investmentPrincipal, setInvestmentPrincipal] = useState(5000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const projectedInvestment = Math.round(investmentPrincipal * Math.pow(1 + 0.12, investmentDuration));

  // Initialize
  useEffect(() => {
    fetchSummary();
    fetchExpenses({ limit: 5 });
    fetchIncomes({ limit: 5 });
    fetchCategories();
  }, []);

  // Update categories default on form type change
  useEffect(() => {
    if (categories.length > 0 && !txForm.category) {
      const firstMatched = categories.find(c => c.type === txForm.type);
      if (firstMatched) {
        setTxForm(prev => ({ ...prev, category: firstMatched._id }));
      }
    }
  }, [txForm.type, categories]);

  // Drag and Drop implementation
  const [draggedWidget, setDraggedWidget] = useState(null);

  const handleDragStart = (id) => {
    setDraggedWidget(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (!draggedWidget || draggedWidget === targetId) return;
    const newOrder = [...widgetOrder];
    const draggedIdx = newOrder.indexOf(draggedWidget);
    const targetIdx = newOrder.indexOf(targetId);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedWidget);

    setWidgetOrder(newOrder);
    localStorage.setItem('dashboard_widget_order', JSON.stringify(newOrder));
    setDraggedWidget(null);
  };

  // Switch role simulator (Premium demo)
  const togglePremiumRole = () => {
    const nextRole = user?.role === 'premium' ? 'user' : 'premium';
    updateUser({ role: nextRole });
    toast.success(`Role switched to ${nextRole.toUpperCase()} mode!`);
  };

  // OCR Pre-fill simulation
  const simulateOCR = (brand) => {
    setOcrLoading(true);
    setTimeout(() => {
      setOcrLoading(false);
      setActiveModal(null);
      let prefill = {};
      if (brand === 'starbucks') {
        prefill = { title: 'Starbucks Coffee', amount: '450', type: 'expense', description: 'Caramel Macchiato' };
      } else if (brand === 'uber') {
        prefill = { title: 'Uber Trip', amount: '1200', type: 'expense', description: 'Airport commute' };
      } else if (brand === 'walmart') {
        prefill = { title: 'Grocery Shopping', amount: '5400', type: 'expense', description: 'Weekly groceries at Walmart' };
      }

      // Map to correct category ID if possible
      const categoryMatch = categories.find(c => c.type === 'expense' && (c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('transport') || c.name.toLowerCase().includes('shop')));

      setTxForm(prev => ({
        ...prev,
        ...prefill,
        category: categoryMatch ? categoryMatch._id : prev.category
      }));
      setActiveModal('addTx');
      toast.success('Mock receipt text extracted successfully!');
    }, 1500);
  };

  // Voice command parsing simulation
  const handleVoiceRecording = () => {
    setVoiceRecording(true);
    setVoiceTranscript('Listening for financial logs...');
    setTimeout(() => {
      setVoiceTranscript('"Spent 650 rupees on dinner at Dominos today"');
      setVoiceRecording(false);
    }, 2000);
  };

  const processVoice = () => {
    const categoryMatch = categories.find(c => c.type === 'expense' && c.name.toLowerCase().includes('food'));
    setTxForm(prev => ({
      ...prev,
      title: 'Dinner at Dominos',
      amount: '650',
      type: 'expense',
      description: 'Voice entered transaction',
      category: categoryMatch ? categoryMatch._id : prev.category
    }));
    setActiveModal(null);
    setActiveModal('addTx');
    toast.success('Voice transcription processed successfully!');
  };

  // QR Scanning pre-fill simulation
  const simulateQR = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setQrMerchant('Zara Store Merchant • ₹3,800.00');
      setTimeout(() => {
        const categoryMatch = categories.find(c => c.type === 'expense' && c.name.toLowerCase().includes('shop'));
        setTxForm(prev => ({
          ...prev,
          title: 'Zara Apparel Purchase',
          amount: '3800',
          type: 'expense',
          description: 'UPI Scanned Merchant Payment',
          category: categoryMatch ? categoryMatch._id : prev.category
        }));
        setActiveModal(null);
        setActiveModal('addTx');
        toast.success('Merchant payment metadata captured!');
      }, 1000);
    }, 1500);
  };

  // Handle Quick Transaction Submit to DB
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: txForm.title,
        amount: Number(txForm.amount),
        category: txForm.category,
        date: txForm.date,
        paymentMethod: txForm.paymentMethod,
        description: txForm.description
      };

      if (txForm.type === 'expense') {
        await addExpense(payload);
      } else {
        await addIncome(payload);
      }

      setActiveModal(null);
      fetchSummary();
      fetchExpenses({ limit: 5 });
      fetchIncomes({ limit: 5 });
      setTxForm({
        title: '',
        amount: '',
        type: 'expense',
        category: categories.find(c => c.type === 'expense')?._id || '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'upi',
        description: ''
      });
    } catch {
      toast.error('Failed to create transaction');
    }
  };

  // Combine and sort real-time transactions
  const combinedTx = [
    ...expenses.slice(0, 5).map(e => ({ ...e, type: 'expense' })),
    ...incomes.slice(0, 5).map(i => ({ ...i, type: 'income' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in relative pb-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Here is your financial gamified overview for today.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={togglePremiumRole}
            className={`btn border text-xs px-4 py-2 ${
              user?.role === 'premium'
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {user?.role === 'premium' ? '👑 Premium Mode Active' : '🔓 Try Premium Mode'}
          </button>
          <button
            onClick={() => {
              setTxForm({
                title: '',
                amount: '',
                type: 'expense',
                category: categories.find(c => c.type === 'expense')?._id || '',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'upi',
                description: ''
              });
              setActiveModal('addTx');
            }}
            className="btn-primary text-xs px-4 py-2"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card-sm flex items-center gap-4 border-l-4 border-emerald-500">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Income</p>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">₹{Number(summary?.totalIncome || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card-sm flex items-center gap-4 border-l-4 border-red-500">
          <span className="text-2xl">💸</span>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Total Expenses</p>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">₹{Number(summary?.totalExpense || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card-sm flex items-center gap-4 border-l-4 border-indigo-500">
          <span className="text-2xl">🏦</span>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Net Balance</p>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">₹{Number(summary?.balance || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card-sm flex items-center gap-4 border-l-4 border-amber-500">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Savings Rate</p>
            <p className="text-lg font-extrabold text-slate-100 mt-0.5">{summary?.savingsRate || 0}%</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 mb-2">
        <span>🧩</span>
        <span>Tip: Drag widgets by headers to custom arrange your control dashboard panel</span>
      </div>

      {/* Rearrangeable Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {widgetOrder.map((widgetId) => {
          // Render widget logic
          if (widgetId === 'health') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">🏥 Financial Health</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="flex flex-col items-center py-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * 82) / 100} />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-slate-100">82</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Excellent</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-center leading-normal">
                  Your budget variances are well optimized. Try increasing auto-savings to boost your index to 90.
                </p>
              </div>
            );
          }

          if (widgetId === 'gamified') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">🔥 Achievements & Levels</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-400">Lvl 4 Saver</span>
                    <span className="text-xs font-semibold text-slate-400">3,450 / 4,000 XP</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-primary-500 h-full rounded-full" style={{ width: '86.25%' }}></div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span>⚡ Streak:</span>
                    <span className="font-extrabold text-orange-400">18 consecutive days logged!</span>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    {BADGES.map(badge => (
                      <span
                        key={badge.id}
                        title={`${badge.name}: ${badge.desc}`}
                        className={`text-xl p-1.5 rounded-xl border ${badge.unlocked ? 'bg-primary-600/10 border-primary-500/20' : 'bg-slate-900/40 border-slate-800 opacity-20'}`}
                      >
                        {badge.icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          if (widgetId === 'heatmap') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">📅 Spending Density</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-4">
                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      let shade = 'bg-slate-800/40';
                      if ([2, 5, 8, 12, 18, 22].includes(day)) shade = 'bg-red-500/70';
                      else if ([3, 6, 14, 25, 29].includes(day)) shade = 'bg-primary-500/50';
                      else if ([1, 10, 15, 20].includes(day)) shade = 'bg-emerald-500/60';

                      return (
                        <div
                          key={day}
                          title={`Day ${day}`}
                          className={`w-full aspect-square rounded-md text-[8px] font-bold flex items-center justify-center text-slate-400 ${shade}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          if (widgetId === 'aiInsights') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">🤖 AI Spending Advisor</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-4 space-y-3">
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Overlapping streaming subscriptions</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        Canceling Netflix could save you ₹22,900/year. Acting on this boosts your Health score.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Dining expenses climbing</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        Eating out is up 14% vs last month. Set a dining budget to control leaking savings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (widgetId === 'transactions') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move md:col-span-2 xl:col-span-3"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50 mb-4">
                  <h3 className="text-sm font-bold text-slate-200">📝 Recent Transactions</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                {combinedTx.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No recent transactions recorded.</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Method</th>
                          <th>Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {combinedTx.map((tx) => (
                          <tr key={tx._id}>
                            <td className="font-semibold text-xs">{tx.title}</td>
                            <td className="text-xs">{tx.category?.icon} {tx.category?.name || 'Unassigned'}</td>
                            <td className="text-xs font-mono">{tx.paymentMethod?.toUpperCase()}</td>
                            <td className="text-[11px] text-slate-400">{new Date(tx.date).toLocaleDateString('en-IN')}</td>
                            <td className={`text-xs font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          }

          if (widgetId === 'bills') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">⏳ Upcoming Obligations</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-4 space-y-2.5">
                  <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span>🏠</span>
                      <div>
                        <p className="font-bold text-slate-300">Apartment Rent</p>
                        <p className="text-[10px] text-slate-500">Due: Jul 1</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-200">₹1,800.00</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span>🎬</span>
                      <div>
                        <p className="font-bold text-slate-300">Netflix Premium</p>
                        <p className="text-[10px] text-slate-500">Due: Jul 5</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-200">₹22.99</span>
                  </div>
                </div>
              </div>
            );
          }

          if (widgetId === 'eco') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">🍃 Eco emission tracker</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Monthly CO2 Impact:</span>
                    <span className="font-bold text-slate-200">248.5 kg CO2</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '49.7%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Rank: Top 15% Offset</span>
                    <span className="font-bold text-emerald-400">Carbon Score: A</span>
                  </div>
                </div>
              </div>
            );
          }

          if (widgetId === 'family') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">👥 Shared Family Wallet</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-3 space-y-2">
                  {FAMILY_MEMBERS.map(member => (
                    <div key={member.id} className="flex items-center gap-3 text-xs">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold`}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-300 truncate">{member.name}</span>
                          <span className="text-slate-400">₹{member.spent.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-primary-500 h-full" style={{ width: `${(member.spent / member.limit) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (widgetId === 'leaderboard') {
            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-indigo-500/20 transition-all cursor-move"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-bold text-slate-200">🏆 Savings Leaderboard</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="py-3 space-y-2.5">
                  {LEADERBOARD.map(p => (
                    <div key={p.rank} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          p.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : p.rank === 2 ? 'bg-slate-400/20 text-slate-300' : 'bg-amber-700/20 text-amber-500'
                        }`}>
                          {p.rank}
                        </span>
                        <span className="text-slate-300">{p.name}</span>
                      </div>
                      <div className="flex gap-3 font-semibold">
                        <span className="text-slate-400">{p.rate}</span>
                        <span className="text-primary-400">{p.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (widgetId === 'wealth') {
            if (user?.role !== 'premium' && user?.role !== 'admin') {
              return (
                <div
                  key={widgetId}
                  draggable
                  onDragStart={() => handleDragStart(widgetId)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widgetId)}
                  className="card flex flex-col justify-between border-dashed border-2 border-slate-700/50 opacity-60 text-center py-8 hover:opacity-100 transition-all cursor-move"
                >
                  <span className="text-3xl mb-2">🔒</span>
                  <h3 className="text-sm font-bold text-slate-200">Premium Wealth Tracker</h3>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-2 leading-normal">
                    Unlock portfolio dashboards, stock trends, and net worth simulators.
                  </p>
                  <button onClick={togglePremiumRole} className="btn-primary text-[10px] py-1.5 px-3 mx-auto mt-4">
                    Activate Premium
                  </button>
                </div>
              );
            }

            return (
              <div
                key={widgetId}
                draggable
                onDragStart={() => handleDragStart(widgetId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(widgetId)}
                className="card flex flex-col justify-between hover:border-amber-500/30 transition-all cursor-move md:col-span-2 xl:col-span-3"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/50 mb-4">
                  <h3 className="text-sm font-bold text-amber-400">👑 Premium Wealth & Investments</h3>
                  <span className="text-xs text-slate-500">≡ Drag</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Asset list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Active Holdings</h4>
                    {WEALTH_HOLDINGS.map((h, i) => (
                      <div key={i} className="p-3 bg-dark-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-200">{h.name}</p>
                          <p className="text-[9px] text-slate-500">{h.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-200">₹{h.amount.toLocaleString('en-IN')}</p>
                          <p className={`text-[10px] font-bold ${h.color}`}>{h.returns}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle Column: Compound interest sliders */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Projected Growth Calculator (12% CAGR)</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 text-[10px]">
                          <span>Monthly deposit:</span>
                          <span className="font-bold text-primary-400">₹{investmentPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="50000"
                          step="1000"
                          value={investmentPrincipal}
                          onChange={(e) => setInvestmentPrincipal(Number(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-[10px]">
                          <span>Duration (years):</span>
                          <span className="font-bold text-primary-400">{investmentDuration} Years</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={investmentDuration}
                          onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                      </div>
                      <div className="p-3 bg-primary-600/10 border border-primary-500/20 rounded-xl text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Estimated Future Value</span>
                        <span className="text-lg font-extrabold text-slate-100 block mt-1">₹{projectedInvestment.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Recharts Chart */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Net Worth Progression</h4>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={NET_WORTH_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', fontSize: 11 }} />
                          <Area type="monotone" dataKey="Wealth" stroke="#f59e0b" fillOpacity={1} fill="url(#colorWealth)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Floating Utilities (Mic, QR Code) */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-40">
        <button
          onClick={() => setActiveModal('voice')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Voice entry"
        >
          🎙️
        </button>
        <button
          onClick={() => setActiveModal('qr')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Scan QR Merchant"
        >
          📱
        </button>
      </div>

      {/* OCR Receipt Scanner Floater */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setActiveModal('ocr')}
          className="btn-primary flex items-center gap-2 h-12 px-5 rounded-full shadow-lg"
        >
          📷 Scan Receipt
        </button>
      </div>

      {/* ─── OCR MODAL ─── */}
      {activeModal === 'ocr' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">📷 Receipt OCR Scanner</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Select one of the mock receipt objects below to simulate automatic transaction scanning and parsing.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => simulateOCR('starbucks')} className="p-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between">
                <span>☕ Starbucks Coffee receipt</span>
                <span className="text-slate-400">₹450.00</span>
              </button>
              <button onClick={() => simulateOCR('uber')} className="p-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between">
                <span>🚗 Uber Ride invoice</span>
                <span className="text-slate-400">₹1,200.00</span>
              </button>
              <button onClick={() => simulateOCR('walmart')} className="p-3 bg-slate-800 hover:bg-slate-700 text-left text-xs font-semibold rounded-xl flex items-center justify-between">
                <span>🛍️ Walmart grocery bill</span>
                <span className="text-slate-400">₹5,400.00</span>
              </button>
            </div>
            {ocrLoading && (
              <div className="flex flex-col items-center justify-center py-4 space-y-2 border-t border-slate-800">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium text-slate-300">AI parsing receipt structures...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── VOICE ENTRY MODAL ─── */}
      {activeModal === 'voice' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3 text-left">
              <h3 className="font-bold text-slate-100">🎙️ Voice transaction logger</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Click the mic button and say: "Spent 650 rupees on dinner at Dominos today."
            </p>
            <div className="flex justify-center py-6">
              <button
                onClick={handleVoiceRecording}
                className={`h-20 w-20 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all ${
                  voiceRecording ? 'bg-red-600 animate-pulse scale-105 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                🎙️
              </button>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono italic text-slate-300 break-words">
              {voiceTranscript}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
              <button
                onClick={processVoice}
                disabled={voiceTranscript.startsWith('"Your')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Confirm log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── QR SCANNER MODAL ─── */}
      {activeModal === 'qr' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3 text-left">
              <h3 className="font-bold text-slate-100">📱 UPI QR Payment Scanner</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <p className="text-xs text-slate-400">Simulates capturing merchant code detail structures.</p>
            <div className="relative w-48 h-48 mx-auto border-4 border-primary-500 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <div className="absolute top-0 w-full h-1 bg-primary-500 shadow-md shadow-primary-500/50 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-8xl opacity-15 text-white">🔳</span>
              {qrScanning && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center space-y-2">
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-slate-300">Scanning metadata...</span>
                </div>
              )}
              {qrMerchant && (
                <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white p-3">
                  <span className="text-3xl">✅</span>
                  <p className="text-xs font-bold mt-2">QR Scanned</p>
                  <p className="text-[9px] opacity-90 mt-1 break-all">{qrMerchant}</p>
                </div>
              )}
            </div>
            <button onClick={simulateQR} disabled={qrScanning || qrMerchant} className="btn-primary text-xs w-full py-2.5">
              Simulate QR Scan
            </button>
          </div>
        </div>
      )}

      {/* ─── ADD TRANSACTION MODAL ─── */}
      {activeModal === 'addTx' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="glass max-w-md w-full p-6 my-8 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
              <h3 className="font-bold text-slate-100">Add Scanned Transaction</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleSaveTransaction} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input py-2"
                    value={txForm.amount}
                    onChange={(e) => setForm(prev => setTxForm({ ...txForm, amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Type</label>
                  <select
                    className="select py-2"
                    value={txForm.type}
                    onChange={(e) => setTxForm({ ...txForm, type: e.target.value, category: '' })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Category</label>
                  <select
                    className="select py-2"
                    value={txForm.category}
                    onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                    required
                  >
                    {categories
                      .filter(c => c.type === txForm.type)
                      .map(c => (
                        <option key={c._id} value={c._id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Title</label>
                  <input
                    type="text"
                    className="input py-2"
                    value={txForm.title}
                    onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">Payment Method</label>
                  <select
                    className="select py-2"
                    value={txForm.paymentMethod}
                    onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value })}
                  >
                    <option value="upi">UPI/GPay</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Date</label>
                  <input
                    type="date"
                    className="input py-2"
                    value={txForm.date}
                    onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Notes / Description</label>
                <input
                  type="text"
                  className="input py-2"
                  value={txForm.description}
                  onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700/50">
                <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-4">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
