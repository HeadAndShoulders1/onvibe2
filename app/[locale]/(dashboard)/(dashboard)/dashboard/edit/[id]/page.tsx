"use client"
import { useTranslations } from "next-intl"
import EditReleaseForm from "./form"
import Link from "next/link";


export default function EditRelease({ params }: { params: { id: string } }) {
    const t = useTranslations('edit_release')
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('edit')}</title>
            </head>
            <div className="lg:flex grid gap-y-4 w-full justify-between items-center">
                <span className="text-2xl flex w-full lg:text-3xl text-gray-700 font-bold dark:text-slate-200 lg:w-1/3">{t('edit_title')}</span>
                <div className="lg:flex gap-x-8 justify-center select-none hidden lg:w-1/3">
                    <Link href={`/dashboard/edit/${params.id}`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">1</Link>
                    <Link href={`/dashboard/edit/${params.id}/upload_track`} className="flex justify-center w-12 h-12 rounded-full bg-slate-500 items-center text-lg text-slate-200 font-semibold">2</Link>
                    <Link href={`/dashboard/edit/${params.id}/finish`} className="flex justify-center w-12 h-12 rounded-full bg-slate-500 items-center text-lg text-slate-200 font-semibold">3</Link>
                </div>
                <div className="lg:w-1/3 justify-end flex w-full">
                    <Link href={`/dashboard/edit/${params.id}/upload_track`} className="lg:w-auto w-full inline-flex rounded-md items-center text-sm px-4 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                        <span className="font-semibold text-white text-center">{t('upload_track')}</span>
                    </Link>
                </div>
            </div>

            <EditReleaseForm params={{
                id: params.id
            }} />
        </>
    )
}