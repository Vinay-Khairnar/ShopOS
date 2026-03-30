import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/services/locale';
import { locales, defaultLocale, Locale } from '@/i18n/config';

export default getRequestConfig(async () => {
  // Extract and validate the specific locale from the cookie (or fallback to default)
  let locale = await getUserLocale() as Locale;
  if (!locales.includes(locale)) {
    console.warn(`Invalid locale detected: ${locale}. Falling back to default.`);
    locale = defaultLocale;
  }

  // Explicit mapping prevents path traversal vulnerabilities entirely
  let messages;
  switch (locale) {
    case 'hi':
      messages = (await import('../../messages/hi.json')).default;
      break;
    case 'mr':
      messages = (await import('../../messages/mr.json')).default;
      break;
    case 'en':
    default:
      messages = (await import('../../messages/en.json')).default;
      break;
  }

  return {
    locale,
    messages
  };
});
