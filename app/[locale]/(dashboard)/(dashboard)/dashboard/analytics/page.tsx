"use client"
import { useTranslations } from "next-intl"
import ChartListens from "./Chart";
import { Fragment, useEffect, useState } from "react";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import SpinnerLoading from "@/components/Spinner/page";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";
import ChartPlatform from "./ChartPlatform";

export default function Analytics() {
    const t = useTranslations('analytics')
    type Streams = {
        id: number;
        stream: number;
        date: string;
        platform: string;
    }
    const [releases, setReleases] = useState<Release[]>([])
    type Release = {
        id: string;
        cover: string,
        title: string;
        artist: [];
        upc: string;
        streams: string;
    }
    const [streams, setStreams] = useState<Streams[]>([])
    const [streamsPlatform, setStreamsPlatform] = useState<Streams[]>([])
    const [upc_date, setReleaseStatus] = useState("");
    const [filterReleaseSee, setfilterReleaseSee] = useState(t('all'));
    function onFilterRelease(selectType: any) {
        if (selectType.title != null) {
            setReleaseStatus(selectType.upc)
            setfilterReleaseSee(selectType.title)
        } else {
            setReleaseStatus("")
            setfilterReleaseSee(t('all'))
        }
    }

    const [loading, setLoading] = useState(false)
    const [subscribe, setSubscribe] = useState(false)
    const FetchPros = async () => {
        setLoading(true)
        const res = await fetch('/api/user/streams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type_date: parseInt(type_date),
                upc: upc_date
            }),
        });
        const data = await res.json()
        if (data.message === "subscribe_error") {
            setLoading(false)
            setSubscribe(true)
        } else {
            if (data.message === "not_found") {
                setStreams([{
                    stream: 0,
                    id: 0,
                    date: "",
                    platform: ""
                }])
                setSubscribe(false)
                setLoading(false)
            } else {
                setSubscribe(false)
                setStreams(data.analytics)
                setReleases(data.releases)
                setStreamsPlatform(data.analytics_on_platform)
                setLoading(false)
            }
        }
    }
    const dataListens = streams.map(item => ({ name: item.date, uv: item.stream })).filter(item => item !== null);

    const totalSum = streams.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.stream;
    }, 0);

    const dataPlatform = streamsPlatform.map(item => ({ name: item.platform, uv: item.stream })).filter(item => item !== null);
    const genre = [
        { "name": "1", "text": t('week') },
        { "name": "2", "text": t('month') },
        { "name": "3", "text": t('3_month') },
        { "name": "4", "text": t('6_month') },
    ]
    const [type_date, setFilterStatus] = useState(genre[0].text);
    const [filterStatusSee, setfilterStatusSee] = useState(genre[0].text);
    function onFilter(selectType: any) {
        setFilterStatus(selectType.name)
        setfilterStatusSee(selectType.text)
    }

    const md = useTranslations('metadata')
    useEffect(() => {
        FetchPros();
    }, [])
    useEffect(() => {
        FetchPros();
    }, [type_date, upc_date])
    return (
        <>
            <head>
                <title>{md('analytics')}</title>
            </head>
            <div className="flex lg:items-center justify-between lg:flex-row flex-col gap-y-4">
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
                <div className="flex lg:flex-row flex-col gap-2">
                    <div className="flex p-2 bg-[#fff] h-12 text-zinc-800 dark:text-slate-200 text-base dark:bg-zinc-900 rounded-2xl w-full lg:w-fit items-center shadow-sm">
                        <Listbox onChange={onFilterRelease}>
                            <div className="relative flex flex-col gap-y-2 w-full ">
                                <Listbox.Button className="flex lg:w-64 w-full justify-between outline-none whitespace-nowrap text-base rounded-md text-left p-2">
                                    <span className="">{t('release')}:</span>
                                    <span className="">{filterReleaseSee ? filterReleaseSee : "N/A"}</span>
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
                                    <Listbox.Options className="absolute z-20 mt-12 max-h-60 w-full overflow-auto rounded-xl  bg-white  dark:bg-zinc-900 text-base shadow-lg text-left border border-slate-300 dark:border-zinc-800  sm:text-sm ">
                                        <Listbox.Option
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 px-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover`
                                            }
                                            value={1}
                                        >
                                            <span className="text-sm dark:text-slate-200 text-zinc-800 font-bold">{t('all')}</span>
                                        </Listbox.Option>
                                        {releases.map((person, personIdx) => (
                                            <Listbox.Option
                                                key={personIdx}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 px-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover`
                                                }
                                                value={person}
                                            >
                                                {({ selected }) => (
                                                    <div className="flex gap-x-4 items-center">
                                                        <div className="rounded-lg min-w-10 max-w-10 max-h-10 w-full flex items-center justify-center  bg-gray-100 dark:bg-zinc-900">
                                                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${person.cover}`} className="w-10 h-10 rounded-lg" alt="cover" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm dark:text-slate-200 text-zinc-800 font-bold">{person.title ? person.title : "N/A"}</span>
                                                            <span className="text-xs dark:text-zinc-400 text-slate-2000">
                                                                {Array.isArray(person?.artist) && person?.artist.length > 0 ? (
                                                                    <>
                                                                        {person?.artist.map((items: any, index: number, array: string | any[]) => (
                                                                            <React.Fragment key={index}>
                                                                                {items}
                                                                                {index !== array.length - 1 && ', '}
                                                                            </React.Fragment>
                                                                        ))}

                                                                    </>
                                                                ) : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                    <div className="flex p-2 bg-[#fff] h-12 text-zinc-800 dark:text-slate-200 text-base dark:bg-zinc-900 rounded-2xl  w-full lg:w-fit items-center shadow-sm">
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
                                    <Listbox.Options className="absolute z-20 mt-12 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-zinc-900 text-base shadow-lg text-left  sm:text-sm ">
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
            {subscribe ? (
                <div className="flex w-full flex-col gap-y-4 items-center py-40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="7em" height="7em" viewBox="0 0 18 18">
                        <path className="fill-pink-800" d="M17.85 7.352l-4.05 4.16.957 5.87a.517.517 0 0 1-.22.518.5.5 0 0 1-.308.1.472.472 0 0 1-.25-.07L9 15.176 4.017 17.93a.53.53 0 0 1-.777-.55l.96-5.867-4.05-4.16a.5.5 0 0 1-.12-.53.517.517 0 0 1 .42-.36l5.57-.857 2.5-5.33a.552.552 0 0 1 .957 0l2.5 5.33 5.573.858a.517.517 0 0 1 .418.36.5.5 0 0 1-.12.528z" />
                    </svg>
                    <span className="text-xl dark:text-slate-200 text-zinc-800 font-bold">{t('subscribe_not_found')}</span>
                </div>
            ) : (
                <>
                    {totalSum === 0 ? (
                        <>
                            {loading ? (
                                <div className="flex items-center justify-center mt-20">
                                    <BigSpinnerLoading />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center mt-20 flex-col gap-y-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="7em" height="7em" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 11C9.55228 11 10 10.5523 10 10C10 9.44772 9.55228 9 9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11Z" className="fill-indigo-600" />
                                        <path d="M14 17C14 15.8954 13.1046 15 12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14Z" className="fill-indigo-600" />
                                        <path d="M16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44772 14.4477 9 15 9C15.5523 9 16 9.44772 16 10Z" className="fill-indigo-600" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" className="fill-indigo-600" />
                                    </svg>
                                    <span className="text-xl dark:text-slate-200 text-zinc-800 font-bold">{t('not_found')}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex lg:flex-row flex-col gap-4 mt-4">
                            <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl shadow-sm w-full">
                                <div className="flex flex-col gap-y-4">
                                    <div className="p-6 flex flex-col gap-y-8">
                                        <div className="flex gap-x-2 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                <path d="M10.0909 11.9629L19.3636 8.63087V14.1707C18.8126 13.8538 18.1574 13.67 17.4545 13.67C15.4964 13.67 13.9091 15.096 13.9091 16.855C13.9091 18.614 15.4964 20.04 17.4545 20.04C19.4126 20.04 21 18.614 21 16.855C21 16.855 21 16.8551 21 16.855L21 7.49236C21 6.37238 21 5.4331 20.9123 4.68472C20.8999 4.57895 20.8852 4.4738 20.869 4.37569C20.7845 3.86441 20.6352 3.38745 20.347 2.98917C20.2028 2.79002 20.024 2.61055 19.8012 2.45628C19.7594 2.42736 19.716 2.39932 19.6711 2.3722L19.6621 2.36679C18.8906 1.90553 18.0233 1.93852 17.1298 2.14305C16.2657 2.34086 15.1944 2.74368 13.8808 3.23763L11.5963 4.09656C10.9806 4.32806 10.4589 4.52419 10.0494 4.72734C9.61376 4.94348 9.23849 5.1984 8.95707 5.57828C8.67564 5.95817 8.55876 6.36756 8.50501 6.81203C8.4545 7.22978 8.45452 7.7378 8.45455 8.33743V16.1307C7.90347 15.8138 7.24835 15.63 6.54545 15.63C4.58735 15.63 3 17.056 3 18.815C3 20.574 4.58735 22 6.54545 22C8.50355 22 10.0909 20.574 10.0909 18.815C10.0909 18.815 10.0909 18.8151 10.0909 18.815L10.0909 11.9629Z" className="fill-emerald-500" />
                                            </svg>
                                            <span className="text-lg text-zinc-800 dark:text-slate-200 font-semibold">{t('listens')}</span>
                                        </div>
                                        {loading ? (
                                            <div className="flex gap-x-2 items-center">
                                                <SpinnerLoading />
                                                <span className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold">{t('listens_col')}</span>
                                            </div>
                                        ) : (
                                            <span className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold">{totalSum} {t('listens_col')}</span>
                                        )}
                                    </div>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <BigSpinnerLoading />
                                        </div>
                                    ) : (
                                        <>
                                            <ChartListens data={dataListens} />
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col justify-between bg-[#fff] pr-6 dark:bg-zinc-900 rounded-2xl  shadow-sm lg:w-1/3 w-full">
                                <div className="p-6 flex gap-x-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 28 28" fill="none">
                                        <path clipRule="evenodd" d="M1 20C1 18.8954 1.89543 18 3 18H6C7.10457 18 8 18.8954 8 20V25C8 26.1046 7.10457 27 6 27H3C1.89543 27 1 26.1046 1 25V20ZM6 20.4C6 20.1791 5.82091 20 5.6 20H3.4C3.17909 20 3 20.1791 3 20.4V24.6C3 24.8209 3.17909 25 3.4 25H5.6C5.82091 25 6 24.8209 6 24.6V20.4Z" className="fill-indigo-600" fillRule="evenodd" />
                                        <path clipRule="evenodd" d="M10 3C10 1.89543 10.8954 1 12 1H15C16.1046 1 17 1.89543 17 3V25C17 26.1046 16.1046 27 15 27H12C10.8954 27 10 26.1046 10 25V3ZM15 3.4C15 3.17909 14.8209 3 14.6 3L12.4 3C12.1791 3 12 3.17909 12 3.4V24.6C12 24.8209 12.1791 25 12.4 25H14.6C14.8209 25 15 24.8209 15 24.6V3.4Z" className="fill-indigo-600" fillRule="evenodd" />
                                        <path clipRule="evenodd" d="M19 11C19 9.89543 19.8954 9 21 9H24C25.1046 9 26 9.89543 26 11V25C26 26.1046 25.1046 27 24 27H21C19.8954 27 19 26.1046 19 25V11ZM24 11.4C24 11.1791 23.8209 11 23.6 11H21.4C21.1791 11 21 11.1791 21 11.4V24.6C21 24.8209 21.1791 25 21.4 25H23.6C23.8209 25 24 24.8209 24 24.6V11.4Z" className="fill-indigo-600" fillRule="evenodd" />
                                    </svg>
                                    <span className="text-xl text-zinc-800 dark:text-slate-200 font-semibold">{t('analytics_on_platform')}</span>
                                </div>
                                <ChartPlatform data={dataPlatform} />
                            </div>

                        </div>
                    )}
                </>
            )}
        </>
    )
}