import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Fragment, MouseEventHandler, useEffect, useState } from "react"

export default function AddArtist({ artist_info_post }: any) {
    const t = useTranslations('upload_track')
    const d = useTranslations('edit_release')
    const [artist_info, setArtistInfo] = useState(artist_info_post);

    const AddArtist: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {

            const value = e.currentTarget.value;
            if (artistName != null) {
                closeModal()
                const res = await fetch("/api/releases/track/add_artist", {
                    method: "POST",
                    body: JSON.stringify({
                        id_release: parseInt(artist_info.id, 10),
                        type: value,
                        name: artistName,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setArtistInfo(data)
                    setartistName('')
                }
            } else {
                setErrorArtist(t('nevalidartistname'))
            }
        }
        catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const DeleteArtistBasic: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            const value = e.currentTarget.value;
            const res = await fetch("/api/releases/track/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(artist_info.id, 10),
                    type: "basic",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setArtistInfo(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };


    const DeleteArtistFeaturing: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            const value = e.currentTarget.value;
            const res = await fetch("/api/releases/track/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(artist_info.id, 10),
                    type: "feat",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setArtistInfo(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    const DeleteAutor: MouseEventHandler<HTMLButtonElement> = async (e) => {
            try {
                const value = e.currentTarget.value;
                const res = await fetch("/api/releases/track/delete_artist", {
                    method: "POST",
                    body: JSON.stringify({
                        id_release: parseInt(artist_info.id, 10),
                        type: "autor",
                        name: value,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setArtistInfo(data)
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
    
        const DeleteAutorText: MouseEventHandler<HTMLButtonElement> = async (e) => {
            try {
                const value = e.currentTarget.value;
                const res = await fetch("/api/releases/track/delete_artist", {
                    method: "POST",
                    body: JSON.stringify({
                        id_release: parseInt(artist_info.id, 10),
                        type: "autortext",
                        name: value,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setArtistInfo(data)
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

    const [errorArtist, setErrorArtist] = useState('')
    let [isOpen, setIsOpen] = useState(false)
    function closeModal() {
        setIsOpen(false)
    }
    function openModal() {
        setIsOpen(true)
    }
    const plans = [
        {
            id: 1,
            type: t('type_basic_artist'),
            type_ph: t('type_basic_artist_description')
        },
        {
            id: 2,
            type: t('type_feat_artist'),
            type_ph: t('type_feat_artist_description')
        },
        {
            id: 3,
            type: d('type_autor_artist'),
            type_ph: d('add_autor_dialog_description')
        },
        {
            id: 4,
            type: d('type_autortext_artist'),
            type_ph: d('add_autortext_dialog_description')
        },
    ]
    const [selected, setSelected] = useState(plans[0])
    const [artistName, setartistName] = useState<string>('');
    return (
        <>
            <div className="flex flex-col gap-y-4">
                <div className="flex flex-wrap gap-3 gap-x-3">
                    {Array.isArray(artist_info?.artist) && artist_info?.artist.map((item: any, index: any) => (
                        <div className="flex items-center gap-x-2 justify-between  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1" key={index}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_429_11111)">
                                        <circle cx="12" cy="7" r="3" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" />
                                        <circle cx="18" cy="18" r="2" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12.3414 20H6C4.89543 20 4 19.1046 4 18C4 15.7909 5.79086 14 8 14H13.5278" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 18V11L22 13" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </div>
                            <div className="grid gap-y">
                                <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                    {item}
                                </div>
                                <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                    {t('basic_artist')}
                                </div>
                            </div>

                            <button onClick={DeleteArtistBasic} value={item as string}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <path d="M10 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 7H20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 gap-x-3">
                    {Array.isArray(artist_info?.featartist) && artist_info?.featartist.map((item: any, index: any) => (
                        <div className="flex items-center gap-x-2 justify-between  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1 " key={index}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_429_11111)">
                                        <circle cx="12" cy="7" r="3" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" />
                                        <circle cx="18" cy="18" r="2" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12.3414 20H6C4.89543 20 4 19.1046 4 18C4 15.7909 5.79086 14 8 14H13.5278" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 18V11L22 13" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </div>
                            <div className="grid gap-y-1">
                                <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                    {item}
                                </div>
                                <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                    {t('feat_artist')}
                                </div>
                            </div>

                            <button onClick={DeleteArtistFeaturing} value={item as string}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <path d="M10 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 7H20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 gap-x-3">
                            {Array.isArray(artist_info?.autor) && artist_info?.autor.map((item: any, index: any) => (
                                <div className="flex items-center gap-x-2 justify-between  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1 " key={index}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_429_11111)">
                                                <circle cx="12" cy="7" r="3" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" />
                                                <circle cx="18" cy="18" r="2" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.3414 20H6C4.89543 20 4 19.1046 4 18C4 15.7909 5.79086 14 8 14H13.5278" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20 18V11L22 13" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="grid gap-y-1">
                                        <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                            {item}
                                        </div>
                                        <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                            {d('type_autor_artist')}
                                        </div>
                                    </div>

                                    <button onClick={DeleteAutor} value={item as string}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                            <path d="M10 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 7H20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 gap-x-3">
                            {Array.isArray(artist_info?.autor_text) && artist_info?.autor_text.map((item: any, index: any) => (
                                <div className="flex items-center gap-x-2 justify-between  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1 " key={index}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_429_11111)">
                                                <circle cx="12" cy="7" r="3" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" />
                                                <circle cx="18" cy="18" r="2" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12.3414 20H6C4.89543 20 4 19.1046 4 18C4 15.7909 5.79086 14 8 14H13.5278" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20 18V11L22 13" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="grid gap-y-1">
                                        <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                            {item}
                                        </div>
                                        <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                            {d('type_autortext_artist')}
                                        </div>
                                    </div>

                                    <button onClick={DeleteAutorText} value={item as string}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                            <path d="M10 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 12V17" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 7H20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                </div>
                            ))}
                    </div>
                <div>
                    <button className="flex items-center gap-x-2 justify-between  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover" onClick={openModal}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12H20M12 4V20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-base text-zinc-800 dark:text-slate-200" onClick={openModal}>
                            {t('add_artist_button')}
                        </span>
                    </button>
                </div>
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
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl text-center font-medium leading-6 text-zinc-800 dark:text-slate-200"
                                    >
                                        {t('add_artist_dialog')}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-slate-2000 dark:text-zinc-400">
                                            {t('add_artist_dialog_description')}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <input type="text" placeholder={t('name_artist')} className="w-full outline-none p-2 bg-white dark:bg-zinc-900 border-b-2 text-zinc-800 dark:text-slate-200 text-2xl text-center focus:border-indigo-500" onChange={e => setartistName(e.target.value)} value={artistName} />
                                    </div>
                                    <div className="mt-1 text-sm text-orange-700">{errorArtist}</div>
                                    <RadioGroup value={selected} onChange={setSelected}>
                                        <div className="grid w-full h-full grid-cols-2 gap-4 my-4 select-none">
                                            {plans.map((plan) => (
                                                <RadioGroup.Option key={plan.type} value={plan}>
                                                    <div className="grid items-center w-full h-full gap-y-1  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover">
                                                        <div className="flex justify-between  text-base font-semibold">
                                                            {plan.type}
                                                            {selected.id === plan.id ? (
                                                                <div className="shrink-0 text-white h-6 w-6">
                                                                    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em">
                                                                        <circle cx={12} cy={12} r={12} className="fill-neutral-900 dark:fill-[#fff]" opacity="0.2" />
                                                                        <path
                                                                            d="M7 13l3 3 7-7"
                                                                            className="stroke-neutral-900 dark:stroke-[#fff]"
                                                                            strokeWidth={1.5}
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                                            {plan.type_ph}
                                                        </div>
                                                    </div>
                                                </RadioGroup.Option>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                    <div className="mt-4">
                                        <button value={selected.id} onClick={AddArtist} className="rounded-md w-full bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            {t('add')}
                                        </button>
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