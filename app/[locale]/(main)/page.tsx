'use client'
import AOS from 'aos'
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import StoresOther from '@/components/main/platforms_store/page';
import Permission from '@/components/main/Permission/page';
import FAQ from '@/components/main/faq/page';
import Interested from '@/components/main/interested/page';
import LogoCarousel from '@/components/main/partners/partners';
import TracksHome from '@/components/main/tracks/tracks';
import StoresOther2 from '@/components/main/platform_store_2/page';
import PlaylistsHome from '@/components/main/playlists/playlists-home';

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    })
  }, [])
  const t = useTranslations('home');
  const md = useTranslations('metadata');
  
  return (

    <div className="w-full grid gap-y-[8rem]">
      <head>
        <title>{md('general')}</title>
        <meta name="description" content={md('general_desc')} />
      </head>
      <div className="h-screen relative flex w-full mx-auto" data-aos="fade-up" data-aos-delay="100">
        <div className="w-full h-screen bg-[url('/lines.svg')] bg-center absolute bg-no-repeat bg-cover opacity-90 dark:opacity-[0.02] z-[-1]"></div>
        <div className="flex w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto items-center justify-center py-52">
          <div className="flex flex-col gap-y-8 z-20 items-center text-center">
            <span className="dark:text-slate-200 text-slate-800 font-semibold lg:text-5xl text-[44px] xl:text-7xl 2xl:text-[90px] leading-none " data-aos="fade-right" data-aos-delay="100">{t('title')}</span>
            <span className="lg:text-base text-sm dark:text-zinc-500 text-slate-500 max-w-4xl" data-aos="fade-left" data-aos-delay="100">{t('description')}</span>
            <div className="flex gap-x-4 items-center" data-aos="fade-up" data-aos-delay="100">
              <div className="rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
                <div className="hover:bg-gray-700 transition bg-gray-800 rounded-full px-8 py-2 text-sm lg:text-base text-slate-50 font-medium">{t('sign_in')}</div>
              </div>
              <div className="hover:bg-zinc-300 hover:dark:bg-zinc-700 transition rounded-md h-fit px-4 py-2 text-sm lg:text-base dark:text-zinc-300 text-zinc-700 font-bold">{t('learn_more')}</div>
            </div>
          </div>
        </div>
      </div>
      <Permission />
      <div>
        <TracksHome/>
      </div>
      <PlaylistsHome/>
      <StoresOther />
      <LogoCarousel/>
      <StoresOther2/>
      <FAQ />
      <Interested />
    </div>
  )
}
