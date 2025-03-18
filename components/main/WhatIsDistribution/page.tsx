import { useTranslations } from "next-intl"

export default function WhatIsDistribution() {
    const t = useTranslations('home')
    const success = [
        {
            title: t('access_to_platform')
        },
        {
            title: t('monetization_creativity')
        },
        {
            title: t('attracting_listeners')
        }
    ]
    const step = [
        {
            title: t("global_coverage"),
            description: t("access_to_listeners"),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-12 h-12 text-slate-100"> <circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path> <path d="M2 12h20"></path> </svg>,
        },
        {
            title: t("monetization"),
            description: t("monetization_from_streams"),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-12 h-12 text-slate-100"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        },
        {
            title: t("verification"),
            description: t("official_status"),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-12 h-12 text-slate-100"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg>
        },
        {
            title: t("audience"),
            description: t("new_listeners"),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-12 h-12 text-slate-100"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        }
    ]
    return (
        <div className="flex flex-col gap-y-12 items-center justify-between w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto"  data-aos="fade-top" data-aos-delay="100">
            <span className="text-2xl lg:text-4xl font-bold text-center dark:text-slate-200 text-slate-800">{t('what_is_distribution')}</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12">
                <div className="flex flex-col gap-y-6 max-w-4xl" data-aos="fade-rigth" data-aos-delay="100">
                    <span className="text-slate-700 dark:text-slate-300 text-base lg:text-lg">Музыкальная дистрибуция — это процесс размещения вашей музыки на всех основных стриминговых платформах и магазинах. Это мост между артистом и слушателем, позволяющий вашей музыке достичь глобальной аудитории.</span>
                    <div className="flex flex-col gap-y-1">
                        {success.map((item, index) => (
                            <div className="flex gap-x-2" key={index}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 1024 1024" className="fill-white">
                                    <path className="fill-emerald-400" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path>
                                </svg>
                                <span className="text-base text-slate-700 dark:text-slate-300">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4" data-aos="fade-left" data-aos-delay="100">
                    {step.map((item, index) => (
                        <div className="bg-indigo-500 dark:bg-indigo-600 p-6 rounded-xl flex flex-col gap-y-4 shadow-md dark:hover:bg-indigo-700 hover:bg-indigo-600 transition-all" key={index}>
                            {item.svg}
                            <div className="flex flex-col gap-y-1">
                                <span className="text-slate-50 font-medium">{item.title}</span>
                                <span className="text-zinc-300 text-sm">{item.description}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}