"use client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import AlertAll from "../Alert/page"
import { Tab } from "@headlessui/react"

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function SubscribeDash() {
    const t = useTranslations('subscribe')
    const [subscriptions] = useState({
        month: [
            {
                id: 1,
                title: t('subscribe_start'),
                discript: t('subscribe_start_discript'),
                price: "329",
                type: "month_start",
                time: "3_month",
                svg: <svg xmlns="http://www.w3.org/2000/svg" className="fill-indigo-600" width="2em" height="2em" viewBox="0 0 96 96"> <title /> <g> <path d="M84,36a6,6,0,0,0-12,0,24,24,0,0,1-48,0,6,6,0,0,0-12,0A35.9772,35.9772,0,0,0,42,71.3936V84H30a6,6,0,0,0,0,12H66a6,6,0,0,0,0-12H54V71.3936A35.9772,35.9772,0,0,0,84,36Z" /> <path d="M48,48A12.0157,12.0157,0,0,0,60,36V12a12,12,0,0,0-24,0V36A12.0157,12.0157,0,0,0,48,48Z" /> </g> </svg>,
                user: "263",
                color: "block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
                name: t('buy'),
                advantages: [
                    {
                        id: 1,
                        name: t('subscribe_start_prem_1')
                    },
                    {
                        id: 2,
                        name: t('subscribe_start_prem_2')
                    },
                    {
                        id: 3,
                        name: t('subscribe_start_prem_3')
                    },
                    {
                        id: 4,
                        name: t('subscribe_start_prem_5')
                    },
                    {
                        id: 5,
                        name: t('subscribe_premium_prem_5')
                    }
                ],
            },
            {
                id: 2,
                title: t('subscribe_premium'),
                discript: t('subscribe_premium_discript'),
                svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none"><path d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                price: "999",
                user: "329",
                time: "3_month",
                type: "month_premium",
                color: "block w-full rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                name: t('buy'),
                advantages: [
                    {
                        id: 1,
                        name: t('subscribe_premium_prem_1')
                    },
                    {
                        id: 2,
                        name: t('subscribe_premium_prem_2')
                    },
                    {
                        id: 3,
                        name: t('subscribe_premium_prem_3')
                    },
                    {
                        id: 4,
                        name: t('subscribe_premium_prem_4')
                    },
                    {
                        id: 5,
                        name: t('subscribe_premium_prem_7')
                    }
                ],
            }
        ],
        year: [
            {
                id: 1,
                title: t('subscribe_start'),
                discript: t('subscribe_start_discript'),
                price: "2999",
                svg: <svg xmlns="http://www.w3.org/2000/svg" className="fill-indigo-600" width="2em" height="2em" viewBox="0 0 96 96"> <title /> <g> <path d="M84,36a6,6,0,0,0-12,0,24,24,0,0,1-48,0,6,6,0,0,0-12,0A35.9772,35.9772,0,0,0,42,71.3936V84H30a6,6,0,0,0,0,12H66a6,6,0,0,0,0-12H54V71.3936A35.9772,35.9772,0,0,0,84,36Z" /> <path d="M48,48A12.0157,12.0157,0,0,0,60,36V12a12,12,0,0,0-24,0V36A12.0157,12.0157,0,0,0,48,48Z" /> </g> </svg>,
                user: "657",
                time: "years",
                type: "year_start",
                color: "block w-full rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
                name: t('buy'),
                advantages: [
                    {
                        id: 1,
                        name: t('subscribe_start_prem_1')
                    },
                    {
                        id: 2,
                        name: t('subscribe_start_prem_2')
                    },
                    {
                        id: 3,
                        name: t('subscribe_start_prem_3')
                    },
                    {
                        id: 4,
                        name: t('subscribe_start_prem_5')
                    },
                    {
                        id: 5,
                        name: t('subscribe_premium_prem_5')
                    }
                ],
            },
            {
                id: 2,
                title: t('subscribe_premium'),
                discript: t('subscribe_premium_discript'),
                svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none"><path d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                price: "6499",
                user: "219",
                time: "years",
                type: "year_premium",
                color: "block w-full rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                name: t('buy'),
                advantages: [
                    {
                        id: 1,
                        name: t('subscribe_premium_prem_1')
                    },
                    {
                        id: 2,
                        name: t('subscribe_premium_prem_2')
                    },
                    {
                        id: 3,
                        name: t('subscribe_premium_prem_3')
                    },
                    {
                        id: 4,
                        name: t('subscribe_premium_prem_4')
                    },
                    {
                        id: 5,
                        name: t('subscribe_premium_prem_7')
                    }
                ],
            }
        ]
    })
    const home = useTranslations('home')
    return (
        <div className='w-11/12 lg:w-11/12 2xl:w-10/12 justify-center mx-auto py-20' data-aos="fade-up" data-aos-delay="100">
            <h1 className="font-bold tracking-tight text-white-900 text-3xl lg:text-4xl  text-center dark:text-slate-200">
                {home('our_services')}
            </h1>
            <h1 className="tracking-tight text-slate-400 sm:text-1xl text-center py-3 dark:text-zinc-400">
                {home('our_services_detail')}
            </h1>
            <div className='flex flex-col w-full justify-center items-center gap-y-0 '>
                <Tab.Group>
                    <Tab.List className="flex w-fit  whitespace-nowrap bg-slate-200 dark:bg-zinc-800 p-1 rounded-lg select-none gap-x-1 font-medium overflow-auto mt-4 justify-center">
                        {Object.keys(subscriptions).map((category) => (
                            <Tab key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'inline-block p-2 px-3 rounded text-sm text-slate-600 cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-150 break-keep whitespace-nowrap',

                                        selected
                                            ? 'text-sm font-medium text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-700'
                                            : 'text-sm font-medium text-slate-600 dark:text-zinc-400 '
                                    )
                                }>
                                {t(category)}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels>
                        {Object.values(subscriptions).map((posts, index) => (
                            <Tab.Panel key={index}>
                                <div className="flex gap-4 lg:flex-row flex-col justify-center items-center w-full mt-4">
                                    {posts.map((subscription) => (
                                        <div className="flex flex-col p-8 w-full text-left relative h-full gap-y-8 rounded-3xl border border-slate-300 dark:border-zinc-800  bg-white dark:bg-zinc-900 shadow-sm max-w-xl" key={subscription.id}>
                                            <div className='flex flex-col gap-y-2 '>
                                                <div className='flex w-full justify-between'>
                                                    {subscription.svg}
                                                    <div className="flex select-none items-center gap-x-2 rounded-full border-zinc-700 bg-green-600/10 p-1 px-3">
                                                        <div className='flex h-1 w-1 rounded-full bg-green-600'></div>
                                                        <div className='text-gray-800 dark:text-gray-200 text-base font-semibold'>
                                                            {subscription.user}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-2xl leading-8 font-bold text-zinc-800 dark:text-white">
                                                    {subscription.title}
                                                </div>
                                                <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                                    {subscription.discript}
                                                </div>
                                                <div className="mt-8 h-full flex items-baseline text-left gap-x-2">
                                                    <span className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-slate-200">₽{subscription.price}</span>
                                                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">/ {t(subscription.time)}</span>
                                                </div>
                                            </div>

                                            <div className='flex w-full flex-col gap-y-2'>
                                                {subscription.advantages.map(advantage => (
                                                    <div className='flex gap-x-2 items-center' key={advantage.id}>
                                                        <div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em" aria-hidden="true" className="fill-indigo-600">
                                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                                            </svg>
                                                        </div>
                                                        <div className='text-md text-fray-950 dark:text-slate-200' key={advantage.id}>{advantage.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='mt-auto'>
                                                <a href="/dashboard/subscribe" className={subscription.color}>{subscription.name}</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}
