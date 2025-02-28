"use client"
import NewsTable from "@/components/news/page"
import NewsTableVision from "@/components/news/vision"
import { News } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function AdminNews() {
    const t = useTranslations('news')
    const [text, setText] = useState('')
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (result && typeof result === 'string') {
                setImageSrc(result);
            }
        };

        reader.readAsDataURL(file);
    };

    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) {
            return "N/A";
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const [news, setNews] = useState<News[]>([])
    const PostData = async () => {
        const res = await fetch(`/api/admin/news/get`, { method: "GET" })
        const data = await res.json()
        setNews(data.news)
    }
    const createNews = async () => {
        const res = await fetch(`/api/admin/news/post`, {
            method: "POST",
            body: JSON.stringify({
                text: text,
                photo_url: imageSrc
            })
        })
        const data = await res.json()
        setNews(data.news)
    }
    useEffect(() => {
        PostData()
    }, [])
    return (
        <>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row mt-5 w-full gap-4">
                    <div className="bg-[#fff] dark:bg-zinc-900 rounded-2xl p-4 border border-slate-300 dark:border-zinc-800 shadow-md w-full">
                        <div className="flex flex-col gap-y-4 justify-between h-full">
                            <span className="text-xl font-medium dark:text-slate-100 text-zinc-800">{t('basic_information')}</span>
                            <div className="flex flex-col gap-y-4">
                                <textarea className="hover:outline-slate-400 min-h-40 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" placeholder={t('text')} required onChange={(e) => setText(e.target.value)} value={text} />
                                <div className="w-full h-36 relative">
                                    <div className="flex w-full h-full items-center border-slate-300 border-2 hover:border-slate-400 dark:border-zinc-600 dark:hover:border-zinc-400 border-dashed rounded-2xl relative justify-center transition-all duration-150">
                                        <div className="grid justify-center w-full h-full select-none absolute">
                                            <div className="mx-auto mt-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" width="2em" height="2em" className="stroke-gray-900 dark:stroke-gray-50">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                </svg>
                                            </div>
                                            <div className="align-top mt-8 grid gap-y text-center">
                                                <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{t('add_cover')}</span>
                                                <span className="text-slate-2000 dark:text-zinc-400 font-semibold text-xs">(.jpeg)</span>
                                            </div>
                                            <input type="file" name="track" id="track" onChange={handleImageUpload} className='w-full h-full opacity-0 absolute cursor-pointer rounded-xl' accept="image/jpeg" />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={createNews} className="flex items-center justify-center gap-x-2 bg-[#5351FF] h-10 px-3 rounded-lg text-sm font-semibold text-white text-center">
                                    {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-3xl">
                        <NewsTableVision createAt={formatDate(new Date())} text={text} photo_url={imageSrc} />
                    </div>
                </div>
                <div className="flex flex-col gap-y-4 mt-5">
                    <span className="text-2xl text-zinc-800 font-bold dark:text-slate-200">{t('news_added')}</span>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                        {news.map((item, index) => (
                            <div className="max-w-3xl w-full" key={index}>
                                <NewsTable updateNews={setNews} id={item.id} admin={true} createAt={item.createdAt ? formatDate(new Date(item.createdAt)) : null} text={item.text} photo_url={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.photo_url}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}