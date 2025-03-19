"use client"
import { useTranslations } from "next-intl"
import { useEffect, useState, MouseEventHandler, useRef, Fragment} from "react";
import { Dialog, Listbox, RadioGroup, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Datepicker from "react-tailwindcss-datepicker";
import { Alert } from "@material-tailwind/react";
import AlertAll from "@/components/Alert/page";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";



export default function EditReleaseForm({ params }: { params: { id: string } }) {


    const t = useTranslations('edit_release')
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [LoadingImage, setLoadingImage] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [typeAlert, setTypeAlert] = useState('')
    const [MessageAlert, setMessageAlert] = useState('');
    const UploadAvatar = async (event: any) => {
        event.preventDefault();
        if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
        } else {
            const file = inputFileRef.current.files[0];
            setLoadingImage(true)
            const formData = new FormData();
            formData.append('id_release', params.id);
            formData.append('file', file);
            const response = await fetch(
                `/api/releases/upload_cover`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
            const data = await response.json()
            setLoadingImage(false)
            if (data.message == "invalid_image_format") {
                setOpenAlert(true)
                setMessageAlert('isFormatNotValid')
                setTypeAlert('error')
            }
            if (data.message == "invalid_image_size") {
                setOpenAlert(true)
                setMessageAlert('isSizeNotValid')
                setTypeAlert('error')
            }
            if (data.id) {
                setReleases(data)
                setOpenAlert(true)
                setCoverRelease(data.cover_small_path)
                setTypeAlert('success')
                setMessageAlert('successUploadImage')
            }
        }
    }

    const PostData = async () => {
        try {
            const { endDate, startDate } = inputValueDate;
            let date_release = null
            if (endDate != null) {
                date_release = new Date(endDate)
            }

            const res = await fetch("/api/releases/update_info", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    title: nameRelease,
                    version: versionRelease,
                    meta_language: LanguageRelease,
                    type: TypeRelease,
                    p_line: p_line,
                    date_release: date_release,
                    genre: GenreRelease,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    const AddArtist: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {

            const value = e.currentTarget.value;
            if (artistName != null) {
                closeModal()
                const res = await fetch("/api/releases/add_artist", {
                    method: "POST",
                    body: JSON.stringify({
                        id_release: parseInt(params.id, 10),
                        type: value,
                        name: artistName,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setReleases(data)
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
            const res = await fetch("/api/releases/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    type: "basic",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };


    const DeleteArtistFeaturing: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            const value = e.currentTarget.value;
            const res = await fetch("/api/releases/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    type: "feat",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const DeleteAutor: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            const value = e.currentTarget.value;
            const res = await fetch("/api/releases/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    type: "autor",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const DeleteAutorText: MouseEventHandler<HTMLButtonElement> = async (e) => {
        try {
            const value = e.currentTarget.value;
            const res = await fetch("/api/releases/delete_artist", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    type: "autortext",
                    name: value,
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    let [release_info, setReleases] = useState<Release | null>(null);
    type Release = {
        id: string;
        cover_small_path: string;
        title: string;
        version: string;
        artist: string;
        autor: string;
        autor_text: string;
        featartist: string;
        date_release: Date;
        genre: string;
        meta_language: string;
        type: string;
        upc: string;
        status: string;
        p_line: string;
    }

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/releases/info_release", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10)
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const [nameRelease, setnameRelease] = useState<string>('');
    const [versionRelease, setversionRelease] = useState<string>('');
    const [LanguageRelease, setLanguageRelease] = useState(release_info?.meta_language || '');
    const language = [
        { name: 'Русский' },
        { name: 'English' },
    ]
    function onLanguageChange(selectLanguage: any) {
        setLanguageRelease(selectLanguage.name)
    }
    const [artistName, setartistName] = useState<string>('');
    const [TypeRelease, setTypeRelease] = useState(release_info?.type);
    function onTypeChange(selectType: any) {
        setTypeRelease(selectType.name)
    }
    const [GenreRelease, setGenreRelease] = useState(release_info?.genre);
    function onGenreChange(selectType: any) {
        setGenreRelease(selectType.name)
    }
    const [CoverRelease, setCoverRelease] = useState(release_info?.cover_small_path);
    const [errorArtist, setErrorArtist] = useState('')

    const genre = [
        { "name": "Acid Jazz" },
        { "name": "Electronic" },
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
    const [inputValueDate, setInputValueDate] = useState({
        startDate: release_info?.date_release || null,
        endDate: release_info?.date_release || null,
    });

    const date_change = (newValue: any) => {
        inputValueDate.startDate = newValue.startDate
        inputValueDate.endDate = newValue.endDate
        PostData()
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 5);

    const [p_line, setPLine] = useState('');
    const type = [
        { name: 'Single' },
        { name: 'EP' },
        { name: 'Album' },
    ]
    useEffect(() => {
        fetchUserData();

    }, ['']);
    useEffect(() => {
        if (release_info) {
            setnameRelease(release_info.title || '');
            setversionRelease(release_info.version || '');
            setLanguageRelease(release_info.meta_language);
            setTypeRelease(release_info.type);
            setPLine(release_info.p_line || '');
            setInputValueDate({
                startDate: release_info?.date_release,
                endDate: release_info?.date_release,
            });
            setGenreRelease(release_info.genre);
            setCoverRelease(release_info.cover_small_path);
        }

    }, [release_info]);
    useEffect(() => {
        if (LanguageRelease) {
            PostData();
        }
    }, [LanguageRelease]);
    useEffect(() => {
        if (TypeRelease) {
            PostData();
        }
    }, [TypeRelease]);
    useEffect(() => {
        if (GenreRelease) {
            PostData();
        }
    }, [GenreRelease]);



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
            type: t('type_autor_artist'),
            type_ph: t('add_autor_dialog_description')
        },
        {
            id: 4,
            type: t('type_autortext_artist'),
            type_ph: t('add_autortext_dialog_description')
        },
    ]


    const [selected, setSelected] = useState(plans[0])
    return (
        <>
            {openAlert ? (
                <AlertAll type={typeAlert} message={MessageAlert} setIsOpen={setOpenAlert} />
            ) : null}

            <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
                <div className="grid gap-y-4 w-full">
                    <div className="grid gap-y-1">
                        <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('basic_information')}</h1>
                        <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('basic_information_description')}</h1>
                    </div>
                    <div className="lg:flex grid gap-4  grid-cols-1 lg:grid-cols-2 w-full">
                        <div className="w-44 h-44 relative">
                            <div className="w-full sm:w-44 h-full border-slate-300 border-2 hover:border-slate-400 dark:border-zinc-600 dark:hover:border-zinc-400 border-dashed rounded-2xl relative items-center justify-center transition-all duration-150">
                                <div className="grid justify-center absolute w-full h-full select-none">
                                    {LoadingImage ? (
                                        <div className="w-full flex h-full justify-center items-center">
                                            <BigSpinnerLoading />
                                        </div>
                                    ) : (
                                        <>
                                            {release_info?.cover_small_path ? (
                                                <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${release_info.cover_small_path}`} className="w-full h-full rounded-2xl" />
                                            ) : (
                                                <>
                                                    <div className="mx-auto mt-auto">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" width="2em" height="2em" className="stroke-gray-900 dark:stroke-gray-50">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>

                                                    </div>
                                                    <div className="align-top mt-10 grid gap-y text-center">
                                                        <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{t('add_cover')}</span>
                                                        <span className="text-slate-2000 dark:text-zinc-400 font-semibold text-xs">(.jpeg)</span>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                                <input type="file" name="cover" id="cover" accept="image/jpeg" ref={inputFileRef} onChange={UploadAvatar} className="w-full h-full opacity-0 absolute cursor-pointer rounded-xl" />
                            </div>
                        </div>

                        <div className="grid gap-2 xl:gap-6  lg:grid-cols-2 grid-cols-1 lg:p-4 lg:py-0 py-4 w-full lg:max-w-7xl   ">
                            <div className="grid gap-y-1">
                                <span className="flex text-sm text-gray-700 font-semibold dark:text-slate-200">{t('name_release')}:</span>
                                <input type="text" name="name_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('name_release_ph')} required id="name_release" value={nameRelease} onChange={e => setnameRelease(e.target.value)} onBlur={PostData} />
                            </div>
                            <div className="grid gap-y-1">
                                <label className="flex text-sm text-gray-700 font-semibold dark:text-slate-200">{t('version_release')}:</label>
                                <input type="text" name="version_release" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('version_release_ph')} required id="version_release" value={versionRelease} onChange={e => setversionRelease(e.target.value)} onBlur={PostData} />
                            </div>
                            <Listbox onChange={onLanguageChange} >
                                <div className="relative grid gap-y-2">
                                    <h1 className="text-sm text-gray-700 font-semibold dark:text-slate-200">{t('language_release')}:</h1>
                                    <Listbox.Button className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full">
                                        <span className="">{release_info?.meta_language ? (release_info?.meta_language) : (t('language_release_ph'))}</span>
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
                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full z-30 overflow-auto rounded-xl bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm top-full">
                                            {language.map((person, personIdx) => (
                                                <Listbox.Option
                                                    key={personIdx}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2  hover:bg-gray-200 dark:hover:bg-zinc-800 hover`
                                                    }
                                                    value={person}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    } font-semibold text-zinc-800 px-4 text-base dark:text-slate-200`}
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

                            <Listbox onChange={onTypeChange} >
                                <div className="relative grid gap-y-2">
                                    <h1 className="text-sm text-gray-700 font-semibold dark:text-slate-200">{t('type_release')}:</h1>
                                    <Listbox.Button className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full">
                                        <span className="">{release_info?.type ? (release_info?.type) : (t('type_release_ph'))}</span>
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
                                        <Listbox.Options className="absolute mt-1 top-full max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                                            {type.map((person, personIdx) => (
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
                                                                    } font-semibold text-zinc-800 px-4 text-base w-full dark:text-slate-200`}
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
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" >
                <div className="grid gap-y-4 w-full">
                    <div className="grid gap-y-1">
                        <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('add_artist_information')}</h1>
                        <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('add_artis_description')}</h1>
                    </div>
                    <div className="grid gap-y-2">
                        <div className="flex flex-wrap gap-3 gap-x-3">
                            {Array.isArray(release_info?.artist) && release_info?.artist.map((item: any, index: any) => (
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
                            {Array.isArray(release_info?.featartist) && release_info?.featartist.map((item: any, index: any) => (
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
                            {Array.isArray(release_info?.autor) && release_info?.autor.map((item: any, index: any) => (
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
                                            {t('type_autor_artist')}
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
                            {Array.isArray(release_info?.autor_text) && release_info?.autor_text.map((item: any, index: any) => (
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
                                            {t('type_autortext_artist')}
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
                    </div>
                    <div>
                        <button className="flex items-center gap-x-2 justify-between transition bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover shadow-sm" onClick={openModal}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 12H20M12 4V20" className="stroke-zinc-800 dark:stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-slate-200" onClick={openModal}>
                                {t('add_artist_button')}
                            </span>
                        </button>
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

                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
                <div className="grid gap-y-4 w-full">
                    <div className="grid gap-y-1">

                        <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('additionally_information')}</h1>
                        <h1 className="text-sm text-slate-2000 dark:text-zinc-400">{t('additionally_description')}</h1>
                    </div>
                    <div className="grid gap-2 xl:gap-6 2xl:gap-8 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 w-full lg:max-w-7xl   ">
                        <div className="grid gap-y-2">
                            <label className="text-sm text-gray-700 font-semibold dark:text-slate-200">{t('date_start')}:</label>

                            <Datepicker
                                useRange={false}
                                asSingle={true}
                                minDate={minDate}
                                value={inputValueDate}
                                onChange={date_change}
                                i18n="ru"
                                displayFormat="DD.MM.YYYY"
                                startWeekOn="mon"
                                placeholder={t('date_ph')}
                                inputClassName="hover:outline-slate-400 text-zinc-800 dark:text-slate-200 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                            />
                        </div>
                        <Listbox onChange={onGenreChange}>
                            <div className="relative grid gap-y-2">
                                <h1 className="text-sm text-gray-700 font-semibold dark:text-slate-200">{t('genre')}:</h1>
                                <Listbox.Button className="outline-none bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full">
                                    <span className="">{release_info?.genre ? (release_info?.genre) : (t('genre_ph'))}</span>
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
                        <div className="grid gap-y-2">
                            <label className="text-sm text-gray-700 font-semibold dark:text-slate-200">P-line:</label>
                            <input type="text" name="p_line" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('p_line_ph')} required id="p_line" value={p_line} onChange={e => setPLine(e.target.value)} onBlur={PostData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
