'use client'
import { useTranslations } from "next-intl"
import ReleaseCreate from "./release"
import { Listbox, Transition } from "@headlessui/react"
import React, { Fragment, useEffect, useState } from "react"
import CheckIcon from "@heroicons/react/20/solid/CheckIcon"
import ChartPlatform from "./payments"
import ChartSubscibe from "./subscribe"

export default function Analycis() {
    const t = useTranslations('statistics')
    const dataRelease = [
        {
            name: '28.08.2025',
            uv: 24
        },
        {
            name: '28.08.2026',
            uv: 24
        },
    ]
    const genre = [
        { "name": "1", "text": t('week') },
        { "name": "2", "text": t('month') },
        { "name": "3", "text": t('3_month') },
        { "name": "4", "text": t('6_month') },
    ]
    const [type_date, setFilterStatus] = useState(genre[0].name);
    const [filterStatusSee, setfilterStatusSee] = useState(genre[0].text);
    function onFilter(selectType: any) {
        setFilterStatus(selectType.name)
        setfilterStatusSee(selectType.text)
    }

    const [release_info, set_release_info] = useState<ReleaseInfo>()
    type ReleaseInfo = {
        release_all: any,
        release_accepter: any,
        release_moderate: any,
        release_error: any,
        release_edit: any,
        release_data: any
    }
    const [user_info, set_user_info] = useState<UserInfo>()
    type UserInfo = {
        user_all: any,
        user_accepter: any,
        user_moderate: any,
        user_not_fill: any,
        user_email_fail: any,
        user_data: any
    }
    const [payments, set_payments] = useState<any>()
    const [subscibe, set_subscibe] = useState<any[]>([])
    const dataPlatform = subscibe.map(item => ({ name: item.platform, uv: item.stream })).filter(item => item !== null);

    const [loading, setLoading] = useState(true)
    const Update_Info = async () => {
        const fetch_data = await fetch(`/api/admin/info`, {
            method: "POST",
            body: JSON.stringify({
                date: parseInt(type_date, 10)
            })
        })
        const data = await fetch_data.json()
        set_release_info(data.release)
        set_user_info(data.user)
        set_payments(data.payment)
        set_subscibe(data.subscribe)
        setLoading(false)
    }
    useEffect(() => { Update_Info() }, [type_date])
    return (
        <>
            <div className="flex lg:items-center justify-between lg:flex-row flex-col gap-y-4">
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
                <div className="flex lg:flex-row flex-col gap-4">
                    <div className="flex p-2 bg-[#fff] h-12 text-zinc-800 dark:text-slate-200 text-base dark:bg-zinc-900 rounded-2xl border border-slate-300 dark:border-zinc-800 w-full lg:w-fit items-center shadow-sm">
                        <Listbox onChange={onFilter}>
                            <div className="relative flex flex-col gap-y-2 w-full ">
                                <Listbox.Button className="flex lg:w-64 w-full justify-between outline-none whitespace-nowrap text-base rounded-xl text-left p-2">
                                    <span className="">{t('status')}:</span>
                                    <span className="">{filterStatusSee}</span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <Listbox.Options className="absolute z-20 mt-12 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-zinc-900 text-base shadow-lg text-left border border-slate-300 dark:border-zinc-800 sm:text-sm ">
                                        {genre.map((person, personIdx) => (
                                            <Listbox.Option
                                                key={personIdx}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover`
                                                }
                                                value={person}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                } font-semibold text-zinc-800 px-4 dark:text-slate-200`}
                                                        >
                                                            {person.text}
                                                        </span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                </div>
            </div>
            <div className="grid  lg:grid-cols-2 grid-cols-1 mt-4 gap-4">
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4">
                        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">{t('release')}</span>
                        {loading ? null : (
                            <>
                                <ReleaseCreate data={release_info?.release_data} />
                                <div className="flex flex-col gap-y-0">
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('all')}: {release_info?.release_all}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('release_release_accept')}: {release_info?.release_accepter}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('release_moderate')}: {release_info?.release_moderate}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('release_error')}: {release_info?.release_error}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('release_edit')}: {release_info?.release_edit}</span>
                                </div>
                            </>
                        )}
                    </div>

                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4">
                        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">{t('user')}</span>
                        {loading ? null : (
                            <>
                                <ReleaseCreate data={user_info?.user_data} />
                                <div className="flex flex-col gap-y-0">
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('all')}: {user_info?.user_all}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('license_accept')}: {user_info?.user_accepter}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('license_moderate')}: {user_info?.user_moderate}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('license_not_fill')}: {user_info?.user_not_fill}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('email_fail')}: {user_info?.user_email_fail}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4">

                        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">Платежи</span>
                        {loading ? null : (
                            <>
                                <ChartPlatform data={payments?.payment_data} />
                                <div className="flex flex-col gap-y-0">
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('all')}: {payments?.all_amount}</span>
                                    <span className="text-zinc-800 dark:text-zinc-300 text-sm">{t('all')} за данный промежуток: {payments?.amount_in_period}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                    <div className="flex flex-col gap-y-4">

                        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">Подписки</span>
                        {loading ? null : (
                            <>
                                <ChartSubscibe data={dataPlatform}/>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}