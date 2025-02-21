import { useTranslations } from 'next-intl';
import Form from './form';
import Headers from './header';
import FooterSign from '@/components/auth/Footer/page';
export default function Signup() {
  const t = useTranslations("auth");
  const md = useTranslations("metadata");
  return (
    <div className='flex bg-white dark:bg-zinc-900 rounded-2xl border border-slate-300 dark:border-zinc-800 w-full lg:max-w-lg'>
      <head>
        <title>{md('signin')}</title>
        <meta name="description" content={md('signin_desc')} />
      </head>
      <div className="grid h-full gap-y-20 w-full">
        <div>
          <Headers />
        </div>
        <div className="flex h-full flex-col items-center justify-center px-4 w-full">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-zinc-800 dark:text-slate-200">
              {t('sign_in')}
            </h2>
          </div>

          <div className="sm:mx-auto w-full sm:max-w-lg">
            <Form />
          </div>
        </div>
        <FooterSign />
      </div>
    </div>
  )

}