"use client"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react";
import TrackCatalog from "./trackcatalog";

import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import AlertAll from "@/components/Alert/page";

export default function EditReleaseTrackForm({ params }: { params: { id: string } }) {
    const t = useTranslations('upload_track')
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [typeAlert, setTypeAlert] = useState('')
    const [MessageAlert, setMessageAlert] = useState('');
    const UploadTrack = async (event: any) => {
        event.preventDefault();
        if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
        }

        const file = inputFileRef.current.files[0];
        inputFileRef.current.value = '';
        if (file) {
            const formData = new FormData()
            formData.append('id_release', params.id);
            formData.append('file', file);
            setLoading(true)
            const response = await fetch(
                `/api/releases/track/add_track`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
            if (response.ok) {
                setOpenAlert(true)
                setTypeAlert('success')
                setMessageAlert('successUploadAudio')
                const data = await response.json();
                setTrack(data.info_release)
                setLoading(false)

            }
        };
    }

    const deleteTrack = async (value: any) => {

        const formData = new FormData()
        formData.append('track_id', value);
        formData.append('id_release', params.id);
        const res = await fetch("/api/releases/track/delete_track",
            {
                method: 'POST',
                body: formData,
            });
        fetchUserTrack()
        setOpenAlert(true)
        setTypeAlert('success')
        setMessageAlert('successDeleteAudio')
    };
    const [loading, setLoading] = useState(false);
    let [track_info, setTrack] = useState<Track[]>([]);
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
        track_mp3: string
    }
    const fetchUserTrack = async () => {
        try {
            const formData = new FormData()
            formData.append('id_release', params.id);
            const res = await fetch("/api/releases/track/get_track",
                {
                    method: 'POST',
                    body: formData,
                });
            if (res.ok) {
                const data = await res.json();
                setTrack(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    useEffect(() => {
        fetchUserTrack();
    }, []);
    return (
        <>
            {openAlert ? (
                <AlertAll type={typeAlert} message={MessageAlert} setIsOpen={setOpenAlert} />
            ) : null}
            <div className="bg-white dark:bg-zinc-900 mt-10 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 w-full flex shadow-sm">
                <div className="grid gap-y-4 w-full">
                    <div>
                        <h1 className="text-lg text-gray-700 font-bold dark:text-slate-200">{t('title')}</h1>
                    </div>
                    <div className="lg:flex grid gap-4 grid-cols-1 lg:grid-cols-2 w-full">
                        <div className="w-full h-36 relative">
                            <div className="flex w-full h-full items-center border-slate-300 border-2 hover:border-slate-400 dark:border-zinc-600 dark:hover:border-zinc-400 border-dashed rounded-2xl relative justify-center transition-all duration-150">
                                {loading === false ? (
                                    <div className="grid justify-center absolute w-full h-full select-none">
                                        <div className="mx-auto mt-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" width="2em" height="2em" className="stroke-gray-900 dark:stroke-gray-50">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                            </svg>
                                        </div>
                                        <div className="align-top mt-8 grid gap-y text-center">
                                            <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{t('add_track')}</span>
                                            <span className="text-slate-2000 dark:text-zinc-400 font-semibold text-xs">(.wav)</span>
                                        </div>
                                        <input type="file" name="track" id="track" ref={inputFileRef} onChange={UploadTrack} className='w-full h-full opacity-0 absolute cursor-pointer rounded-xl' accept="audio/wav" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-y-4 items-center w-full my-auto justify-between">
                                        <div><BigSpinnerLoading /></div>
                                        <div>{t('loading')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-4 mt-4">
                {loading === false ? null : (
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 w-full flex flex-col shadow-sm">
                        <div className="flex flex-col gap-y-4 items-center justify-between">
                            <div><BigSpinnerLoading /></div>
                            <div>{t('loading')}</div>
                        </div>
                    </div>
                )}
                {track_info && track_info.map((item) => (
                    <TrackCatalog release_info={item} id={params.id} key={item.id} deleteTrack={deleteTrack} />
                ))}

            </div>
        </>
    )
}