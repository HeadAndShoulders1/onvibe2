"use client"
import { useLayoutEffect, useState } from 'react'
import { Rubik } from 'next/font/google'
const inter = Rubik({ weight: 'variable', subsets: ['arabic'] })
const isDarkTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches
const defaultTheme = isDarkTheme ? 'dark' : 'light'


export const useTheme = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem('app-theme') || defaultTheme
  )

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('class', `${theme} ${inter.className}`)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  return { theme, setTheme }
}