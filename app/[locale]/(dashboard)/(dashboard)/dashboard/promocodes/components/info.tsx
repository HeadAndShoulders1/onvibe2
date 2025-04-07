import { useTranslations } from "next-intl"

export default function PromocodesInfoUser({ summ, info_promo }: { summ: any, info_promo: any }) {
    const t = useTranslations('promocodes')
    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) {
            return "N/A";
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4">
            <div className="flex p-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl  w-full items-center shadow-md">
                <div className="flex flex-col gap-y-4 w-full">
                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">{t('balance')}</span>
                    <div className="flex justify-between w-full">
                        <div className="flex items-end gap-x-2">
                            <p className="text-zinc-800 dark:text-slate-200 font-medium text-5xl">{summ}</p>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">RUB</p>
                        </div>
                        {summ >= 500 ? (
                            <button className="flex w-12 h-12 items-center justify-center rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-800 transition ">
                                <svg className="dark:fill-slate-200" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M13.29 4.086C13.057 4.009 12.74 4 11.75 4h-5.5c-.712 0-1.202 0-1.58.032-.371.03-.57.085-.714.159a1.75 1.75 0 0 0-.765.765c-.043.084-.08.188-.11.335-.022.11.067.21.179.21h10.913c.16 0 .29-.14.241-.292a1.75 1.75 0 0 0-1.123-1.123ZM3 12.7V7.237C3 7.106 3.106 7 3.237 7H13.7c.865 0 1.423.001 1.848.036.408.033.559.09.633.128a1.5 1.5 0 0 1 .655.655c.038.074.095.225.128.633.035.425.036.983.036 1.848v2.4c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.127.633a1.5 1.5 0 0 1-.656.656c-.074.037-.225.094-.633.127-.425.035-.983.036-1.848.036H6.3c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.127a1.5 1.5 0 0 1-.656-.656c-.037-.074-.094-.225-.127-.633C3 14.123 3 13.565 3 12.7ZM1.5 7.22v5.48c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327h7.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311c.327-.642.327-1.482.327-3.162v-2.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.403-1.355 1.678 1.678 0 0 1-.93-1.037 3.25 3.25 0 0 0-2.086-2.087c-.492-.16-1.07-.16-1.874-.159H6.219c-.674 0-1.224 0-1.672.037-.463.037-.882.118-1.272.317a3.25 3.25 0 0 0-1.42 1.42c-.2.391-.28.81-.318 1.273-.037.448-.037.998-.037 1.672Zm11.75 3.28a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="flex p-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl w-full items-center shadow-md">
                <div className="w-full flex items-start justify-between">
                    <div className="flex gap-x-3 items-center">
                        <div className="flex bg-gray-200 dark:bg-zinc-800 rounded-full w-12 h-12 justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-neutral-500 dark:stroke-neutral-400" height="8em" width="8em" version="1.1" id="图层_1" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
                                <path d="M19.6,28.5L19.6,28.5c-0.1,0-0.3-0.1-0.4-0.1c-0.8-0.8-2.2-0.8-2.9,0c-0.2,0.2-0.5,0.2-0.7,0l-4-4     c-0.2-0.2-0.2-0.5,0-0.7c0.8-0.8,0.8-2.1,0-2.9c-0.2-0.2-0.2-0.5,0-0.7l8.4-8.4c0.1-0.1,0.2-0.1,0.4-0.1l0,0     c0.1,0,0.3,0.1,0.4,0.1c0.8,0.8,2.1,0.8,2.9,0c0.2-0.2,0.5-0.2,0.7,0l4,4c0.2,0.2,0.2,0.5,0,0.7c-0.8,0.8-0.8,2.1,0,2.9     c0.2,0.2,0.2,0.5,0,0.7L20,28.4C19.9,28.4,19.7,28.5,19.6,28.5z M12.7,24l3.3,3.3c1-0.7,2.5-0.7,3.6,0l7.7-7.7     c-0.8-1.1-0.8-2.5,0-3.6L24,12.7c-1,0.7-2.5,0.7-3.6,0l-7.7,7.7C13.4,21.5,13.4,22.9,12.7,24z" />
                                <path d="M21,23.3c-0.2,0-0.4-0.1-0.5-0.4l-1.7-5.9c-0.1-0.3,0.1-0.5,0.3-0.6c0.3-0.1,0.5,0.1,0.6,0.3l1.7,5.9      c0.1,0.3-0.1,0.5-0.3,0.6C21.1,23.3,21.1,23.3,21,23.3z" />
                                <path d="M23,20.9c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S23.6,20.9,23,20.9z" />
                                <path d="M17.4,20.8c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S17.9,20.8,17.4,20.8z" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-y-0.5">
                            <span className="text-zinc-800 dark:text-slate-200 font-medium text-base">{t('name_promocodes')}: {info_promo.name}</span>
                            <div className="flex flex-col gap-y-0">
                                <span className="text-zinc-600 dark:text-zinc-400 text-sm">{t('date_create')}: {formatDate(new Date(info_promo.createdAt))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}