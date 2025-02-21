"use client"

import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signUp } from "../actions/users/signUp";
import AlertAll from "@/components/Alert/page";

export default function Form() {
  const t = useTranslations('auth')
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (username != '' && email != '' && password != '') {
      const message = await signUp(username, email, password);
      if (message == "success") {
        const signInResponse = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        router.refresh();
        router.push('/dashboard/catalog');
      }
      if (message == "User with that email already exists.") {
        setOpenAlert(true)
        setTypeAlert('error')
        setMesssageAlert('error_email')
      }
      if (message == "User with that username already exists.") {
        setOpenAlert(true)
        setTypeAlert('error')
        setMesssageAlert('error_username')
      }
    }
  };

  const [openAlert, setOpenAlert] = useState(false)
  const [TypeAlert, setTypeAlert] = useState('')
  const [MesssageAlert, setMesssageAlert] = useState('')
  return (
    <>
      {openAlert ? (
        <AlertAll type={TypeAlert} message={MesssageAlert} setIsOpen={setOpenAlert} />
      ) : null}
      <>
        <div className="grid gap-y-2 mt-6">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
                {t('username')}
              </label>
            </div>
            <div className="">
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                required
                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
              {t('email')}
            </label>
            <div className="">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
                {t('password')}
              </label>
            </div>
            <div className="">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <button
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('sign_up_button')}
          </button>
        </div>
      </>
    </>
  )
}