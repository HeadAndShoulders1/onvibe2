"use client"
import { useTranslations } from "next-intl"
import { useEffect, useState, MouseEventHandler, useRef, Fragment} from "react";
import AlertAll from "@/components/Alert/page";




export default function EditReleaseForm2({ params }: { params: { id: string } }) {
    const t = useTranslations('edit_release')
    const [openAlert, setOpenAlert] = useState(false);
    const [typeAlert, setTypeAlert] = useState('')
    const [MessageAlert, setMessageAlert] = useState('');
    

    const PostData = async () => {
        try {
            const res = await fetch("/api/releases/update_info", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10),
                    comment: commentRelease,
                    text: textRelease
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    


    let [release_info, setReleases] = useState<Release | null>(null);
    type Release = {
        id: string;
        comment: string;
        text: string
    }

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/releases/info_release", {
                method: "POST",
                body: JSON.stringify({
                    id_release: parseInt(params.id, 10)
                })
            });
            if (res.ok) {
                const data = await res.json();
                setReleases(data)
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };


    const [commentRelease, setComment] = useState<string>('');
    const [textRelease, setText] = useState<string>('');

    useEffect(() => {
        fetchUserData();
    }, ['']);

    useEffect(() => {
        if (release_info) {
            setComment(release_info.comment || '');
            setText(release_info.text || '');
        }
    }, [release_info]);


    return (
        <>
            {openAlert ? (
                <AlertAll type={typeAlert} message={MessageAlert} setIsOpen={setOpenAlert} />
            ) : null}

            <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm h-[350px]">
                <div className="grid gap-y-4 w-full ">
                    <div className="lg:flex grid gap-4  grid-cols-1 lg:grid-cols-2 w-full">
                        <div className="grid gap-2 xl:gap-6  lg:grid-cols-2 grid-cols-1 lg:p-4 lg:py-0 py-4 w-full lg:max-w-7xl   ">
                            <div className="grid gap-y-1 h-[100px]">
                                <span className="flex text-xl text-gray-700 font-semibold dark:text-slate-200">{t('comments_desc')}:</span>
                                <div className="flex flex-col gap-y-5">
                                    <input type="text" name="comment" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full h-12" placeholder={t('comment')} required id="comment" value={commentRelease} onChange={e => setComment(e.target.value)} onBlur={PostData} />
                                    <textarea name="text" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full h-[200px]" placeholder={t('text')} required id="text" value={textRelease} onChange={e => setText(e.target.value)} onBlur={PostData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
