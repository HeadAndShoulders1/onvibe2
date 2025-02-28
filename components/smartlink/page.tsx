import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function SmartLinkSee({ smartlink_info }: any) {
  const t = useTranslations('smartlink')
  return (
    <div className="relative w-full min-h-full">
      <div className=" absolute flex h-full w-full flex-col bg-[#141518]">
        <div className="absolute flex h-full w-full scale-100 bg-center opacity-10 blur-md">
          <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${smartlink_info?.cover}`} alt="cover" className="w-full" />
        </div>

      </div>
      <div className='flex relative items-center justify-center py-20 px-10'>
        <div className="w-80 flex flex-col gap-y-6 items-center justify-center">
          <div className="relative w-full h-full rounded-[40px]">
            <img
              src={`https://onvibe.hb.ru-msk.vkcs.cloud/${smartlink_info?.cover}`}
              alt="cover-background"
              className="absolute top-0 left-0 z-10 blur-[100px] opacity-70 w-full h-full rounded-3xl"
            />

            <img
              src={`https://onvibe.hb.ru-msk.vkcs.cloud/${smartlink_info?.cover}`}
              alt="cover"
              className="relative z-20 w-full h-full rounded-3xl"
            />
          </div>
          <div className="flex flex-col gap-y-1 items-center w-full">
            <div className="">
              <span className="text-slate-200 text-2xl font-semibold">{smartlink_info?.title}</span>
              {smartlink_info?.version ? (<>
                <span className="text-zinc-400 text-2xl">({smartlink_info?.version})</span>
              </>) :
                null}
            </div>
            <span className="text-base text-zinc-400">
              {Array.isArray(smartlink_info?.artist) && smartlink_info?.artist.length > 0 ? (
                <>
                  {smartlink_info?.artist.map((items: any, index: number, array: string | any[]) => (
                    <React.Fragment key={index}>
                      {items}
                      {index !== array.length - 1 && ', '}
                    </React.Fragment>
                  ))}

                </>
              ) : "N/A"}
              {' '}
              {Array.isArray(smartlink_info?.featartist) && smartlink_info?.featartist.length > 0 ? (
                <>
                  (feat.
                  {smartlink_info?.featartist.map((items: any, index: number, array: string | any[]) => (
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
          {Array.isArray(smartlink_info?.smart_url) && smartlink_info?.smart_url.length > 0 ? (
            <div className="bg-zinc-900 py-4 px-4 w-full rounded-xl  ">
              <div className="flex flex-col gap-y-8">
                {smartlink_info?.smart_url.map((items: any, index: number, array: string | any[]) => (
                  <div className="flex justify-between" key={index}>
                    <div className="flex items-center justify-center w-32 h-12">
                      <img src={`/platform/${items.cover}`} alt={items.platform} />
                    </div>
                    <div className="flex items-center">
                      <Link href={items.url} className="flex items-center w-fit bg-none rounded-xl border border-zinc-800 px-4 py-2 shadow-sm">
                        <span className="text-slate-200 text-sm">
                          {t('listen')}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <Link href="/" className="flex gap-x-4 items-center">
            <div className="text-slate-200 text-sm">{t('create_with')}</div>
            <div className="w-28">
              <img src="/platform/logo.svg" alt="Logo" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}