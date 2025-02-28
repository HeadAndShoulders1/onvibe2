'use client';

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import SpinnerLoading from "../Spinner/page";

interface Withdrawal {
  id: number;
  amount: number;
  created_at: string;
  status: string;
}

export default function WithdrawalHistory() {
  const t = useTranslations("dashboard_link");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchWithdrawals();
    }
  }, [isOpen]);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/withdrawal/history", { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setWithdrawals(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке истории выводов", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-x-2 bg-[#5351FF] py-2 px-3 rounded-lg h-12 my-auto"
      >
        <span className="text-lg font-semibold text-white mx-auto">История</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all lg:p-6 p-4">
                  <Dialog.Title as="h3" className="text-2xl text-center font-bold leading-6 text-zinc-700 dark:text-slate-50">
                    История выводов
                  </Dialog.Title>
                  <div className="mt-4 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center">
                            <SpinnerLoading/>
                        </div>
                    ) : withdrawals.length > 0 ? (
                      <ul className="space-y-2">
                        {withdrawals.map((withdrawal) => (
                          <li
                            key={withdrawal.id}
                            className="flex justify-between items-center p-3 border-b border-gray-300 dark:border-gray-700"
                          >
                            <span className="text-zinc-800 dark:text-slate-200">{new Date(withdrawal.created_at).toLocaleDateString()}</span>
                            <span className="font-semibold text-lg">{withdrawal.amount} ₽</span>
                            <span className={
                              withdrawal.status === "Completed"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }>
                              {withdrawal.status === "Completed" ? "Выполнено" : "В обработке"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-zinc-500 dark:text-zinc-400">История пустая</p>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-bold text-slate-50 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Закрыть
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}