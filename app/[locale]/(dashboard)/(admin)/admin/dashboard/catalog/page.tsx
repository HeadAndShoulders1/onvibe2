'use client'
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Pagination from "@/components/pagination/page"
import { redirect, useRouter } from "next/navigation";
import ErrorAll from "@/components/admin/ErrorAll";
import React from "react";
import TrackListAdmin from "./TrackListAdmin";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import StatusSee from "@/app/[locale]/(dashboard)/(dashboard)/dashboard/catalog/status";



interface ReleaseQueryParams {
    name?: string;
    status?: string;
    skip: number;
    take: number;
}

export default function Header() {
    const t = useTranslations('catalog');
    let [release_info, setReleases] = useState<Release[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const subs = useTranslations('subscribe')
    const genre = [
        { "name": "All", "text": t('all') },
        { "name": "Editing", "text": t('editing') },
        { "name": "Moderate", "text": t('moderate') },
        { "name": "Uploading", "text": t('uploading') },
        { "name": "Error", "text": t('error') },
        { "name": "Accepted", "text": t('accepted') },
        { "name": "Removal", "text": t('removal') },
        { "name": "Deleted", "text": t('deleted') },
    ]
    const [filterStatus, setFilterStatus] = useState(genre[0].text);
    const [filterStatusSee, setfilterStatusSee] = useState(genre[0].text);
    function onFilter(selectType: any) {
        setFilterStatus(selectType.name)
        setfilterStatusSee(selectType.text)
        setPage(1);
    }
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    type Release = {
        id: string;
        p_line: string;
        cover_small_path: string;
        title: string;
        version: string;
        artist: string;
        error: [];
        featartist: string;
        date_release: Date;
        genre: string;
        meta_language: string;
        type: string;
        upc: string;
        status: string;
        tracks: string;
        fio: string;
        type_subscribe: number;
        text: string;
        comment: string;
    }
    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) {
            return "N/A";
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };
    const ChangeStatusRelease = async () => {
        try {
            const res = await fetch("/api/admin/releases/change_status", {
                method: "POST",
                body: JSON.stringify({
                    release_id: parseInt(ReleaseIDnumber, 10),
                    status: statusRelease,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    redirect('/dashboard/catalog')
                } else {
                    fetchUserData()
                    closeModalStatus()
                }

            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }
    const ChangeUPCRelease = async () => {
        try {
            const res = await fetch("/api/admin/releases/change_upc", {
                method: "POST",
                body: JSON.stringify({
                    release_id: parseInt(ReleaseIDnumber, 10),
                    upc: upcRelease,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    redirect('/dashboard/catalog')
                } else {
                    fetchUserData()
                    closeModalUPC()
                }

            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }
    const [UploadStatus, setUploadStatus] = useState('not_load')
    const UploadRelease = async () => {
        setLoading(true)
        const res = await fetch("/api/admin/releases/upload_release", {
            method: "POST",
            body: JSON.stringify({
                id_release: parseInt(id_upload_release, 10),
            }),
        });
        const data = await res.json()
        if (data.message === "success") {
            setLoading(false)
            setUploadStatus('success')
        } else {
            setLoading(false)
            setUploadStatus('error')
        }
    }

    const ChangeErrorRelease = async () => {
        try {
            const res = await fetch("/api/admin/releases/change_error", {
                method: "POST",
                body: JSON.stringify({
                    release_id: parseInt(ReleaseIDnumber, 10),
                    error: errorRelease,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    redirect('/dashboard/catalog')
                } else {
                    fetchUserData()
                    closeModalError()
                }

            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }

    const fetchUserData = async () => {
        try {
            const queryParams: ReleaseQueryParams = {
                skip: (page - 1) * pageSize,
                take: pageSize,
            };

            if (searchName) {
                queryParams.name = searchName;
            }

            if (filterStatus != "All" && filterStatus != "Все") {
                queryParams.status = filterStatus;
            }
            const res = await fetch("/api/admin/releases/user_releases", {
                method: "POST",
                body: JSON.stringify(queryParams),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    redirect('/dashboard/catalog')
                } else {
                    setReleases(data.releases);
                    setTotalPages(data.totalPages);

                }

            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
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
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [filterStatus, page, pageSize])



    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    let [ReleaseIDnumber, setReleaseNumber] = useState('')
    let [isOpenUPC, setIsOpenUPC] = useState(false)
    let [upcRelease, setReleaseUPC] = useState('')
    const changeUPCRelease = (event: { target: { value: any; }; }) => {
        const inputDate = event.target.value;
        setReleaseUPC(inputDate);
    };
    function closeModalUPC() {
        setIsOpenUPC(false)
    }

    function openModalUPC(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setReleaseNumber(value)
        setIsOpenUPC(true)
    }

    let [isOpenError, setIsOpenError] = useState(false)
    let [errorRelease, setErroeRelease] = useState('')
    const changeErrorRelease = (event: { target: { value: any; }; }) => {
        const inputDate = event.target.value;
        setErroeRelease(inputDate);
    };
    function closeModalError() {
        setIsOpenError(false)
    }

    function openModalError(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setReleaseNumber(value)
        setIsOpenError(true)
    }

    let [isOpenStatus, setIsOpenStatus] = useState(false)
    let [statusReleaseSee, setStatusReleaseSee] = useState('')
    let [statusRelease, setStatusRelease] = useState('')
    function changeStatusRelease(selectType: any) {
        setStatusRelease(selectType.name)
        setStatusReleaseSee(selectType.text);
    };
    function closeModalStatus() {
        setIsOpenStatus(false)
    }

    function openModalStatus(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setReleaseNumber(value)
        setIsOpenStatus(true)
    }
    const status = [
        { "name": "Editing", "text": t('editing') },
        { "name": "Moderate", "text": t('moderate') },
        { "name": "Uploading", "text": t('uploading') },
        { "name": "Error", "text": t('error') },
        { "name": "Accepted", "text": t('accepted') },
        { "name": "Removal", "text": t('removal') },
        { "name": "Deleted", "text": t('deleted') },
    ]
    let [isOpenStatusAll, setIsOpenStatusAll] = useState(false)
    const [error_all, SetErrorAll] = useState<[]>([])
    function closeModalErrorAll() {
        setIsOpenStatusAll(false)
    }

    function openModalErrorAll(error: any) {
        setIsOpenStatusAll(true)
        SetErrorAll(error)
    }

    const [id_upload_release, setIdUpload] = useState('')
    let [isOpenUpload, setIsOpenUpload] = useState(false)
    function closeModalUpload() {
        setIsOpenUpload(false)
    }

    function openModalUpload(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setIsOpenUpload(true)
        setIdUpload(value)
        setUploadStatus('not_load')
    }


    let [isOpenAdditional, setIsOpenAdditional] = useState(false)
    function closeModalAdditional() {
        setIsOpenAdditional(false)
    }

    function openModalAdditional(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setIsOpenAdditional(true)
        setIdUpload(value)
        setUploadStatus('not_load')
    }


    const md = useTranslations('metadata')
    return (

        <>
            <head>
                <title>{md('catalog')}</title>
            </head>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('catalog_title')}</span>
            <div className="flex flex-col lg:items-center gap-4 mt-5 lg:flex-row lg:justify-between ">
                <div className="flex p-2 h-12 bg-[#fff] dark:bg-zinc-900 rounded-2xl border border-slate-300 dark:border-zinc-800 w-full items-center shadow-sm">
                    <div className="flex gap-x-2 w-full">
                        <div className="w-20 flex justify-center border-r-2 border-slate-300 dark:border-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="border-none bg-transparent outline-none w-full"
                            placeholder={t('search_placeholder')}
                            value={searchName}
                            onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                            onBlur={fetchUserData}
                        />
                    </div>
                </div>
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
                                <Listbox.Options className="absolute z-20 mt-12 max-h-60 w-full overflow-auto rounded-xl bg-white   dark:bg-zinc-900 text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
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

            {release_info ? release_info.map((item) => (
                <div className="flex flex-col bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={item.id}>
                    <div className="flex border-b border-slate-300 dark:border-zinc-800">
                        <div className="flex w-full flex-col lg:flex-row  p-4 gap-y-2">
                            <div className="flex justify-between">
                                <div className="items-center justify-center">
                                    <div className="relative h-[120px] w-[120px] items-center justify-center rounded-2xl  bg-gray-100 dark:bg-zinc-800">
                                        <a href={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover_small_path}`} className="relative flex h-full w-full items-center justify-center border-2 hover:border-indigo-500 border-transparent rounded-2xl">
                                            {item?.cover_small_path ? (
                                                <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover_small_path}`} className="h-[120px] w-[120px] rounded-2xl " alt="cover" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                                                    <path d="M7 12C7 9.23858 9.23858 7 12 7" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                                                    <path d="M17 12C17 14.7614 14.7614 17 12 17" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                                                    <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                                                </svg>
                                            )}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-x-2 p-4 lg:hidden">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="flex bg-[#fff] dark:bg-zinc-900 rounded-lg border border-slate-300 dark:border-zinc-800 w-10 h-10 justify-center items-center  text-zinc-800 dark:text-slate-200">
                                                ...
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 w-fit py-2 px-4 origin-top-right rounded-lg bg-white dark:bg-zinc-900 shadow-lg border border-slate-300 dark:border-zinc-800">
                                                <Menu.Item>
                                                    <button onClick={openModalUPC} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M4 12H20M12 4V20" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>UPC</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalError} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white" width="1.5em" height="1.5em" viewBox="0 0 1024 1024">
                                                            <path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('error')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalStatus} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6.87988 18.1501V16.0801" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M12 18.15V14.01" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M17.1201 18.1499V11.9299" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M17.1199 5.8501L16.6599 6.3901C14.1099 9.3701 10.6899 11.4801 6.87988 12.4301" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M14.1899 5.8501H17.1199V8.7701" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('status')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => openModalErrorAll(item.error)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <g id="Map" transform="translate(-288.000000, -48.000000)" fillRule="nonzero">
                                                                    <g id="route_fill" transform="translate(288.000000, 48.000000)">
                                                                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fillRule="nonzero" />
                                                                        <path d="M18,16 C19.6569,16 21,17.3431 21,19 C21,20.6569 19.6569,22 18,22 C16.3431,22 15,20.6569 15,19 C15,17.3431 16.3431,16 18,16 Z M15.5,4 C17.9853,4 20,6.01472 20,8.5 C20,10.9853 17.9853,13 15.5,13 L8.5,13 C7.11929,13 6,14.1193 6,15.5 C6,16.8807 7.11929,18 8.5,18 L13,18 C13.5523,18 14,18.4477 14,19 C14,19.5523 13.5523,20 13,20 L8.5,20 C6.01472,20 4,17.9853 4,15.5 C4,13.0147 6.01472,11 8.5,11 L15.5,11 C16.8807,11 18,9.88071 18,8.5 C18,7.11929 16.8807,6 15.5,6 L11,6 C10.4477,6 10,5.55228 10,5 C10,4.44772 10.4477,4 11,4 L15.5,4 Z M6,2 C7.65685,2 9,3.34315 9,5 C9,6.65685 7.65685,8 6,8 C4.34315,8 3,6.65685 3,5 C3,3.34315 4.34315,2 6,2 Z" className="fill-black dark:fill-white" />
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('status_error')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalUpload} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('uploading')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalAdditional} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>Доп. информация</div>
                                                    </button>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                            </div>

                            <div className="flex w-full justify-between lg:px-4 items-center">
                                <div className="flex flex-col h-full w-full gap-y-6">
                                    <div className="grid gap-y">
                                        <div className="text-left w-full items-center">
                                            <span className="text-xl font-bold text-zinc-800 dark:text-slate-200">{item?.title ? item?.title : "N/A"}{' '}</span>
                                            {item?.version ? (
                                                <span className="text-xl font-bold text-zinc-500 dark:text-slate-400">({item?.version}){' '}</span>
                                            ) : null}
                                            {item.type_subscribe === 3 ? (
                                                <div className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-200/50 dark:bg-indigo-200 p-1 ">
                                                    <div className="flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1em" height="1em" viewBox="0 0 226.777 226.777" enableBackground="new 0 0 226.777 226.777">
                                                            <path className="fill-indigo-600" d="M113.388,0C50.765,0,0,50.767,0,113.392c0,62.618,50.765,113.385,113.389,113.385  c62.626,0,113.389-50.768,113.389-113.385C226.777,50.767,176.014,0,113.388,0z M159.202,67.375  c-0.102,0.892-0.248,1.868-0.448,2.947c-0.2,1.069-0.452,2.152-0.754,3.255c-0.298,1.102-0.666,2.112-1.099,3.035  c-0.434,0.921-0.916,1.682-1.452,2.275c-0.534,0.594-1.097,0.888-1.696,0.888c-0.937,0-2.104-0.368-3.502-1.109  c-1.401-0.745-3.118-1.549-5.151-2.411c-2.035-0.858-4.418-1.667-7.148-2.413c-2.738-0.74-5.836-1.112-9.306-1.112  c-3.6,0-6.649,0.445-9.149,1.338c-2.502,0.892-4.553,2.068-6.152,3.53c-1.602,1.451-2.787,3.095-3.55,4.903  c-0.769,1.819-1.149,3.648-1.149,5.487c0,2.142,0.599,4.031,1.796,5.673c1.202,1.633,2.803,3.152,4.805,4.55  c1.999,1.403,4.282,2.756,6.849,4.06c2.568,1.31,5.168,2.678,7.807,4.104c2.632,1.427,5.229,2.991,7.795,4.682  c2.57,1.697,4.854,3.668,6.855,5.899c1.998,2.227,3.601,4.785,4.801,7.674c1.198,2.883,1.799,6.197,1.799,9.948  c0,5.595-1.267,10.786-3.8,15.572c-2.536,4.797-6.118,8.959-10.753,12.498c-4.634,3.536-10.237,6.326-16.801,8.34  c-1.836,0.564-3.744,1.036-5.689,1.442l-1.028,14.367c-0.162,2.889-2.515,5.128-5.355,5.207c-0.155,0.004-0.313,0.004-0.471-0.005  c-3.044-0.172-5.374-2.785-5.199-5.825l0.878-12.308c-1.64,0.094-3.291,0.162-4.993,0.162c-1.324,0-2.554-0.084-3.815-0.142  l-0.924,12.91c-0.162,2.889-2.514,5.128-5.354,5.207c-0.156,0.004-0.314,0.004-0.47-0.005c-3.046-0.172-5.375-2.785-5.201-5.825  l0.974-13.642c-2.52-0.509-4.891-1.067-6.966-1.721c-2.832-0.893-5.217-1.83-7.151-2.809c-1.934-0.981-3.367-1.922-4.299-2.81  c-0.936-0.894-1.401-2.231-1.401-4.021c0-0.476,0.068-1.187,0.201-2.143c0.132-0.951,0.315-1.98,0.548-3.074  c0.236-1.099,0.516-2.235,0.851-3.394c0.331-1.156,0.732-2.217,1.202-3.167c0.463-0.951,0.981-1.726,1.549-2.319  c0.566-0.593,1.183-0.896,1.852-0.896c1.131,0,2.48,0.461,4.05,1.387c1.563,0.922,3.513,1.932,5.848,3.03  c2.333,1.103,5.1,2.128,8.303,3.078c3.199,0.953,7.036,1.433,11.501,1.433c3.934,0,7.387-0.446,10.354-1.338  c2.962-0.897,5.449-2.113,7.45-3.659c2.001-1.548,3.519-3.352,4.549-5.402c1.036-2.054,1.555-4.3,1.555-6.738  c0-2.199-0.602-4.132-1.804-5.799c-1.201-1.667-2.786-3.203-4.752-4.601c-1.966-1.396-4.199-2.725-6.698-3.965  c-2.502-1.251-5.055-2.596-7.649-4.022c-2.604-1.427-5.154-2.975-7.652-4.638c-2.502-1.666-4.737-3.618-6.703-5.849  c-1.966-2.226-3.553-4.8-4.75-7.723c-1.199-2.912-1.799-6.305-1.799-10.168c0-5.355,1.201-10.298,3.598-14.819  c2.402-4.521,5.736-8.399,10.002-11.646c3.361-2.553,7.257-4.647,11.656-6.319l1.222-17.092c0.172-3.05,2.804-5.378,5.825-5.202  c3.046,0.17,5.375,2.784,5.202,5.824l-0.964,13.465c2.841-0.472,5.796-0.766,8.872-0.883l0.94-13.204  c0.177-3.05,2.806-5.378,5.827-5.202c3.046,0.17,5.376,2.784,5.201,5.824l-0.928,12.985c0.514,0.059,1.051,0.092,1.555,0.166  c3.003,0.45,5.738,1.01,8.202,1.697c2.466,0.685,4.567,1.441,6.301,2.274c1.736,0.834,2.934,1.536,3.601,2.1  c0.667,0.562,1.151,1.157,1.451,1.778c0.3,0.628,0.451,1.418,0.451,2.369C159.353,65.801,159.3,66.482,159.202,67.375z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {item.type_subscribe === 2 ? (
                                                <div className="inline-flex items-center gap-x-2 rounded-xl bg-orange-200/50 dark:bg-orange-200 p-1">
                                                    <div className="flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                            <path className="stroke-orange-600" d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {item.type_subscribe === 1 ? (
                                                <div className="inline-flex items-center gap-x-2 rounded-md bg-pink-200/70 dark:bg-pink-200 p-1">
                                                    <div className="flex">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 28 28" fill="none">
                                                            <path d="M20.75 3C21.0557 3 21.3421 3.13962 21.5303 3.3746L21.6048 3.48102L25.8548 10.481C26.0556 10.8118 26.0459 11.2249 25.8395 11.5435L25.7634 11.6459L14.7634 24.6459C14.3906 25.0865 13.7317 25.1159 13.3207 24.7341L13.2366 24.6459L2.23662 11.6459C1.98663 11.3505 1.93182 10.941 2.08605 10.5941L2.14522 10.481L6.39522 3.48102C6.55388 3.21969 6.82182 3.04741 7.1204 3.00842L7.25001 3H20.75ZM17.515 12H10.484L13.999 20.672L17.515 12ZM22.844 12H19.673L16.756 19.195L22.844 12ZM8.326 12H5.155L11.242 19.193L8.326 12ZM9.674 5H7.81101L4.775 10H8.245L9.674 5ZM16.246 5H11.753L10.324 10H17.675L16.246 5ZM20.188 5H18.325L19.754 10H23.224L20.188 5Z" className="dark:fill-pink-500/70 fill-pink-500/80" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="">
                                            <span className="text-base font-semibold  text-zinc-800 dark:text-slate-200">
                                                {Array.isArray(item?.artist) && item?.artist.length > 0 ? (
                                                    <>
                                                        {item?.artist.map((items, index, array) => (
                                                            <React.Fragment key={index}>
                                                                {items}
                                                                {index !== array.length - 1 && ', '}
                                                            </React.Fragment>
                                                        ))}

                                                    </>
                                                ) : "N/A"}
                                            </span>
                                            {Array.isArray(item?.featartist) && item?.featartist.length > 0 ? (
                                                <span className="text-base font-semibold text-gray-600 dark:text-zinc-400">
                                                    (feat.{' '}
                                                    {item?.featartist.map((items, index, array) => (
                                                        <React.Fragment key={index}>
                                                            {items}
                                                            {index !== array.length - 1 && ', '}
                                                        </React.Fragment>
                                                    ))}
                                                    )
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 w-full md:grid-cols-3 lg:flex items-center gap-12 flex-wrap">
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{t('date_release')}</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.date_release ? formatDate(new Date(item.date_release)) : "N/A"}</span>
                                        </div>
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{t('meta_language')}</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.meta_language ? item?.meta_language : "N/A"}</span>
                                        </div>
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{t('genre')}</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.genre ? item?.genre : "N/A"}</span>
                                        </div>
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('type')}</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.type ? item?.type : "N/A"}</span>
                                        </div>
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">UPC</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.upc ? item?.upc : "N/A"}</span>
                                        </div>
                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">P_line</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.p_line ? item?.p_line : "N/A"}</span>
                                        </div>

                                        <div className="grid gap-y text-left">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">ФИО</span>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.fio ? item?.fio : "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-4">
                                <div className="lg:flex gap-x-2 hidden">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <div>
                                            <Menu.Button className="flex bg-[#fff] dark:bg-zinc-900 rounded-lg border border-slate-300 dark:border-zinc-800 w-10 h-10 justify-center items-center  text-zinc-800 dark:text-slate-200">
                                                ...
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 w-fit py-2 px-4 origin-top-right rounded-lg bg-white dark:bg-zinc-900 shadow-lg border border-slate-300 dark:border-zinc-800 focus:outline-none">
                                                <Menu.Item>
                                                    <button onClick={openModalUPC} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M4 12H20M12 4V20" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>UPC</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalError} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white" width="1.5em" height="1.5em" viewBox="0 0 1024 1024">
                                                            <path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('error')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalStatus} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M6.87988 18.1501V16.0801" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M12 18.15V14.01" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M17.1201 18.1499V11.9299" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M17.1199 5.8501L16.6599 6.3901C14.1099 9.3701 10.6899 11.4801 6.87988 12.4301" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" />
                                                            <path d="M14.1899 5.8501H17.1199V8.7701" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" className="stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('status')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => openModalErrorAll(item.error)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" version="1.1">
                                                            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                                <g id="Map" transform="translate(-288.000000, -48.000000)" fillRule="nonzero">
                                                                    <g id="route_fill" transform="translate(288.000000, 48.000000)">
                                                                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fillRule="nonzero" />
                                                                        <path d="M18,16 C19.6569,16 21,17.3431 21,19 C21,20.6569 19.6569,22 18,22 C16.3431,22 15,20.6569 15,19 C15,17.3431 16.3431,16 18,16 Z M15.5,4 C17.9853,4 20,6.01472 20,8.5 C20,10.9853 17.9853,13 15.5,13 L8.5,13 C7.11929,13 6,14.1193 6,15.5 C6,16.8807 7.11929,18 8.5,18 L13,18 C13.5523,18 14,18.4477 14,19 C14,19.5523 13.5523,20 13,20 L8.5,20 C6.01472,20 4,17.9853 4,15.5 C4,13.0147 6.01472,11 8.5,11 L15.5,11 C16.8807,11 18,9.88071 18,8.5 C18,7.11929 16.8807,6 15.5,6 L11,6 C10.4477,6 10,5.55228 10,5 C10,4.44772 10.4477,4 11,4 L15.5,4 Z M6,2 C7.65685,2 9,3.34315 9,5 C9,6.65685 7.65685,8 6,8 C4.34315,8 3,6.65685 3,5 C3,3.34315 4.34315,2 6,2 Z" className="fill-black dark:fill-white" />
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('status_error')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalUpload} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                                            <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('uploading')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={openModalAdditional} value={item.id} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>Доп. информация</div>
                                                    </button>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                                <StatusSee item={item} />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col">
                        <TrackListAdmin item={item} />
                    </div>
                </div>
            )) : (
                <div className="flex flex-col items-center w-full py-20 gap-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                        <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500" />
                    </svg>
                    <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('not_found')}</span>
                </div>
            )}


            <Pagination totalPages={totalPages} page={page} handlePageChange={handlePageChange} />

            <Transition appear show={isOpenUPC} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalUPC}>
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
                                            {t('change_upc')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalUPC} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <input type="text" name="version_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('upc_release_ph')} required onChange={changeUPCRelease} value={upcRelease} />
                                        <span className="text-md text-gray-700 dark:text-gray-200">
                                            {t('change_upc_descript')}
                                        </span>
                                    </div>

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            value={ReleaseIDnumber}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={ChangeUPCRelease}
                                        >
                                            {t('accept')}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isOpenError} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalUPC}>
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
                                            {t('change_error')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalError} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <textarea className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('error_release_ph')} required onChange={changeErrorRelease} value={errorRelease} />
                                        <span className="text-md text-gray-700 dark:text-gray-200">
                                            {t('change_error_descript')}
                                        </span>
                                    </div>

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            value={ReleaseIDnumber}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={ChangeErrorRelease}
                                        >
                                            {t('accept')}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isOpenStatus} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalStatus}>
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
                                <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('change_status')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalStatus} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col  border-slate-300 dark:border-zinc-800">

                                        <Listbox onChange={changeStatusRelease} >
                                            <div className="relative flex flex-col gap-y-2 w-full h-[240px]">
                                                <Listbox.Button className="flex justify-between hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full">
                                                    <span className="">{t('status')}:</span>
                                                    <span className="">{statusReleaseSee}</span>
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
                                                    <Listbox.Options className="absolute  mt-12 max-h-60 w-full overflow-auto rounded-xl bg-white   dark:bg-zinc-900 text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                                                        {status.map((person, personIdx) => (
                                                            <Listbox.Option
                                                                key={personIdx}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover `
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

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            value={ReleaseIDnumber}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={ChangeStatusRelease}
                                        >
                                            {t('accept')}
                                        </button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isOpenStatusAll} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalErrorAll}>
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
                                            {t('error_all')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalError} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <ErrorAll error={error_all} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isOpenUpload} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalUpload}>
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
                                            {t('uploading')}
                                        </div>
                                    </div>
                                    {loading ? (
                                        <div className="p-20 w-full flex justify-center">
                                            <BigSpinnerLoading />
                                        </div>
                                    ) : (
                                        <>
                                            {UploadStatus === "error" ? (
                                                <div className="flex flex-col w-full justify-center p-6 gap-y-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-red-600 relative z-20" width="4em" height="4em" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                                    </svg>
                                                </div>
                                            ) : null}
                                            {UploadStatus === "success" ? (
                                                <div className="flex flex-col w-full justify-center p-6 gap-y-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
                                                        <path className="fill-green-500 shadow-2xl shadow-slate-400 dark:shadow-slate-200" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" />
                                                    </svg>
                                                </div>
                                            ) : null}
                                            {UploadStatus === "not_load" ? (
                                                <div className="flex flex-col w-full justify-center p-6 gap-y-6">
                                                    <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-300">{t('upload_release_decs')}</span>
                                                    <button onClick={UploadRelease} className="text-sm justify-center inline-flex rounded-md items-center  px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                                                        {t('uploading')}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isOpenAdditional} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalAdditional}>
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
                                            Информация
                                        </div>
                                    </div>
                                    {loading ? (
                                        <div className="p-20 w-full flex justify-center">
                                            <BigSpinnerLoading />
                                        </div>
                                    ) : (
                                        <>
                                        {release_info.some((item) => item?.comment || item?.text) ? (
                                            release_info.map((item, index) => (
                                            <div className="flex flex-col w-full justify-center p-6 gap-y-6" key={index}>
                                                <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-300 whitespace-pre-line">
                                                Комментарий:
                                                </span>
                                                <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-500">
                                                    {item?.comment || "N/A"}
                                                </span>
                                                <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-300">
                                                Текст:
                                                </span>
                                                <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-500 whitespace-pre-line">
                                                    {item?.text || "N/A"}
                                                </span>
                                            </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center w-full py-20 gap-y-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                                                <path
                                                d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0"
                                                className="fill-red-500"
                                                />
                                            </svg>
                                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                                Информация не найдена
                                            </span>
                                            </div>
                                        )}
                                        </>


                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}