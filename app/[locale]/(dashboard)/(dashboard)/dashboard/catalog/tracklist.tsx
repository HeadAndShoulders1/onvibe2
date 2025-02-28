import BigAudioPlayer from "@/components/upload/playerAudionBig/page";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon, PlayIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import React from "react";
import { useState } from "react";

export default function TrackList({ item }: any) {
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
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(item?.tracks) && item?.tracks.length > 0 ? (
                      <>
                        {item?.tracks.map((items: any, index: any, array: any) => (
                          <tr className="border-t border-slate-300 dark:border-zinc-800 py-2" key={items.order}>
                            <td className="py-2 px-4 items-center flex justify-center">
                              <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => HandleAudio(items.track_mp3, items.title, item.cover_small_path, items.artist, items.featartist)} className="rounded-md p-2 shadow-sm hover:bg-gray-200 dark:hover:bg-zinc-800">
                                <PlayIcon className="h-4 w-4 fill-black dark:fill-white" aria-hidden="true" />
                              </button>
                            </td>
                            <td className="py-2 px-4">{items.order ? items.order : ("N/A")}</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-x-1">
                                <span className="text-base font-bold text-zinc-800 dark:text-slate-200">{items?.title ? items?.title : "N/A"}</span>
                                {items.version ? (
                                  <span className="text-base font-bold text-slate-2000 dark:text-zinc-400">({items.version})</span>
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
                            <td className="py-2 px-4">{items.isrc ? items.isrc : ("N/A")}</td>
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
    </>
  )
}