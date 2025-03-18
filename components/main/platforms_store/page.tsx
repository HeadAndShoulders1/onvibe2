import { useTranslations } from "next-intl";
import Image from 'next/image'

export default function StoresOther() {
  const t = useTranslations('stores');
  const image_dark: any = []
  for (let i = 1; i < 19; i++) {
    image_dark.push({ id: i })
  }
  const image_light: any = []
  for (let i = 1; i < 19; i++) {
    image_light.push({ id: i })
  }
  return (
    <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center' data-aos="fade-up" data-aos-delay="100">
      <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center" data-aos="fade-bottom" data-aos-delay="100">
        <span className="font-bold tracking-tight text-white-900 text-3xl lg:text-4xl  text-center dark:text-slate-200">
          {t('main_stores')}
        </span>
        <span className="tracking-tight text-zinc-600 text-sm max-w-sm py-3 dark:text-zinc-400">
          {t('main_stores_detail')}
        </span>
      </div>
      <div className="flex border border-slate-300 dark:border-zinc-800 rounded-lg p-4 lg:p-12 lg:px-12 w-full tems-center justify-center transition select-none shadow-sm" data-aos="fade-top" data-aos-delay="100">
        <div className="hidden w-full grid-cols-2 gap-4 lg:gap-20 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 dark:grid">
          {image_dark.map((item: any, index: any) => (
            <div className="relative h-14 flex justify-center items-center w-full" key={index}>
              <div className="flex w-full h-fit hover:p-0 max-w-56 lg:p-4 p-4 transition-all justify-center items-center">
                <Image src={`/platforms/${item.id}.svg`} width={800} height={800} className="" alt="/" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid w-full grid-cols-2 gap-4 lg:gap-20 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 dark:hidden">
          {image_light.map((item: any, index: any) => (
            <div className="relative h-14 flex justify-center items-center w-full" key={index}>
              <div className="flex w-full h-fit hover:p-0 max-w-56 lg:p-4 p-4 transition-all justify-center items-center">
                <Image src={`/stores/${item.id}.webp`} width={800} height={800} className="" alt="/" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}