'use client';

import { Dialog, Transition } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

export function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult]: any = useState();
    const [modal, setModal] = useState(false)

    const t = useTranslations('admin_tool')
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/generate_report', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const json = await res.json();
            setResult(json);
            setModal(true)
        } else {
            alert('Failed to upload file.');
        }
    };
    const Add_report = async () => {
        setModal(false)
        const res = await fetch('/api/admin/add_report', { 
            method: 'POST',
            body: JSON.stringify({
                reports: result.releases
            })
         })
        const data = await res.json()
    }
    return (
        <>
            <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-sm">
                <h1 className="text-zinc-800 dark:text-slate-50 font-semibold text-lg">{t('create_report')}</h1>
                <input type="file" accept=".csv" onChange={handleFileChange} className="my-2" />
                <button
                    onClick={handleUpload}
                    className="w-full text-sm justify-center inline-flex rounded-md items-center px-2 py-1 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                >
                    {t('upload')}
                </button>
            </div>

            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setModal(false)}>
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
                                <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between px-6 py-4 border-b border-slate-300 dark:border-zinc-800 w-full">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('create_report')}
                                        </div>
                                        <div className="flex items-start">
                                            <button onClick={() => setModal(false)} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-b gap-y-4 flex flex-col border-slate-300 dark:border-zinc-800 w-full">
                                        <div className='p-4 bg-slate-200 dark:bg-zinc-700 w-full rounded-md flex flex-col gap-y-4'>
                                            <span className='text-zinc-900 dark:text-slate-50 text-lg lg:text-xl font-bold'>{t('summary_information')}</span>
                                            <div className='flex justify-between'>
                                                <div className='flex flex-col gap-y-'>
                                                    <span className='text-zinc-700 dark:text-slate-200 text-sm'>{t('total_earned')}</span>
                                                    <span className='text-zinc-800 dark:text-slate-100 font-medium text-base'>    {result?.totalAmount || 0} ₽</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 w-full'>
                                            {result?.releases ? (result.releases.map((item: any, index: any) => (
                                                <div className='rouned-md border border-slate-300 dark:border-zinc-800 shadow-sm p-2 rounded-md' key={index}>
                                                    <div className='flex w-full justify-between'>
                                                        <div className='flex gap-x-2'>
                                                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover}`} className='w-12 h-12 rounded-md' alt="" />
                                                            <div className='flex flex-col'>
                                                                <span className='text-zinc-800 dark:text-slate-200 font-medium text-base'>{item.title}</span>
                                                                <span className='text-zinc-600 dark:text-slate-400 text-sm'>{item.artist}</span>
                                                            </div>
                                                        </div>
                                                        <span className='text-emerald-500'>+{item.amount}₽</span>
                                                    </div>
                                                </div>
                                            ))) : null}
                                        </div>
                                    </div>
                                    <div className="flex w-full justify-end border-t border-gray-300 dark:border-zinc-800 p-4">
                                        <button
                                            onClick={()=>Add_report()}
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
                                        >
                                            {t('upload')}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
