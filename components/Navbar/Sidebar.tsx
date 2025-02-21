"use client"
import { useTranslations } from "next-intl";
import Links from "./links";
async function getData() {
  const res = await fetch(`/api/user/isAdmin`);

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}


export default function Sidebar() {
  const t = useTranslations('dashboard_link')


  return (
    <div className="w-[16rem] hidden lg:flex flex-shrink-0 flex-col h-full hover:overflow-auto overflow-hidden border-r border-slate-300 dark:border-zinc-800 dark:bg-[#141518] bg-[#fff]">
      <div className="flex flex-col gap-y-5 w-full select-none p-4 ">
        <Links />
      </div>
    </div>
  )
}