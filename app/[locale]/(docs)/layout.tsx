import '@/app/globals.css'
import { Rubik } from 'next/font/google'
import Header from '@/components/main/header/Header'
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { useLocale } from 'next-intl';
import Footers from '@/components/main/Footers/Footers';
import type { Metadata } from 'next'
import YandexMetrikaContainer from '@/context/YandexMetrika';

const inter = Rubik({ weight: '700', subsets: ['latin'], })

export const metadata: Metadata = {
  title: 'ONVIBE.FUN',
}

export default function LocaleLayout({ children }: {
  children: React.ReactNode
}) {
  // Validate that the incoming `locale` parameter is valid
  const locale = useLocale();
  const messages = useMessages();


  return (
    <html lang={locale} className={inter.className}>
      <body className="h-full">
        <div className='_next '>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <div className='p-2 lg:p-0'>
              {children}
            </div>
            <Footers />
          </NextIntlClientProvider>
        </div>
      </body>
      <YandexMetrikaContainer />

    </html>
  );
}
