"use client"
import NewsTableVision from "@/components/news/vision";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function News() {
    const t = useTranslations('news')
    type News = {
        createdAt: Date,
        text: any,
        photo_url: any
    }
    const [news, setNews] = useState<News[]>([])
    const PostData = async () => {
        const res = await fetch(`/api/news/get`, { method: "GET" })
        const data = await res.json()
        setNews(data.news)
    }
    useEffect(() => {
        PostData()
    }, [])
    const formatDate = (date: Date) => {
        console.log(date)
        if (!(date instanceof Date)) {
            return "N/A";
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    return (
        <div className="flex justify-center">
            <div className="flex w-11/12 flex-col max-w-4xl justify-center lg:px-5 py-20 dark:text-slate-100">
                <span className="text-2xl flex w-full lg:text-3xl text-gray-700 font-bold dark:text-slate-200 lg:w-1/3">{t('title')}</span>
                <div className="flex flex-col gap-y-4 mt-5">
                    {news.map((item, index) => (
                        <div key={index}>
                            <NewsTableVision createAt={item.createdAt ? formatDate(new Date(item.createdAt)) : null} text={item.text} photo_url={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.photo_url}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}