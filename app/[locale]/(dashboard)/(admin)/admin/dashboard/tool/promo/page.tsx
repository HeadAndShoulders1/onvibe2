"use client"
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, Transition } from "@headlessui/react";

export default function AdminPromo() {
    const router = useRouter()
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
        General_text: string;
        playlists: string;
        key_facts: string;
        release_promotion: string;
        upc: string;
        date_release: Date;
    }
    const FetchSmartlink = async () => {
        const res = await fetch("/api/admin/promo/get", {
            method: "GET",
        });

        const data = await res.json();
        if (data.message == "not_admin") {
            router.push('/dashboard/catalog')
        } else {
            setReleasePromo(data)
        }
    };
    const deletePromo = async () => {
        const res = await fetch("/api/admin/promo/check", {
            method: "POST",
            body: JSON.stringify({
                id_release: releasePromoSend?.id
            })
        });

        const data = await res.json();
        if (data.message == "not_admin") {
            router.push('/dashboard/catalog')
            setIsOpen(false)
        } else {
            setReleasePromo(data)
            setIsOpen(false)
        }
    }
    useEffect(() => {
        FetchSmartlink();
    }, []);
    const [releasePromoSend, setReleasePromoSend] = useState<PromoRelase | null>(null)
    let [isOpen, setIsOpen] = useState(false)

    function OpenModal(value: any) {
        setIsOpen(true)
        setReleasePromoSend(value)
    }
    function CloseModal(value: any) {
        setIsOpen(false)
    }
    const md = useTranslations('metadata')
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
            <head>
                <title>{md('promo')}</title>
            </head>
            <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="grid gap-4 lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4">
                {releasePromo ? releasePromo.map((item, index) => (
                    <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-2 border border-slate-300 dark:border-zinc-800 shadow-md" key={index}>
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
                            <button onClick={() => OpenModal(item)} className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-2 font-medium text-[#FFF] bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                                {t('check_promo_text')}
                            </button>
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
                                                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${releasePromoSend?.cover_small_path}`} className="min-w-12 max-w-12 w-full rounded-md" alt="/" />
                                                    <div className="flex justify-between w-full">
                                                        <div className="flex flex-col gap-y-1">
                                                            <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{releasePromoSend?.title ? releasePromoSend.title : "N/A"}</span>
                                                            <span className="text-slate-2000 dark:text-zinc-400 text-sm">
                                                                {Array.isArray(releasePromoSend?.artist) && releasePromoSend?.artist?.length > 0 ? (
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
                                                        <div className="flex flex-col gap-y-1 items-end">
                                                            <span className="text-zinc-800 dark:text-slate-200 font-semibold text-sm">{releasePromoSend?.upc ? releasePromoSend.upc : "N/A"}</span>
                                                            <span className="text-zinc-800 dark:text-slate-200 font-semibold text-sm">{releasePromoSend?.date_release ? formatDate(new Date(releasePromoSend.date_release)) : "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-y-4 mt-5">
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-zinc-600 dark:text-slate-400">{t('general_text')}</span>
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-slate-200">{releasePromoSend?.General_text}</span>
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-zinc-600 dark:text-slate-400">{t('playlists')}</span>
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-slate-200">{releasePromoSend?.playlists}</span>
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-zinc-600 dark:text-slate-400">{t('key_facts')}</span>
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-slate-200">{releasePromoSend?.key_facts}</span>
                                                </div>
                                                <div className="flex flex-col gap-y-1 w-full">
                                                    <span className="text-sm  text-zinc-600 dark:text-slate-400">{t('release_promotion')}</span>
                                                    <span className="text-sm font-medium text-zinc-800 dark:text-slate-200">{releasePromoSend?.release_promotion}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end py-4 px-6 border-t border-slate-300 dark:border-zinc-800">
                                        <button onClick={deletePromo} className="text-sm font-medium leading-6 text-slate-50 bg-indigo-600 p-2 rounded-xl">
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