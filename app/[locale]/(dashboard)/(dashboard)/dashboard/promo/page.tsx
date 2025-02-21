"use client"
import { useTranslations } from "next-intl"
import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";


export default function Promo() {
    const t = useTranslations('promo')
    const [releasePromo, setReleasePromo] = useState<PromoRelase[]>([])
    type PromoRelase = {
        id: number;
        cover_small_path: string;
        artist: string;
        featartist: string;
        title: string;
        version: string;
        promo_prosent: number;
        promo_send: string;
    }
    const FetchSmartlink = async () => {
        try {
            const res = await fetch("/api/promo/get", {
                method: "GET",
            });
            if (res.ok) {
                const data = await res.json();
                setReleasePromo(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    useEffect(() => {
        FetchSmartlink();
    }, [])
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }
    const [loadingPromoSend, setLoadingPromoSend] = useState(true)
    const [releasePromoSend, setReleasePromoSend] = useState<PromoRelase | undefined>(undefined)
    const [general_text, set_general_text] = useState('')
    const [playlists, set_playlists] = useState('')
    const [key_facts, set_key_facts] = useState('')
    const [release_promotion, set_release_promotion] = useState('')

    function OpenModal(value: any) {
        setIsOpen(true)
        setReleasePromoSend(value)
    }
    function CloseModal(value: any) {
        setIsOpen(false)
    }

    const sendPromo = async (value: any) => {
        if (general_text != "" && key_facts != "" && playlists != "" && release_promotion != "") {
            const res = await fetch("/api/promo/send", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(value),
                    general_text: general_text,
                    playlists: playlists,
                    key_facts: key_facts,
                    release_promotion: release_promotion
                })
            })
            const data = await res.json();
            setReleasePromo(data)
            setLoadingPromoSend(false)
        }
    };
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('promo')}</title>
            </head>
            <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="grid gap-4 lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 mt-4">
                {releasePromo ? releasePromo.map((item, index) => (
                    <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-2 border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                        <div className="flex flex-col gap-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2 lg:flex-row flex-col">
                                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover_small_path}`} className="w-16 rounded-md" alt="/" />
                                    <div className="flex flex-col gap-y-1">
                                        <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{item.title ? item.title : "N/A"}</span>
                                        <span className="text-slate-2000 dark:text-zinc-400 text-sm">
                                            {Array.isArray(item?.artist) && item?.artist.length > 0 ? (
                                                <>
                                                    {item?.artist.map((items: any, index: number, array: string | any[]) => (
                                                        <React.Fragment key={index}>
                                                            {items}
                                                            {index !== array.length - 1 && ', '}
                                                        </React.Fragment>
                                                    ))}

                                                </>
                                            ) : "N/A"}
                                            {' '}
                                            {Array.isArray(item?.featartist) && item?.featartist.length > 0 ? (
                                                <>
                                                    (feat.{' '}
                                                    {item?.featartist.map((items: any, index: number, array: string | any[]) => (
                                                        <React.Fragment key={index}>
                                                            {items}
                                                            {index !== array.length - 1 && ', '}
                                                        </React.Fragment>
                                                    ))}
                                                    )
                                                </>
                                            ) : null}
                                        </span>
                                    </div>
                                </div>
                                {item.promo_send ? (
                                    <div className="flex gap-x-1 items-center p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-red-600 relative z-20" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                        <span className="text-zinc-800 dark:text-slate-200 font-medium text-sm">{t('unavailable')}</span>
                                    </div>
                                ) : (
                                    <div className="flex gap-x-1 items-center p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" className="fill-white">
                                            <path className="fill-emerald-400" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path>
                                        </svg>
                                        <span className="text-zinc-800 dark:text-slate-200 font-medium text-sm">{t('available')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-y-2 flex-col">
                                <div className="flex justify-between">
                                    <span className="text-sm font-semibold  text-zinc-800 dark:text-slate-200">{item.promo_prosent}%</span>
                                    <div className="flex gap-x-3">
                                        <Image width={16} height={16} src="/promo_image/vk.svg" alt="/" />
                                        <Image width={16} height={16} src="/promo_image/yandex.svg" alt="/" />
                                        <Image width={16} height={16} src="/promo_image/spotify.svg" alt="/" />
                                    </div>
                                </div>
                                <div className="flex border w-full rounded-lg border-slate-300 dark:border-zinc-800">
                                    {item.promo_prosent < 20 ? (
                                        <div style={{ width: `${item.promo_prosent}%` }} className="flex border-[3px] rounded-lg border-red-500"></div>
                                    ) : null}
                                    {item.promo_prosent < 30 && item.promo_prosent >= 20 ? (
                                        <div style={{ width: `${item.promo_prosent}%` }} className="flex border-[3px] rounded-lg border-orange-500"></div>
                                    ) : null}
                                    {item.promo_prosent >= 30 ? (
                                        <div style={{ width: `${item.promo_prosent}%` }} className="flex border-[3px] rounded-lg border-green-500"></div>
                                    ) : null}
                                </div>
                            </div>
                            {item.promo_send ? (
                                <button className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] bg-green-600 gap-x-2 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ">
                                    {t('success_promo_send')}
                                </button>
                            ) : (
                                <button onClick={() => OpenModal(item)} className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                                    {t('send_to_promo')}
                                </button>
                            )}
                        </div>
                    </div>
                )) : null}
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={CloseModal}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between py-4 px-6 border-b border-slate-300 dark:border-zinc-800">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('promo_send')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={CloseModal} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {releasePromoSend && (
                                        <div className="p-4 flex flex-col">
                                            <div className="border border-slate-300 dark:border-zinc-800 rounded-md p-2">
                                                <div className="flex gap-x-4">
                                                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${releasePromoSend?.cover_small_path}`} className="w-12 rounded-md" alt="/" />
                                                    <div className="flex flex-col gap-y-1">
                                                        <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{releasePromoSend?.title ? releasePromoSend.title : "N/A"}</span>
                                                        <span className="text-slate-2000 dark:text-zinc-400 text-sm">
                                                            {Array.isArray(releasePromoSend?.artist) && releasePromoSend?.artist.length > 0 ? (
                                                                <>
                                                                    {releasePromoSend?.artist.map((items: any, index: number, array: string | any[]) => (
                                                                        <React.Fragment key={index}>
                                                                            {items}
                                                                            {index !== array.length - 1 && ', '}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </>
                                                            ) : "N/A"}
                                                            {' '}
                                                            {Array.isArray(releasePromoSend?.featartist) && releasePromoSend?.featartist.length > 0 ? (
                                                                <>
                                                                    (feat.{' '}
                                                                    {releasePromoSend?.featartist.map((items: any, index: number, array: string | any[]) => (
                                                                        <React.Fragment key={index}>
                                                                            {items}
                                                                            {index !== array.length - 1 && ', '}
                                                                        </React.Fragment>
                                                                    ))}
                                                                    )
                                                                </>
                                                            ) : null}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-y-4 mt-5">
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('general_text')}</span>
                                                    <textarea
                                                        className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                                                        value={general_text}
                                                        onChange={e => set_general_text(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('playlists')}</span>
                                                    <textarea
                                                        className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                                                        value={playlists}
                                                        onChange={e => set_playlists(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('key_facts')}</span>
                                                    <textarea
                                                        className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                                                        value={key_facts}
                                                        onChange={e => set_key_facts(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('release_promotion')}</span>
                                                    <textarea
                                                        className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                                                        value={release_promotion}
                                                        onChange={e => set_release_promotion(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-300 dark:border-zinc-800 py-4 px-6 flex justify-end gap-x-2">
                                        <button onClick={closeModal} className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] bg-red-600 gap-x-2 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                            {t('close')}
                                        </button>
                                        <button onClick={() => sendPromo(releasePromoSend?.id)} className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] bg-green-600 gap-x-2 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                                            {t('send')}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}