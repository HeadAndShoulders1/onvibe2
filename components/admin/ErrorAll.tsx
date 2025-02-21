import { useTranslations } from "next-intl"

export default function ErrorAll({ error }: any) {
    const t = useTranslations('catalog')
    return (
        <>
            {error.length > 0 ? (
                <div className="flex flex-col gap-y-2">
                    {error.map((items: any, index: any, array: any) => (
                        <div className="flex gap-x-2 items-center" key={index}>
                            <div className="border bg-white dark:bg-zinc-900  border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-slate-200 rounded-full w-10 min-w-[40px] h-10 text-sm font-semibold flex items-center justify-center">{index + 1}</div>
                            <div className="bg-white dark:bg-zinc-900 p-2 border border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-slate-200 rounded-md text-sm break-all w-full">
                                {items}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center text-zinc-800 dark:text-slate-200">{t('error_not_found')}</div>
            )}
        </>
    )
}