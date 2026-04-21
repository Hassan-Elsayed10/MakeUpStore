'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart,
  LogOut, Sparkles, Lock, Menu, X, Shield, MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const t = useTranslations('admin');
  const ct = useTranslations('common');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        setError(t('loginError'));
      }
    } catch {
      setError(t('loginError'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Glamour</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('login')}</h1>
            <p className="text-white/70 text-sm mt-1">{t('adminPanel')}</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 ps-10 pe-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {ct('loading')}
                  </span>
                ) : (
                  t('loginButton')
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-neutral-400 mt-6">
              Default password:{' '}
              <span className="font-mono font-semibold text-neutral-600 dark:text-neutral-300">
                admin123
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('admin');
  const ct = useTranslations('common');
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verify session via server-side API — httpOnly cookies cannot be read by document.cookie
  useEffect(() => {
    fetch('/api/auth/verify')
      .then((res) => {
        setAuthenticated(res.ok);
        setChecking(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setChecking(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500">{t('checkingAccess')}</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  const navItems = [
    { href: '/admin' as const, label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/products' as const, label: t('products'), icon: Package },
    { href: '/admin/categories' as const, label: t('categories'), icon: FolderTree },
    { href: '/admin/orders' as const, label: t('orders'), icon: ShoppingCart },
    { href: '/admin/reviews' as const, label: ct('reviews'), icon: MessageSquare },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed bottom-6 start-6 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-neutral-900 border-e border-neutral-200 dark:border-neutral-800 flex-shrink-0 z-40 transition-transform duration-300 ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0'
          }`}
        >
          <div className="p-4 flex flex-col h-full overflow-y-auto">
            {/* Brand */}
            <div className="flex items-center gap-3 px-3 py-2 mb-6">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Glamour Admin</p>
                <p className="text-xs text-neutral-500">{t('adminPanel')}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname === item.href + '/';
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && (
                      <span className="ms-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {t('logout')}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
