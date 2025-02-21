'use client'
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, Fragment } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function CreatedSnippet({ params }: { params: { id: string } }) {
    const t = useTranslations('generator')
    type Release = {
        id: number,
        title: string,
        artist: [],
        cover: string,
        featartist: []
    }
    const [trackData, setTrackData] = useState<Release>()
    const [loading, setLoading] = useState(true)
    const route = useRouter()
    const FetchData = async () => {
        setLoading(true)
        const res = await fetch('/api/generator/trackData', {
            method: "POST",
            body: JSON.stringify({
                id_track: parseInt(params.id, 10),
            })
        })
        const data = await res.json()
        if (data.message === "not_permission") {
            route.push("/dashboard/catalog")
        } else {
            setTrackData(data)
            setLoading(false)
            setAudioUrl("https://onvibe.hb.ru-msk.vkcs.cloud/" + data.track)
        }
    }
    useEffect(() => {
        FetchData()
    }, [])
    const background = [
        { "type": "1", "url": "background_1.jpg" },
        { "type": "2", "url": "background_2.jpg" },
        { "type": "3", "url": "background_3.jpg" },
        { "type": "4", "url": "background_4.jpg" },
    ]
    const [backgroundType, setBackgroundType] = useState(background[0].type);

    const waveformRef = useRef<HTMLDivElement>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState('')
    const [currentTimeInt, setCurrentTimeInt] = useState(0);
    const [currentTimeIntEnd, setCurrentTimeIntEnd] = useState(15);
    useEffect(() => {
        if (!audioRef.current) return;
        if (currentTimeInt + 15 > audioRef.current.duration) {
            setCurrentTimeIntEnd(Math.floor(audioRef.current.duration))
            setCurrentTimeInt(Math.floor(currentTime))
        } else {
            setCurrentTimeIntEnd(currentTimeInt + 15)
            setCurrentTimeInt(Math.floor(currentTime))
        }
    }, [currentTime])
    useEffect(() => {
        if (waveformRef.current && audioUrl) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current!,
                waveColor: '#8c8c8c',
                progressColor: '#4F46E5',
                cursorWidth: 0,
                barWidth: 2,
                responsive: true,
                backend: 'MediaElementWebAudio',
            });

            waveSurferRef.current.load(audioUrl);
        }

        return () => {
            if (waveSurferRef.current) {
                waveSurferRef.current.destroy();
            }
        };
    }, [audioUrl]);



    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!waveSurferRef.current) return;
        if (!audioRef.current) return;

        const boundingRect = waveformRef.current!.getBoundingClientRect();
        const xPos = e.clientX - boundingRect.left;

        const seekTime = xPos / boundingRect.width;

        waveSurferRef.current.seekTo(seekTime);
        setCurrentTime(seekTime * (audioRef.current?.duration || 1))
        audioRef.current.currentTime = seekTime * (audioRef.current?.duration || 1)
    };

    const handlePlay = () => {
        waveSurferRef.current!.play()
    };
    const handlePlayStop = () => {
        waveSurferRef.current!.stop()
        waveSurferRef.current!.seekTo(currentTime / (audioRef.current?.duration || 1));
    };
    const handleTimeUpdate = () => {
        if (audioRef?.current) setCurrentTime(audioRef?.current.currentTime);
        if (!waveSurferRef.current) return;
        waveSurferRef.current.seekTo(currentTime / (audioRef.current?.duration || 1));
    };


    function secondsToMMSS(seconds: any) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Добавляем ведущие нули, если необходимо
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const CreateSnippet = async () => {
        openModal()
        const res = await fetch('/api/generator/createSnippet', {
            method: "POST",
            body: JSON.stringify({
                id_track: parseInt(params.id, 10),
                track_start: currentTimeInt,
                track_end: currentTimeIntEnd,
                type_background: backgroundType
            })
        })
        try {
            const data = await res.json()
            if (data.message === "success") {
                closeModal()
            }
        } catch {

        }
    }
    const [Modal, setModal] = useState(false)
    function closeModal() {
    }

    function openModal() {
        setModal(true)
    }
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('generator_id')}</title>
            </head>
            <div className="flex lg:flex-row flex-col gap-y-4 justify-between">
                <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('snippet_title')}</span>
                <div className="flex">
                    <button onClick={CreateSnippet} className="items-center gap-x-2 bg-[#5351FF] text-slate-50 font-medium px-3 rounded-lg py-1 lg:w-fit w-full text-center">{t('create_snippet')}</button>
                </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-2 w-full">
                <div className="bg-[#fff] dark:bg-zinc-900 transition mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md w-full p-4">
                    {loading ? (
                        <div className="flex w-full h-full lg:py-0 py-20 justify-center items-center">
                            <BigSpinnerLoading />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-between h-full gap-6">
                            <div className="flex flex-col gap-y-4">
                                <span className="text-xl text-gray-700 font-bold dark:text-slate-200">{t('selected_track')}</span>
                                <div className="flex gap-x-2">
                                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${trackData?.cover}`} alt="/" className="w-24 rounded-md" />
                                    <div className="flex flex-col">
                                        <div>
                                            <span className="text-zinc-900 dark:text-slate-50 font-semibold text-lg">{trackData?.title}</span>
                                        </div>
                                        <span className="text-zinc-700 dark:text-slate-300 text-sm">
                                            {trackData?.artist?.length && Array.isArray(trackData?.artist) && trackData?.artist?.length > 0 ? (
                                                <>
                                                    {trackData?.artist.map((items: any, index: number, array: string | any[]) => (
                                                        <React.Fragment key={index}>
                                                            {items}
                                                            {index !== array.length - 1 && ', '}
                                                        </React.Fragment>
                                                    ))}
                                                </>
                                            ) : "N/A"}
                                            {' '}
                                            {trackData?.featartist.length && Array.isArray(trackData?.featartist) && trackData?.featartist.length > 0 ? (
                                                <>
                                                    (feat.{' '}
                                                    {trackData?.featartist.map((items: any, index: number, array: string | any[]) => (
                                                        <React.Fragment key={index}>
                                                            {items}
                                                            {index !== array.length - 1 && ', '}
                                                        </React.Fragment>
                                                    ))}
                                                    )
                                                </>
                                            ) : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-300 dark:border-zinc-800 p-4">
                                <span className="text-xl text-gray-700 font-bold dark:text-slate-200">{t('selected_time')}</span>
                                <div className="waveform-container flex flex-col gap-y-2">
                                    <div ref={waveformRef} className="waveform" onClick={handleSeek}></div>
                                    <audio
                                        ref={audioRef}
                                        controls
                                        src={audioUrl}
                                        onTimeUpdate={handleTimeUpdate}
                                        onPlay={() => handlePlay()}
                                        onPause={() => handlePlayStop()}
                                        className='w-full h-10'
                                    ></audio>
                                    <div className="flex flex-col gap-y-0.5">
                                        <span className="text-base text-gray-700 font-medium dark:text-slate-200">{t('your_time')}</span>
                                        <div className="flex gap-x-2 items-center">
                                            <div className="px-2 py-1 rounded-md border border-slate-300 dark:border-zinc-800">
                                                {secondsToMMSS(currentTimeInt)}
                                            </div>
                                            -
                                            <div className="px-2 py-1 rounded-md border border-slate-300 dark:border-zinc-800">
                                                {secondsToMMSS(currentTimeInt + 15)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-[#fff] dark:bg-zinc-900 transition mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md w-full p-4">
                    <span className="flex flex-col gap-y-2">
                        <span className="text-xl text-gray-700 font-bold dark:text-slate-200">{t('selected_background')}</span>
                        <div className="grid xl:grid-cols-4 grid-cols-2 gap-2 select-none h-full">
                            {background.map((item, index) => (
                                <button onClick={() => setBackgroundType(item.type)} key={index}>
                                    {backgroundType === item.type ? (
                                        <div className="p-1 border-2 border-indigo-600 rounded-md">
                                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.url}`} className="rounded-md" alt="" />
                                        </div>
                                    ) : (
                                        <div className="p-1 hover:border-2 border-slate-400 dark:border-zinc-700 rounded-md">
                                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.url}`} className="rounded-md" alt="" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </span>
                </div>
            </div>

            <Transition appear show={Modal} as={Fragment}>
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
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                                        <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                            {t('snippet_title')}
                                        </div>
                                    </div>
                                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                        <div className="flex flex-col">
                                            <span className="text-base dark:text-slate-300 text-zinc-700">{t('please_wait')}</span>
                                            <div className="flex w-full py-20 justify-center items-center">
                                                <BigSpinnerLoading />
                                            </div>
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