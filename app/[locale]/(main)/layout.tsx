import '@/app/globals.css'
import Header from '@/components/main/header/Header'
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { useLocale } from 'next-intl';
import Footers from '@/components/main/Footers/Footers';
import YandexMetrikaContainer from '@/context/YandexMetrika';
import { Rubik } from 'next/font/google'

const inter = Rubik({ weight: '700', subsets: ['latin'], })


export default function LocaleLayout({ children }: {
  children: React.ReactNode
}) {
  // Validate that the incoming `locale` parameter is valid
  const locale = useLocale();
  const messages = useMessages();


  return (
    <html lang={locale}  className={inter.className}>
      <body className="h-full">
        <div className='_next '>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} />
            </div>
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
              <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} />
            </div>
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
