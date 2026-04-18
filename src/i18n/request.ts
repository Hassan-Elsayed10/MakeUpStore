import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const messageImports = {
  en: () => import('./messages/en.json'),
  ar: () => import('./messages/ar.json'),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const importFn = messageImports[locale as keyof typeof messageImports];
  const messages = (await importFn()).default;

  return {
    locale,
    messages,
  };
});
