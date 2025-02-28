import { useTranslations } from "next-intl"

export default function HistoryPromocodes({ promoaction }: { promoaction: any }) {
    const t = useTranslations('promocodes')
    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) {
            return "N/A";
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    return (
        <>
            {promoaction.map((action: any, index: any) => (
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-md" key={index}>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-row gap-x-2 items-center">
                            <div className="flex bg-gray-200 dark:bg-zinc-800 rounded-full w-12 h-12 justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="6" width="18" height="13" rx="2" className="stroke-neutral-500 dark:stroke-neutral-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M3 10H20.5" className="stroke-neutral-500 dark:stroke-neutral-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7 15H9" className="stroke-neutral-500 dark:stroke-neutral-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-800 dark:text-slate-200 font-medium text-base">{t('summ')}: {action.action.amount}</span>
                                <span className="text-zinc-600 dark:text-zinc-400 text-sm">{t('date_replenish')}: {formatDate(new Date(action.action.createdAt))}</span>
                            </div>
                        </div>
                        {action.action.status === "paid" ? (
                            <div className="dark:bg-emerald-400/10 bg-emerald-400/20 rounded-xl px-3 py-1 flex h-fit">
                                <span className="dark:text-emerald-400 text-emerald-500 font-medium text-xs">{t('paid')}</span>
                            </div>
                        ) : null}
                        {action.action.status === "ponclusion" ? (
                            <div className="dark:bg-emerald-400/10 bg-emerald-400/20 rounded-xl px-3 py-1 flex h-fit">
                                <span className="dark:text-emerald-400 text-emerald-500 font-medium text-xs">{t('conclusion')}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            ))}
        </>
    )
}