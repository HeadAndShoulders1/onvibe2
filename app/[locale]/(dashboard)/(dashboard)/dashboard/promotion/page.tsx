'use client'

import BigSpinnerLoading from "@/components/Spinner/bigspinner"
import { Dialog, Transition } from "@headlessui/react"
import { Snippet } from "@prisma/client"
import { useTranslations } from "next-intl"
import React, { Fragment } from "react"
import { useEffect, useState } from "react"

export default function Generator() {
    const t = useTranslations('generator')
    type Release = {
        id: number,
        title: string,
        artist: [],
        cover: string,
        featartist: []
    }
    const [releases, setReleases] = useState<Release[]>([])
    const [snippet, setSnippet] = useState<Snippet[]>([])
    const [loading, setLoading] = useState(false)
    const FetchData = async () => {
        setLoading(true)
        const res = await fetch('/api/generator/getData')
        const data = await res.json()

        setReleases(data.releases)
        setSnippet(data.snippets)
        setLoading(false)
    }
    const DeleteSnippet = async (id: any) => {
        setLoading(true)
        const res = await fetch('/api/generator/deleteSnippet', {
            method: "POST",
            body: JSON.stringify({
                id_snippet: id
            })
        })
        const data = await res.json()

        setReleases(data.releases)
        setSnippet(data.snippets)
        setLoading(false)
    }
    useEffect(() => {
        FetchData()
    }, [])
    const [Modal, setModal] = useState(false)
    function closeModal() {
        setModal(false)
    }

    function openModal() {
        setModal(true)
    }
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('generator')}</title>
            </head>
            <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="grid lg:grid-cols-3 2xl:grid-cols-5 gap-4"></div>
            <button onClick={openModal} className="bg-[#fff] text-left dark:bg-zinc-900 hover:bg-gray-300 hover:dark:bg-zinc-700 transition mt-5 rounded-2xl  shadow-md w-96 p-2">
                <div className="flex gap-y-2 w-full flex-col">
                    <div className="bg-gray-200 dark:bg-zinc-800 h-40 flex items-center justify-center rounded-md w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C9.284 2 8.944 2.01133 7.87733 2.06C6.81267 2.10867 6.08533 2.278 5.44933 2.52533C4.78267 2.776 4.178 3.16933 3.678 3.67867C3.16948 4.17809 2.77591 4.78233 2.52467 5.44933C2.27867 6.08533 2.10867 6.81333 2.06 7.878C2.012 8.944 2 9.28333 2 12C2 14.7167 2.01133 15.056 2.06 16.1227C2.10867 17.1873 2.278 17.9147 2.52533 18.5507C2.776 19.2173 3.16933 19.822 3.67867 20.322C4.1781 20.8305 4.78234 21.2241 5.44933 21.4753C6.08533 21.722 6.81267 21.8913 7.87733 21.94C8.944 21.9887 9.284 22 12 22C14.716 22 15.056 21.9887 16.1227 21.94C17.1873 21.8913 17.9147 21.722 18.5507 21.4747C19.2173 21.224 19.822 20.8307 20.322 20.3213C20.8305 19.8219 21.2241 19.2177 21.4753 18.5507C21.722 17.9147 21.8913 17.1873 21.94 16.1227C21.9887 15.056 22 14.716 22 12C22 9.284 21.9887 8.944 21.94 7.87733C21.8913 6.81267 21.722 6.08533 21.4747 5.44933C21.2236 4.78204 20.83 4.17755 20.3213 3.678C19.8219 3.16948 19.2177 2.77591 18.5507 2.52467C17.9147 2.27867 17.1867 2.10867 16.122 2.06C15.056 2.012 14.7167 2 12 2ZM12 3.802C14.67 3.802 14.9867 3.812 16.0413 3.86C17.016 3.90467 17.5453 4.06667 17.898 4.20467C18.3647 4.38533 18.698 4.60267 19.048 4.952C19.398 5.302 19.6147 5.63533 19.7953 6.102C19.9327 6.45467 20.0953 6.984 20.14 7.95867C20.188 9.01333 20.198 9.33 20.198 12C20.198 14.67 20.188 14.9867 20.14 16.0413C20.0953 17.016 19.9333 17.5453 19.7953 17.898C19.6353 18.3324 19.3799 18.7253 19.048 19.048C18.7254 19.38 18.3324 19.6354 17.898 19.7953C17.5453 19.9327 17.016 20.0953 16.0413 20.14C14.9867 20.188 14.6707 20.198 12 20.198C9.32933 20.198 9.01333 20.188 7.95867 20.14C6.984 20.0953 6.45467 19.9333 6.102 19.7953C5.66764 19.6353 5.27467 19.3799 4.952 19.048C4.62012 18.7253 4.36475 18.3323 4.20467 17.898C4.06733 17.5453 3.90467 17.016 3.86 16.0413C3.812 14.9867 3.802 14.67 3.802 12C3.802 9.33 3.812 9.01333 3.86 7.95867C3.90467 6.984 4.06667 6.45467 4.20467 6.102C4.38533 5.63533 4.60267 5.302 4.952 4.952C5.27463 4.62003 5.66761 4.36465 6.102 4.20467C6.45467 4.06733 6.984 3.90467 7.95867 3.86C9.01333 3.812 9.33 3.802 12 3.802Z" className="fill-neutral-500 dark:fill-neutral-400" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 15.3367C11.5618 15.3367 11.128 15.2504 10.7231 15.0827C10.3183 14.915 9.95047 14.6692 9.64064 14.3594C9.3308 14.0495 9.08502 13.6817 8.91734 13.2769C8.74965 12.8721 8.66335 12.4382 8.66335 12C8.66335 11.5618 8.74965 11.1279 8.91734 10.7231C9.08502 10.3183 9.3308 9.95046 9.64064 9.64062C9.95047 9.33078 10.3183 9.08501 10.7231 8.91732C11.128 8.74964 11.5618 8.66333 12 8.66333C12.885 8.66333 13.7336 9.01487 14.3594 9.64062C14.9851 10.2664 15.3367 11.1151 15.3367 12C15.3367 12.8849 14.9851 13.7336 14.3594 14.3594C13.7336 14.9851 12.885 15.3367 12 15.3367ZM12 6.86C10.6368 6.86 9.32942 7.40153 8.36549 8.36547C7.40155 9.32941 6.86002 10.6368 6.86002 12C6.86002 13.3632 7.40155 14.6706 8.36549 15.6345C9.32942 16.5985 10.6368 17.14 12 17.14C13.3632 17.14 14.6706 16.5985 15.6345 15.6345C16.5985 14.6706 17.14 13.3632 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM18.6353 6.76667C18.6353 7.0889 18.5073 7.39794 18.2795 7.6258C18.0516 7.85366 17.7426 7.98167 17.4204 7.98167C17.0981 7.98167 16.7891 7.85366 16.5612 7.6258C16.3334 7.39794 16.2053 7.0889 16.2053 6.76667C16.2053 6.44443 16.3334 6.13539 16.5612 5.90753C16.7891 5.67968 17.0981 5.55167 17.4204 5.55167C17.7426 5.55167 18.0516 5.67968 18.2795 5.90753C18.5073 6.13539 18.6353 6.44443 18.6353 6.76667Z" className="fill-neutral-500 dark:fill-neutral-400" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base dark:text-slate-300 text-zinc-800 font-medium">{t('snippet_title')}</span>
                        <span className="text-sm dark:text-slate-400 text-zinc-700">{t('snippet_desc')}</span>
                    </div>
                </div>
            </button>
            <div className="flex flex-col mt-10">
                <span className="text-2xl text-gray-700 font-bold dark:text-slate-200">{t('ready_snippet')}</span>
                {loading ? (
                    <div className="flex w-full py-20 justify-center items-center">
                        <BigSpinnerLoading />
                    </div>
                ) : (
                    <>
                        {snippet.length > 0 ? (
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-4 mt-4">
                                {snippet.map((item, index) => (
                                    <div className="flex flex-col gap-y-4 bg-[#fff] dark:bg-zinc-900 transition rounded-2xl  shadow-md p-4" key={index}>
                                        <div className="flex justify-between">
                                            <div className="flex gap-x-2">
                                                <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover}`} alt="/" className="w-12 rounded-md" />
                                                <div className="flex flex-col">
                                                    <span className="text-zinc-900 dark:text-slate-50 font-semibold text-base">{item.title}</span>
                                                    <span className="text-zinc-700 dark:text-slate-300 text-sm">
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
                                            <div className="flex py-1 px-2 bg-emerald-400/10 h-fit rounded-lg">
                                                <span className="text-emerald-600 text-xs">{t('ready')}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <a href={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.url}`} className="flex gap-x-2 p-2 border items-center border-slate-300 dark:border-zinc-800 w-fit hover:bg-gray-300 hover:dark:bg-zinc-700 transition rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="none">
                                                    <path className="stroke-zinc-800 dark:stroke-slate-200" d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="text-zinc-800 dark:text-slate-200 text-sm font-medium">{t('download')}</span>
                                            </a>
                                            <button onClick={() => DeleteSnippet(item.id)} className="hover:bg-gray-300 hover:dark:bg-zinc-700 transition p-2 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full justify-center py-20 gap-y-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                                    <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500" />
                                </svg>
                                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('nothing_found')}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Transition appear show={Modal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                    <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('choose_track')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModal} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        {loading ? (
                                            <div className="flex w-full py-20 justify-center items-center">
                                                <BigSpinnerLoading />
                                            </div>
                                        ) : (
                                            <>
                                                {releases.length > 0 ? (
                                                    <div className="flex flex-col gap-y-4 w-full">
                                                        {releases.map((item, index) => (
                                                            <a href={`/dashboard/promotion/${item.id}`} className="bg-[#fff] dark:bg-zinc-900 hover:bg-gray-300 hover:dark:bg-zinc-700 transition w-full rounded-2xl  shadow-md p-4" key={index}>
                                                                <div className="flex gap-x-2">
                                                                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover}`} alt="/" className="w-12 rounded-md" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-zinc-900 dark:text-slate-50 font-semibold text-base">{item.title}</span>
                                                                        <span className="text-zinc-700 dark:text-slate-300 text-sm">
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
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center w-full justify-center py-20 gap-y-4">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                                                            <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500" />
                                                        </svg>
                                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('nothing_found')}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
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