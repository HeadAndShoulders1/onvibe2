import { useTranslations } from "next-intl"

export default function Stats() {
  const t = useTranslations('stats')
  const stats = [
    {
      id: 1,
      name: t('years_of_work'),
      value: '2+'
    },
    {
      id: 2,
      name: t('releases_released'),
      value: '1,000+'
    },
    {
      id: 3,
      name: t('users'),
      value: '2,000+'
    },
    {
      id: 4,
      name: t('platform'),
      value: '50+'
    },
  ]
  return (
    <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center' data-aos="fade-up" data-aos-delay="100">
      <h1 className="font-bold tracking-tight text-zinc-800 dark:text-slate-200 text-3xl lg:text-4xl text-center">
        {t('our_numbers')}
      </h1>
      <div className='flex w-full py-8 items-center justify-center mx-auto'>
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 lg:gap-6 w-full text-center select-none '>
          {stats.map((stat) => (
            <div className="p-8 sm:p-10 lg:flex-auto hover:bg-gray-200 dark:hover:bg-zinc-900 rounded-xl transition-all duration-150 hover:-translate-y-4 ease-in" key={stat.id}>
              <h3 className="text-xl lg:text-4xl font-semibold  text-zinc-800 dark:text-slate-200 py-3 ">
                {stat.value}
              </h3>
              <h3 className="text-base lg:text-lg text-slate-400 dark:text-zinc-400">
                {stat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}