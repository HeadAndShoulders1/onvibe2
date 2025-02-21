import SubscribeDash from "@/components/subscribe/SubscribeDash"
import { useTranslations } from "next-intl"

export default function SubscribeDashPage() {
    const t = useTranslations('subscribe')
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('subscribe')}</title>
            </head>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            <SubscribeDash />
        </>
    )
}