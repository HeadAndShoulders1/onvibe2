import Image from "next/image"

export default function NewsTableVision({ createAt, text, photo_url }: any) {
    return (
        <div className="bg-white dark:bg-zinc-900 px-8 py-6 rounded-xl shadow-md w-full">
            <div className="flex flex-col gap-y-4 ">
                <div className="flex flex-row gap-x-2 items-center">
                    <Image src="/logo_support.jpg" alt="/" width={48} height={48} className="rounded-2xl w-12 h-12" />
                    <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-slate-200 font-medium text-base">ONVIBE</span>
                        <span className="text-zinc-600 dark:text-zinc-400 text-sm">{createAt}</span>
                    </div>
                </div>
                <div className="text-zinc-900 dark:text-zinc-300 text-sm lg:text-base whitespace-pre-line flex flex-col gap-y-4">
                    {text}
                </div>
                {photo_url != "" && photo_url != null ? (
                    <Image src={photo_url} width={1000} height={500} className="w-full rounded-md" alt="." />
                ) : null}
            </div>
        </div>
    )
}