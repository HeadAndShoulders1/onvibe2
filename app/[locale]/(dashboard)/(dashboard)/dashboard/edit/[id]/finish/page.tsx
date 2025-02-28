"use client"
import { useTranslations } from "next-intl"
import { Key, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReleaseInfo from "./release";

interface ApiError {
    track_id: string;
    errors: string[];
}


export default function EditRelease({ params }: { params: { id: string } }) {
    const t = useTranslations('finish')
    const [errorImage, setErrorImage] = useState('')
    const [errorTrack, setErrorTrack] = useState('')
    const [errorTitle, setErrorTitle] = useState('')
    const [errorArtist, setErrorArtist] = useState('')
    const [errorMetaLanguage, setErrorMetaLanguage] = useState('')
    const [errorType, setErrorType] = useState('')
    const [errorPLine, setErrorPLine] = useState('')
    const [errorDateRelease, setErrorDateRelease] = useState('')
    const [errorGenre, setErrorGenre] = useState('')
    const [count_error, serCountError] = useState(0)
    const [apiErrors, setApiErrors] = useState<ApiError[]>([]);
    const router = useRouter()
    const PostData = async () => {
        try {
            const res = await fetch("/api/releases/upload_track", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.message == "success") {
                    router.push(`/dashboard/catalog`)
                } else {
                    if (data.message == "Not fill") {
                        router.push('/dashboard/profile/license');
                        router.refresh();
                    }
                    if (data.message == "not subscribe") {
                        router.push('/dashboard/subscribe');
                        router.refresh();
                    }
                    setErrorImage(data.image_error)
                    setErrorTrack(data.track_error)
                    setErrorTitle(data.title_error)
                    setErrorArtist(data.artist_error)
                    setErrorDateRelease(data.date_release_error)
                    setErrorGenre(data.genre_error)
                    setErrorMetaLanguage(data.meta_language_error)
                    setErrorPLine(data.p_line_error)
                    setErrorType(data.type_error)
                    serCountError(data.error_count)
                    setApiErrors(data.track_errors)
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('edit')}</title>
            </head>
            <div className="lg:flex grid  gap-y-4 justify-between items-center w-full">
                <span className="text-2xl lg:text-3xl text-gray-700 font-bold dark:text-slate-200 lg:w-1/3">{t('check_information')}</span>
                <div className="lg:flex gap-x-8 justify-center select-none hidden w-1/3 ">
                    <Link href={`/dashboard/edit/${params.id}`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">1</Link>
                    <Link href={`/dashboard/edit/${params.id}/upload_track`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">2</Link>
                    <Link href={`/dashboard/edit/${params.id}/finish`} className="flex justify-center w-12 h-12 rounded-full bg-indigo-600 items-center text-lg text-slate-200 font-semibold">3</Link>
                </div>
                <div className="lg:w-1/3 flex lg:justify-end">
                    <button onClick={PostData} className="inline-flex rounded-md items-center  px-4 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">
                        <span className="text-sm font-semibold text-white">{t('upload_track')}</span>
                    </button>
                </div>
            </div>
            {count_error > 0 ? (
                <div className="flex bg-slate-800/10 dark:bg-slate-400/10 border-l-2 border-red-700/80 flex-col p-2 mt-4 gap-y-4">
                    <div>
                        <div className="text-base text-zinc-800 leading-8 font-semibold dark:text-slate-200">{t('error_release')}</div>
                        <div className="text-sm text-gray-600 dark:text-zinc-400">
                            {errorImage != "" ? (<div>{t('errorImage')}</div>) : null}
                            {errorTitle != "" ? (<div>{t('errorTitle')}</div>) : null}
                            {errorArtist != "" ? (<div>{t('errorArtist')}</div>) : null}
                            {errorMetaLanguage != "" ? (<div>{t('errorMetaLanguage')}</div>) : null}
                            {errorType != "" ? (<div>{t('errorType')}</div>) : null}
                            {errorPLine != "" ? (<div>{t('errorPLine')}</div>) : null}
                            {errorDateRelease != "" ? (<div>{t('errorDateRelease')}</div>) : null}
                            {errorGenre != "" ? (<div>{t('errorGenre')}</div>) : null}
                            {errorTrack != "" ? (<div>{t('errorTrack')}</div>) : null}
                        </div>
                    </div>
                    {apiErrors.length > 0 && (
                        <>
                            {apiErrors.map((error, index) => (
                                <div key={index}>
                                    <div className="text-base text-zinc-800 leading-8 font-semibold dark:text-slate-200">
                                        {t('error_track')} {error.track_id}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-zinc-400">
                                        {error.errors.map((errorname: any, innerIndex: any) => (
                                            <div key={innerIndex}>{t(errorname)}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            ) : null}
            <ReleaseInfo params={{
                id: params.id
            }} />
        </>
    )
}