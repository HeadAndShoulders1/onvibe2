"use client"
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react";

export default function Support() {
    const t = useTranslations('support')
    const [loading, setLoading] = useState(true)
    const [messageAll, setMessageAll] = useState<Message[]>([]); // Specify the type here
    type Message = {
        id: string;
        name: string,
        status: string,
        title: string,
        createdAt: string
    }
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            const res = await fetch('/api/support/get_message')
            const data = await res.json()
            setMessageAll(data);
            setLoading(false)
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
        };
        fetchUserData();
    }, [setMessageAll]);
    const sendMessage = async () => {
        const res = await fetch("/api/support/send_message", {
            method: "POST",
            body: JSON.stringify({
                message: message,
            })
        });
        if (res.ok) {
            const data = await res.json();
            setMessageAll(data)
            setMessage('')
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
        }
    };
    const [message, setMessage] = useState<string>('');
    const message_add = (event: { target: { value: any; }; }) => {
        const inputDate = event.target.value;
        setMessage(inputDate);
    };
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const questions = [
        {
            id: 1,
            question: t('question_1'),
            Answer: t('question_1_answer')
        },
        {
            id: 2,
            question: t('question_2'),
            Answer: t('question_2_answer')
        },
        {
            id: 3,
            question: t('question_3'),
            Answer: t('question_3_answer')
        },
        {
            id: 4,
            question: t('question_4'),
            Answer: t('question_4_answer')
        },
        {
            id: 5,
            question: t('question_5'),
            Answer: t('question_5_answer')
        },
        {
            id: 6,
            question: t('question_6'),
            Answer: t('question_6_answer')
        },
    ]
    const md = useTranslations('metadata')
    return (
        <>
            <head>
                <title>{md('support')}</title>
            </head>
            <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>
            <div className="flex flex-col gap-y-4 grid-cols-1 mt-5 gap-x-12">
                <div className="flex w-full max-h-[1024px]">
                    <div className="grid  w-full bg-white dark:bg-zinc-900 rounded-xl shadow-md ">
                        <div className="flex gap-x-2 w-full items-center border-b  p-4 border-gray-300 dark:border-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" className="fill-zinc-600 dark:fill-gray-200">
                                <rect width="24" height="24" fill="none" />
                                <path d="M12,2a8,8,0,0,0-8,8v1.9A2.92,2.92,0,0,0,3,14a2.88,2.88,0,0,0,1.94,2.61C6.24,19.72,8.85,22,12,22h3V20H12c-2.26,0-4.31-1.7-5.34-4.39l-.21-.55L5.86,15A1,1,0,0,1,5,14a1,1,0,0,1,.5-.86l.5-.29V11a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1v5H13.91a1.5,1.5,0,1,0-1.52,2H20a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2V10A8,8,0,0,0,12,2Z" />
                            </svg>
                            <div className="text-lg text-zinc-800 dark:text-slate-200 font-semibold">{t('title')} ONVIBE</div>
                        </div>
                        <div ref={scrollContainerRef} className="flex w-full flex-col gap-y-4 h-[480px] border-b p-4 border-gray-300 dark:border-zinc-800 overflow-y-auto">
                            {loading ? (
                                <div className="flex h-full w-full justify-center items-center">
                                    <BigSpinnerLoading />
                                </div>
                            ) : (
                                <>
                                    {messageAll.map((item) => (
                                        item.status == "default_user" ? (
                                            <div className="flex w-full gap-x-2 items-start " key={item.id}>
                                                <div className="justify-center flex rounded-full min-w-[32px] max-w-[32px] h-8 text-sm font-semibold shadow-sm items-center bg-indigo-900">
                                                    <span className="text-slate-200 justify-center p-0 leading-0">
                                                        <div>
                                                            {item.name[0]}
                                                        </div>
                                                    </span>
                                                </div>
                                                <div className="grid gap-y">
                                                    <div className="flex gap-x-2">
                                                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                                                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">{item.createdAt}</span>
                                                    </div>
                                                    <div className="flex p-2 w-fit bg-indigo-600 rounded-r-lg rounded-b-lg">
                                                        <span className="text-sm text-slate-200">{item.title}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex w-full gap-x-2 items-start first:pb-0" key={item.id}>
                                                <div className="justify-center flex rounded-full min-w-[32px] max-w-[32px] h-8 text-sm font-semibold shadow-sm items-center bg-indigo-900 ">
                                                    <span className="text-slate-200 justify-center p-0 leading-0">
                                                        <div>
                                                            <img src="/logo_support.jpg" className="w-full h-full  rounded-full" alt="logo_round" />
                                                        </div>
                                                    </span>
                                                </div>
                                                <div className="grid gap-y">
                                                    <div className="flex gap-x-2">
                                                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                                                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">{item.createdAt}</span>
                                                    </div>
                                                    <div className="flex p-2 w-fit bg-zinc-600 rounded-r-lg rounded-b-lg">
                                                        <span className="text-sm text-slate-200 dark:text-slate-200">{item.title}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </>
                            )}

                        </div>
                        <div className="flex w-full justify-between p-4 items-center">
                            <input className="border-none bg-transparent outline-none w-full" placeholder={t('please_write_text')} onChange={message_add} value={message} />
                            <button onClick={sendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                                    <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" className="stroke-zinc-400 dark:stroke-gray-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="py-10 font-bold text-zinc-800 dark:text-slate-200 text-3xl text-center">{t('basic_questions')}</div>
                <div className="grid gap-6 lg:grid-cols-2 grid-cols-1 w-full mt-5 lg:mt-0">
                    {questions.map((step) => (
                        <div className="flex border border-slate-200 w-full dark:border-zinc-800 rounded-3xl p-4 align-text-top bg-white dark:bg-zinc-900 " key={step.id}>
                            <div className="flex flex-col gap-y-2">
                                <span className="text-lg font-semibold text-zinc-800 dark:text-slate-200">{step.question}</span>
                                <span className="text-sm text-slate-2000 dark:text-zinc-400">{step.Answer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}