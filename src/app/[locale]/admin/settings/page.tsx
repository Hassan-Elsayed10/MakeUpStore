'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/providers/ToastProvider';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, ToggleLeft, ToggleRight } from 'lucide-react';

interface Setting {
  key: string;
  enabled: boolean;
}

export default function AdminSettingsPage() {
  const t = useTranslations('admin');
  const tt = useTranslations('toast');
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const getSetting = (key: string): boolean => {
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.enabled : true;
  };

  const toggleSetting = async (key: string) => {
    const current = getSetting(key);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, enabled: !current }),
      });

      if (res.ok) {
        showToast(tt('settingsUpdated'));

        setSettings((prev) => {
          const existing = prev.find((s) => s.key === key);
          if (existing) {
            return prev.map((s) => (s.key === key ? { ...s, enabled: !current } : s));
          }
          return [...prev, { key, enabled: !current }];
        });
      }
    } catch {
      showToast(tt('error'), 'error');
    }
  };

  const featureToggles = [
    {
      key: 'cart_enabled',
      label: t('cartEnabled'),
      description: 'Enable or disable the shopping cart system for customers.',
      icon: ShoppingCart,
    },
    {
      key: 'orders_enabled',
      label: t('ordersEnabled'),
      description: 'Enable or disable the order placement system.',
      icon: Package,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        {t('featureToggles')}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {featureToggles.map((toggle, index) => {
            const enabled = getSetting(toggle.key);

            return (
              <motion.div
                key={toggle.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${enabled ? 'bg-green-50 dark:bg-green-900/30 text-green-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}>
                    <toggle.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {toggle.label}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {toggle.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleSetting(toggle.key)}
                  className={`transition-colors ${enabled ? 'text-green-500' : 'text-neutral-400'}`}
                >
                  {enabled ? (
                    <ToggleRight className="w-10 h-10" />
                  ) : (
                    <ToggleLeft className="w-10 h-10" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
