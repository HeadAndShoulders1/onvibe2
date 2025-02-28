import { PauseIcon, PlayIcon, SpeakerWaveIcon } from "@heroicons/react/20/solid";
import { Alert } from "@material-tailwind/react";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";

interface Track {
  image: string;
  title: string;
  track_mp3: string;
  active: boolean;
  artist: [];
  featartist: [];
  handleCloseAudio: () => void;
}

export default function BigAudioPlayer(props: Track) {
  const MAX = 20;
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(MAX);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const oceanRef = useRef<HTMLAudioElement>(null);
  const skipTime = 15;

  const handleRewind = () => {
    if (oceanRef.current) {
      const newTime = oceanRef.current.currentTime - skipTime;
      oceanRef.current.currentTime = Math.max(newTime, 0);
      setCurrentTime(oceanRef.current.currentTime);
    }
  };

  const handleForward = () => {
    if (oceanRef.current) {
      const newTime = oceanRef.current.currentTime + skipTime;
      oceanRef.current.currentTime = Math.min(newTime, duration);
      setCurrentTime(oceanRef.current.currentTime);
    }
  };

  const duration = oceanRef.current ? oceanRef.current.duration || 0 : 0;

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    return formattedTime;
  };

  const togglePlayPause = () => {
    if (oceanRef.current) {
      if (isPlaying) {
        oceanRef.current.pause();
      } else {
        oceanRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    setVolume(Number(value));
    if (oceanRef.current) {
      const normalizedVolume = Number(value) / MAX;
      oceanRef.current.volume = normalizedVolume;
    }
  }

  const handleTimeUpdate = () => {
    if (oceanRef.current) {
      setCurrentTime(oceanRef.current.currentTime);
    }
  };

  const handleSeek = (e: any) => {
    if (oceanRef.current) {
      const seekTime = e.target.value;
      oceanRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  useEffect(() => {
    if (oceanRef.current) {
      oceanRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }, []);
  const handleLoadedMetadata = () => {
    if (oceanRef.current) {
      setMaxDuration(oceanRef.current.duration);
    }
  };
  return (
    <Alert
      open={props.active}
      className="z-f select-none "
      animate={{
        mount: { y: 0 },
        unmount: { y: 100 },
      }}
    >
      <audio
        ref={oceanRef}
        src={`https://onvibe.hb.ru-msk.vkcs.cloud/${props.track_mp3}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-y-4 lg:flex-row mx-20 bg-[#fff] dark:bg-zinc-900 mt-5 rounded-2xl border border-slate-300 dark:border-zinc-800 p-4 lg:p-2">
          <div className="flex justify-between">
            <div className="flex gap-x-4 lg:pr-6 items-center">
              <div className="rounded-lg w-14 h-14 flex items-center justify-center  bg-gray-100 dark:bg-zinc-900">
                {props.image ? (
                  <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${props.image}`} className="w-14 h-14 rounded-lg" alt="cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                    <path d="M7 12C7 9.23858 9.23858 7 12 7" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                    <path d="M17 12C17 14.7614 14.7614 17 12 17" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                    <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm dark:text-slate-200 text-zinc-800 font-bold">{props.title ? props.title : "N/A"}</span>
                <span className="text-xs dark:text-zinc-400 text-slate-2000">
                  {Array.isArray(props?.artist) && props?.artist.length > 0 ? (
                    <>
                      {props?.artist.map((items: any, index: number, array: string | any[]) => (
                        <React.Fragment key={index}>
                          {items}
                          {index !== array.length - 1 && ', '}
                        </React.Fragment>
                      ))}

                    </>
                  ) : "N/A"}
                  {' '}
                  {Array.isArray(props?.featartist) && props?.featartist.length > 0 ? (
                    <>
                      (feat.{' '}
                      {props?.featartist.map((items: any, index: number, array: string | any[]) => (
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
            <button onClick={props.handleCloseAudio} className="hover:bg-gray-200 dark:hover:bg-zinc-800 flex items-start w-8 h-8 p-2 rounded-md lg:hidden justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-x-4 px-6  lg:border-l lg:border-r border-slate-300 dark:border-zinc-800">
            <button onClick={handleRewind}
              type="button"
              className="w-full rounded-md p-2 text-white shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-800 justify-center flex"
            >
              <svg className="h-6 w-6 flex-none" fill="none">
                <path d="M6.22 11.03a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM3 6.75l-.53-.53a.75.75 0 0 0 0 1.06L3 6.75Zm4.28-3.22a.75.75 0 0 0-1.06-1.06l1.06 1.06ZM13.5 18a.75.75 0 0 0 0 1.5V18ZM7.28 9.97 3.53 6.22 2.47 7.28l3.75 3.75 1.06-1.06ZM3.53 7.28l3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm16.72 5.47c0 2.9-2.35 5.25-5.25 5.25v1.5a6.75 6.75 0 0 0 6.75-6.75h-1.5ZM15 7.5c2.9 0 5.25 2.35 5.25 5.25h1.5A6.75 6.75 0 0 0 15 6v1.5ZM15 6H3v1.5h12V6Zm0 12h-1.5v1.5H15V18Z" className="fill-black dark:fill-white"></path>
                <path d="M3 15.75h.75V21" className="fill-black dark:fill-white stroke-black dark:stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M9 16.5A.75.75 0 0 0 9 15v1.5Zm-2.25-.75V15a.75.75 0 0 0-.75.75h.75Zm0 2.25H6c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5ZM9 15H6.75v1.5H9V15Zm-3 .75V18h1.5v-2.25H6Zm.75 3h1.5v-1.5h-1.5v1.5Zm1.5 1.5h-1.5v1.5h1.5v-1.5ZM9 19.5a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25H9Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z" className="fill-black dark:fill-white "></path>
              </svg>
            </button>
            <button
              onClick={togglePlayPause}
              type="button"
              className="w-full rounded-md p-2 text-white shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-800 justify-center flex"
            >
              {isPlaying ? (
                <PauseIcon className="h-6 w-6 fill-black dark:fill-white" aria-hidden="true" />

              ) : (
                <PlayIcon className="h-6 w-6 fill-black dark:fill-white" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={handleForward}
              type="button"
              className="w-full rounded-md p-2 text-white shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-800 justify-center flex"
            >
              <svg className="h-6 w-6 flex-none" fill="none">
                <path d="M16.72 9.97a.75.75 0 1 0 1.06 1.06l-1.06-1.06ZM21 6.75l.53.53a.75.75 0 0 0 0-1.06l-.53.53Zm-3.22-4.28a.75.75 0 1 0-1.06 1.06l1.06-1.06ZM10.5 19.5a.75.75 0 0 0 0-1.5v1.5Zm3.75-4.5a.75.75 0 0 0 0 1.5V15Zm.75.75h.75A.75.75 0 0 0 15 15v.75ZM14.25 21a.75.75 0 0 0 1.5 0h-1.5Zm6-4.5a.75.75 0 0 0 0-1.5v1.5ZM18 15.75V15a.75.75 0 0 0-.75.75H18ZM18 18h-.75c0 .414.336.75.75.75V18Zm0 2.25a.75.75 0 0 0 0 1.5v-1.5Zm-.22-9.22 3.75-3.75-1.06-1.06-3.75 3.75 1.06 1.06Zm3.75-4.81-3.75-3.75-1.06 1.06 3.75 3.75 1.06-1.06ZM2.25 12.75A6.75 6.75 0 0 0 9 19.5V18a5.25 5.25 0 0 1-5.25-5.25h-1.5ZM9 6a6.75 6.75 0 0 0-6.75 6.75h1.5C3.75 9.85 6.1 7.5 9 7.5V6Zm0 1.5h12V6H9v1.5Zm0 12h1.5V18H9v1.5Zm5.25-3H15V15h-.75v1.5Zm0-.75V21h1.5v-5.25h-1.5Zm6-.75H18v1.5h2.25V15Zm-3 .75V18h1.5v-2.25h-1.5Zm.75 3h1.5v-1.5H18v1.5Zm1.5 1.5H18v1.5h1.5v-1.5Zm.75-.75a.75.75 0 0 1-.75.75v1.5a2.25 2.25 0 0 0 2.25-2.25h-1.5Zm-.75-.75a.75.75 0 0 1 .75.75h1.5a2.25 2.25 0 0 0-2.25-2.25v1.5Z" className="fill-black dark:fill-white"></path>
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center ml-4 leading-5 ">
            <div className="flex justify-between gap-x-4">
              <div className="text-sm text-zinc-800 dark:text-slate-200 w-8 whitespace-nowrap">{formatTime(currentTime)}</div>
              <input
                className="h-5 accent-indigo-600 w-60"
                type="range"
                value={currentTime}
                max={maxDuration}
                onChange={handleSeek}
              />
              <div className="text-sm text-zinc-800 dark:text-slate-200 justify-end w-8 whitespace-nowrap">{formatTime(duration)}</div>
            </div>
            <div className="relative flex flex-col space-y-0">
              <div className="mx-2 flex items-center justify-center">
                <Menu>
                  <Menu.Button className={`hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-md`}>
                    <SpeakerWaveIcon
                      className="h-5 w-5 fill-black dark:fill-white "
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-1.5 mb-10 w-[40px] bottom-0 py-2 items-center flex justify-center origin-bottom-right divide-y divide-gray-100 rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <Menu.Item>
                        <input
                          type="range"
                          className="writing-mode-vertical rotate-[540] h-150 w-1 accent-indigo-600 rounded-md"
                          min={0}
                          value={volume}
                          max={MAX}
                          onChange={(e) => handleVolume(e)}
                        />
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <button onClick={props.handleCloseAudio} className="hover:bg-gray-200 dark:hover:bg-zinc-800 lg:flex items-start w-8 h-8 p-2 rounded-md hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
            </svg>
          </button>
        </div>
      </div>
    </Alert>

  )
}
