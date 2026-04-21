'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/providers/ToastProvider';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Eye, X, User, Mail, Phone, ShoppingBag, Search } from 'lucide-react';

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: {
    nameEn: string;
    nameAr: string;
    image: string | null;
  } | null;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const ct = useTranslations('common');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('order')} #{order.id}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wide">
                {ct('customer')}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span className="text-neutral-900 dark:text-white">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span className="text-neutral-600 dark:text-neutral-400">{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-neutral-600 dark:text-neutral-400">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wide">
                {ct('status')}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wide">
                Items ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 dark:from-neutral-700 dark:to-neutral-700 flex-shrink-0 overflow-hidden">
                      {item.product?.image ? (
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-primary-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {item.product?.nameEn ?? 'Product deleted'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 flex-shrink-0">
                      {formatPrice(parseFloat(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-center">
              <span className="font-semibold text-neutral-900 dark:text-white">{ct('total')}</span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminOrdersPage() {
  const t = useTranslations('admin');
  const tt = useTranslations('toast');
  const ct = useTranslations('common');
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchId, setSearchId] = useState('');

  const filteredOrders = searchId.trim()
    ? orders.filter((o) => String(o.id).includes(searchId.trim().replace(/^#/, '')))
    : orders;

  const fetchData = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        showToast(tt('orderUpdated'));
        fetchData();
      }
    } catch {
      showToast(tt('error'), 'error');
    }
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {t('manageOrders')}
        </h1>
        <div className="relative w-full sm:w-56">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchOrders')}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full ps-9 pe-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500">{ct('noResults')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('id')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('customer')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('email')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('total')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{t('orderStatus')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('date')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('details')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="p-4 text-neutral-500">#{order.id}</td>
                    <td className="p-4 font-medium text-neutral-900 dark:text-white">
                      {order.customerName}
                    </td>
                    <td className="p-4 text-neutral-500">{order.customerEmail}</td>
                    <td className="p-4 font-medium text-primary-600 dark:text-primary-400">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {t(s as any)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-neutral-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}


