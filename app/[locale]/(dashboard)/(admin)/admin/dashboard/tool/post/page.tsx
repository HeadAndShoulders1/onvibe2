'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import htmlToImage, { toJpeg, toPng } from 'html-to-image';
import { useTranslations } from "next-intl";
import { redirect, useRouter } from "next/navigation";


export default function Post() {
    const t = useTranslations('admin_tool')
    const [general, setGeneral] = useState('')
    const [desc, setDesc] = useState('')
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const Check_Admin = async () => {
        const res = await fetch('/api/user/isAdmin', { method: 'GET' })
        const data = await res.json()
        if (data.admin == false) {
            router.push('/dashboard/catalog')
        }
    }
    const onButtonClick = useCallback(() => {
        if (ref.current === null) {
            return
        }

        toJpeg(ref.current, { cacheBust: true, })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = 'my-image-name.jpeg'
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])
    useEffect(() => {
        Check_Admin()
    }, [])
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('admin_post')}</title>
            </head>
            <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="flex flex-col gap-y-8 mt-5">
                <div className="flex lg:flex-row flex-col justify-between gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-y-1 w-full">
                        <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('general')}</span>
                        <textarea
                            className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                            onChange={e => setGeneral(e.target.value)}
                            value={general}
                        />
                    </div>
                    <div className="flex flex-col gap-y-1 w-full">
                        <span className="text-sm  text-gray-600 dark:text-zinc-400">{t('description')}</span>
                        <textarea
                            className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                            onChange={e => setDesc(e.target.value)}
                            value={desc}
                        />
                    </div>
                </div>
                <div className="relative w-full height-fit flex  max-w-[800px] " ref={ref}>
                    <div className="">
                        <img src="/post.jpg" alt="cover" className="max-w-[800px] height-fit" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center w-full">
                        <div className="flex flex-col gap-y-8 max-w-xl w-full">
                            {general ? (
                                <span className="text-3xl text-slate-200 text-center font-bold">{general}</span>
                            ) : null}
                            {desc ? (
                                <div className=" bg-white dark:bg-zinc-900 rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-md w-full p-4">
                                    <span className="text-sm text-slate-400">{desc}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <button onClick={onButtonClick} className="flex items-center gap-x-2 bg-[#5351FF] h-10 px-3 rounded-lg text-sm font-semibold text-white w-fit">{t('save')}</button>
            </div>
        </>
    )
}
