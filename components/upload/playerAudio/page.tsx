import { Menu, Transition } from "@headlessui/react";
import { PauseIcon, PlayIcon, SpeakerWaveIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef, useState } from "react";

interface Track {
    track_mp3: string;
}

export default function PlayerAudio(props: Track) {
    const MAX = 20;
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState<number>(MAX);
    const [currentTime, setCurrentTime] = useState(0);
    const [maxDuration, setMaxDuration] = useState(0);
    const oceanRef = useRef<HTMLAudioElement>(null);

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

    const handleLoadedMetadata = () => {
        if (oceanRef.current) {
            setMaxDuration(oceanRef.current.duration);
        }
    };

    return (
        <div className="flex w-full justify-between items-center">
            <div>
                <button
                    onClick={togglePlayPause}
                    type="button"
                    className="w-full rounded-full p-2 text-white shadow-sm"
                >
                    {isPlaying ? (
                        <PauseIcon className="h-6 w-6 fill-black dark:fill-white" aria-hidden="true" />

                    ) : (
                        <PlayIcon className="h-6 w-6 fill-black dark:fill-white" aria-hidden="true" />
                    )}
                </button>
            </div>
            <input
                className="w-full h-5 accent-indigo-600"
                type="range"
                value={currentTime}
                max={maxDuration}
                onChange={handleSeek}
            />
            <div className="relative flex flex-col space-y-0">
                <div className="mx-2 flex">
                    <Menu>
                        <Menu.Button>
                            <SpeakerWaveIcon
                                className="h-5 w-5 fill-black dark:fill-white"
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
                            <Menu.Items className="absolute right-0 mb-8 w-[40px] bottom-0 py-2 items-center flex justify-center origin-bottom-right divide-y divide-gray-100 rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 focus:outline-none">
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
            <audio
                ref={oceanRef}
                src={`https://onvibe.hb.ru-msk.vkcs.cloud/${props.track_mp3}`}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={handleLoadedMetadata}
            />
        </div>
    );
}
