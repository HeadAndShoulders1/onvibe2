import PlayerAudio from "@/components/upload/playerAudio/page";
import { useTranslations } from "next-intl"
import React from "react";
import { useEffect, useState } from "react";

export default function ReleaseInfo({ params }: { params: { id: string } }) {
  const t = useTranslations('finish')
  let [release_info, setReleases] = useState<Release | null>(null);
  type Release = {
    id: string;
    cover_small_path: string;
    title: string;
    version: string;
    artist: string;
    featartist: string;
    date_release: string;
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
  useEffect(() => {
    fetchUserData();

  }, ['']);
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      return "N/A";
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
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
    track: string
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
      <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
        <h1 className="text-lg text-zinc-800 dark:text-slate-200 font-bold">{t('check_information')}</h1>
        <div className="flex w-full flex-col lg:flex-row mt-4">
          <div className="">
            <div className="relative h-[160px] w-[160px] items-center justify-center rounded-2xl lg:rounded-2xl bg-gray-100 dark:bg-zinc-800">
              <div className="relative flex h-full w-full items-center justify-center">
                {release_info?.cover_small_path ? (
                  <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${release_info.cover_small_path}`} className="h-[160px] w-[160px] rounded-2xl lg:rounded-2xl" alt="cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                    <path d="M7 12C7 9.23858 9.23858 7 12 7" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                    <path d="M17 12C17 14.7614 14.7614 17 12 17" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                    <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col h-full p-4 w-full gap-y-8">
              <div className="grid gap-y">
                <div className="flex gap-x-2 text-left w-full">
                  <span className="text-xl font-bold text-zinc-800 dark:text-slate-200">{release_info?.title ? release_info?.title : "N/A"}</span>
                  {release_info?.version ? (
                    <span className="text-xl font-bold text-slate-2000 dark:text-zinc-400">({release_info?.version})</span>
                  ) : null}
                </div>
                <div className="flex gap-x-2">
                  <span className="text-base font-semibold  text-zinc-800 dark:text-slate-200">
                    {(release_info && Array.isArray(release_info.artist) && release_info.artist.length > 0) ? (
                      <>
                        {release_info.artist.map((items, index, array) => (
                          <React.Fragment key={index}>
                            {items}
                            {index !== array.length - 1 && ', '}
                          </React.Fragment>
                        ))}
                      </>
                    ) : ("N/A")}

                  </span>
                  {(release_info && Array.isArray(release_info?.featartist) && release_info?.featartist.length > 0) ? (
                    <span className="text-base font-semibold text-gray-600 dark:text-zinc-400">
                      (feat.{' '}
                      {release_info?.featartist.map((items, index, array) => (
                        <React.Fragment key={index}>
                          {items}
                          {index !== array.length - 1 && ', '}
                        </React.Fragment>
                      ))}
                      )
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 w-full md:grid-cols-3 lg:flex items-center gap-12 flex-wrap">
                <div className="grid gap-y text-left">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">{t('date_release')}</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{release_info?.date_release ? formatDate(new Date(release_info.date_release)) : "N/A"}</span>
                </div>
                <div className="grid gap-y text-left">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">{t('meta_language')}</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{release_info?.meta_language ? release_info?.meta_language : "N/A"}</span>
                </div>
                <div className="grid gap-y text-left">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">{t('genre')}</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{release_info?.genre ? release_info?.genre : "N/A"}</span>
                </div>
                <div className="grid gap-y text-left">
                  <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('type')}</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{release_info?.type ? release_info?.type : "N/A"}</span>
                </div>
                <div className="grid gap-y text-left">
                  <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('p_line')}</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{release_info?.p_line ? release_info?.p_line : "N/A"}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {track_info && track_info.map((item, index) => (
        <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
          <div className="flex w-full justify-between items-center overflow-x-auto whitespace-nowrap">
            <div className="flex gap-x-4 items-center text-lg font-bold text-zinc-800 dark:text-slate-200">
              <span>{item.order}</span>
              <span>|</span>
              <div className="flex gap-x-2">
                <div className="flex items-end gap-x-1">
                  {Array.isArray(item?.artist) && item?.artist.length > 0 ? (
                    <>
                      {item?.artist.map((items, index, array) => (
                        <>
                          {items}
                          {index !== array.length - 1 && ', '}
                        </>
                      ))}

                    </>
                  ) : "N/A"}

                  {Array.isArray(item?.featartist) && item?.featartist.length > 0 ? (
                    <span className="text-base font-semibold text-gray-600 dark:text-zinc-400">
                      (feat.{' '}
                      {item?.featartist.map((items, index, array) => (
                        <>
                          {items}
                          {index !== array.length - 1 && ', '}
                        </>
                      ))}
                      )
                    </span>
                  ) : null}
                </div>
                <span className="font-bold text-zinc-800 dark:text-slate-200">-</span>
                <span className="font-bold text-zinc-800 dark:text-slate-200">{item?.title ? item?.title : "N/A"}</span>
                {item?.version ? (
                  <span className="text-slate-2000 dark:text-zinc-400">({item?.version})</span>
                ) : null}
                <div className="flex items-start">
                  {item?.is_curse === true ? (
                    <>
                      <span className="flex w-4 h-4 bg-red-100 rounded text-xs font-medium text-red-600 items-center justify-center">E</span>
                    </>) : null}
                  {item?.is_instrumental === true ? (
                    <>
                      <span className="flex w-4 h-4 bg-blue-100 rounded text-xs font-medium text-blue-600 items-center justify-center">In</span>
                    </>) : null}
                </div>
              </div>
            </div>
          </div><div className="flex flex-col gap-y-4 mt-4">
            <PlayerAudio track_mp3={item.track} />
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 ">
              <div className="grid gap-y text-left">
                <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('genre_track')}</span>
                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.genre ? item?.genre : "N/A"}</span>
              </div>
              <div className="grid gap-y text-left">
                <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('is_curse_track')}</span>
                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.is_curse === true ? t('yes') : t('no')}</span>
              </div>
              <div className="grid gap-y text-left">
                <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('is_instrumental_track')}</span>
                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.is_instrumental === true ? t('yes') : t('no')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
