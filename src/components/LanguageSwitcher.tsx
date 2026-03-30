'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  function onChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      setUserLocale(nextLocale);
    });
  }

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        disabled={isPending}
        aria-label="Language"
        className="block w-auto rounded-full border-0 py-1 pl-2 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-xs font-bold bg-white shadow-sm"
      >
        <option value="en">EN</option>
        <option value="hi">HI</option>
        <option value="mr">MR</option>
      </select>
    </div>
  );
}
