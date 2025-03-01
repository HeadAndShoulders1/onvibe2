import '@/app/globals.css'
import { Poppins } from 'next/font/google'
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import Sidebar from "@/components/Navbar/Sidebar";
import NavbarDashboard from '@/components/Navbar/Navbar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import YandexMetrikaContainer from '@/context/YandexMetrika';
const inter = Poppins({ weight: '700', subsets: ['latin'], })




export default async function DataFetch({ children }: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (session && session.user != null && typeof session.user.email === 'string') {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    if (user) {
      if (user.email_auth == true) {
        return <DashboardLayout>{children}</DashboardLayout>
      } else {
        redirect('/auth/signin/auth_email')
      }
    } else {
      redirect('/auth/signin')
    }
  } else {
    redirect('/auth/signin')
  }
}

export const metadata: Metadata = {
  title: 'ONVIBE.FUN',
}

export function DashboardLayout({ children }: {
  children: any
}) {
  // Validate that the incoming `locale` parameter is valid 
  const locale = useLocale();
  const messages = useMessages();


  return (
    <html lang={locale} className={inter.className}>
      <body className="h-full">
        <div className='_next'>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className='relative flex h-screen max-h-screen flex-col lg:overflow-y-hidden'>
              <NavbarDashboard />
              <div className='flex relative dark:bg-[#141518] bg-white h-full pt-16 lg:pt-0'>
                <Sidebar />
                <div className='h-full w-full overflow-y-scroll px-4 py-8 pb-[200px] lg:px-8 2xl:px-16'>
                  <div className='w-full 2xl:w-11/12'>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </NextIntlClientProvider>
        </div>
      </body>
      <YandexMetrikaContainer />

    </html>
  );
}