import "@/app/globals.css";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { Roboto } from 'next/font/google';
import AuthBar from "@/components/auth/AuthBar/page";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
const inter = Roboto({ weight: '700', subsets: ['latin'] });

export default async function DataFetch({ children }: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  if (session && session.user != null && typeof session.user.email === 'string') {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });
    if (user) {
      if (user.email_auth === true) {
        redirect('/dashboard/catalog');
      } else {
        return <RootLayout>{children}</RootLayout>;
      }
    } else {
      redirect('/auth/signin');
    }
  } else {
    redirect('/auth/signin');
  }
}

function RootLayout({ children }: {
  children: React.ReactNode
}) {
  // Validate that the incoming `locale` parameter is valid
  const locale = useLocale();
  const messages = useMessages();


  return (
    <html lang={locale} className={inter.className}>
      <body className="h-full">
        <div className='_next'>
          <NextIntlClientProvider locale={locale} messages={messages}>

            <div className="flex h-full w-full">
              <div className="flex z-20 w-full items-center justify-center p-4">
                {children}
              </div>
              <div className="absolute w-full">
                <AuthBar />
              </div>
            </div>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
