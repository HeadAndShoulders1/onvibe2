'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function Countdown() {
  const targetDate = new Date('2025-05-20T00:00:00')
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate))
  const md = useTranslations('onvibecup')
  
  function getTimeRemaining(target: Date) {
    const total = target.getTime() - new Date().getTime()
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    return { total, days, hours, minutes, seconds }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = getTimeRemaining(targetDate)
      setTimeLeft(updated)

      if (updated.total <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (timeLeft.total <= 0) {
    return <div className="text-red-600 font-bold">⏰ {md('up')}!</div>
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl shadow text-center text-lg font-semibold">
      ⏳ {md('end')}: {timeLeft.days}{md('d')} {timeLeft.hours}{md('h')} {timeLeft.minutes}{md('m')} {timeLeft.seconds}{md('s')}
    </div>
  )
}
