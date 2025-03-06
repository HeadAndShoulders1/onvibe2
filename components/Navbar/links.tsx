"use client"
import NavLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import AdminBar from "./adminlink";
async function getData() {
    const res = await fetch(`/api/user/isAdmin`);

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default function Links() {
    const t = useTranslations('dashboard_link')
    const [subscribe, setTypeSubscribe] = useState(true)
    const check_subscribe = async () => {
        const response = await fetch('/api/user/check_subscribe', { method: 'GET' })
        const data = await response.json()
        if (data.type) {
            setTypeSubscribe(true)
        } else {
            setTypeSubscribe(false)
        }
    }
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
            title: t('finance'),
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
                ,
                {
                    id: 3,
                    title: "Промо-коды",
                    url: `/${locale}/dashboard/subscribe`,
                    svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tickets"><path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8"/><path d="M6 10V8"/><path d="M6 14v1"/><path d="M6 19v2"/><rect x="2" y="8" width="20" height="13" rx="2"/></svg>
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
    let [admin, setAdmin] = useState<Admin | null>(null);
    type Admin = {
        admin: boolean;
    };
    useEffect(() => {
        const fetchData = async () => {
            await check_subscribe();  // Сначала вызываем проверку подписки
            try {
                const data = await getData();  // Получаем данные о администраторе
                setAdmin(data);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();  // Вызов асинхронной функции внутри useEffect
    }, []);
    return (
        <div className="flex flex-col gap-y-5 w-full select-none ">
            {subscribe ? null : (
                <div className="flex">
                    <NavLink href={`/${locale}/dashboard/subscribe`} className="flex w-full border border-slate-300 dark:border-zinc-800 shadow-md p-4 rounded-xl items-center dark:hover:bg-zinc-800 hover:bg-slate-200 transition">
                        <div className="w-full flex gap-x-3 items-center lg:justify-start justify-center">
                            <div className=" flex items-center">
                                <svg className="animate-pulse blur-xl hidden lg:absolute " xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 18 18">
                                    <path className="fill-pink-600" d="M17.85 7.352l-4.05 4.16.957 5.87a.517.517 0 0 1-.22.518.5.5 0 0 1-.308.1.472.472 0 0 1-.25-.07L9 15.176 4.017 17.93a.53.53 0 0 1-.777-.55l.96-5.867-4.05-4.16a.5.5 0 0 1-.12-.53.517.517 0 0 1 .42-.36l5.57-.857 2.5-5.33a.552.552 0 0 1 .957 0l2.5 5.33 5.573.858a.517.517 0 0 1 .418.36.5.5 0 0 1-.12.528z" />
                                </svg>
                                <svg className="" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 18 18">
                                    <path className="fill-pink-600" d="M17.85 7.352l-4.05 4.16.957 5.87a.517.517 0 0 1-.22.518.5.5 0 0 1-.308.1.472.472 0 0 1-.25-.07L9 15.176 4.017 17.93a.53.53 0 0 1-.777-.55l.96-5.867-4.05-4.16a.5.5 0 0 1-.12-.53.517.517 0 0 1 .42-.36l5.57-.857 2.5-5.33a.552.552 0 0 1 .957 0l2.5 5.33 5.573.858a.517.517 0 0 1 .418.36.5.5 0 0 1-.12.528z" />
                                </svg>
                            </div>
                            <span className="text-sm dark:text-slate-200 text-zinc-800 font-medium">{t('buy_subscribe')}</span>
                        </div>
                    </NavLink>
                </div>
            )}
            {links.map((link) => (
                <div key={link.id}>
                    <span className="pl-4 text-sm font-medium text-slate-900 dark:text-zinc-400 mb-5 mt-5" key={link.id}>{link.title}</span>
                    <div className="grid gap-y-2">
                        {link.name.map((item) => (
                            <NavLink href={item.url} key={item.id}>
                                <div className="flex w-full justify-between text-slate-900 dark:text-slate-400 hover:dark:text-slate-100 hover:text-brand-600 font-medium py-3 px-4 transition-all duration-75 hover:bg-gray-200 dark:hover:bg-zinc-800 h-full p-2 rounded-md hover" key={item.id}>
                                    <div className="flex gap-x-3 items-center ">
                                        <div className="flex">
                                            {item.svg}
                                        </div>
                                        <div className="flex">
                                            <span className="text-sm">{item.title}</span>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                </div>
            ))}
            {admin?.admin}
            {admin?.admin === true ? <AdminBar /> : null}
        </div>
    )
}