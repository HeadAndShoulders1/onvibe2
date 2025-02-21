"use client"
import { Alert } from "@material-tailwind/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AlertAll({ type, message, setIsOpen }: any) {
    const t = useTranslations('alert')
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsOpen(false);
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [setIsOpen]);
    return (
        <Alert
            open={true}
            className="z-f select-none"
            animate={{
                mount: { y: 0 },
                unmount: { y: 100 },
            }}
        >
            <div className="grid justify-center ">
                <div className="flex gap-4 bg-white dark:bg-zinc-900 py-2.5 px-4 rounded-3xl border border-slate-300 dark:border-zinc-800 max-w-screen-sm">
                    <div className="flex items-center relative justify-center">
                        {type === "success" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024">
                                <path className="fill-green-500 shadow-2xl shadow-slate-400 dark:shadow-slate-200" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" />
                            </svg>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-red-600 relative z-20" width="2em" height="2em" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </>
                        )}
                    </div>
                    <div className="grid gap-y-1">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-medium text-base text-zinc-800 dark:text-slate-200">
                                    {t(type)}
                                </span>
                            </div>
                        </div>
                        <span className="text-sm text-zinc-800 dark:text-slate-200">
                            {t(message)}
                        </span>
                    </div>
                </div>
            </div>
        </Alert>
    )
}