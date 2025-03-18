import { useTranslations } from "next-intl";
import Image from "next/image"

export default function Permission() {
    const t = useTranslations('home');
    const perms = [
        {
            name_black: t('partners_desc_3'),
            name_rose: t('partners_desc_4'),
            description: t('partners_desc_5'),
            image_src: "/permissions/money.svg"
        },
        {
            name_black: t('partners_desc_6'),
            name_rose: t('partners_desc_7'),
            description: t('partners_desc_8'),
            image_src: "/permissions/marketing.svg"
        },
        {
            name_black: t('partners_desc_9'),
            name_rose: t('partners_desc_10'),
            description: t('partners_desc_11'),
            image_src: "/permissions/time.svg"
        },
    ]
    return (
        <div className="flex  justify-center relative w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto border-t border-slate-300 dark:border-zinc-800" data-aos="fade-up" data-aos-delay="100">
            <div className="flex flex-col gap-y-8 py-12">
                <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center">
                    <span className="text-zinc-800 font-bold text-3xl lg:text-4xl max-w-2xl dark:text-slate-50">{t('partners_desc_1')}</span>
                    <span className="text-zinc-800 text-sm max-w-md dark:text-zinc-300">{t('partners_desc_2')}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {perms.map((perm, index) => (
                        <div className="border rounded-lg border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                            <div className="flex flex-col gap-y-8 p-6 justify-between h-full">
                                <div className="flex flex-col gap-y-2">
                                    <div className="text-zinc-800 font-bold text-xl lg:text-2xl">
                                        <span className="text-zinc-800 dark:text-slate-50">{perm.name_black} </span>
                                        <span className="dark:text-indigo-500 text-indigo-400">{perm.name_rose}</span>
                                    </div>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{perm.description}</span>
                                </div>
                                <div className="w-full mx-auto max-w-md flex lg:pl-10">
                                    <Image src={perm.image_src} width={100} height={100} className="w-full pl-4" alt="/" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}