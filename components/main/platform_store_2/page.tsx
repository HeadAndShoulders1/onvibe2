import { useTranslations } from "next-intl";
import AppleMusic from "@/public/platforms_images/apple_music";
import Spotify from "@/public/platforms_images/spotify";
import Vkontakte from "@/public/platforms_images/VK_black";
import YandexMusic from "@/public/platforms_images/yandex_music_black";
import YoutubeMusic from "@/public/platforms_images/youtubemusic_black";
import TikTok from "@/public/platforms_images/tiktok";
import Shazam from "@/public/platforms_images/shazam";

export default function StoresOther2() {
  const t = useTranslations('stores');

  const stores = [
    {
      id: 1,
      url_black: <Spotify />,
      name: 'Spotify'
    },
    {
      id: 2,
      url_black: <AppleMusic />,
      name: 'Apple Music'
    },
    {
      id: 3,
      url_black: <Vkontakte />,
      name: 'VK'
    },
    {
      id: 4,
      url_black: <YandexMusic />,
      name: 'Yandex Music'
    },
    {
      id: 5,
      url_black: <YoutubeMusic />,
      name: "Youtube Music"
    },
    {
      id: 6,
      url_black: <TikTok />,
      name: 'TikTok'
    },
    {
      id: 7,
      url_black: <Shazam />,
      name: 'Shazam'
    },
  ]
  return (
    <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center' data-aos="fade-up" data-aos-delay="100">
      <div className='flex w-full mx-auto justify-center my-10'>
        <div className='grid gap-x-12 gap-y-6 grid-cols-2 md:grid-cols-2 xl:grid-cols-4 justify-center'>
          {stores.map((store) => (
            <div className="flex mx-auto shadow-2xl px-4 lg:px-16 py-4  rounded-3xl h-24 md:h-44 w-full border border-slate-200 dark:border-zinc-800 lg:mx-0 lg:flex items-center justify-center scroll-smooth shadow-slate-400 dark:shadow-slate-800 bg-white dark:bg-zinc-900 transition-all duration-150 hover:-translate-y-4 ease-in" key={store.id} data-aos="fade-up" data-aos-delay="100">
              <div className="relative w-full ">
                {store.url_black}
              </div>
            </div>
          ))}
          <div className="flex mx-auto shadow-2xl px-4 lg:px-16 py-4  rounded-3xl h-24 md:h-44 mw-full border border-slate-200 dark:border-zinc-800 lg:mx-0 lg:flex items-center justify-center scroll-smooth shadow-slate-400 dark:shadow-slate-800 bg-white dark:bg-zinc-900 transition-all duration-150 hover:-translate-y-4 ease-in" data-aos="fade-up" data-aos-delay="100">
            <div className="relative w-full">
              <h3 className="text-sm font-semibold leading-6 text-white-900 text-center dark:text-slate-200 fill-black dark:fill-white">{t('more_stores')}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}