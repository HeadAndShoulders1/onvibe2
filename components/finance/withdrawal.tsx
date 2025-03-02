'use client'

import { Fragment, useEffect, useState } from "react";
import SpinnerLoading from "../Spinner/page";
import { Dialog, Transition } from '@headlessui/react'
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import AlertAll from "../Alert/page";

export default function Withdrawal() {
  const t = useTranslations('dashboard_link');
  const router = useRouter();
  let [isOpen, setIsOpen] = useState(false);
  let [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState(999);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchBalance();
  }, []);

  const FetchBalance = async () => {
    const res = await fetch('/api/user/balance', { method: "GET" });
    const data = await res.json();
    setBalance(data.balance);
  };

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const Payment = async () => {
    setLoading(true);
    const res = await fetch(`/api/finance/withdrawal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setAlert({ type: "success", message: "Заявка успешно отправлена!" });
      setTimeout(() => {
        router.refresh();
        closeModal();
      }, 5000);
    } else {
      setAlert({ type: "error", message: data.error || "Ошибка при отправке заявки" });
    }
  };

  return (
    <>
      {alert && <AlertAll type={alert.type} message={alert.message} setIsOpen={() => setAlert(null)} />}

      <button onClick={openModal} className="flex items-center gap-x-2 bg-[#5351FF] py-2 px-3 rounded-lg h-12 my-auto">
        <span className="text-lg font-semibold text-white mx-auto">Вывод</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-200"
            leave="ease-in duration-100"
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
                    Вывод средств
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center">
                      Выплата будет осуществляться на платежные реквизиты, которые Вы указали при подписании договора. Если данные поменялись, напишите в поддержку. После выплаты средств Вы обязаны предоставить чек из налоговой. Для этого зарегистрируйтесь в качестве самозанятого и создайте платеж на сумму выплаты.
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-8 mt-8">
                    <input
                      type="number"
                      placeholder={t('desposit_ph')}
                      className="w-full outline-none p-2 bg-white dark:bg-zinc-900 border-b-2 text-zinc-800 dark:text-slate-200 text-3xl text-center focus:border-indigo-500 border-slate-300 dark:border-zinc-800"
                      pattern="[0-9]{,3}"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                    <div className="flex gap-2 justify-between">
                      <div className="flex flex-col gap-y-0">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">К выплате:</span>
                        <span className="text-lg text-center font-bold leading-6 text-zinc-700 dark:text-slate-50">{amount} рублей</span>
                      </div>
                      <div className="flex flex-col gap-y-0">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Вы получите:</span>
                        <span className="text-lg text-center font-bold leading-6 text-zinc-700 dark:text-slate-50">{amount * 0.83} рублей</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={Payment}
                      disabled={loading}
                      className="rounded-md w-full bg-indigo-600 px-3.5 py-2.5 text-sm font-bold text-slate-50 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {loading ? "Загрузка..." : "Вывести"}
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
