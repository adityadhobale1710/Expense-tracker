import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      if (rememberMe) {
        localStorage.setItem('remembered_email', form.email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const simulateSocialLogin = (provider) => {
    toast.success(`Simulating Single-Sign-On with ${provider}...`);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Create a dummy user
      const dummyUser = {
        name: 'Aditya Dhobale',
        email: `aditya@${provider.toLowerCase()}.com`,
        currency: 'INR',
        role: 'user',
        phone: '+91 9876543210',
        company: 'SSO Account',
        twoFactorEnabled: false
      };
      localStorage.setItem('accessToken', 'mock-sso-token');
      localStorage.setItem('user', JSON.stringify(dummyUser));
      // Reload page state or update auth
      window.location.href = '/dashboard';
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-92 h-92 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-92 h-92 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/30 mb-4 glow-primary">
            <span className="text-white text-3xl font-bold">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient">ExpenseTrack Pro</h1>
          <p className="text-slate-400 mt-1">Professional Personal Finance Dashboard</p>
        </div>

        {/* Card */}
        <div className="glass p-8 relative overflow-hidden">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? '👁️' : '🕶️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-dark-900 text-primary-500 focus:ring-primary-500"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => toast.success('Password reset email sent to the address provided!')}
                className="text-primary-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary w-full mt-2 py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700/50"></div></div>
            <span className="relative bg-dark-800/80 px-3 text-xs text-slate-500 font-medium">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => simulateSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all"
            >
              🌐 Google
            </button>
            <button
              type="button"
              onClick={() => simulateSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all"
            >
              🐙 GitHub
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
