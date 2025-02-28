"use client"
import SmartLinkSee from "@/components/smartlink/page";
import DeleteRelease from "@/components/dashboard/release/delete"
import { Dialog, Transition } from "@headlessui/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { redirect, useRouter } from "next/navigation";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";

export default function SmartLinksRedact({ params }: { params: { id: string } }) {
    const t = useTranslations('smartlink')
    const route = useRouter()
    const [smartlink_info, setSmartlinkInfo] = useState<Smartlink | null>(null);
    const [smartlink_url, setSmartlink_url] = useState(smartlink_info?.url || '')
    const [smartlink_error, setSmartlink_error] = useState('')
    const [loading, setLoading] = useState(false)
    type Smartlink = {
        title: string,
        version: string,
        url: string,
        smart_url: []
    }
    const PostURL = async () => {
        if (smartlink_url) {
            if (smartlink_url?.length > 0) {
                try {

                    const res = await fetch("/api/smartlink/update_url", {
                        method: "POST",
                        body: JSON.stringify({
                            id_smartlink: parseInt(params.id, 10),
                            url: smartlink_url,
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.message == "not_unique") {
                            setSmartlink_error(t('not_unique'))
                        } else {
                            FetchSmartlink()
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        }
    };
    const [smartlink_url_add, setSmartlinkUrlAdd] = useState('')
    const [smartlink_url_add_error, setSmartlinkUrlAddError] = useState('')
    const change_smartlink_url_add = (event: { target: { value: any; }; }) => {
        const inputDate = event.target.value;
        setSmartlinkUrlAdd(inputDate)
    };
    const SmartPostURL = async () => {
        if (smartlink_url) {
            if (smartlink_url?.length > 0) {
                try {

                    const res = await fetch("/api/smartlink/add_smartlinks", {
                        method: "POST",
                        body: JSON.stringify({
                            id_smartlink: parseInt(params.id, 10),
                            url: smartlink_url_add,
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.message == "not_found") {
                            setSmartlinkUrlAddError(t('not_found'))
                        } else {
                            FetchSmartlink()
                            closeModal()
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        }
    };
    const [loadingAuto, setLoadingAuto] = useState(false)
    const SmartAutoURL = async () => {
        try {
            setLoadingAuto(true)
            const res = await fetch("/api/smartlink/add_smartlinks_auto", {
                method: "POST",
                body: JSON.stringify({
                    id_smartlink: parseInt(params.id, 10),
                })
            });
            if (res.ok) {
                setLoadingAuto(false)
                const data = await res.json();
                if (data.message == "not_found") {
                    setSmartlinkUrlAddError(t('not_found'))
                } else {
                    setSmartlinkInfo(data)
                    setSmartlink_url(data.url)
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }

    const FetchSmartlink = async () => {
        try {
            const res = await fetch("/api/smartlink/get_smartlink_link", {
                method: "POST",
                body: JSON.stringify({
                    id_smartlink: parseInt(params.id, 10)
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message === 'error') {
                    route.push('/dashboard/catalog')
                } else {
                    setSmartlinkInfo(data)
                    setLoading(false)
                    setSmartlink_url(data.url)
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    const DeleteLink = async (value: any) => {
        try {
            const res = await fetch("/api/smartlink/delete_link", {
                method: "POST",
                body: JSON.stringify({
                    id_smartlink: parseInt(params.id, 10),
                    id_link: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "success") {
                    FetchSmartlink()
                }
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

    function openModal() {
        setIsOpen(true)
    }
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('smartlink')}</title>
            </head>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            {loading ? (
                <div className="flex w-full justify-center py-20 items-center">
                    <BigSpinnerLoading />
                </div>
            ) : (
                <div className="bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md">
                    <div className="flex lg:flex-row flex-col ">
                        <div className="lg:w-fit w-full p-6 lg:border-r border-b lg:border-b-0 border-slate-300 dark:border-zinc-800">
                            <div className="text-zinc-800 dark:text-slate-200 font-bold text-lg">{t('basic_information')}</div>
                            <div className="flex flex-col gap-y-4 mt-4">
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-zinc-800 dark:text-slate-200 text-base font-semibold">URL:</div>
                                    <input type="text" name="version_release" className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('url_smartlink_ph')} required value={smartlink_url} onChange={e => setSmartlink_url(e.target.value)} onBlur={PostURL} />
                                    <span className="text-red-600 text-sm">{smartlink_error}</span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex flex-col gap-y-1">
                                        <div className="text-zinc-800 dark:text-slate-200 text-base font-semibold">{t('url_smartlinks')}:</div>
                                        <div className="text-slate-2000 dark:text-zinc-400 text-sm">{t('url_smartlinks_descript')}</div>
                                    </div>
                                    <div className="flex flex-col gap-y-2 py-2">
                                        {smartlink_info && Array.isArray(smartlink_info?.smart_url) && smartlink_info?.smart_url.length > 0 ? (
                                            <>
                                                {smartlink_info?.smart_url.map((items: any, index: number, array: string | any[]) => (
                                                    <div className="flex justify-between border border-slate-300 dark:border-zinc-800 p-2 rounded-lg" key={index}>
                                                        <div className="w-28 flex items-center justify-center select-none bg-slate-300 dark:bg-zinc-800 h-10 p-2 rounded-md">
                                                            <img src={`/platform/${items.cover}`} alt={items.cover} />
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <Link href={`${items.url}`} className="rounded-md w-8 h-8 hover:bg-gray-200 dark:hover:bg-zinc-800 justify-center flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="-0.5 0 25 25" fill="none">
                                                                    <path d="M22 11.8201C22 9.84228 21.4135 7.90885 20.3147 6.26436C19.2159 4.61987 17.6542 3.33813 15.8269 2.58126C13.9996 1.82438 11.9889 1.62637 10.0491 2.01223C8.10927 2.39808 6.32748 3.35052 4.92896 4.74904C3.53043 6.14757 2.578 7.92935 2.19214 9.86916C1.80629 11.809 2.00436 13.8197 2.76123 15.6469C3.51811 17.4742 4.79985 19.036 6.44434 20.1348C8.08883 21.2336 10.0222 21.8201 12 21.8201" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M2 11.8201H22" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M12 21.8201C10.07 21.8201 8.5 17.3401 8.5 11.8201C8.5 6.30007 10.07 1.82007 12 1.82007C13.93 1.82007 15.5 6.30007 15.5 11.8201" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M18.3691 21.6901C20.3021 21.6901 21.8691 20.1231 21.8691 18.1901C21.8691 16.2571 20.3021 14.6901 18.3691 14.6901C16.4361 14.6901 14.8691 16.2571 14.8691 18.1901C14.8691 20.1231 16.4361 21.6901 18.3691 21.6901Z" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M22.9998 22.8202L20.8398 20.6702" stroke="#c3bdcf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </Link>
                                                            <button onClick={() => DeleteLink(items.id)} className="rounded-md w-8 h-8 hover:bg-gray-200 dark:hover:bg-zinc-800 justify-center flex items-center">
                                                                <DeleteRelease />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : null}

                                    </div>
                                    <button onClick={openModal} className="flex items-center gap-x-2 w-fit bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover shadow-md">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 12H20M12 4V20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-zinc-800 dark:text-slate-200">
                                            {t('add_smartlink_url')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>{smartlink_info?.url ? (
                            <div className="w-full rounded-md flex select-none"><SmartLinkSee smartlink_info={smartlink_info} /></div>
                        ) : null}
                    </div>
                </div>
            )}
            <Transition appear show={isOpen} as={Fragment}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('add_smartlink_url_title')}
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
                                        {loadingAuto ? (
                                            <div className="flex w-full justify-center py-20">
                                                <BigSpinnerLoading />
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={SmartAutoURL} className="border border-slate-300 dark:border-zinc-700 p-6 rounded-md hover:bg-slate-300 hover:dark:bg-zinc-700 hover:dark:text-slate-100 hover:text-zinc-800 dark:text-slate-300 text-zinc-700 ">
                                                    <span className="text-sm">{t('auto_smartlink')}</span>
                                                </button>
                                                <input type="text" name="version_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('add_smartlink_ph')} required value={smartlink_url_add} onChange={change_smartlink_url_add} />
                                                <span className="text-red-600">{smartlink_url_add_error}</span>
                                                <span className="text-md text-gray-700 dark:text-gray-200">
                                                    {t('add_smartlink_url_descript')}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={SmartPostURL}
                                        >
                                            {t('add')}
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