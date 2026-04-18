'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/providers/CartProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = '201281834012';

export default function CartPage() {
  const t = useTranslations('cart');
  const ct = useTranslations('common');
  const cht = useTranslations('checkout');
  const locale = useLocale();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);

    let orderNumber = '';
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
          total: totalPrice,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        orderNumber = `#${data.order.id}`;
      }
    } catch {}

    const itemLines = items
      .map((i) => `• ${locale === 'ar' ? i.nameAr : i.nameEn} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`)
      .join('\n');

    const message = [
      '🛍️ *طلب جديد / New Order*',
      orderNumber ? `📋 *رقم الطلب / Order No:* ${orderNumber}` : '',
      '',
      `👤 *الاسم / Name:* ${form.name}`,
      `📧 *البريد / Email:* ${form.email}`,
      form.phone ? `📞 *الهاتف / Phone:* ${form.phone}` : '',
      '',
      '*المنتجات / Items:*',
      itemLines,
      '',
      `💰 *الإجمالي / Total:* ${formatPrice(totalPrice)}`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    clearCart();
    setShowCheckout(false);
    setSubmitting(false);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold font-display text-neutral-900 dark:text-white mb-8"
        >
          {t('title')}
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {t('empty')}
            </h2>
            <p className="text-neutral-500 mb-6">{t('emptyMessage')}</p>
            <Link href="/products">
              <Button>{ct('continueShopping')}</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                >
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-800 dark:to-neutral-800 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-primary-200" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                      {locale === 'ar' ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  {t('orderSummary')}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">{ct('subtotal')}</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between">
                    <span className="font-semibold">{ct('total')}</span>
                    <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {showCheckout ? (
                    <form onSubmit={handlePlaceOrder} className="space-y-4">
                      <h3 className="text-sm font-semibold">{cht('customerInfo')}</h3>
                      <Input
                        placeholder={cht('name')}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                      <Input
                        type="email"
                        placeholder={cht('email')}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                      <Input
                        type="tel"
                        placeholder={cht('phone')}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {t('placeOrder')}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowCheckout(false)}
                      >
                        {ct('cancel')}
                      </Button>
                    </form>
                  ) : (
                    <Button className="w-full" onClick={() => setShowCheckout(true)}>
                      {ct('checkout')}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </Button>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
