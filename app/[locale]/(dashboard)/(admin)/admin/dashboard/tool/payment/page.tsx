'use client'
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function Payment() {
    const t = useTranslations('payment')
    type Payment = {
        amount: number,
        createdAt: Date,
        status: string
    }
    const [payment, setPayment] = useState<Payment[]>([])
    const fetchPayment = async () => {
        const res = await fetch('/api/admin/payment', { method: "GET" })
        const data = await res.json()
        setPayment(data.payment)
    }
    useEffect(() => {
        fetchPayment()
    }, [])
    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) return "N/A";
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    return (
        <>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 mt-5 gap-4">
                {payment.map((item, index) => (
                    <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-row gap-x-2 items-center">
                                <div className="flex bg-gray-200 dark:bg-zinc-800 rounded-full w-12 h-12 justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="6" width="18" height="13" rx="2" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10H20.5" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 15H9" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-200 font-medium text-base">{t('pay')}: {item.amount}</span>
                                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">{t('date')}:{item.createdAt ? formatDate(new Date(item.createdAt)) : "N/A"}</span>
                                </div>
                            </div>
                            {item.status === "canceled" || item.status === "REJECTED" ? (
                                <div className="dark:bg-red-400/10 bg-red-400/20 rounded-xl px-3 py-1 flex h-fit">
                                    <span className="dark:text-red-400 text-red-500 font-medium text-xs">{t("canceled")}</span>
                                </div>
                            ) : null}
                            {item.status === "succeeded" || item.status === "CONFIRMED" ? (
                                <div className="dark:bg-emerald-400/10 bg-emerald-400/20 rounded-xl px-3 py-1 flex h-fit">
                                    <span className="dark:text-emerald-400 text-emerald-500 font-medium text-xs">{t("succeeded")}</span>
                                </div>
                            ) : null}
                            {item.status === "pending" ? (
                                <div className="dark:bg-orange-400/10 bg-orange-400/20 rounded-xl px-3 py-1 flex h-fit">
                                    <span className="dark:text-orange-400 text-orange-500 font-medium text-xs">{t(item.status)}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}