import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Interested() {
    const t = useTranslations('distribution');
    return (
        <div className='flex w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto' >
            <div className="flex bg-no-repeat bg-center w-full  rounded-3xl justify-between bg-gradient-to-r from-indigo-500/90 20% to-green-500/90  items-center flex-col lg:flex-row gap-y-8 shadow-md relative">
                <div className='flex w-full mx-auto justify-center'>
                    <div className='flex p-6 py-8 bg-no-repeat bg-center w-full justify-between bg-cover items-center flex-col lg:flex-row gap-y-8 z-20'>
                        <div className="flex flex-col gap-y-2">
                            <span className="text-3xl font-semibold text-slate-50">{t('interested')}</span>
                            <span className="text-base text-slate-50">{t('interested_detail')}</span>
                        </div>
                        <div className="items-right">
                            <Link href="/auth/signin/" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{t('sign_in')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}