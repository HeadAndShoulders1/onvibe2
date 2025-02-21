import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import BigAudioPlayer from "@/components/upload/playerAudionBig/page";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { TimeBar } from "./TimeBar";
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import IsrcChange from "./isrcchange";

export default function TrackListAdmin({ item }: any) {
  const t = useTranslations('catalog')
  const [openAudio, setOpenAudio] = useState(false)
  const [Audio, setAudio] = useState('')
  const [TitleTrack, setTitleTrack] = useState('')
  const [ImageTrack, setImageTrack] = useState('')
  const [ArtistTrack, setArtistTrack] = useState<[]>([])
  const [FeatArtistTrack, setFeatArtistTrack] = useState<[]>([])
  const HandleAudio = (audio: any, title: any, image: any, artist: any, featartist: any) => {
    setOpenAudio(true)
    setImageTrack(image)
    setTitleTrack(title)
    setArtistTrack(artist)
    setFeatArtistTrack(featartist)
    setAudio(audio)
  }
  const handleCloseAudio = () => {
    setOpenAudio(false);
  };

  const handleButtonClick = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/releases/regonoize_music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_url: track_mp3,
      }),
    });
    setLoading(false)
    const data_track = await res.json();
    if (data_track.message == "not_found") {
      setSuccess(false)
    } else {
      setSuccess(true)
      set_info_ap(data_track.results.music)
    }
  }

  const [info_ap, set_info_ap] = useState<Info[]>([])
  type Info = {
    result: {
      title: any,
      artists: any,
      sample_begin_time_offset_ms: any,
      sample_end_time_offset_ms: any,
      duration_ms: any,
      score: any,
      label: any,
      album: {
        name: any
      }
    },
    url: any,
  }
  const [success, setSuccess] = useState(false)
  const [ModalRecognize, setModalRecognize] = useState(false)
  const [loading, setLoading] = useState(true)
  const [track_mp3, setTrack] = useState<string>('')
  function closeModalRecognize() {
    setModalRecognize(false)
  }

  function openModalRecognize(subscribe: any) {
    setModalRecognize(true)
    setTrack('https://onvibe.hb.ru-msk.vkcs.cloud/' + subscribe)
  }
  useEffect(() => {
    if (track_mp3 != '') {
      handleButtonClick();
    }
  }, [track_mp3])
  function millisecondsToTime(time: number) {
    let seconds: number = Math.floor((time / 1000) % 60);
    let minutes: number = Math.floor((time / (1000 * 60)) % 60);

    const second = (seconds < 10) ? ("0" + seconds.toString()) : seconds;
    const minute = (minutes < 10) ? ("0" + minutes.toString()) : minutes;

    return minute + ":" + second;
  }


  return (
    <>
      <Disclosure >
        {({ open }) => (
          <>
            <Disclosure.Button>
              <div className="flex w-full">
                <div className="p-4 items-center flex   rounded-lg justify-center">
                  <ChevronRightIcon
                    className={`${open ? 'rotate-90 transform' : ''
                      }h-5 w-5 text-zinc-800 dark:text-slate-200 `}
                  />
                  {t('list')}
                </div>
              </div>
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >

              <Disclosure.Panel className=" overflow-x-auto table-fixed max-w-full">
                <table className="w-full">
                  <thead className="text-left text-sm whitespace-nowrap text-zinc-800 dark:text-slate-200 font-semibold border-b border-t border-slate-300 dark:border-zinc-800">
                    <tr>
                      <th className="py-2 px-4"></th>
                      <th className="py-2 px-4">№</th>
                      <th className="py-2 px-4">{t('name')}</th>
                      <th className="py-2 px-4">{t('artists')}</th>
                      <th className="py-2 px-4">{t('genre')}</th>
                      <th className="py-2 px-4">ISRC</th>
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(item?.tracks) && item?.tracks.length > 0 ? (
                      <>
                        {item?.tracks.map((items: any, index: any, array: any) => (
                          <tr className="border-t border-slate-300 dark:border-zinc-800 py-2" key={index}>
                            <td className="py-2 px-4">
                              <div className="items-center flex justify-center">
                                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => HandleAudio(items.track_mp3, items.title, item.cover_small_path, items.artist, items.featartist)} className="rounded-md p-2 shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-800">
                                  <PlayIcon className="h-4 w-4 fill-black dark:fill-white" aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-4">{items.order ? items.order : ("N/A")}</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-x-1">
                                <span className="text-base font-bold text-zinc-800 dark:text-slate-200 whitespace-nowrap">{items?.title ? items?.title : "N/A"}</span>
                                {items.version ? (
                                  <span className="text-base font-bold text-zinc-600 dark:text-slate-400 whitespace-nowrap">({items.version})</span>
                                ) : null}
                                {items?.is_curse === true ? (
                                  <>
                                    <span className="flex w-4 h-4 bg-red-100 rounded text-xs font-medium text-red-600 items-center justify-center">E</span>
                                  </>) : null}
                                {items?.is_instrumental === true ? (
                                  <>
                                    <span className="flex w-4 h-4 bg-blue-100 rounded text-xs font-medium text-blue-600 items-center justify-center">In</span>
                                  </>) : null}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              {Array.isArray(items?.artist) && items?.artist.length > 0 ? (
                                <>
                                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                    {items?.artist.map((items: any, index: number, array: string | any[]) => (
                                      <React.Fragment key={index}>
                                        {items}
                                        {index !== array.length - 1 && ', '}
                                      </React.Fragment>
                                    ))}
                                  </span>
                                </>
                              ) : "N/A"}
                              {' '}
                              {Array.isArray(items?.featartist) && items?.featartist.length > 0 ? (
                                <span className="text-base text-slate-2000 dark:text-zinc-400">
                                  (feat.{' '}
                                  {items?.featartist.map((items: any, index: number, array: string | any[]) => (
                                    <React.Fragment key={index}>
                                      {items}
                                      {index !== array.length - 1 && ', '}
                                    </React.Fragment>
                                  ))}
                                  )
                                </span>
                              ) : null}
                            </td>
                            <td className="py-2 px-4">{items.genre ? items.genre : ("N/A")}</td>
                            <td className="py-2 px-4">
                              <IsrcChange id={items.id} isrc={items.isrc ? String(items.isrc) : ''} />
                            </td>
                            <td className="py-2 px-4">
                              <div className="items-center flex justify-center">
                                <Link href={`https://onvibe.hb.ru-msk.vkcs.cloud/${items.track_mp3}`} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-10 h-10">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                    <path d="M5.625 15C5.625 14.5858 5.28921 14.25 4.875 14.25C4.46079 14.25 4.125 14.5858 4.125 15H5.625ZM4.875 16H4.125H4.875ZM19.275 15C19.275 14.5858 18.9392 14.25 18.525 14.25C18.1108 14.25 17.775 14.5858 17.775 15H19.275ZM11.1086 15.5387C10.8539 15.8653 10.9121 16.3366 11.2387 16.5914C11.5653 16.8461 12.0366 16.7879 12.2914 16.4613L11.1086 15.5387ZM16.1914 11.4613C16.4461 11.1347 16.3879 10.6634 16.0613 10.4086C15.7347 10.1539 15.2634 10.2121 15.0086 10.5387L16.1914 11.4613ZM11.1086 16.4613C11.3634 16.7879 11.8347 16.8461 12.1613 16.5914C12.4879 16.3366 12.5461 15.8653 12.2914 15.5387L11.1086 16.4613ZM8.39138 10.5387C8.13662 10.2121 7.66533 10.1539 7.33873 10.4086C7.01212 10.6634 6.95387 11.1347 7.20862 11.4613L8.39138 10.5387ZM10.95 16C10.95 16.4142 11.2858 16.75 11.7 16.75C12.1142 16.75 12.45 16.4142 12.45 16H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM4.125 15V16H5.625V15H4.125ZM4.125 16C4.125 18.0531 5.75257 19.75 7.8 19.75V18.25C6.61657 18.25 5.625 17.2607 5.625 16H4.125ZM7.8 19.75H15.6V18.25H7.8V19.75ZM15.6 19.75C17.6474 19.75 19.275 18.0531 19.275 16H17.775C17.775 17.2607 16.7834 18.25 15.6 18.25V19.75ZM19.275 16V15H17.775V16H19.275ZM12.2914 16.4613L16.1914 11.4613L15.0086 10.5387L11.1086 15.5387L12.2914 16.4613ZM12.2914 15.5387L8.39138 10.5387L7.20862 11.4613L11.1086 16.4613L12.2914 15.5387ZM12.45 16V5H10.95V16H12.45Z" className="fill-black dark:fill-white" />
                                  </svg>
                                </Link>
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="items-center flex justify-center">
                                <button onClick={() => openModalRecognize(items.track_mp3)} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-10 h-10">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.357 1.61413C18.5701 1.25895 19.0308 1.14378 19.386 1.35689L19.0001 2.00001C19.386 1.35689 19.3857 1.35668 19.386 1.35689L19.3874 1.35772L19.389 1.35867L19.3927 1.36093L19.4023 1.36684C19.4096 1.37142 19.4189 1.37726 19.4299 1.38438C19.4519 1.39861 19.481 1.41798 19.5162 1.44261C19.5865 1.49183 19.6815 1.56234 19.7928 1.65509C20.0149 1.84018 20.3053 2.11667 20.5946 2.49272C21.1775 3.25046 21.7501 4.40735 21.7501 6.00001C21.7501 7.59266 21.1775 8.74955 20.5946 9.50729C20.3053 9.88334 20.0149 10.1598 19.7928 10.3449C19.6815 10.4377 19.5865 10.5082 19.5162 10.5574C19.481 10.582 19.4519 10.6014 19.4299 10.6156C19.4189 10.6228 19.4096 10.6286 19.4023 10.6332L19.3927 10.6391L19.389 10.6413L19.3874 10.6423C19.3871 10.6425 19.386 10.6431 19.0001 10L19.386 10.6431C19.0308 10.8562 18.5701 10.7411 18.357 10.3859C18.1448 10.0322 18.2581 9.57388 18.6098 9.35959L18.6153 9.35606C18.6226 9.35134 18.6365 9.3422 18.656 9.32855C18.695 9.30121 18.7563 9.25609 18.8325 9.19259C18.9854 9.06518 19.1949 8.86667 19.4057 8.59272C19.8228 8.05046 20.2501 7.20735 20.2501 6.00001C20.2501 4.79266 19.8228 3.94955 19.4057 3.40729C19.1949 3.13334 18.9854 2.93483 18.8325 2.80742C18.7563 2.74393 18.695 2.6988 18.656 2.67146C18.6365 2.65781 18.6226 2.64867 18.6153 2.64396L18.6098 2.64043C18.2581 2.42614 18.1448 1.96783 18.357 1.61413Z" className="fill-black dark:fill-white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 1.25001C7.37678 1.25001 5.25013 3.37665 5.25013 6.00001C5.25013 8.62336 7.37678 10.75 10.0001 10.75C12.6235 10.75 14.7501 8.62336 14.7501 6.00001C14.7501 3.37665 12.6235 1.25001 10.0001 1.25001ZM6.75013 6.00001C6.75013 4.20508 8.20521 2.75001 10.0001 2.75001C11.7951 2.75001 13.2501 4.20508 13.2501 6.00001C13.2501 7.79493 11.7951 9.25001 10.0001 9.25001C8.20521 9.25001 6.75013 7.79493 6.75013 6.00001Z" className="fill-black dark:fill-white" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 12.25C7.68658 12.25 5.55506 12.7759 3.97558 13.6643C2.41962 14.5396 1.25013 15.8661 1.25013 17.5L1.25007 17.602C1.24894 18.7638 1.24752 20.222 2.52655 21.2635C3.15602 21.7761 4.03661 22.1407 5.22634 22.3815C6.4194 22.623 7.97436 22.75 10.0001 22.75C12.0259 22.75 13.5809 22.623 14.7739 22.3815C15.9637 22.1407 16.8443 21.7761 17.4737 21.2635C18.7527 20.222 18.7513 18.7638 18.7502 17.602L18.7501 17.5C18.7501 15.8661 17.5807 14.5396 16.0247 13.6643C14.4452 12.7759 12.3137 12.25 10.0001 12.25ZM2.75013 17.5C2.75013 16.6487 3.37151 15.7252 4.71098 14.9717C6.02693 14.2315 7.89541 13.75 10.0001 13.75C12.1049 13.75 13.9733 14.2315 15.2893 14.9717C16.6288 15.7252 17.2501 16.6487 17.2501 17.5C17.2501 18.8078 17.2098 19.544 16.5265 20.1004C16.156 20.4022 15.5366 20.6967 14.4763 20.9113C13.4194 21.1252 11.9744 21.25 10.0001 21.25C8.02591 21.25 6.58087 21.1252 5.52393 20.9113C4.46366 20.6967 3.84425 20.4022 3.47372 20.1004C2.79045 19.544 2.75013 18.8078 2.75013 17.5Z" className="fill-black dark:fill-white" />
                                    <path d="M17.386 3.35689C17.0308 3.14378 16.5701 3.25895 16.357 3.61413L16.6052 4.63763L16.613 4.64295C16.6247 4.65115 16.6469 4.66736 16.6762 4.6918C16.7354 4.74108 16.8199 4.82084 16.9057 4.93229C17.0728 5.14955 17.2501 5.49266 17.2501 6.00001C17.2501 6.50735 17.0728 6.85046 16.9057 7.06772C16.8199 7.17917 16.7354 7.25893 16.6762 7.30822C16.6469 7.33265 16.6247 7.34887 16.613 7.35707L16.6052 7.36238C16.2571 7.57784 16.1457 8.03372 16.357 8.38588C16.5701 8.74106 17.0308 8.85624 17.386 8.64313L17.0001 8.00001C17.386 8.64313 17.3857 8.64333 17.386 8.64313L17.3873 8.64232L17.3888 8.64145L17.3919 8.63953L17.3994 8.63493L17.4186 8.62272C17.4333 8.61322 17.4517 8.60098 17.4732 8.58591C17.5162 8.55584 17.5721 8.51424 17.6365 8.46055C17.7649 8.35358 17.9303 8.19584 18.0946 7.98229C18.4275 7.54955 18.7501 6.89266 18.7501 6.00001C18.7501 5.10735 18.4275 4.45046 18.0946 4.01772C17.9303 3.80417 17.7649 3.64643 17.6365 3.53947C17.5721 3.48577 17.5162 3.44418 17.4732 3.4141C17.4517 3.39904 17.4333 3.38679 17.4186 3.3773L17.3994 3.36508L17.3919 3.36049L17.3888 3.35856L17.3873 3.35769C17.387 3.35749 17.386 3.35689 17.0001 4.00001L17.386 3.35689Z" className="fill-black dark:fill-white" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      </>
                    ) : null}
                  </tbody>
                </table>
                {item?.tracks.length == 0 ? (
                  <div className="flex w-full py-4 justify-center font-semibold text-zinc-800 dark:text-slate-200">
                    {t('not_found_track')}
                  </div>
                ) : null}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
      {openAudio && <BigAudioPlayer image={ImageTrack} artist={ArtistTrack} featartist={FeatArtistTrack} title={TitleTrack} track_mp3={Audio} active={openAudio} handleCloseAudio={handleCloseAudio} />}

      <Transition appear show={ModalRecognize} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModalRecognize}>
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                    <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                      {t('check_track')}
                    </div>
                    <div className="flex items-start">
                      <button onClick={closeModalRecognize} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 gap-y-4 flex flex-col">
                    {loading ? (
                      <div className="flex w-full items-center justify-center">
                        <BigSpinnerLoading />
                      </div>
                    ) : (
                      <>
                        {success ? (
                          <>
                            {info_ap.map((item, index) => (
                              <div className="flex p-4 w-full flex-col gap-y-8 rounded-xl border border-slate-300 dark:border-zinc-800" key={index}>
                                <div className="flex lg:flex-row flex-col w-full p-2">
                                  <div className="flex flex-col whitespace-nowrap text-left w-full">
                                    <span className="text-sm text-slate-600 dark:text-zinc-400">{t('title')}</span>
                                    <span className="text-base text-zinc-800 dark:text-slate-200 font-semibold">{item.result.title}</span>
                                  </div>
                                  <div className="flex flex-col whitespace-nowrap text-left w-full">
                                    <span className="text-slate-600 dark:text-zinc-400">{t('artists')}</span>
                                    {Array.isArray(item?.result.artists) ? (
                                      <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                                        {item?.result.artists.map((items: any, index: number, array: string | any[]) => (
                                          <React.Fragment key={index}>
                                            {items.name}
                                            {index !== array.length - 1 && ', '}
                                          </React.Fragment>
                                        ))}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="flex w-full lg:flex-row flex-col justify-between p-2">
                                  <div className="flex flex-col whitespace-nowrap text-left w-full">
                                    <span className="text-sm text-slate-600 dark:text-zinc-400">{t('album')}</span>
                                    <span className="text-base text-zinc-800 dark:text-slate-200 font-semibold">{item.result.album.name}</span>
                                  </div>
                                  <div className="flex flex-col whitespace-nowrap text-left w-full">
                                    <span className="text-sm text-slate-600 dark:text-zinc-400">P-Line</span>
                                    <span className="text-base text-zinc-800 dark:text-slate-200 font-semibold">{item.result.label}</span>
                                  </div>
                                </div>
                                <div className="flex gap-y-2 flex-col w-full p-2">
                                  <div className="flex w-full justify-between">
                                    <div className="flex items-center gap-x-1">
                                      <div className='flex h-2 w-2 rounded-full bg-indigo-600'></div>
                                      <span className="text-slate-600 dark:text-zinc-400">{t('zone_match')}</span>
                                    </div>
                                    <div className="flex items-center gap-x-1 py-1 px-2 bg-gray-200 dark:bg-zinc-800 rounded-md">
                                      <div className='flex h-2 w-2 rounded-full bg-indigo-600'></div>
                                      <span className="text-slate-600 dark:text-zinc-400">{item.result.score}</span>
                                    </div>
                                  </div>
                                  <div className="w-full flex">
                                    <TimeBar
                                      sampleBeginTimeOffsetMs={item.result.sample_begin_time_offset_ms}
                                      sampleEndTimeOffsetMs={item.result.sample_end_time_offset_ms}
                                      durationMs={item.result.duration_ms}
                                    />
                                  </div>
                                  <div className="flex w-full justify-between mt-1">
                                    <div className="flex items-center gap-x-1 bg-gray-200 dark:bg-zinc-800 py-1 px-2 rounded-md">
                                      <span className="text-slate-600 dark:text-zinc-400">{t('zone_timing')}</span>
                                      <span className="text-slate-600 dark:text-zinc-400">{millisecondsToTime(item.result.sample_begin_time_offset_ms)}</span>
                                      <span className="text-slate-600 dark:text-zinc-400">-</span>
                                      <span className="text-slate-600 dark:text-zinc-400">{millisecondsToTime(item.result.sample_end_time_offset_ms)}</span>
                                    </div>
                                    <div className="flex gap-x-1 items-center bg-gray-200 dark:bg-zinc-800 py-1 px-2 rounded-md">
                                      <span className="text-slate-600 dark:text-zinc-400">{t('duration')}: </span>
                                      <span className="text-slate-600 dark:text-zinc-400">{millisecondsToTime(item.result.duration_ms)}</span>
                                    </div>
                                  </div>
                                  {item.url ? (
                                    <Link href={item.url} className="flex border border-slate-300 dark:border-zinc-800 gap-x-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 p-4 w-fit mt-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                        <path d="M11 4H4V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V13" className="dark:stroke-gray-50 stroke-gray-900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        <path d="M9 15L20 4" className="dark:stroke-gray-50 stroke-gray-900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                        <path d="M15 4H20V9" className="dark:stroke-gray-50 stroke-gray-900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                      </svg>
                                      <span className="text-sm text-zinc-800 dark:text-slate-200 font-semibold">Spotify</span>
                                    </Link>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className="flex flex-col gap-y-4 w-full items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                              <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500"></path>
                            </svg>
                            <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('recognize_not_found')}</div>
                          </div>
                        )}
                      </>
                    )}

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