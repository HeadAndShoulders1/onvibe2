import { useTranslations } from "next-intl"

export default function Reviews() {
    const t = useTranslations('review')
    const review = [
        {
            id: 1,
            name: t('name_1'),
            type: t('type_1'),
            review: t('review_1'),
        },
        {
            id: 2,
            name: t('name_2'),
            type: t('type_2'),
            review: t('review_2'),
        }, {
            id: 3,
            name: t('name_3'),
            type: t('type_3'),
            review: t('review_3'),
        },
        {
            id: 4,
            name: t('name_4'),
            type: t('type_4'),
            review: t('review_4'),
        },
        {
            id: 5,
            name: t('name_5'),
            type: t('type_5'),
            review: t('review_5'),
        },
        {
            id: 6,
            name: t('name_6'),
            type: t('type_6'),
            review: t('review_6'),
        }, {
            id: 7,
            name: t('name_7'),
            type: t('type_7'),
            review: t('review_7'),
        },
        {
            id: 8,
            name: t('name_8'),
            type: t('type_8'),
            review: t('review_8'),
        },
    ]
    return (
        <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center' data-aos="fade-up" data-aos-delay="100">
            <h1 className="font-bold tracking-tight text-zinc-800 text-3xl lg:text-4xl  text-center dark:text-slate-200">{t('title')}</h1>
            <h1 className="tracking-tight text-slate-400 sm:text-1xl text-center py-3 dark:text-zinc-400">
                {t('detail')}
            </h1>
            <div className='w-full mx-auto justify-center'>
                <div className='grid gap-4 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 justify-center mt-2'>
                    {review.map((step) => (
                        <div className="flex w-full border border-slate-300 dark:border-zinc-800 rounded-3xl p-8 gap-2 lg:items-center flex-col lg:flex-row  bg-white dark:bg-zinc-900 shadow-sm" key={step.id}>
                            <div className="grid lg:flex-auto gap-y-3 mb-auto">
                                <div className="flex gap-x-2 items-center">
                                    <div className='justify-center flex rounded-full border border-slate-400 dark:border-zinc-600 w-10 h-10 text-sm font-semibold shadow-sm items-center'>
                                        <span className="text-zinc-800 dark:text-slate-200 justify-center p-0 leading-0">
                                            <div>
                                                {step.name[0]}
                                            </div>
                                        </span>
                                    </div>

                                    <div className='flex flex-col text-left'>
                                        <span className="dark:text-slate-200 text-zinc-800 justify-center p-0 leading-0 text-sm font-semibold">
                                            {step.name}
                                        </span>
                                        <span className="dark:text-zinc-400 text-slate-2000 justify-center p-0 leading-0 text-xs">
                                            {step.type}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-2000 dark:text-zinc-400">
                                        {step.review}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}