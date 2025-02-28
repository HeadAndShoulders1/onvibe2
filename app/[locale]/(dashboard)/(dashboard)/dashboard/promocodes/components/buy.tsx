import { useTranslations } from "next-intl"
import Image from "next/image"

export default function PromocodesInfo() {
    const t = useTranslations('promocodes')
    return (
        <div className="dark:bg-indigo-500 bg-indigo-500 rounded-2xl p-4 lg:p-16 mt-8">
            <div className="flex justify-between">
                <div className="max-w-3xl flex-col flex gap-4">
                    <span className="text-slate-50 text-2xl lg:text-4xl 2xl:text-5xl font-medium !leading-tight">{t('general_text')}</span>
                    <span className="text-zinc-300 text-sm lg:text-base">{t('description_text')}</span>
                </div>
                <div className="lg:flex hidden max-w-xl w-full justify-end">
                    <div className="flex relative">
                        <div className="flex absolute">
                            <Image src="/promocodes.svg" width={100} height={100} className="w-full blur-md z-10 animate-pulse" alt="/" />
                        </div>
                        <Image src="/promocodes.svg" width={100} height={100} className="w-full z-20" alt="/" />
                    </div>
                </div>
            </div>
        </div>
    )
}