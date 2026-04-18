'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/providers/ToastProvider';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Sparkles } from 'lucide-react';

interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: string;
  image: string | null;
  categoryId: number | null;
  featured: boolean | null;
}

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
}

const emptyForm = {
  nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
  price: '', image: '', categoryId: '', featured: false,
};

export default function AdminProductsPage() {
  const t = useTranslations('admin');
  const tt = useTranslations('toast');
  const ct = useTranslations('common');
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      descriptionEn: product.descriptionEn || '',
      descriptionAr: product.descriptionAr || '',
      price: product.price,
      image: product.image || '',
      categoryId: product.categoryId?.toString() || '',
      featured: product.featured || false,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingId ? tt('productUpdated') : tt('productAdded'));
        setModalOpen(false);
        fetchData();
      }
    } catch {
      showToast(tt('error'), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(tt('productDeleted'));
        fetchData();
      }
    } catch {
      showToast(tt('error'), 'error');
    }
  };

  const categoryOptions = [
    { value: '', label: t('selectCategory') },
    ...categories.map((c) => ({ value: c.id.toString(), label: c.nameEn })),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {t('manageProducts')}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          {t('addProduct')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="text-start p-4 font-medium text-neutral-500">Image</th>
                  <th className="text-start p-4 font-medium text-neutral-500">ID</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{t('productName')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('price')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{ct('featured')}</th>
                  <th className="text-end p-4 font-medium text-neutral-500">{ct('edit')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500">{product.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{product.nameEn}</p>
                        <p className="text-xs text-neutral-400">{product.nameAr}</p>
                      </div>
                    </td>
                    <td className="p-4 text-primary-600 dark:text-primary-400 font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="p-4">
                      {product.featured && <Star className="w-4 h-4 text-accent-500 fill-accent-500" />}
                    </td>
                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">
                      {ct('noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? t('editProduct') : t('addProduct')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('productName')}
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            required
          />
          <Input
            label={t('productNameAr')}
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            required
            dir="rtl"
          />
          <Textarea
            label={t('description')}
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
          />
          <Textarea
            label={t('descriptionAr')}
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            dir="rtl"
          />
          <Input
            label={ct('price')}
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <ImageUpload
            label="Product Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <Select
            label={t('selectCategory')}
            options={categoryOptions}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {ct('featured')}
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{ct('save')}</Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              {ct('cancel')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
