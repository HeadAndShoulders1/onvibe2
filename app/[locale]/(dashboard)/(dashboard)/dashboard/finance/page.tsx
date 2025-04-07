"use client"
import Withdrawal from "@/components/finance/withdrawal"
import WithdrawalHistory from "@/components/finance/WithdrawalHistoryModal"
import BigSpinnerLoading from "@/components/Spinner/bigspinner"
import SpinnerLoading from "@/components/Spinner/page"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function Finance() {
    const t = useTranslations('finance')
    const md = useTranslations('metadata')
    const [FinanceData, setFinanceData]: any = useState()
    const fetch_data = async () => {
        const res = await fetch('/api/report/get', { method: "GET" })
        const data = await res.json()
        setFinanceData(data)
        setLoading(false)
    }
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setFinanceData({ all_finance: 0, report: [] })
        fetch_data()
    }, [])
    return (
        <>
            <head>
                <title>{md('finance')}</title>
            </head>
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
                <div className="flex bg-[#fff] dark:bg-zinc-900 rounded-xl  px-4 py-3 shadow-sm w-full  mt-4 ">
                        <div className="flex flex-col gap-y-4 w-full">
                            <span className="text-xl text-zinc-800 dark:text-slate-200 font-semibold">{t('balance')}</span>
                            {loading ? <BigSpinnerLoading /> : (
                                <span className="text-zinc-800 dark:text-slate-200 font-medium text-4xl">{FinanceData.all_amount / 100} ₽</span>
                            )}
                        </div>
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-[50%]">
                            <Withdrawal />
                            <WithdrawalHistory/>
                        </div>
                    </div>
                

            <div className="flex bg-[#fff] dark:bg-zinc-900 mt-3 rounded-xl p-4 shadow-sm">
                <div className="grid gap-y-4 w-full">
                    <span className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold">{t('finance_otchet')}</span>
                    {loading ? <BigSpinnerLoading /> : (
                        <>
                            {FinanceData.report.length !== 0 ? (
                                <>
                                    {FinanceData.report.map((item: any, index: any)=>(
                                        <div className="flex flex-col gap-y-2" key={index}>
                                            <div className="flex w-full justify-between">
                                                <span className="text-lg text-zinc-800 dark:text-slate-200 font-semibold">{item.date}</span>
                                                <span className="text-lg text-emerald-400 dark:text-emerald-500 font-semibold">+{item.amount/100}₽</span>
                                            </div>
                                            <div className='grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 w-full'>
                                            {item?.release ? (item.release.map((item: any, index: any) => (
                                                <div className='rouned-md border border-slate-300 dark:border-zinc-800 shadow-sm p-2 rounded-md' key={index}>
                                                    <div className='flex w-full justify-between'>
                                                        <div className='flex gap-x-2'>
                                                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover}`} className='w-12 h-12 rounded-md' alt="" />
                                                            <div className='flex flex-col'>
                                                                <span className='text-zinc-800 dark:text-slate-200 font-medium text-base'>{item.title}</span>
                                                                <span className='text-zinc-600 dark:text-slate-400 text-sm'>{item.artist}</span>
                                                            </div>
                                                        </div>
                                                        <span className='text-emerald-500'>+{item.amount/100}₽</span>
                                                    </div>
                                                </div>
                                            ))) : null}
                                        </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="py-20 justify-center flex">
                                    <span className="text-lg text-zinc-800 dark:text-slate-200">{t('not_data')}</span>
                                </div>
                            )}
                        </>
                    )}

                </div >
            </div >
        </>
    )
}