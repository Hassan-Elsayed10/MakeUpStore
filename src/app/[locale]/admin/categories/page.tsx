'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/providers/ToastProvider';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';

interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string | null;
}

const emptyForm = { nameEn: '', nameAr: '', slug: '', image: '' };

export default function AdminCategoriesPage() {
  const t = useTranslations('admin');
  const tt = useTranslations('toast');
  const ct = useTranslations('common');
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      slug: category.slug,
      image: category.image || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingId ? tt('categoryUpdated') : tt('categoryAdded'));
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
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(tt('categoryDeleted'));
        fetchData();
      }
    } catch {
      showToast(tt('error'), 'error');
    }
  };

  const handleNameChange = (nameEn: string) => {
    setForm({
      ...form,
      nameEn,
      slug: editingId ? form.slug : nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {t('manageCategories')}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          {t('addCategory')}
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
                  <th className="text-start p-4 font-medium text-neutral-500">{t('categoryName')}</th>
                  <th className="text-start p-4 font-medium text-neutral-500">{t('slug')}</th>
                  <th className="text-end p-4 font-medium text-neutral-500">{ct('edit')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  >
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                        {category.image ? (
                          <img src={category.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Palette className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500">{category.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{category.nameEn}</p>
                        <p className="text-xs text-neutral-400">{category.nameAr}</p>
                      </div>
                    </td>
                    <td className="p-4 text-neutral-500 font-mono text-xs">{category.slug}</td>
                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-neutral-500">
                      {ct('noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? t('editCategory') : t('addCategory')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('categoryName')}
            value={form.nameEn}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label={t('categoryNameAr')}
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            required
            dir="rtl"
          />
          <Input
            label={t('slug')}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            placeholder="e.g., lips"
          />
          <ImageUpload
            label="Category Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
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
