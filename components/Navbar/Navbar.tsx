"use client"
import { useEffect, useState } from "react";
import NavLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import LocaleSwitcher from "../SelectLanguage/SelectLanguageDown";
import { Dialog } from "@headlessui/react";
import DropdownUser from "./dropdownuser";
import { useRouter } from "next/navigation";
import AdminBar from "./adminlink";
import Logo from "../logo/page";
import BalanceUser from "./balance_user";
import Links from "./links";

async function getData() {
    const res = await fetch(`/api/user/isAdmin`);

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


export default function NavbarDashboard() {
    const t = useTranslations('dashboard_link')
    const subs = useTranslations('subscribe')
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const locale = useLocale()
    const links = [
        {
            id: 1,
            title: t('catalog'),
            name: [
                {
                    id: 1,
                    title: t('all_release'),
                    url: `/${locale}/dashboard/catalog`,
                    svg: <svg width="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-home"><path fillRule="evenodd" clipRule="evenodd" d="M5 22C3.34315 22 2 20.6569 2 19V11.3361C2 10.4857 2.36096 9.67518 2.99311 9.10625L9.9931 2.80625C11.134 1.77943 12.866 1.77943 14.0069 2.80625L21.0069 9.10625C21.639 9.67518 22 10.4857 22 11.3361V19C22 20.6569 20.6569 22 19 22H5ZM20 11.3361V19C20 19.5523 19.5523 20 19 20H16V15C16 13.3432 14.6569 12 13 12H11C9.34315 12 8 13.3432 8 15V20H5C4.44772 20 4 19.5523 4 19V11.3361C4 11.0526 4.12032 10.7825 4.33104 10.5928L11.331 4.29284C11.7113 3.95056 12.2887 3.95056 12.669 4.29284L19.669 10.5928C19.8797 10.7825 20 11.0526 20 11.3361ZM10 20V15C10 14.4478 10.4477 14 11 14H13C13.5523 14 14 14.4478 14 15V20H10Z" className="dark:fill-slate-300 fill-slate-600"></path></svg>
                },
                {
                    id: 2,
                    title: t('analytics'),
                    url: `/${locale}/dashboard/analytics`,
                    svg: <svg width="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-statistics"><path fillRule="evenodd" clipRule="evenodd" d="M3 2C3.55228 2 4 2.44772 4 3V19C4 19.5523 4.44772 20 5 20H21C21.5523 20 22 20.4477 22 21C22 21.5523 21.5523 22 21 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2Z" className="dark:fill-slate-300 fill-slate-600"></path><path fillRule="evenodd" clipRule="evenodd" d="M7 8C7.55228 8 8 8.44772 8 9V17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17V9C6 8.44772 6.44772 8 7 8Z" className="dark:fill-slate-300 fill-slate-600"></path><path fillRule="evenodd" clipRule="evenodd" d="M11 14C11.5523 14 12 14.4477 12 15V17C12 17.5523 11.5523 18 11 18C10.4477 18 10 17.5523 10 17V15C10 14.4477 10.4477 14 11 14Z" className="dark:fill-slate-300 fill-slate-600"></path><path fillRule="evenodd" clipRule="evenodd" d="M15 4C15.5523 4 16 4.44772 16 5V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V5C14 4.44772 14.4477 4 15 4Z" className="dark:fill-slate-300 fill-slate-600"></path><path fillRule="evenodd" clipRule="evenodd" d="M19 10C19.5523 10 20 10.4477 20 11V17C20 17.5523 19.5523 18 19 18C18.4477 18 18 17.5523 18 17V11C18 10.4477 18.4477 10 19 10Z" className="dark:fill-slate-300 fill-slate-600"></path></svg>
                },
            ]
        },
        {
            id: 2,
            title: "Финансы",
            name: [
                {
                    id: 1,
                    title: t('finance'),
                    url: `/${locale}/dashboard/finance`,
                    svg: <svg width="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-payments"><path fillRule="evenodd" clipRule="evenodd" d="M2 7C2 5.34315 3.34315 4 5 4H19C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7ZM5 6H19C19.5523 6 20 6.44771 20 7V8H4V7C4 6.44772 4.44772 6 5 6ZM4 10V17C4 17.5523 4.44772 18 5 18H19C19.5523 18 20 17.5523 20 17V10H4Z" className="dark:fill-slate-300 fill-slate-600"></path><path fillRule="evenodd" clipRule="evenodd" d="M6 15C6 14.4477 6.44772 14 7 14H13C13.5523 14 14 14.4477 14 15C14 15.5523 13.5523 16 13 16H7C6.44772 16 6 15.5523 6 15Z" className="dark:fill-slate-300 fill-slate-600"></path></svg>
                },
                {
                    id: 2,
                    title: t('subscribe'),
                    url: `/${locale}/dashboard/subscribe`,
                    svg: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 24 24"><path className="dark:fill-slate-300 fill-slate-600" d="M12 0a2 2 0 0 0-1.81 1.15L7.556 6.758 1.7 7.642a2 2 0 0 0-1.13 3.374l4.3 4.408-1.02 6.235a2 2 0 0 0 2.94 2.073L12 20.86l5.216 2.89a2 2 0 0 0 2.942-2.073l-1.02-6.237 4.293-4.39a2 2 0 0 0-1.124-3.376l-5.857-.9-2.64-5.624A2 2 0 0 0 12 0z" /></svg>
                }
            ]
        },
        {
            id: 3,
            title: t('marketing'),
            name: [
                {
                    id: 1,
                    title: t('smartlink'),
                    url: `/${locale}/dashboard/smartlink`,
                    svg: <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 24 24" width="1.5em" className="dark:fill-slate-300 fill-slate-600"><path d="M0 0h24v24H0" fill="none"></path><path d="M8 11h8v2H8zm12.1 1H22c0-2.76-2.24-5-5-5h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1zM3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM19 12h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
                },
                {
                    id: 2,
                    title: t('promo'),
                    url: `/${locale}/dashboard/promo`,
                    svg: <svg xmlns="http://www.w3.org/2000/svg" className="dark:fill-slate-300 fill-slate-600" height="1.5em" width="1.5em" version="1.1" id="Layer_1" viewBox="0 0 512 512"> <g> <g> <path d="M458.667,37.589c-27.027,0-49.355,20.128-52.844,46.203L104.61,140.269c-6.372-22.323-26.914-38.68-51.277-38.68    C23.887,101.589,0,125.476,0,154.922v192c0,29.446,23.887,53.333,53.333,53.333c24.363,0,44.905-16.358,51.277-38.681    l37.472,7.026l-13.205,44.312c-3.578,12.006,3.911,24.496,16.186,26.996l167.232,34.069c10.832,2.207,21.556-4.227,24.707-14.823    l15.211-51.155l53.608,10.051c3.489,26.075,25.818,46.203,52.844,46.203c29.446,0,53.333-23.887,53.333-53.333v-320    C512,61.476,488.113,37.589,458.667,37.589z M64,346.922c0,5.882-4.785,10.667-10.667,10.667c-5.882,0-10.667-4.785-10.667-10.667    v-192c0-5.882,4.785-10.667,10.667-10.667c5.882,0,10.667,4.785,10.667,10.667v10.667v170.667V346.922z M106.667,183.294    l298.667-56V374.55l-64.009-12.002c-0.049-0.01-0.096-0.022-0.145-0.031l-167.957-31.488c-0.001,0-0.002,0-0.002,0l-66.553-12.479    V183.294z M301.674,428.272l-125.248-25.516l7.822-26.248l125.805,23.588L301.674,428.272z M469.333,410.922    c0,5.882-4.785,10.667-10.667,10.667S448,416.804,448,410.922v-10.667V101.589V90.922c0-5.882,4.785-10.667,10.667-10.667    s10.667,4.785,10.667,10.667V410.922z" /> </g> </g> </svg>,
                }
            ]
        },
        {
            id: 4,
            title: "Информация",
            name: [
                {
                    id: 1,
                    title: t('support'),
                    url: `/${locale}/dashboard/support`,
                    svg: <svg width="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-help"><path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" className="dark:fill-slate-300 fill-slate-600"></path><circle cx="12" cy="18" r="1" className="dark:fill-slate-300 fill-slate-600"></circle><path fillRule="evenodd" clipRule="evenodd" d="M12 8C11.1307 8 10.3886 8.5551 10.1135 9.33325C9.92948 9.85396 9.35815 10.1269 8.83744 9.94284C8.31672 9.75879 8.0438 9.18747 8.22784 8.66675C8.77648 7.11451 10.2568 6 12 6C14.2091 6 16 7.79086 16 10C16 11.8638 14.7252 13.4299 13 13.874V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13C11 12.4477 11.4477 12 12 12C13.1045 12 14 11.1046 14 10C14 8.89543 13.1045 8 12 8Z" className="dark:fill-slate-300 fill-slate-600"></path></svg>
                },
                {
                    id: 2,
                    title: t('news'),
                    url: `/${locale}/dashboard/news`,
                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none"><path d="M3 4V18C3 19.1046 3.89543 20 5 20H17H19C20.1046 20 21 19.1046 21 18V8H17" className="dark:stroke-slate-300 stroke-slate-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 4H17V18C17 19.1046 17.8954 20 19 20V20" className="dark:stroke-slate-300 stroke-slate-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13 8L7 8" className="dark:stroke-slate-300 stroke-slate-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13 12L9 12" className="dark:stroke-slate-300 stroke-slate-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                }

            ]
        },
    ]
    const Create_relese = async () => {
        const response = await fetch('/api/releases/create_release', { method: 'POST' })
        const data = await response.json()

        if (data.message == "success") {
            router.push('/dashboard/edit/' + data.id_album);
            router.refresh();
        }
        if (data.message == "not fill") {
            router.push('/dashboard/profile/license');
            router.refresh();
        }
        if (data.message == "not subscribe") {
            router.push('/dashboard/subscribe');
            router.refresh();
        }
    }
    let [admin, setAdmin] = useState<Admin | null>(null);
    type Admin = {
        admin: boolean;
    };
    const [TypeSubscribe, setTypeSubscribe] = useState(0)
    const check_subscribe = async () => {
        const response = await fetch('/api/user/check_subscribe', { method: 'GET' })
        const data = await response.json()
        setTypeSubscribe(data.type)
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getData();
                setAdmin(data);
            } catch (error) {
                console.error(error);
            }
        }
        check_subscribe()
        fetchData();
    }, []);
    return (
        <div className="flex w-full lg:py-1 py-3 px-6 lg:relative fixed top-0 z-30  dark:bg-[#141518] bg-white border-b border-slate-300 dark:border-zinc-800 items-center">
            <div className="flex w-full lg:w-fit items-center justify-between lg:mr-4">
                <div className="flex items-center">
                    <NavLink href="/" className="w-40 lg:w-full flex items-center">
                        <Logo />
                    </NavLink>
                </div>
                <div className="flex items-center lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <svg width="2em" viewBox="0 0 24 24" className="ill-dark dark:fill-[#c3bdcf]" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="justify-between lg:flex invisible lg:visible hidden w-full">
                <div className="flex items-center">
                    {TypeSubscribe === 3 ? (
                        <div className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-200/50 dark:bg-indigo-200 px-2 py-1 ">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1.5em" height="1.5em" viewBox="0 0 226.777 226.777" enableBackground="new 0 0 226.777 226.777">
                                    <path className="fill-indigo-600" d="M113.388,0C50.765,0,0,50.767,0,113.392c0,62.618,50.765,113.385,113.389,113.385  c62.626,0,113.389-50.768,113.389-113.385C226.777,50.767,176.014,0,113.388,0z M159.202,67.375  c-0.102,0.892-0.248,1.868-0.448,2.947c-0.2,1.069-0.452,2.152-0.754,3.255c-0.298,1.102-0.666,2.112-1.099,3.035  c-0.434,0.921-0.916,1.682-1.452,2.275c-0.534,0.594-1.097,0.888-1.696,0.888c-0.937,0-2.104-0.368-3.502-1.109  c-1.401-0.745-3.118-1.549-5.151-2.411c-2.035-0.858-4.418-1.667-7.148-2.413c-2.738-0.74-5.836-1.112-9.306-1.112  c-3.6,0-6.649,0.445-9.149,1.338c-2.502,0.892-4.553,2.068-6.152,3.53c-1.602,1.451-2.787,3.095-3.55,4.903  c-0.769,1.819-1.149,3.648-1.149,5.487c0,2.142,0.599,4.031,1.796,5.673c1.202,1.633,2.803,3.152,4.805,4.55  c1.999,1.403,4.282,2.756,6.849,4.06c2.568,1.31,5.168,2.678,7.807,4.104c2.632,1.427,5.229,2.991,7.795,4.682  c2.57,1.697,4.854,3.668,6.855,5.899c1.998,2.227,3.601,4.785,4.801,7.674c1.198,2.883,1.799,6.197,1.799,9.948  c0,5.595-1.267,10.786-3.8,15.572c-2.536,4.797-6.118,8.959-10.753,12.498c-4.634,3.536-10.237,6.326-16.801,8.34  c-1.836,0.564-3.744,1.036-5.689,1.442l-1.028,14.367c-0.162,2.889-2.515,5.128-5.355,5.207c-0.155,0.004-0.313,0.004-0.471-0.005  c-3.044-0.172-5.374-2.785-5.199-5.825l0.878-12.308c-1.64,0.094-3.291,0.162-4.993,0.162c-1.324,0-2.554-0.084-3.815-0.142  l-0.924,12.91c-0.162,2.889-2.514,5.128-5.354,5.207c-0.156,0.004-0.314,0.004-0.47-0.005c-3.046-0.172-5.375-2.785-5.201-5.825  l0.974-13.642c-2.52-0.509-4.891-1.067-6.966-1.721c-2.832-0.893-5.217-1.83-7.151-2.809c-1.934-0.981-3.367-1.922-4.299-2.81  c-0.936-0.894-1.401-2.231-1.401-4.021c0-0.476,0.068-1.187,0.201-2.143c0.132-0.951,0.315-1.98,0.548-3.074  c0.236-1.099,0.516-2.235,0.851-3.394c0.331-1.156,0.732-2.217,1.202-3.167c0.463-0.951,0.981-1.726,1.549-2.319  c0.566-0.593,1.183-0.896,1.852-0.896c1.131,0,2.48,0.461,4.05,1.387c1.563,0.922,3.513,1.932,5.848,3.03  c2.333,1.103,5.1,2.128,8.303,3.078c3.199,0.953,7.036,1.433,11.501,1.433c3.934,0,7.387-0.446,10.354-1.338  c2.962-0.897,5.449-2.113,7.45-3.659c2.001-1.548,3.519-3.352,4.549-5.402c1.036-2.054,1.555-4.3,1.555-6.738  c0-2.199-0.602-4.132-1.804-5.799c-1.201-1.667-2.786-3.203-4.752-4.601c-1.966-1.396-4.199-2.725-6.698-3.965  c-2.502-1.251-5.055-2.596-7.649-4.022c-2.604-1.427-5.154-2.975-7.652-4.638c-2.502-1.666-4.737-3.618-6.703-5.849  c-1.966-2.226-3.553-4.8-4.75-7.723c-1.199-2.912-1.799-6.305-1.799-10.168c0-5.355,1.201-10.298,3.598-14.819  c2.402-4.521,5.736-8.399,10.002-11.646c3.361-2.553,7.257-4.647,11.656-6.319l1.222-17.092c0.172-3.05,2.804-5.378,5.825-5.202  c3.046,0.17,5.375,2.784,5.202,5.824l-0.964,13.465c2.841-0.472,5.796-0.766,8.872-0.883l0.94-13.204  c0.177-3.05,2.806-5.378,5.827-5.202c3.046,0.17,5.376,2.784,5.201,5.824l-0.928,12.985c0.514,0.059,1.051,0.092,1.555,0.166  c3.003,0.45,5.738,1.01,8.202,1.697c2.466,0.685,4.567,1.441,6.301,2.274c1.736,0.834,2.934,1.536,3.601,2.1  c0.667,0.562,1.151,1.157,1.451,1.778c0.3,0.628,0.451,1.418,0.451,2.369C159.353,65.801,159.3,66.482,159.202,67.375z" />
                                </svg>
                            </div>
                            <div className="flex text-indigo-600 text-sm font-medium">{subs('subscribe_3')}</div>
                        </div>
                    ) : null}
                    {TypeSubscribe === 2 ? (
                        <div className="inline-flex items-center gap-x-2 rounded-xl bg-orange-200 dark:bg-orange-200 px-2 py-1 ">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                    <path className="stroke-orange-600" d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <div className="flex text-orange-600 text-sm font-medium">{subs('subscribe_2')}</div>
                        </div>
                    ) : null}
                    {TypeSubscribe === 1 ? (
                        <div className="inline-flex items-center gap-x-2 rounded-xl bg-pink-200/70 dark:bg-pink-200 px-2 py-1 ">
                            <div className="flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 28 28" fill="none">
                                    <path d="M20.75 3C21.0557 3 21.3421 3.13962 21.5303 3.3746L21.6048 3.48102L25.8548 10.481C26.0556 10.8118 26.0459 11.2249 25.8395 11.5435L25.7634 11.6459L14.7634 24.6459C14.3906 25.0865 13.7317 25.1159 13.3207 24.7341L13.2366 24.6459L2.23662 11.6459C1.98663 11.3505 1.93182 10.941 2.08605 10.5941L2.14522 10.481L6.39522 3.48102C6.55388 3.21969 6.82182 3.04741 7.1204 3.00842L7.25001 3H20.75ZM17.515 12H10.484L13.999 20.672L17.515 12ZM22.844 12H19.673L16.756 19.195L22.844 12ZM8.326 12H5.155L11.242 19.193L8.326 12ZM9.674 5H7.81101L4.775 10H8.245L9.674 5ZM16.246 5H11.753L10.324 10H17.675L16.246 5ZM20.188 5H18.325L19.754 10H23.224L20.188 5Z" className="dark:fill-pink-500/70 fill-pink-500/80" />
                                </svg>
                            </div>
                            <div className="flex text-pink-500 text-sm font-medium">{subs('subscribe_1')}</div>
                        </div>
                    ) : null}
                </div>
                <div className="gap-x-4 items-center flex">
                    <button onClick={Create_relese} className="flex items-center gap-x-2 bg-[#5351FF] py-2 px-3 rounded-lg invisible lg:visible">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12H20M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="text-sm font-semibold text-white">{t('upload')}</span>
                    </button>
                    <BalanceUser />
                    <div className='rounded-3xl flex border border-slate-300 dark:border-zinc-800 lg:mx-0 items-center scroll-smooth px-2 justify-between'>
                        <div className="items-center flex"> <DarkModeToggle /></div>
                        <div ><LocaleSwitcher /></div>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <DropdownUser />
                    </div>
                </div>
            </div>

            <Dialog as="div" className="lg:hidden transition" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 min-w-full overflow-y-auto bg-white dark:bg-zinc-900 px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between ">
                        <a href="/" className="-m-1.5 p-1.5">
                            <Logo />
                        </a>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#c3bdcf" />
                            </svg>
                        </button>

                    </div>
                    <div className="mt-10 justify-between flex w-full">

                        <DropdownUser />
                        <BalanceUser />
                    </div>
                    <div className="mt-6 flow-root">
                        <button onClick={Create_relese} className="inline-flex rounded-md items-center px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12H20M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="text-sm font-semibold text-white">{t('upload')}</span>
                        </button>
                        <div className="mt-5 divide-y divide-gray-500/10">
                            <Links />
                        </div>
                    </div>
                    <div>
                        <div className='w-full rounded-3xl ring-1 flex ring-gray-200 lg:mx-0 items-center justify-between scroll-smooth mt-5 px-4'>
                            <div className='flex'> <DarkModeToggle /></div>
                            <div className='flex'><LocaleSwitcher /></div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}