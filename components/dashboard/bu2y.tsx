'use client'

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'

const BANNER_KEY = 'bannerDismissed'
const HIDE_DURATION_MS = 1 * 24 * 60 * 60 * 1000 // 3 дня

export default function PromoInfo() {
    const t = useTranslations('promocodes')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const dismissed = localStorage.getItem(BANNER_KEY)
        if (dismissed) {
        const dismissTime = parseInt(dismissed)
        if (Date.now() - dismissTime < HIDE_DURATION_MS) {
            return 
        }
        }
        setIsVisible(true)
    }, [])

  const handleClose = () => {
    localStorage.setItem(BANNER_KEY, Date.now().toString())
    setIsVisible(false)
  }
  const md = useTranslations('onvibecup')
  if (!isVisible) return null

    return (
        <div className="dark:bg-indigo-500 bg-indigo-500 rounded-2xl p-4 lg:p-16 mt-2">
            <div className="flex justify-end mt-[-15px]">
                <button onClick={handleClose} className="ml-4 font-bold text-4xl ">
                    ×
                </button>
            </div>
            <div className="flex justify-between">
                <Link href='/dashboard/onvibecup' className="max-w-3xl flex-col flex gap-4 mt-[-20px]">
                    <span className="text-slate-50 text-lg lg:text-4xl 2xl:text-5xl font-medium !leading-tight">{md('desc3')}!</span>
                    <span className="text-zinc-300 text-sm lg:text-base">{md('desc4')}</span>
                </Link>
                <div className="lg:flex hidden max-w-xl w-full justify-end">
                    <div className="flex relative h-[150px]">
                        <Link href='/dashboard/onvibecup'  className="flex absolute">
                            <Image src="/promocodes.svg" width={100} height={100} className="w-full blur-md z-10 animate-pulse" alt="/" />
                        </Link>
                        <Image src="/promocodes.svg" width={100} height={100} className="w-full z-20" alt="/" />
                    </div>
                </div>
            </div>
        </div>
    )
}