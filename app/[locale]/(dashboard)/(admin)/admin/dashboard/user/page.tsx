"use client"
import Pagination from "@/components/pagination/page";
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl"
import { redirect, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { CreateUser } from "./create_user";
import { signIn, useSession } from "next-auth/react";


interface ReleaseQueryParams {
    name?: string;
    status?: string;
    skip: number;
    take: number;
}


export default function UsersAdmin() {
    const md = useTranslations('metadata')
    const t = useTranslations('user_admin')
    const [user_info, setUserInfo] = useState<Users[]>([])
    type Users = {
        id: string;
        createdAt: Date;
        username: string;
        email: string;
        password: string;
        license_status: string;
        balance: string;
        admin: boolean;
        license: any;
        subscribe: any;
        count_release: number;
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
    const [searchName, setSearchName] = useState('');
    const genre = [
        { "name": "All", "text": t('all') },
        { "name": "Not fill", "text": t('not_fill') },
        { "name": "Moderate", "text": t('Moderate') },
        { "name": "Accepted", "text": t('Accepted') }
    ]
    const router = useRouter()
    const Check_Admin = async () => {
        const res = await fetch('/api/user/isAdmin')
        const data = await res.json()
        if (data?.admin === false) {
            router.push('/dashboard/catalog')
        }
    }
    const [filterStatus, setFilterStatus] = useState(genre[0].name);
    const [filterStatusSee, setfilterStatusSee] = useState(genre[0].text);
    function onFilter(selectType: any) {
        setFilterStatus(selectType.name)
        setfilterStatusSee(selectType.text)
        setPage(1);
    }
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

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
            const res = await fetch("/api/admin/users/users_info", {
                method: "POST",
                body: JSON.stringify(queryParams),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    router.push('/dashboard/catalog')
                } else {
                    setUserInfo(data.releases);
                    setTotalPages(data.totalPages);

                }

            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
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
    const [user_id, setUserID] = useState('')
    const [OpenModalAddAdmin, setOpenModalAddAdmin] = useState(false)
    const [AddAdmin, setAddAdmin] = useState(false)
    function closeModalAddAdmin() {
        setOpenModalAddAdmin(false)
    }

    function openModalAddAdmin(type: any, userID: any) {
        setOpenModalAddAdmin(true)
        setUserID(userID)
        if (type == true) {
            setAddAdmin(false)
        } else {
            setAddAdmin(true)
        }
    }
    const ChangeAdminStatus = async () => {
        const res = await fetch("/api/admin/users/add_admin", {
            method: "POST",
            body: JSON.stringify({
                id_user: user_id,
                status_admin: AddAdmin
            }),
        });
        const data = await res.json();
        if (data.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            fetchUserData()
            closeModalAddAdmin()
        }
    }

    const [OpenModalChangeBalance, setOpenModalChangeBalance] = useState(false)
    const [ChangeBalanceValue, setChangeBalanceValue] = useState('')
    function closeModalChangeBalance() {
        setOpenModalChangeBalance(false)
    }

    function openModalChangeBalance(balance: any, userID: any) {
        setOpenModalChangeBalance(true)
        setUserID(userID)
        setChangeBalanceValue(balance)
    }
    const ChangeBalance = async () => {
        const res = await fetch("/api/admin/users/change_balance", {
            method: "POST",
            body: JSON.stringify({
                id_user: user_id,
                balance: parseInt(ChangeBalanceValue, 10)
            }),
        });
        const data = await res.json();
        if (data.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            fetchUserData()
            closeModalChangeBalance()
        }
    }

    const [OpenModalCheckLicense, setOpenModalCheckLicense] = useState(false)
    const [license_info, setLicenseInfo] = useState<LicenseFull | null>(null)
    type LicenseFull = {
        id: string;
        last_name: string;
        first_name: string;
        middle_name: string;

        passport_serial_number: string;
        passport_number_number: BigInteger;

        passport_date_received: string;
        passport_office_id: BigInteger;

        registration_address: string;
        passport_received_by: string;

        email: string;
        number_phone: string;

        bank_account_number: BigInteger;
        bank_name: string;

        date_birth: string;
        place_of_birth: string;

        username: string;
        inn: BigInteger;

        signature: string;
    }
    function closeModalCheckLicense() {
        setOpenModalCheckLicense(false)
    }

    function openModalCheckLicense(license: any) {
        setOpenModalCheckLicense(true)
        setLicenseInfo(license)
    }

    const [OpenModalCheckSubscribe, setOpenModalCheckSubscribe] = useState(false)
    const [subsribe_info, setSubscribeInfo] = useState<[]>([])
    function closeModalSubscribeInfo() {
        setOpenModalCheckSubscribe(false)
    }

    function openModalSubscribeInfo(subscribe: any) {
        setOpenModalCheckSubscribe(true)
        setSubscribeInfo(subscribe)
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async () => {
        try {
            const signInResponse = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            router.refresh();
            router.push('/dashboard/catalog');
        } catch (err) {
            console.log(err);
        }

    };
    useEffect(() => {
        if (email != "" && password != "") {
            handleSubmit();
        }
    }, [email])
    return (
        <>
            <head>
                <title>{md('user')}</title>
            </head>
            <div className="flex justify-between lg:items-center lg:flex-row flex-col gap-y-4">
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
                <CreateUser />
            </div>
            <div className="flex flex-col lg:items-center gap-3 lg:flex-row lg:justify-between ">
                <div className="flex p-2 h-12 bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 w-full items-center shadow-sm">
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
                <div className="flex p-2 bg-[#fff] h-12 text-zinc-800 dark:text-slate-200 text-base dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 w-full lg:w-fit items-center shadow-sm">
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
            <div className="grid grid-cols-2 gap-4 mt-4">
                {user_info ? user_info.map((item) => (
                    <>
                        <div className="flex flex-col gap-y-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-sm p-4" key={item.id}>
                            <div className="flex w-full justify-between">
                                <div className="grid grid-cols-1 w-full md:grid-cols-3 lg:flex items-center gap-12 flex-wrap">
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.id}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">ID</span>
                                    </div>
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.username}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('username')}</span>
                                    </div>
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.email}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('email')}</span>
                                    </div>
                                </div>
                                <div className="flex gap-x-2">
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
                                            <Menu.Items className="absolute right-0 z-10 w-fit py-2 px-4 origin-top-right rounded-lg bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    <button onClick={() => openModalAddAdmin(item.admin, item.id)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white" width="1.5em" height="1.5em" viewBox="0 0 1920 1920">
                                                            <path d="m773.596 1069.654 711.086 711.085c39.632 39.632 104.336 39.632 144.078 0l138.276-138.385c19.268-19.269 29.888-44.778 29.888-71.93 0-27.26-10.62-52.77-29.888-72.039l-698.714-698.714 11.495-32.625c63.5-178.675 18.284-380.45-115.284-514.018-123.715-123.605-305.126-171.01-471.648-128.313l272.281 272.282c32.516 32.406 50.362 75.652 50.362 121.744 0 45.982-17.846 89.227-50.362 121.744L654.48 751.17c-67.222 67.003-176.375 67.003-243.488 0L138.711 478.889c-42.589 166.522 4.707 347.934 128.313 471.648 123.714 123.715 306.22 172.325 476.027 127.218l30.545-8.101ZM1556.611 1920c-54.084 0-108.168-20.692-149.333-61.857L740.095 1190.96c-198.162 41.712-406.725-19.269-550.475-163.019C14.449 852.771-35.256 582.788 65.796 356.27l32.406-72.696 390.194 390.193c24.414 24.305 64.266 24.305 88.68 0l110.687-110.686c11.824-11.934 18.283-27.59 18.283-44.34 0-16.751-6.46-32.516-18.283-44.34L297.569 84.207 370.265 51.8C596.893-49.252 866.875.453 1041.937 175.515c155.026 155.136 212.833 385.157 151.851 594.815l650.651 650.651c39.961 39.852 61.967 92.95 61.967 149.443 0 56.383-22.006 109.482-61.967 149.334l-138.275 138.385c-41.275 41.165-95.36 61.857-149.553 61.857Z" fillRule="evenodd" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('add_admin')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => openModalChangeBalance(item.balance, item.id)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 1024 1024" className="fill-black dark:fill-white" version="1.1">
                                                            <path d="M254.4 289.6c-10.4-20.8-15.2-43.2-15.2-67.2 0-85.6 69.6-155.2 155.2-155.2s155.2 69.6 155.2 155.2v4h-44v-4c0-61.6-49.6-111.2-111.2-111.2s-111.2 49.6-111.2 111.2c0 16.8 4 32.8 11.2 48l1.6 3.2-39.2 19.2-2.4-3.2z" fill="" /><path d="M674.4 913.6c-23.2 0-44.8-14.4-53.6-36.8-1.6-3.2-8.8-20.8-15.2-39.2 0-0.8 0-0.8-0.8-1.6-4 0-9.6 0.8-16.8 1.6-16 1.6-40.8 4-77.6 4-40.8 0-65.6-5.6-82.4-8.8-4-0.8-7.2-1.6-9.6-1.6 0 0.8-0.8 1.6-1.6 3.2-7.2 19.2-16 41.6-16 42.4-8 21.6-29.6 36.8-53.6 36.8-7.2 0-13.6-1.6-20-4l-65.6-24.8c-14.4-5.6-25.6-16-32-30.4-6.4-13.6-6.4-29.6-1.6-44 0-0.8 12-28.8 18.4-48 1.6-4.8 1.6-4.8-4-8l-1.6-0.8C200 721.6 132 652.8 128 557.6c-1.6-35.2 1.6-68 8-99.2-9.6-3.2-21.6-8.8-34.4-17.6-32-21.6-48.8-52.8-48.8-88.8 0-38.4 20.8-72.8 53.6-86.4 2.4-0.8 5.6-1.6 8.8-1.6 8.8 0 16.8 4.8 20 13.6 4.8 11.2 0 24-11.2 28.8-16.8 7.2-27.2 24.8-27.2 46.4 0 21.6 9.6 39.2 28.8 52 8 5.6 16.8 9.6 23.2 12 1.6-3.2 2.4-6.4 4-9.6 17.6-42.4 44-76.8 79.2-104 79.2-61.6 170.4-91.2 278.4-91.2 37.6 0 74.4 4 110.4 11.2 31.2-58.4 80.8-95.2 150.4-112.8 1.6-0.8 3.2-0.8 5.6-0.8 6.4 0 12 2.4 16 7.2 5.6 6.4 7.2 14.4 4 22.4-20.8 56-30.4 88-32 127.2 40 16.8 72 41.6 96.8 74.4 26.4 36 37.6 72 41.6 97.6 0.8 0 3.2 0.8 5.6 0.8h33.6c30.4 0 55.2 24.8 55.2 55.2v100c0 30.4-24.8 55.2-55.2 55.2h-33.6c-7.2 0-8.8 1.6-13.6 11.2-24.8 52-64 92.8-112 119.2-1.6 0.8-2.4 1.6-3.2 2.4 0 0.8 0.8 1.6 0.8 1.6l10.4 28c5.6 14.4 4.8 29.6-1.6 43.2-6.4 13.6-17.6 24.8-32 30.4l-65.6 24.8c-3.2 2.4-10.4 3.2-17.6 3.2z m-67.2-120.8c27.2 0 36 16.8 40.8 31.2 6.4 18.4 13.6 36 13.6 36.8v0.8c1.6 4.8 7.2 8.8 12.8 8.8 1.6 0 3.2 0 4.8-0.8l65.6-24.8c3.2-1.6 5.6-4 7.2-7.2 1.6-3.2 1.6-7.2 0-10.4l-10.4-27.2c-2.4-4-6.4-16-2.4-30.4 2.4-8 8.8-20 24.8-28.8 40.8-22.4 72.8-56 93.6-100 4.8-9.6 17.6-36 52.8-36h33.6c6.4 0 11.2-4.8 11.2-11.2V493.6c0-6.4-4.8-11.2-11.2-11.2h-33.6c-32 0-45.6-18.4-48.8-33.6-5.6-32.8-28-112.8-124.8-146.4-8.8-3.2-14.4-11.2-14.4-20-0.8-43.2 7.2-77.6 19.2-114.4-40.8 18.4-68.8 47.2-88 90.4-3.2 8-11.2 12.8-20 12.8-1.6 0-3.2 0-5.6-0.8C592 260 552 255.2 512 255.2c-98.4 0-180 27.2-251.2 82.4-60 46.4-91.2 124-87.2 218.4 3.2 78.4 61.6 136 96.8 164l0.8 0.8c20 15.2 26.4 34.4 19.2 56.8-6.4 20-16.8 45.6-19.2 50.4-0.8 3.2-0.8 6.4 0.8 9.6 1.6 3.2 4 5.6 7.2 7.2l65.6 24.8c1.6 0.8 3.2 0.8 4.8 0.8 5.6 0 10.4-3.2 12.8-8.8 0-0.8 8.8-23.2 16-41.6 4-9.6 12-32 38.4-32 7.2 0 13.6 1.6 22.4 3.2 15.2 3.2 37.6 8 73.6 8 33.6 0 56-2.4 72.8-4 8-1.6 15.2-2.4 21.6-2.4z" fill="" />
                                                            <path d="M762.4 523.2c-24 0-43.2-19.2-43.2-43.2 0-24 19.2-43.2 43.2-43.2 24 0 43.2 19.2 43.2 43.2 0 24-19.2 43.2-43.2 43.2z" fill="" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('change_balance')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => openModalCheckLicense(item.license)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" version="1.1" id="_x32_" viewBox="0 0 512 512">
                                                            <g>
                                                                <path className="fill-black dark:fill-white" d="M464.932,85.797H47.068C21.076,85.797,0,106.865,0,132.865v246.271c0,25.991,21.076,47.067,47.068,47.067   h417.865c25.991,0,47.068-21.076,47.068-47.067V132.865C512,106.865,490.924,85.797,464.932,85.797z M123.254,167.399   c25.966,0,47.026,21.059,47.026,47.034c0,25.974-21.06,47.025-47.026,47.025c-25.974,0-47.025-21.051-47.025-47.025   C76.229,188.458,97.28,167.399,123.254,167.399z M123.254,348.916c-32.305,0-65.389-11.187-60.229-42.153   c2.102-12.576,12.508-30.203,20.407-38.102c1.016-1.017,5.652-1.28,6.915-0.5c9.585,5.907,20.839,9.364,32.907,9.364   c12.068,0,23.313-3.457,32.898-9.364c1.263-0.78,5.898-0.517,6.924,0.5c7.89,7.899,18.296,25.526,20.398,38.102   C188.636,337.729,155.551,348.916,123.254,348.916z M366.424,333.492H232.194v-27h134.229V333.492z M446.686,267.068H232.194v-27   h214.492V267.068z M446.686,200.644H232.194v-27h214.492V200.644z" />
                                                            </g>
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('check_license')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => openModalSubscribeInfo(item.subscribe)} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                            <path className="fill-black dark:fill-white" d="M12 0a2 2 0 0 0-1.81 1.15L7.556 6.758 1.7 7.642a2 2 0 0 0-1.13 3.374l4.3 4.408-1.02 6.235a2 2 0 0 0 2.94 2.073L12 20.86l5.216 2.89a2 2 0 0 0 2.942-2.073l-1.02-6.237 4.293-4.39a2 2 0 0 0-1.124-3.376l-5.857-.9-2.64-5.624A2 2 0 0 0 12 0z" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>{t('check_subscribe')}</div>
                                                    </button>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button onClick={() => { setPassword(item.password); setEmail(item.email); }} className="flex gap-x-2 justify-start items-center py-2 px-2 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 hover w-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                            <path className="fill-black dark:fill-white" d="M12 0a2 2 0 0 0-1.81 1.15L7.556 6.758 1.7 7.642a2 2 0 0 0-1.13 3.374l4.3 4.408-1.02 6.235a2 2 0 0 0 2.94 2.073L12 20.86l5.216 2.89a2 2 0 0 0 2.942-2.073l-1.02-6.237 4.293-4.39a2 2 0 0 0-1.124-3.376l-5.857-.9-2.64-5.624A2 2 0 0 0 12 0z" />
                                                        </svg>
                                                        <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200 whitespace-nowrap'>Зайти на аккаунт</div>
                                                    </button>
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="grid grid-cols-1 w-full md:grid-cols-3 lg:flex items-center gap-12 flex-wrap">

                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.balance}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('balance')}</span>
                                    </div>
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.license_status}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('license_status')}</span>
                                    </div>
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.count_release}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('count_release')}</span>
                                    </div>
                                    <div className="grid gap-y text-center">
                                        <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{formatDate(new Date(item.createdAt))}</span>
                                        <span className="text-sm text-gray-600 dark:text-zinc-400">{t('createdAt')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )) : null}
            </div>
            <Pagination totalPages={totalPages} page={page} handlePageChange={handlePageChange} />

            <Transition appear show={OpenModalAddAdmin} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalAddAdmin}>
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
                                            {t('add_admin')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalAddAdmin} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <div className="flex w-full justify-center text-xl font-bold text-zinc-800 dark:text-slate-200">
                                            {AddAdmin ? (
                                                <>
                                                    {t('true_admin')}
                                                </>
                                            ) : (
                                                <>
                                                    {t('false_admin')}
                                                </>
                                            )}
                                        </div>
                                        <span className="text-md text-gray-700 dark:text-gray-200">
                                            {t('change_add_admin')}
                                        </span>
                                    </div>

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={ChangeAdminStatus}
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

            <Transition appear show={OpenModalChangeBalance} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalChangeBalance}>
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
                                            {t('change_balance')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalChangeBalance} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <input type="text" name="version_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" required onChange={e => setChangeBalanceValue(e.target.value)} value={ChangeBalanceValue} />
                                        <span className="text-md text-gray-700 dark:text-gray-200">
                                            {t('change_balance_descript')}
                                        </span>
                                    </div>

                                    <div className="py-4 px-6 flex gap-x-4 justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={ChangeBalance}
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

            <Transition appear show={OpenModalCheckLicense} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModalCheckLicense}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-200"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="grid gap-2 sm:grid-cols-2 grid-cols-1 p-4">
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                id
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.id}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('FIO')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.last_name} {license_info?.first_name} {license_info?.middle_name}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_serial_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.passport_serial_number ? license_info?.passport_serial_number : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_number_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.passport_number_number ? license_info?.passport_number_number : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_date_received')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.passport_date_received ? license_info?.passport_date_received : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_office_id')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.passport_office_id ? license_info?.passport_office_id : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('registration_address')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.registration_address ? license_info?.registration_address : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_recieved_by')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.passport_received_by ? license_info?.passport_received_by : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('email')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.email ? license_info?.email : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('number_phone')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.number_phone ? license_info?.number_phone : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('bank_account_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.bank_account_number ? license_info?.bank_account_number : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('bank_name')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.bank_name ? license_info?.bank_name : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('date_birth')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.date_birth ? license_info?.date_birth : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('place_of_birth')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.place_of_birth ? license_info?.place_of_birth : "N/A"}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('username')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.username ? license_info?.username : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('inn')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.inn ? license_info?.inn : "N/A"}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('signature')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info?.signature ? (
                                                    <div className="rounded-xl border-2 border-zinc-800 dark:border-gray-300 bg-gray-200 inline-flex">
                                                        <img src={license_info.signature} className="w-full stroke-white" alt="License Signature" />
                                                    </div>
                                                ) : "N/A"}
                                            </div>
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={OpenModalCheckSubscribe} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModalSubscribeInfo}>
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
                                            {t('check_subscribe')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={closeModalSubscribeInfo} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 gap-y-4 flex flex-col border-slate-300 dark:border-zinc-800">
                                        {subsribe_info ? subsribe_info.map((item: any) => (
                                            <>
                                                {item.id_subscribe === 3 ? (
                                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={item.id}>
                                                        <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                                                            <div className="flex gap-x-4 items-center">
                                                                <div>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="2em" height="2em" viewBox="0 0 226.777 226.777" enableBackground="new 0 0 226.777 226.777">
                                                                        <path className="fill-indigo-600" d="M113.388,0C50.765,0,0,50.767,0,113.392c0,62.618,50.765,113.385,113.389,113.385  c62.626,0,113.389-50.768,113.389-113.385C226.777,50.767,176.014,0,113.388,0z M159.202,67.375  c-0.102,0.892-0.248,1.868-0.448,2.947c-0.2,1.069-0.452,2.152-0.754,3.255c-0.298,1.102-0.666,2.112-1.099,3.035  c-0.434,0.921-0.916,1.682-1.452,2.275c-0.534,0.594-1.097,0.888-1.696,0.888c-0.937,0-2.104-0.368-3.502-1.109  c-1.401-0.745-3.118-1.549-5.151-2.411c-2.035-0.858-4.418-1.667-7.148-2.413c-2.738-0.74-5.836-1.112-9.306-1.112  c-3.6,0-6.649,0.445-9.149,1.338c-2.502,0.892-4.553,2.068-6.152,3.53c-1.602,1.451-2.787,3.095-3.55,4.903  c-0.769,1.819-1.149,3.648-1.149,5.487c0,2.142,0.599,4.031,1.796,5.673c1.202,1.633,2.803,3.152,4.805,4.55  c1.999,1.403,4.282,2.756,6.849,4.06c2.568,1.31,5.168,2.678,7.807,4.104c2.632,1.427,5.229,2.991,7.795,4.682  c2.57,1.697,4.854,3.668,6.855,5.899c1.998,2.227,3.601,4.785,4.801,7.674c1.198,2.883,1.799,6.197,1.799,9.948  c0,5.595-1.267,10.786-3.8,15.572c-2.536,4.797-6.118,8.959-10.753,12.498c-4.634,3.536-10.237,6.326-16.801,8.34  c-1.836,0.564-3.744,1.036-5.689,1.442l-1.028,14.367c-0.162,2.889-2.515,5.128-5.355,5.207c-0.155,0.004-0.313,0.004-0.471-0.005  c-3.044-0.172-5.374-2.785-5.199-5.825l0.878-12.308c-1.64,0.094-3.291,0.162-4.993,0.162c-1.324,0-2.554-0.084-3.815-0.142  l-0.924,12.91c-0.162,2.889-2.514,5.128-5.354,5.207c-0.156,0.004-0.314,0.004-0.47-0.005c-3.046-0.172-5.375-2.785-5.201-5.825  l0.974-13.642c-2.52-0.509-4.891-1.067-6.966-1.721c-2.832-0.893-5.217-1.83-7.151-2.809c-1.934-0.981-3.367-1.922-4.299-2.81  c-0.936-0.894-1.401-2.231-1.401-4.021c0-0.476,0.068-1.187,0.201-2.143c0.132-0.951,0.315-1.98,0.548-3.074  c0.236-1.099,0.516-2.235,0.851-3.394c0.331-1.156,0.732-2.217,1.202-3.167c0.463-0.951,0.981-1.726,1.549-2.319  c0.566-0.593,1.183-0.896,1.852-0.896c1.131,0,2.48,0.461,4.05,1.387c1.563,0.922,3.513,1.932,5.848,3.03  c2.333,1.103,5.1,2.128,8.303,3.078c3.199,0.953,7.036,1.433,11.501,1.433c3.934,0,7.387-0.446,10.354-1.338  c2.962-0.897,5.449-2.113,7.45-3.659c2.001-1.548,3.519-3.352,4.549-5.402c1.036-2.054,1.555-4.3,1.555-6.738  c0-2.199-0.602-4.132-1.804-5.799c-1.201-1.667-2.786-3.203-4.752-4.601c-1.966-1.396-4.199-2.725-6.698-3.965  c-2.502-1.251-5.055-2.596-7.649-4.022c-2.604-1.427-5.154-2.975-7.652-4.638c-2.502-1.666-4.737-3.618-6.703-5.849  c-1.966-2.226-3.553-4.8-4.75-7.723c-1.199-2.912-1.799-6.305-1.799-10.168c0-5.355,1.201-10.298,3.598-14.819  c2.402-4.521,5.736-8.399,10.002-11.646c3.361-2.553,7.257-4.647,11.656-6.319l1.222-17.092c0.172-3.05,2.804-5.378,5.825-5.202  c3.046,0.17,5.375,2.784,5.202,5.824l-0.964,13.465c2.841-0.472,5.796-0.766,8.872-0.883l0.94-13.204  c0.177-3.05,2.806-5.378,5.827-5.202c3.046,0.17,5.376,2.784,5.201,5.824l-0.928,12.985c0.514,0.059,1.051,0.092,1.555,0.166  c3.003,0.45,5.738,1.01,8.202,1.697c2.466,0.685,4.567,1.441,6.301,2.274c1.736,0.834,2.934,1.536,3.601,2.1  c0.667,0.562,1.151,1.157,1.451,1.778c0.3,0.628,0.451,1.418,0.451,2.369C159.353,65.801,159.3,66.482,159.202,67.375z"></path>
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col gap-y-1">
                                                                    <div className="text-sm text-zinc-800 font-bold dark:text-slate-200">{t('buy_subscribe_3')}</div>
                                                                    <div className="text-xs text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} - {formatDate(new Date(item.endDate))}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-red-600 font-semibold text-sm whitespace-nowrap">-1499 ₽</div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {item.id_subscribe === 2 ? (
                                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={item.id}>
                                                        <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                                                            <div className="flex gap-x-4 items-center">
                                                                <div>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" className="stroke-indigo-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col gap-y-1">
                                                                    <div className="text-sm text-zinc-800 font-bold dark:text-slate-200">{t('buy_subscribe_2')}</div>
                                                                    <div className="text-xs text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} - {formatDate(new Date(item.endDate))}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-red-600 font-semibold text-sm whitespace-nowrap">-4499 ₽</div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {item.id_subscribe === 1 ? (
                                                    <div className="bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={item.id}>
                                                        <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                                                            <div className="flex gap-x-4 items-center">
                                                                <div>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 28 28" fill="none">
                                                                        <path d="M20.75 3C21.0557 3 21.3421 3.13962 21.5303 3.3746L21.6048 3.48102L25.8548 10.481C26.0556 10.8118 26.0459 11.2249 25.8395 11.5435L25.7634 11.6459L14.7634 24.6459C14.3906 25.0865 13.7317 25.1159 13.3207 24.7341L13.2366 24.6459L2.23662 11.6459C1.98663 11.3505 1.93182 10.941 2.08605 10.5941L2.14522 10.481L6.39522 3.48102C6.55388 3.21969 6.82182 3.04741 7.1204 3.00842L7.25001 3H20.75ZM17.515 12H10.484L13.999 20.672L17.515 12ZM22.844 12H19.673L16.756 19.195L22.844 12ZM8.326 12H5.155L11.242 19.193L8.326 12ZM9.674 5H7.81101L4.775 10H8.245L9.674 5ZM16.246 5H11.753L10.324 10H17.675L16.246 5ZM20.188 5H18.325L19.754 10H23.224L20.188 5Z" className="dark:fill-pink-500/70 fill-pink-500/80" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col gap-y-1">
                                                                    <div className="text-sm text-zinc-800 font-bold dark:text-slate-200">{t('buy_subscribe_1')}</div>
                                                                    <div className="text-xs text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} - {formatDate(new Date(item.endDate))}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex text-red-600 font-semibold text-sm whitespace-nowrap">-0 ₽</div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </>
                                        )) : null}
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
