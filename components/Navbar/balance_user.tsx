'use client'
import { Fragment, useEffect, useState } from "react";
import SpinnerLoading from "../Spinner/page";
import { Dialog, Transition } from '@headlessui/react'
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function BalanceUser() {
  const t = useTranslations('dashboard_link')

  const route = useRouter()
  let [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
  }
  const [balance, setBalance] = useState('')
  const FetchBalance = async () => {
    const res = await fetch('/api/user/balance', { method: "GET" })
    const data = await res.json()
    setBalance(data.balance)
  }
  useEffect(() => {
    FetchBalance()
  }, [])
  const [amount, setAmount] = useState(999)
  const Payment = async () => {
    const res = await fetch(`/api/user/payment`, {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        promocode: promo
      })
    })
    if (res.ok) {
      const data = await res.json()
      route.push(data.url)
    }
  }

  const [promo, setPromo] = useState('')
  const [promocodeActivate, setPromocodeActivate] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const check_promo = async () => {
    if (promo.length > 4) {
      const res = await fetch('/api/promocode/check_promocode', {
        method: "POST",
        body: JSON.stringify({
          promocode: promo
        })
      })
      const data = await res.json()
      if (data.message === "success") {
        setPromocodeActivate(true)
      } else {
        setError(data.message)
      }
    } else {
      setError("not_find_promocode")
    }
  }
  return (
    <>
      <button onClick={openModal} className="flex gap-x-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 transition rounded-md select-none items-center">
        <div className="flex gap-x-1 items-center">
          <svg className="dark:fill-slate-200" xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.29 4.086C13.057 4.009 12.74 4 11.75 4h-5.5c-.712 0-1.202 0-1.58.032-.371.03-.57.085-.714.159a1.75 1.75 0 0 0-.765.765c-.043.084-.08.188-.11.335-.022.11.067.21.179.21h10.913c.16 0 .29-.14.241-.292a1.75 1.75 0 0 0-1.123-1.123ZM3 12.7V7.237C3 7.106 3.106 7 3.237 7H13.7c.865 0 1.423.001 1.848.036.408.033.559.09.633.128a1.5 1.5 0 0 1 .655.655c.038.074.095.225.128.633.035.425.036.983.036 1.848v2.4c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.127.633a1.5 1.5 0 0 1-.656.656c-.074.037-.225.094-.633.127-.425.035-.983.036-1.848.036H6.3c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.127a1.5 1.5 0 0 1-.656-.656c-.037-.074-.094-.225-.127-.633C3 14.123 3 13.565 3 12.7ZM1.5 7.22v5.48c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327h7.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311c.327-.642.327-1.482.327-3.162v-2.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.403-1.355 1.678 1.678 0 0 1-.93-1.037 3.25 3.25 0 0 0-2.086-2.087c-.492-.16-1.07-.16-1.874-.159H6.219c-.674 0-1.224 0-1.672.037-.463.037-.882.118-1.272.317a3.25 3.25 0 0 0-1.42 1.42c-.2.391-.28.81-.318 1.273-.037.448-.037.998-.037 1.672Zm11.75 3.28a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1Z" clipRule="evenodd" />
          </svg>
        </div>
        {balance === '' ? (
          <SpinnerLoading />
        ) : (
          <span className="text-md dark:text-slate-200 text-zinc-800">{balance} ₽</span>
        )}
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
                  <Dialog.Title
                    as="h3"
                    className="text-2xl text-center font-bold leading-6 text-zinc-700 dark:text-slate-50"
                  >
                    {t('desposit')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center">
                      {t('desposit_description')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-8 mt-8">
                    <input type="number" placeholder={t('desposit_ph')} className="w-full outline-none p-2 bg-white  dark:bg-zinc-900 border-b-2 text-zinc-800 dark:text-slate-200 text-3xl text-center focus:border-indigo-500 border-slate-300 dark:border-zinc-800" pattern="[0-9]{,3}" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
                    <div className="flex gap-y-0.5 flex-col">
                      <span className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
                        {t('promocodes')}
                      </span>
                      {loading ? (
                        <div className="flex gap-1 items-center">
                          <input
                            id="username"
                            required
                            disabled
                            className="hover:outline-slate-400 h-10 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                            value={promo}
                          />
                          <button disabled className="flex items-center bg-[#5351FF] hover:bg-[#5351FF]/80 transition rounded-xl max-w-10 min-w-10 w-full h-10 justify-center">
                            <SpinnerLoading />
                          </button>
                        </div>
                      ) : (
                        <>
                          {promocodeActivate ? (
                            <div className="flex gap-1 items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 1024 1024" className="fill-white">
                                <path className="fill-emerald-400" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z" />
                              </svg>
                              <div className="flex flex-col gap-y-0">
                                <span className="text-sm font-bold leading-6 text-zinc-700 dark:text-slate-50">{t('promocode')}: {promo}</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t('promocode_success')}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1 items-center">
                              <input
                                id="username"
                                required
                                className="hover:outline-slate-400 h-10 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                                value={promo}
                                onChange={(e) => (setPromo(e.target.value), setError(''))}
                              />
                              <button onClick={() => check_promo()} className="flex items-center bg-[#5351FF] hover:bg-[#5351FF]/80 transition rounded-xl max-w-10 min-w-10 w-full h-10 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-slate-100" width="1em" height="1em" viewBox="0 0 1920 1920">
                                  <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {error ? (
                        <span className="text-sm text-red-500 font-medium">{t(error)}</span>
                      ) : null}
                    </div>
                    <div className="flex gap-2 justify-between">
                      <div className="flex flex-col gap-y-0">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">К оплате:</span>
                        <span className="text-lg text-center font-bold leading-6 text-zinc-700 dark:text-slate-50">{amount} рублей</span>
                      </div>
                      <div className="flex flex-col gap-y-0">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Вы получите:</span>
                        <span className="text-lg text-center font-bold leading-6 text-zinc-700 dark:text-slate-50">{amount ? (promocodeActivate ? (Math.floor(amount * 1.10)) : (amount)) : (0)} рублей</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/dashboard/onvibepay">
                      <button onClick={Payment} className="rounded-md w-full bg-indigo-600 px-3.5 py-2.5 text-sm font-bold text-slate-50 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Пополнить
                      </button>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition >

    </>
  )
}