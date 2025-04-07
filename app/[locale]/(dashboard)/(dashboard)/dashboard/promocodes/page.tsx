'use client'
import { useTranslations } from "next-intl"
import PromocodesInfo from "./components/buy"
import PromocodesInfoUser from "./components/info"
import HistoryPromocodes from "./components/HistoryPromocodes"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import SpinnerLoading from "@/components/Spinner/page"
import BigSpinnerLoading from "@/components/Spinner/bigspinner"

export default function Promocodes() {
    const md = useTranslations('metadata')
    const t = useTranslations('promocodes')

    const [isOpen, setIsOpen] = useState(false)
    const [promo, setPromo] = useState('')
    const [error, setError] = useState('')

    const [summ, setSumm] = useState('')
    const [promoinfo, setPromoInfo]: any = useState()
    const [promoaction, setPromoAction]: any = useState()

    const [loading, setLoading] = useState(true)
    const [loading_create, setLoadingCreate] = useState(false)
    const create_promocodes = async () => {
        setLoadingCreate(true)
        const res = await fetch('/api/promocode/create', {
            method: "POST",
            body: JSON.stringify({
                name: promo
            })
        })
        const data = await res.json()
        if (data.status === "error") {
            setError(data.message)
            setLoadingCreate(false)
        } else {
            setLoadingCreate(false)
            setIsOpen(false)
            setPromoInfo(data.info)
            setPromoAction(data.action)
            setSumm(data.summ)
        }
    }

    const info_promocodes = async () => {
        setLoading(true)
        const res = await fetch('/api/promocode/get_info', {
            method: "GET"
        })
        const data = await res.json()
        setPromoInfo(data.info)
        setPromoAction(data.action)
        setSumm(data.summ)
        setLoading(false)
    }
    useEffect(() => {
        info_promocodes()
    }, [])
    return (
        <>
            <head>
                <title>{md('promo')}</title>
            </head>
            <div className="flex justify-between">
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
                {promoinfo ? null : (
                    <>
                        {loading ? null : (
                            <button onClick={() => setIsOpen(true)} className="flex items-center gap-x-2 bg-[#5351FF] hover:bg-[#5351FF]/80 transition py-2 px-3 rounded-lg invisible lg:visible">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 12H20M12 4V20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-sm font-semibold text-white">{t('create_promocodes')}</span>
                            </button>
                        )}
                    </>
                )}
            </div>
            <PromocodesInfo />
            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <BigSpinnerLoading />
                </div>
            ) : (
                <>
                    {promoinfo ? (
                        <>
                            <PromocodesInfoUser summ={summ} info_promo={promoinfo} />
                            <div className="flex flex-col gap-y-2 mt-4">
                                <span className="text-2xl text-gray-700 font-bold dark:text-slate-200">{t('history')}</span>
                                {promoaction.length != 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                        <HistoryPromocodes promoaction={promoaction} />
                                    </div>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </>
            )}


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex flex-col gap-y-6 p-6">
                                        <div className="flex flex-col gap-y-2">
                                            <span className="dark:text-slate-50 text-zinc-700 font-semibold leading-none text-xl">{t('create_promocodes_title')}</span>
                                            <span className="text-sm dark:text-zinc-400 text-zinc-600">{t('create_promocodes_description')}</span>
                                        </div>
                                        <div className="flex gap-y-0.5 flex-col">
                                            <span className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
                                                {t('title')}
                                            </span>
                                            <input
                                                id="username"
                                                required
                                                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl  text-left p-2 w-full"
                                                value={promo}
                                                onChange={(e) => setPromo(e.target.value)}
                                            />
                                            {error ? (
                                                <span className="text-sm text-red-500 font-medium">{t(error)}</span>
                                            ) : null}
                                        </div>
                                        <div className="flex w-full justify-end ">
                                            {loading_create ? (
                                                <button disabled className="flex items-center w-20 justify-center bg-[#5351FF]/80 transition py-2 px-3 rounded-lg invisible lg:visible">
                                                    <SpinnerLoading />
                                                </button>
                                            ) : (
                                                <button onClick={() => create_promocodes()} className="flex items-center bg-[#5351FF] hover:bg-[#5351FF]/80 transition py-2 px-3 rounded-lg invisible lg:visible">
                                                    <span className="text-sm font-medium text-white">{t('create_promocodes')}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}