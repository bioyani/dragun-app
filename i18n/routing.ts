import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr-CA', 'fr-US'],
  defaultLocale: 'en',
  localeDetection: true,
});
