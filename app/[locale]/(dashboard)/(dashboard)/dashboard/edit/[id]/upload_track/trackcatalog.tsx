"use client"
import PlayerAudio from "@/components/upload/playerAudio/page";
import { Dialog, Disclosure, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import AddArtist from "./add_artist";

interface TrackCatalogProps {
    release_info: any;
    id: any;
    deleteTrack: (value: any) => void;
}

export default function TrackCatalog({ release_info, id, deleteTrack }: TrackCatalogProps) {
    const t = useTranslations('upload_track')
    const [item, setTrack] = useState<Track>(release_info);
    useEffect(() => {
        setTrack(release_info);
    }, [release_info]);
    type Track = {
        id: string;
        owner: string,
        order: string,
        title: string;
        version: string;
        artist: string;
        featartist: string;
        genre: string;
        is_instrumental: boolean
        is_curse: boolean,
        track: string
    }
    const genre = [
        { "name": "Acid Jazz" },
        { "name": "Acid Punk" },
        { "name": "Alternative Rock" },
        { "name": "Ambient" },
        { "name": "Blues" },
        { "name": "Big Beat" },
        { "name": "Country" },
        { "name": "Dance" },
        { "name": "Disco" },
        { "name": "Dubstep" },
        { "name": "Deep House" },
        { "name": "Drum & Bass" },
        { "name": "Funk" },
        { "name": "Hard Rock" },
        { "name": "Hardcore" },
        { "name": "House" },
        { "name": "Jazz" },
        { "name": "Metal" },
        { "name": "Punk Rock" },
        { "name": "R&B" },
        { "name": "Soul" },
        { "name": "Techno" },
        { "name": "Pop" },
        { "name": "Phonk" },
        { "name": "Hip-Hop" },
        { "name": "Nu Metal" }
    ]
    useEffect(() => {
        setTrack(release_info);
    }, []);

    const [GenreRelease, setGenreRelease] = useState<string>('');
    function onGenreChange(selectType: any) {
        setGenreRelease(selectType.name)

    }
    useEffect(() => {
        PostData();
    }, [GenreRelease]);
    const [nameRelease, setnameRelease] = useState<string>(item.title);
    const [versionRelease, setversionRelease] = useState<string>(item.version);
    const PostData = async () => {
        if (isOpenDisc === true) {
            const res = await fetch("/api/releases/track/update_info", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(item.id, 10),
                    title: nameRelease,
                    version: versionRelease,
                    is_curse: curse,
                    is_instrumental: instumental,
                    genre: GenreRelease,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setTrack(data)
            }
        }
    };
    const [instumental, setInsrumental] = useState(false)
    const [curse, setCurse] = useState(false)
    const changeInstrumental = () => {
        if (curse == false) {
            setInsrumental(!instumental);
        } else {
            setInsrumental(true);
            setCurse(false);
        }

    };
    const changeCurse = () => {
        if (instumental == false) {
            setCurse(!curse);
        } else {
            setInsrumental(false);
            setCurse(true);
        }
    };
    useEffect(() => {
        PostData()
    }, [instumental, curse])
    useEffect(() => {
        if (item) {
            setnameRelease(item.title);
            setversionRelease(item.version);
            setGenreRelease(item.genre)
            setInsrumental(item.is_instrumental)
            setCurse(item.is_curse)
        }

    }, [item]);
    const [DeleteNumber, setDeleteNumber] = useState('')
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal(e: { currentTarget: { value: any; }; }) {
        const value = e.currentTarget.value
        setDeleteNumber(value)
        setIsOpen(true)
    }
    const handleClick = () => {
        deleteTrack(DeleteNumber);
    };
    const [isOpenDisc, setOpenDisc] = useState(false)
    return (
        <>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 w-full flex flex-col shadow-sm" key={item.id}>
                <Disclosure >
                    {({ open }) => (
                        <>
                            <div className="flex w-full justify-between items-center overflow-x-auto">
                                <div className="flex gap-x-4 items-center text-lg font-semibold text-zinc-800 dark:text-slate-200">
                                    <span >{item.order}</span>
                                    <span >|</span>
                                    <div className="flex gap-x-1">
                                        <span className="font-semibold text-zinc-800 dark:text-slate-200">{item?.title ? item?.title : "N/A"}</span>
                                        {item?.version ? (
                                            <span className="text-slate-2000 dark:text-zinc-400">({item?.version})</span>
                                        ) : null}
                                        <div className="flex items-start">
                                            {item?.is_curse === true ? (
                                                <>
                                                    <span className="flex w-4 h-4 bg-red-100 rounded text-xs font-medium text-red-600 items-center justify-center">E</span>
                                                </>
                                            ) : null}
                                            {item?.is_instrumental === true ? (
                                                <>
                                                    <span className="flex w-4 h-4 bg-blue-100 rounded text-xs font-medium text-blue-600 items-center justify-center">In</span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-x-2 items-center">
                                    <Disclosure.Button>
                                        <button onClick={() => setOpenDisc(!isOpenDisc)} className="w-10 h-8 items-center flex hover:bg-gray-200 dark:hover:bg-zinc-800  rounded-lg justify-center">
                                            <ChevronRightIcon
                                                className={`${open ? 'rotate-90 transform' : ''
                                                    } h-5 w-5 text-zinc-800 dark:text-slate-200 `}
                                            />
                                        </button>
                                    </Disclosure.Button>
                                    <button onClick={openModal} value={item?.id} className="w-10 h-8 items-center flex hover:bg-gray-200 dark:hover:bg-zinc-800  rounded-lg justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 7H20" className="stroke-gray-900 dark:stroke-gray-50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" className="stroke-gray-900 dark:stroke-gray-50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-gray-900 dark:stroke-gray-50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <Transition appear show={isOpen} as={Fragment}>
                                        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all flex flex-col h-full">
                                                            <div className="p-6 flex justify-between items-center">
                                                                <span className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200 ">
                                                                    {t('delete_track')}
                                                                </span>
                                                                <button className="w-8 h-8 items-center flex hover:bg-gray-200 dark:hover:bg-zinc-800  rounded-lg justify-center" onClick={closeModal}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-gray-900 dark:fill-gray-200" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="p-6">
                                                                <p className="text-base text-slate-2000 dark:text-slate-200">{t('delete_track_description')}</p>
                                                            </div>
                                                            <div className="flex w-full justify-end border-t border-gray-300 dark:border-zinc-800 p-4">
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                                                                    onClick={handleClick}
                                                                    value={DeleteNumber}
                                                                >
                                                                    {t('delete')}
                                                                </button>
                                                            </div>
                                                        </Dialog.Panel>
                                                    </Transition.Child>
                                                </div>
                                            </div>
                                        </Dialog>
                                    </Transition>
                                </div>
                            </div>

                            <Transition
                                show={open}
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Disclosure.Panel>
                                    <div className="flex flex-col gap-y-4 w-full mt-4">
                                        <PlayerAudio track_mp3={item.track} />
                                        <div className="lg:w-3/4 flex flex-col gap-y-4">
                                            <div className="grid gap-y-1">
                                                <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('basic_information')}</h1>
                                                <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('basic_information_description')}</h1>
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                                                <div className="grid gap-y-1">
                                                    <span className="flex text-sm text-gray-700 font-semibold dark:text-slate-200">{t('name_release')}:</span>
                                                    <input type="text" name="name_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('name_release_ph')} required id="name_release" value={nameRelease} onChange={e => setnameRelease(e.target.value)} onBlur={PostData} />
                                                </div>
                                                <div className="grid gap-y-1">
                                                    <span className="flex text-sm text-gray-700 font-semibold dark:text-slate-200">{t('version')}:</span>
                                                    <input type="text" name="version" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('version_ph')} required id="version" value={versionRelease} onChange={e => setversionRelease(e.target.value)} onBlur={PostData} />
                                                </div>

                                                <Listbox onChange={onGenreChange}>
                                                    <div className="relative grid gap-y-2">
                                                        <h1 className="text-sm text-gray-700 font-semibold dark:text-slate-200">{t('genre')}:</h1>
                                                        <Listbox.Button className="outline-none bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full">
                                                            <span className="">{item?.genre ? (item?.genre) : (t('genre_ph'))}</span>
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
                                                            <Listbox.Options className="absolute bottom-full max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-zinc-900 text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
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
                                                                                    {person.name}
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
                                            <div className="grid gap-y-1">
                                                <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('artist_add')}</h1>
                                                <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('artist_add_description')}</h1>
                                            </div>
                                            <div className="grid gap-y-2">
                                                <AddArtist artist_info_post={item} />
                                            </div>
                                            <div className="grid gap-y-2 items-end">
                                                <div className="grid gap-y-1">
                                                    <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('addiotinaly_information')}</h1>
                                                    <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('additionally_description')}</h1>
                                                </div>
                                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                                                    <div className={`grid items-center w-full h-full gap-y-2  bg-white dark:bg-zinc-900 rounded-xl border text-left ${instumental ? ('border-indigo-600') : ('border-slate-300 dark:border-zinc-800')} p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 hover select-none transition`} onClick={changeInstrumental}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-x-1 items-center">
                                                                <span className="flex w-4 h-4 bg-blue-100 rounded text-xs font-medium text-blue-600 items-center justify-center">E</span>
                                                                <span className="text-lg font-medium text-zinc-800 dark:text-slate-200">{t('instumental')}</span>
                                                            </div>
                                                            <div className={`w-6 h-6 flex border border-slate-300 dark:border-zinc-800 rounded-md items-center justify-center ${instumental ? ('bg-indigo-600') : null}`}>
                                                                {instumental ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-white" width="1em" height="1em" viewBox="0 0 1920 1920">
                                                                        <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd" />
                                                                    </svg>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-600 dark:text-slate-400">{t('instumental_desc')}</span>
                                                    </div>
                                                    <div className={`grid items-center w-full h-full gap-y-2  bg-white dark:bg-zinc-900 rounded-xl border text-left ${curse ? ('border-indigo-600') : ('border-slate-300 dark:border-zinc-800')} border-slate-300 dark:border-zinc-800 p-4 hover:bg-gray-200 dark:hover:bg-zinc-800 hover select-none transition`} onClick={changeCurse}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-x-1 items-center">
                                                                <span className="flex w-4 h-4 bg-red-100 rounded text-xs font-medium text-red-600 items-center justify-center">E</span>
                                                                <span className="text-lg font-medium text-zinc-800 dark:text-slate-200">{t('curse')}</span>
                                                            </div>
                                                            <div className={`w-6 h-6 flex border border-slate-300 dark:border-zinc-800 rounded-md items-center justify-center ${curse ? ('bg-indigo-600') : null}`}>
                                                                {curse ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-white" width="1em" height="1em" viewBox="0 0 1920 1920">
                                                                        <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd" />
                                                                    </svg>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-600 dark:text-slate-400">{t('curse_desc')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}

                </Disclosure>
            </div>
        </>
    )
}