import { useTranslations } from "next-intl"
import EditReleaseTrackForm from "./form"
import Link from "next/link"

export default function UploadTrack({ params }: { params: { id: string } }) {
    const t = useTranslations('upload_track')
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('edit')}</title>
            </head>
            <div className="lg:flex grid gap-y-4 justify-between items-center">
                <span className="text-2xl lg:text-3xl text-gray-700 font-bold dark:text-slate-200 lg:w-1/3">{t('title')}</span>
                <div className="lg:flex gap-x-8 justify-center select-none hidden w-1/3">
                    <Link href={`/dashboard/edit/${params.id}`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">1</Link>
                    <Link href={`/dashboard/edit/${params.id}/upload_track`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">2</Link>
                    <Link href={`/dashboard/edit/${params.id}/finish`} className="flex justify-center w-12 h-12 rounded-full bg-slate-500 items-center text-lg text-slate-200 font-semibold">3</Link>
                </div>
                <div className="flex lg:w-1/3 lg:justify-end">
                    <Link href={`/dashboard/edit/${params.id}/finish`} className="inline-flex rounded-md items-center  px-4 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                        <span className="text-sm font-semibold text-white">{t('upload_release')}</span>
                    </Link>
                </div>
            </div>
            <EditReleaseTrackForm params={{
                id: params.id
            }} />
        </>
    )
}