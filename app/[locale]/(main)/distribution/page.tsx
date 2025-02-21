"use client"
import { useEffect } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css';
import { useTranslations } from "next-intl";
import StoresOther from "@/components/main/platforms_store/page";
import Interested from "@/components/main/interested/page";
import HowWork from "@/components/main/how_it_work/page";
import Reviews from "@/components/main/reviews/page";

const Distribution = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
        })
    }, [])
    const t = useTranslations('distribution');
    const md = useTranslations('metadata')

    return (
        <div className="grid lg:gap-y-20 gap-y-8 w-full">
            <head>
                <title>{md('distr')}</title>
                <meta name="description" content={md('distr_desc')} />
            </head>
            <div className="mx-auto h-screen flex justify-center flex-col aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-6xl dark:text-slate-200">
                        {t('question')}
                    </h1>
                </div>
                <div className="text-left mt-40 px-0 lg:px-20" data-aos="fade-up" data-aos-delay="100">
                    <div className='flex w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto inset-y-0 right-0'>
                        <div className='grid gap-6 lg:grid-cols-2'>
                            <div>
                                <h1 className="text-base font-bold tracking-tight text-zinc-800 sm:text-lg dark:text-gray-100">
                                    {t('answer')}
                                </h1>
                            </div>
                            <div className="m-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="5em" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 15C12 16.1046 11.1046 17 10 17C8.89543 17 8 16.1046 8 15C8 13.8954 8.89543 13 10 13C11.1046 13 12 13.8954 12 15Z" stroke="#c3bdcf" strokeWidth="1.5" />
                                    <path d="M12 15V9" stroke="#c3bdcf" strokeWidth="1.5" />
                                    <path d="M14.0584 11.0294L12.7416 10.371C12.5592 10.2798 12.468 10.2342 12.3926 10.1765C12.1974 10.0273 12.064 9.81145 12.0178 9.57014C12 9.47699 12 9.37499 12 9.171C12 8.68545 12 8.44268 12.0598 8.27764C12.2178 7.84144 12.6551 7.57119 13.1159 7.62495C13.2902 7.64528 13.5074 7.75385 13.9416 7.971L15.2584 8.62936C15.4408 8.72058 15.532 8.7662 15.6074 8.82381C15.8026 8.97304 15.936 9.1889 15.9822 9.43021C16 9.52337 16 9.62536 16 9.82936C16 10.3149 16 10.5577 15.9402 10.7227C15.7822 11.1589 15.3449 11.4292 14.8841 11.3754C14.7098 11.3551 14.4926 11.2465 14.0584 11.0294Z" stroke="#c3bdcf" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M14 21.8C13.3538 21.9311 12.6849 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7M21.8 14C21.9311 13.3538 22 12.6849 22 12C22 6.47715 17.5228 2 12 2C10.1786 2 8.47087 2.48697 7 3.33782" stroke="#c3bdcf" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M18 22V15M18 15L20.5 17.5M18 15L15.5 17.5" stroke="#c3bdcf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <HowWork />

            <StoresOther />
            <Reviews />
            <Interested />

        </div>
    )
}

export default Distribution