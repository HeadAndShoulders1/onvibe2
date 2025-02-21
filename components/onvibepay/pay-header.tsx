
import React from "react";
import Link from "next/link";

interface Props {
    className?: string;
}

export const PayHeader: React.FC<Props> = ({ className }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
            <span className="text-xl text-zinc-800 font-bold dark:text-slate-200 ">Информация:</span>
            <h1 className="text-base text-zinc-400 dark:text-gray-300 mt-2 ">Мы меняем эквайринг, поэтому способов оплаты стало намного меньше. В скором времени наша комманда решит эту проблему. При оплате через систему Т-БАНКА, вы можете оплатить любой картой. В комментарии к платежу укажите свой ник. Баланс начислится в течение некоторого времени, если возникнут вопросы - напишите в поддержку. </h1>
            </div>
            <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
                <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">Выберите один из способов оплаты:</span>
                <div className="grid sm:grid-cols-2 grid-cols-1">
                    <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm ">
                            <Link href="https://www.tbank.ru/rm/r_yOvrBmTvmy.ahIYuwGRcQ/1AaAG82814/" className="flex justify-center">
                                <img src="/T-Bank white.png" className="h-[75px] w-[200px] dark:block hidden"/>
                                <img src="/T-Bank.png" className="h-[65px] w-[165px] dark:hidden block"/>
                            </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}