import { useTranslations } from "next-intl"

export default function HowWork() {
    const t = useTranslations('how_work')
    const steps = [
        {
            id: 1,
            title: t('registration'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="none"> <path d="M3 19C3.69137 16.6928 5.46998 16 9.5 16C13.53 16 15.3086 16.6928 16 19" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" /> <path d="M13 9.5C13 11.433 11.433 13 9.5 13C7.567 13 6 11.433 6 9.5C6 7.567 7.567 6 9.5 6C11.433 6 13 7.567 13 9.5Z" className="stroke-black dark:stroke-white" strokeWidth="2" /> <path d="M15 5L16.5 6.5V6.5C16.7761 6.77614 17.2239 6.77614 17.5 6.5V6.5L21 3" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg>,
            detail: t('registration_detail')
        },
        {
            id: 2,
            title: t('upload_our_music'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" id="upload-alt-3" className="fill-black dark:fill-white"><path d="M22,12.84a.88.88,0,0,0,0-.16l-3-9a1,1,0,0,0-1.9.64L19.61,12H16a1,1,0,0,0-1,1,3,3,0,0,1-6,0,1,1,0,0,0-1-1H4.39L7,4.32a1,1,0,1,0-1.9-.64l-3,9a.88.88,0,0,0,0,.16A.76.76,0,0,0,2,13v7a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V13A.76.76,0,0,0,22,12.84Z" /><path d="M9.71,6.71,11,5.41V11a1,1,0,0,0,2,0V5.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-3-3h0a1.15,1.15,0,0,0-.33-.21.94.94,0,0,0-.76,0,1.15,1.15,0,0,0-.33.21h0l-3,3A1,1,0,0,0,9.71,6.71Z" /></svg>,
            detail: t('upload_our_music_detail')
        },
        {
            id: 3,
            title: t('add_metadata'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48" fill="none"> <path d="M4 8H32" className="stroke-black dark:stroke-white" strokeWidth="4" strokeLinecap="round" /> <path d="M28 21H44" className="stroke-black dark:stroke-white" strokeWidth="4" strokeLinecap="round" /> <path d="M18 42L18 8" className="stroke-black dark:stroke-white" strokeWidth="4" strokeLinecap="round" /> <path d="M36 42L36 21" className="stroke-black dark:stroke-white" strokeWidth="4" strokeLinecap="round" /> </svg>,
            detail: t('add_metadata_detail')
        },
        {
            id: 4,
            title: t('moderate_music'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none"> <path d="M9.03429 5.96305L6.49114 8.49856C6.02369 8.9646 5.59488 9.3921 5.25624 9.77856C5.03877 10.0267 4.82145 10.2984 4.63737 10.5985L4.61259 10.5738C4.56555 10.5269 4.54201 10.5034 4.51839 10.4805C4.07636 10.0516 3.55641 9.71062 2.98636 9.47575C2.9559 9.4632 2.92498 9.45095 2.86314 9.42645L2.48449 9.27641C1.97153 9.07315 1.83482 8.41279 2.22514 8.02365C3.34535 6.90684 4.69032 5.56594 5.33941 5.29662C5.91185 5.05911 6.53023 4.98008 7.12664 5.06822C7.67311 5.14898 8.19006 5.42968 9.03429 5.96305Z" className="fill-black dark:fill-white"></path> <path d="M13.3767 19.3132C13.5816 19.5212 13.7177 19.6681 13.8408 19.8251C14.0031 20.0322 14.1483 20.2523 14.2748 20.4829C14.4172 20.7426 14.5278 21.02 14.749 21.5748C14.929 22.0265 15.5272 22.1459 15.8746 21.7995L15.9586 21.7157C17.0788 20.5988 18.4237 19.2579 18.6938 18.6108C18.9321 18.04 19.0113 17.4235 18.9229 16.8289C18.8419 16.2841 18.5605 15.7688 18.0256 14.9273L15.474 17.4713C14.9959 17.9479 14.5576 18.385 14.1612 18.7273C13.9236 18.9325 13.6637 19.1376 13.3767 19.3132Z" className="fill-black dark:fill-white"></path> <path fillRule="evenodd" clipRule="evenodd" d="M14.4467 16.3769L20.2935 10.5476C21.1356 9.70811 21.5566 9.28836 21.7783 8.75458C22.0001 8.22081 22.0001 7.62719 22.0001 6.43996V5.87277C22.0001 4.04713 22.0001 3.13431 21.4312 2.56715C20.8624 2 19.9468 2 18.1157 2H17.5468C16.356 2 15.7606 2 15.2252 2.2211C14.6898 2.4422 14.2688 2.86195 13.4268 3.70146L7.57991 9.53078C6.59599 10.5117 5.98591 11.12 5.74966 11.7075C5.67502 11.8931 5.6377 12.0767 5.6377 12.2692C5.6377 13.0713 6.2851 13.7168 7.57991 15.0077L7.75393 15.1812L9.79245 13.1123C10.0832 12.8172 10.558 12.8137 10.8531 13.1044C11.1481 13.3951 11.1516 13.87 10.8609 14.1651L8.8162 16.2403L8.95326 16.3769C10.2481 17.6679 10.8955 18.3133 11.7 18.3133C11.8777 18.3133 12.0478 18.2818 12.2189 18.2188C12.8222 17.9966 13.438 17.3826 14.4467 16.3769ZM17.1935 9.5312C16.435 10.2874 15.2053 10.2874 14.4468 9.5312C13.6883 8.775 13.6883 7.54895 14.4468 6.79274C15.2053 6.03653 16.435 6.03653 17.1935 6.79274C17.952 7.54895 17.952 8.775 17.1935 9.5312Z" className="fill-black dark:fill-white"></path> </svg>,
            detail: t('moderate_detail'),
        },
        {
            id: 5,
            title: t('upload_music'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.15407 7.30116C7.52877 5.59304 9.63674 4.5 12 4.5C12.365 4.5 12.7238 4.52607 13.0748 4.57644L13.7126 5.85192L11.2716 8.2929L8.6466 8.6679L7.36009 9.95441L6.15407 7.30116ZM5.2011 8.82954C4.75126 9.79256 4.5 10.8669 4.5 12C4.5 15.6945 7.17133 18.7651 10.6878 19.3856L11.0989 18.7195L8.8147 15.547L10.3741 13.5256L9.63268 13.1549L6.94027 13.6036L6.41366 11.4972L5.2011 8.82954ZM7.95559 11.4802L8.05962 11.8964L9.86722 11.5951L11.3726 12.3478L14.0824 11.9714L18.9544 14.8135C19.3063 13.9447 19.5 12.995 19.5 12C19.5 8.93729 17.6642 6.30336 15.033 5.13856L15.5377 6.1481L11.9787 9.70711L9.35371 10.0821L7.95559 11.4802ZM18.2539 16.1414C16.9774 18.0652 14.8369 19.366 12.3859 19.4902L12.9011 18.6555L10.6853 15.578L12.0853 13.7632L13.7748 13.5286L18.2539 16.1414ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" className="fill-black dark:fill-white" /></svg>,
            detail: t('upload_music_detail'),
        },
        {
            id: 6,
            title: t('check_release'),
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="fill-black dark:fill-white" height="2em" width="2em" version="1.1" id="Capa_1" viewBox="0 0 33.165 33.165" > <g> <g id="c172_graphic"> <path d="M31.626,4.433H1.536C0.688,4.433,0,5.22,0,6.194v20.784c0,0.969,0.688,1.755,1.536,1.755h30.09    c0.852,0,1.539-0.786,1.539-1.755V6.194C33.165,5.22,32.478,4.433,31.626,4.433z M30.21,25.125c0,0.796-0.566,1.442-1.267,1.442    H4.221c-0.696,0-1.263-0.646-1.263-1.442V8.045c0-0.798,0.566-1.445,1.263-1.445h24.723c0.7,0,1.267,0.647,1.267,1.445v17.08    H30.21z" /> <polygon points="24.31,13.973 24.31,13.973 22.849,16.531 20.776,15.35 20.78,15.349 16.31,12.787 15.48,14.238 14.064,16.629     9.999,14.161 8.951,15.894 8.939,15.89 4.737,22.478 6.563,23.749 10.612,17.141 12.929,18.549 12.927,18.556 14.844,19.69     17.131,15.826 19.177,16.998 19.173,17.002 23.644,19.562 23.662,19.537 23.689,19.551 25.871,15.732 25.873,15.732     28.431,11.259 26.493,10.15   " /> </g> <g id="Capa_1_214_"> </g> </g> </svg>,
            detail: t('check_release_detail'),
        },
    ]

    return (
        <div className='w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto' data-aos="fade-up" data-aos-delay="100">
            <h1 className="font-bold tracking-tight text-zinc-800 text-3xl lg:text-4xl  text-center dark:text-slate-200">{t('how_it_work')}</h1>
            <h1 className="tracking-tight text-slate-400 sm:text-1xl text-center py-3 dark:text-zinc-400">
                {t('how_it_work_detail')}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {steps.map((step) => (
                    <div className="flex w-full gap-2 flex-col border dark:border-zinc-800 border-slate-300 p-4 rounded-lg h-full hover:bg-zinc-100 transition-all dark:hover:bg-zinc-800" key={step.id}>
                        <div className="h-10">
                            {step.svg}
                        </div>
                        <div className="flex flex-col gap-y-2 justify-center ">
                            <span className="text-base lg:text-xl font-medium text-zinc-800 dark:text-slate-200">
                                {step.title}
                            </span>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                {step.detail}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}