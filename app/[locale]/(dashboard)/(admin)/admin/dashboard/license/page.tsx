"use client"
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, MouseEventHandler, Fragment } from "react";
import InnNotFound from "./not_found";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import Found from "./found";

async function getData() {
    const res = await fetch(`/api/user/isAdmin`);

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

export default function AdminLicense() {
    const t = useTranslations('admin_license')
    const router = useRouter()
    let [admin, setAdmin] = useState<Admin | null>(null);
    type Admin = {
        admin: boolean;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData();
                setAdmin(data);

                if (data?.admin === false) {
                    router.push('/dashboard/catalog');
                } else {
                    fetchLicenseData();
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [router]);

    let [license_info, setLicenseInfo] = useState<License[]>([]);
    type License = {
        id: string;
        last_name: string;
        first_name: string;
        middle_name: string;
    }

    const fetchLicenseData = async () => {
        try {
            const res = await fetch("/api/admin/get_license", { method: "GET" });
            if (res.ok) {
                const data = await res.json();
                if (data.message == "not_admin") {
                    redirect('/dashboard/catalog')
                } else {
                    setLicenseInfo(data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    let [license_info_full, setLicenseInfoFull] = useState<LicenseFull | null>(null);
    const check_license: MouseEventHandler<HTMLButtonElement> = async (e) => {
        const value = e.currentTarget.value;
        const response = await fetch(`/api/admin/get_license_info`, {
            method: 'POST',
            body: JSON.stringify({
                id_license: parseInt(value, 10),
            }),
        })
        const dataLicense = await response.json();
        if (dataLicense.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            setLicenseInfoFull(dataLicense);
            openModal();
        }

    }

    const accept_license: MouseEventHandler<HTMLButtonElement> = async (e) => {
        const value = e.currentTarget.value;
        const response = await fetch(`/api/admin/accept_license`, {
            method: 'POST',
            body: JSON.stringify({
                id_license: parseInt(value, 10),
            }),
        })
        const data = await response.json()
        if (data.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            closeModal();
            fetchLicenseData()
        }
    }

    const disagree_license: MouseEventHandler<HTMLButtonElement> = async (e) => {
        const value = e.currentTarget.value;
        const response = await fetch(`/api/admin/disagree_license`, {
            method: 'POST',
            body: JSON.stringify({
                id_license: parseInt(value, 10),
            }),
        })
        const data = await response.json();
        if (data.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            closeModal();
            fetchLicenseData()
        }

    }

    let [license_info_inn, setLicenseInfoInn] = useState<LicenseInn | null>(null);
    const check_data_base: MouseEventHandler<HTMLButtonElement> = async (e) => {
        let data: string = "checked"
        setLicenseInfoInn({ inn: data })
        const value = e.currentTarget.value;
        const response = await fetch(`/api/admin/check_data_base`, {
            method: 'POST',
            body: JSON.stringify({
                id_license: parseInt(value, 10),
            }),
        })
        const dataLicenseInn = await response.json();
        if (dataLicenseInn.message == "not_admin") {
            redirect('/dashboard/catalog')
        } else {
            const inn_status = dataLicenseInn.inn;
            if (inn_status == null) {
                let data: string = "not found"
                setLicenseInfoInn({ inn: data })
            } else {
                let data: string = "found"
                setLicenseInfoInn({ inn: data })
            }
            setLicenseInfoFull(dataLicenseInn);
        }
    }

    type LicenseInn = {
        inn: string;
    }

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
    let [isOpen, setIsOpen] = useState(false)


    function closeModal() {
        setIsOpen(false);
        let data: string = "checked"
        setLicenseInfoInn({ inn: data })
    }
    function openModal() {
        setIsOpen(true)
    }
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('license')}</title>
            </head>

            <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="mt-10 flex justify-center">
                {license_info ? null : <BigSpinnerLoading />}
            </div>
            <div className='grid gap-4 sm:grid-cols-2 grid-cols-1  xl:grid-cols-4 justify-center w-full mt-4'>
                {license_info && license_info.map((item) => (
                    <div className="flex w-full border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl border p-4" key={item.id}>
                        <div className="flex flex-col gap-y-4 w-full">
                            <div className="flex flex-col gap-y-0.5">
                                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                    {t('FIO')}: {item.last_name} {item.first_name} {item.middle_name}
                                </span>
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    id:{item.id}
                                </span>
                            </div>
                            <div className="w-full">
                                <button value={item.id} onClick={check_license} className="flex text-center items-center justify-center text-sm text-slate-200 bg-indigo-600 hover:bg-indigo-500 w-full py-1 font-semibold rounded-md">
                                    {t('check_license')}
                                </button>
                            </div>
                        </div>
                    </div>

                ))}
            </div>


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModal}>
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
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl text-center font-medium leading-6 text-zinc-800 dark:text-slate-200"
                                    >
                                        {t('check')}
                                        {license_info_inn?.inn === "not found" ? (
                                            <InnNotFound />
                                        ) : null}
                                        {license_info_inn?.inn === "found" ? (
                                            <Found />

                                        ) : null}
                                    </Dialog.Title>
                                    <div className="grid gap-2 sm:grid-cols-2 grid-cols-1 p-4">
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                id
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.id}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('FIO')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.last_name} {license_info_full?.first_name} {license_info_full?.middle_name}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_serial_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.passport_serial_number}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_number_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.passport_number_number}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_date_received')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.passport_date_received}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_office_id')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.passport_office_id}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('registration_address')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.registration_address}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('passport_recieved_by')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.passport_received_by}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('email')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.email}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('number_phone')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.number_phone}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('bank_account_number')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.bank_account_number}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('bank_name')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.bank_name}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('date_birth')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.date_birth}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('place_of_birth')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.place_of_birth}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('username')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.username}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('inn')}
                                            </div>
                                            <div className="text-base font-bold text-zinc-800 dark:text-slate-200">
                                                {license_info_full?.inn}
                                            </div>
                                        </div>
                                        <div className="grid gap-y-px">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('signature')}
                                            </div>
                                            <div className="rounded-xl border-2 border-zinc-800 dark:border-gray-300 bg-gray-200 inline-flex">
                                                {license_info_full?.signature && (
                                                    <img src={license_info_full.signature} className="w-full stroke-white" alt="License Signature" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-y-2">
                                            <div className="text-sm leading-8 font-normal text-gray-600 dark:text-zinc-400">
                                                {t('button_request')}
                                            </div>
                                            <button value={license_info_full?.id} onClick={check_data_base} className="inline-flex w-full justify-center rounded-md items-center p-0 px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:visible">
                                                {t('check_data_base')}
                                            </button>
                                            <button value={license_info_full?.id} onClick={accept_license} className="inline-flex w-full justify-center rounded-md items-center p-0 px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-green-600 gap-x-2 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 lg:visible">
                                                {t('accept_license')}
                                            </button>
                                            <button value={license_info_full?.id} onClick={disagree_license} className="inline-flex w-full justify-center rounded-md items-center p-0 px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-red-600 gap-x-2 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 lg:visible">
                                                {t('disagree_license')}
                                            </button>
                                        </div>
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