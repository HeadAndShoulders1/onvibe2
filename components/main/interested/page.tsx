import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Interested() {
    const t = useTranslations('distribution');
    return (
        <div className='flex w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto' >
            <div className="flex bg-no-repeat bg-center w-full  rounded-3xl justify-between bg-gradient-to-r from-indigo-500/80 20% to-green-500/80  items-center flex-col lg:flex-row gap-y-8 shadow-md relative">
                <div className='flex w-full mx-auto justify-center'>
                    <div className='flex p-6 bg-no-repeat bg-center w-full justify-between bg-cover items-center flex-col lg:flex-row gap-y-8 z-20'>
                        <div className="grid gap-y-2 py-10">
                            <div>
                                <h3 className="text-2xl font-semibold leading-6 text-slate-200">{t('interested')}</h3>
                            </div>
                            <div>
                                <h3 className="text-1xl leading-6 text-gray-200">{t('interested_detail')}</h3>
                            </div>
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