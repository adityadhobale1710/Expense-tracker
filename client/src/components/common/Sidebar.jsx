import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard',   icon: '📊', label: 'Dashboard' },
  { to: '/income',      icon: '💰', label: 'Income' },
  { to: '/expenses',    icon: '💸', label: 'Expenses' },
  { to: '/budget',      icon: '🎯', label: 'Budget' },
  { to: '/reports',     icon: '📈', label: 'Reports' },
  { to: '/calendar',    icon: '📅', label: 'Bill Calendar' },
  { to: '/ai-insights',  icon: '🤖', label: 'AI Insights' },
  { to: '/profile',     icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <aside className="w-60 bg-dark-800 border-r border-slate-700/50 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg glow-primary">
            ₹
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight">ExpenseTrack</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pro Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">Main Menu</p>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info at footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600/20 border border-primary-500/30 rounded-xl flex items-center justify-center text-primary-400 font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Guest User'}</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
              {user?.role === 'premium' ? '👑 Premium User' : user?.role === 'admin' ? '🛡️ Admin User' : 'Standard Tier'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
