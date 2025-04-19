'use client'
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import Countdown from "./timer";

export default function OnvibeCup() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [totalBank, setTotalBank] = useState(0);
  const [halfBank, setHalfBank] = useState(0);
  const [userScore, setUserScore] = useState(0); 

  const fetchTopUsers = async () => {
    try {
      const res = await fetch('/api/referral/');
      const data = await res.json();
      console.log("response from /api/referral/:", data);
      setTopUsers(data);
  
      const totalPayments = data.reduce(
        (acc: number, user: any) => acc + (user.confirmedPayments || 0),
        0
      );
      setTotalBank(totalPayments / 2 * 149);
      setHalfBank(totalPayments * 149);
    } catch (error) {
      console.error('Ошибка загрузки топа пользователей:', error);
    }
  };
  
  const fetchUserScore = async () => {
    try {
      const res = await fetch("/api/referral/me");
      if (!res.ok) {
        throw new Error("Не удалось получить данные");
      }
      const data = await res.json();
      return data.referredCount;
    } catch (error) {
      console.error("Ошибка при получении данных о счёте:", error);
      return 0;
    }
  };
  useEffect(() => {
    const getUserScore = async () => {
      const score = await fetchUserScore();
      setUserScore(score);
    };

    getUserScore();
  }, []);
  

  useEffect(() => {
    fetchTopUsers();
  }, []);


  const md = useTranslations('onvibecup')


  return (
    <>
      <head>
        <title>{md('title')}</title>
      </head>
      <div className="w-full">
      <div className="grid grid-cols-2">
        <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{md('leader')}</span>
        <h1 className="text-3xl text-zinc-800 font-bold dark:text-slate-200 hidden sm:block">{md('prizefund')}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="p-2 mt-4 ">
          <div className="grid grid-cols-1 gap-y-4">
          {topUsers.map((entry, index) => (
            <div
              key={entry.id}
              className="flex justify-between p-2 bg-[#fff] dark:bg-zinc-900 rounded-2xl w-full items-center shadow-sm"
            >
              <div className="flex gap-x-4 items-center">
                <img src="/favicon.png" height={50} width={50} />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-slate-200">
                    {entry.user?.username || 'Без имени'}
                  </h3>
                  <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-400">
                  {md('invited')}: {entry.confirmedPayments ?? 0}
                  </h3>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-400">
                {md('points')}: {entry.confirmedPayments ?? 0}
              </h3>
            </div>
          ))}

          </div> 
        </div>

        <div>

          <div className=" mt-4">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="p-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl w-full items-center shadow-sm gap-x-5 grid grid-cols-2 ">
                <h1 className="text-lg font-semibold text-zinc-800 dark:text-slate-200">{md('bank')}: <h1 className="text-4xl font-semibold text-zinc-800 dark:text-slate-300">{totalBank} ₽</h1>
                </h1>
                <h1 className="text-lg font-semibold text-zinc-800 dark:text-slate-200">{md('intermediatebank')}: <h1 className="text-xl font-semibold text-zinc-800 dark:text-slate-400">{halfBank} ₽</h1>
                </h1>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold mb-2">🎉 {md('participateandwin')}</h2>
              <p className="text-base">
                {md('desc')}
              </p>
              <p className="text-sm mt-2 text-white/80">
                {md('desc2')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold shadow-md hover:bg-indigo-600 transition w-full"
              >
              {md('rules_title')}
            </button>
          </div>

          <div className=" mt-4">
            <div className="">
              <div className="p-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl w-full items-center shadow-sm  ">
                <Countdown/>
              </div>
            </div>
          </div>

          <div className=" mt-4">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="p-4 bg-[#fff] dark:bg-zinc-900 rounded-2xl w-full items-center shadow-sm gap-x-5 grid grid-cols-2 ">
                <h1 className="text-lg font-semibold text-zinc-800 dark:text-slate-200">{md('score')}: <h1 className="text-4xl font-semibold text-zinc-800 dark:text-slate-300"> {userScore} {md('points')}</h1></h1>
              </div>
            </div>
          </div>
          
        </div>

      </div>
      </div>
      <Transition appear show={isRulesOpen} as={Fragment}>
  <Dialog as="div" className="relative z-50" onClose={() => setIsRulesOpen(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30" />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              {md('rules_title')}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-300 space-y-2">
                1. {md('rule1')}<br />
                2. {md('rule2')}<br />
                3. {md('rule3')}<br />
                4. {md('rule4')}
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                onClick={() => setIsRulesOpen(false)}
              >
                {md('ok')}
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>

    </>
  )
}