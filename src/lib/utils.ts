import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(num);
}

export function getLocalizedField(
  item: { nameEn: string; nameAr: string; descriptionEn?: string | null; descriptionAr?: string | null },
  field: 'name' | 'description',
  locale: string
): string {
  if (field === 'name') {
    return locale === 'ar' ? item.nameAr : item.nameEn;
  }
  if (field === 'description') {
    return locale === 'ar' ? (item.descriptionAr || '') : (item.descriptionEn || '');
  }
  return '';
}
