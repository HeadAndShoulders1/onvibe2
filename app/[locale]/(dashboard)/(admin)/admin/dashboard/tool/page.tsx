'use client'
import { useTranslations } from "next-intl"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UploadPage } from "./otchet";

export default function AdminTool() {
    const t = useTranslations('admin_tool')

    const router = useRouter()
    const Check_Admin = async () => {
        const res = await fetch('/api/user/isAdmin', { method: 'GET' })
        const data = await res.json()
        if (data.admin == false) {
            router.push('/dashboard/catalog')
        }
    }
    useEffect(() => {
        Check_Admin()
    }, [])
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('admin_tool')}</title>
            </head>

            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="grid gap-4 lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 mt-4">
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-orange-500" width="3em" height="3em" viewBox="0 0 22 22">
                                    <path d="M2 2H20V3H21V17H20V18H12V19H11V20H10V21H6V18H2V17H1V3H2V2M3 4V16H8V19H9V18H10V17H11V16H19V4H3M5 7H17V9H5V7M5 11H15V13H5V11Z" />
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('create_post')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('create_post_disc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/post" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('create')}
                        </Link>
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-purple-600" height="2.5em" width="2.5em" version="1.1" id="Layer_1" viewBox="0 0 512 512">
                                    <g>
                                        <g>
                                            <path d="M458.667,37.589c-27.027,0-49.355,20.128-52.844,46.203L104.61,140.269c-6.372-22.323-26.914-38.68-51.277-38.68    C23.887,101.589,0,125.476,0,154.922v192c0,29.446,23.887,53.333,53.333,53.333c24.363,0,44.905-16.358,51.277-38.681    l37.472,7.026l-13.205,44.312c-3.578,12.006,3.911,24.496,16.186,26.996l167.232,34.069c10.832,2.207,21.556-4.227,24.707-14.823    l15.211-51.155l53.608,10.051c3.489,26.075,25.818,46.203,52.844,46.203c29.446,0,53.333-23.887,53.333-53.333v-320    C512,61.476,488.113,37.589,458.667,37.589z M64,346.922c0,5.882-4.785,10.667-10.667,10.667c-5.882,0-10.667-4.785-10.667-10.667    v-192c0-5.882,4.785-10.667,10.667-10.667c5.882,0,10.667,4.785,10.667,10.667v10.667v170.667V346.922z M106.667,183.294    l298.667-56V374.55l-64.009-12.002c-0.049-0.01-0.096-0.022-0.145-0.031l-167.957-31.488c-0.001,0-0.002,0-0.002,0l-66.553-12.479    V183.294z M301.674,428.272l-125.248-25.516l7.822-26.248l125.805,23.588L301.674,428.272z M469.333,410.922    c0,5.882-4.785,10.667-10.667,10.667S448,416.804,448,410.922v-10.667V101.589V90.922c0-5.882,4.785-10.667,10.667-10.667    s10.667,4.785,10.667,10.667V410.922z"></path>
                                        </g>
                                    </g>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('promo')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('promo_disc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/promo" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('check')}
                        </Link>
                    </div>
                </div>

                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="6" width="18" height="13" rx="2" className="stroke-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 10H20.5" className="stroke-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 15H9" className="stroke-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('payment')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('payment_disc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/payment" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('check')}
                        </Link>
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 4V18C3 19.1046 3.89543 20 5 20H17H19C20.1046 20 21 19.1046 21 18V8H17" className="stroke-yellow-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 4H17V18C17 19.1046 17.8954 20 19 20V20" className="stroke-yellow-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13 8L7 8" className="stroke-yellow-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M13 12L9 12" className="stroke-yellow-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('news')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('news_desc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/news" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('create')}
                        </Link>
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none" stroke="#00e1ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('grant_applications')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('grant_desc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/grants" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('check')}
                        </Link>
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4 justify-between h-full">
                        <div className="flex h-full items-center">
                            <div className="flex gap-x-3 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                                    <g id="analysis">
                                        <polyline className="stroke-emerald-500 fill-none" strokeWidth="2" points="3.96 14.04 9 9 15 15 23 7" />
                                        <line className="stroke-emerald-500 fill-none" strokeWidth="2" x1="2.54" y1="15.46" x2="1" y2="17" />
                                    </g>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('statistics')}</span>
                                    <span className="text-zinc-700 dark:text-slate-400 text-sm">{t('statistics_disc')}</span>
                                </div>
                            </div>
                        </div>
                        <Link href="/admin/dashboard/tool/analytics" className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                            {t('check')}
                        </Link>
                    </div>
                </div>
                <UploadPage />
            </div>
        </>
    )
}