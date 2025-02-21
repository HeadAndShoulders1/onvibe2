import Image from "next/image"
import DeleteRelease from "../dashboard/release/delete"
interface NewsTableProps {
    updateNews: (news: any[]) => void;
    id: any;
    admin: boolean;
    createAt: any;
    text: any;
    photo_url: any;
}

const NewsTable: React.FC<NewsTableProps> = ({ updateNews, id, admin, createAt, text, photo_url }) => {
    const deletePost = async () => {
        const res = await fetch(`/api/admin/news/delete`, {
            method: "POST",
            body: JSON.stringify({
                id: id
            })
        })
        const data = await res.json()
        updateNews(data.news);
    }
    return (
        <div className="bg-white dark:bg-zinc-900 px-8 py-6 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-md">
            <div className="flex flex-col gap-y-4 ">
                <div className="flex items-center justify-between">
                    <div className="flex flex-row gap-x-2 items-center">
                        <Image src="/logo_support.jpg" alt="/" width={48} height={48} className="rounded-2xl w-12 h-12" />
                        <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-slate-200 font-medium text-base">ONVIBE</span>
                            <span className="text-zinc-600 dark:text-zinc-400 text-sm">{createAt}</span>
                        </div>
                    </div>
                    {admin === true ? (
                        <button onClick={deletePost} className="hover:bg-gray-200 dark:hover:bg-zinc-800 h-full p-2 rounded-md transition">
                            <DeleteRelease />
                        </button>
                    ) : null}
                </div>
                <div className="text-zinc-900 dark:text-zinc-300 text-sm lg:text-base whitespace-pre-line flex flex-col gap-y-4">
                    {text}
                </div>
                {photo_url != "" && photo_url != null ? (
                    <Image src={photo_url} width={500} height={500} className="w-full rounded-md" alt="." />
                ) : null}
            </div>
        </div>
    )
}

export default NewsTable;