"use client"
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl"
import NavLink from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import AlertAll from "@/components/Alert/page";

export default function Form() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const signInResponse = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (!signInResponse || signInResponse.ok !== true) {
        setOpenAlert(true)
        setTypeAlert('error')
        setMesssageAlert('error_auth')
      } else {
        router.refresh();
        router.push('/dashboard/catalog');
      }

    } catch (err) {
      console.log(err);
    }

  };



  const [openAlert, setOpenAlert] = useState(false)
  const [TypeAlert, setTypeAlert] = useState('')
  const [MesssageAlert, setMesssageAlert] = useState('')
  const t = useTranslations('auth')
  return (
    <>
      {openAlert ? (
        <AlertAll type={TypeAlert} message={MesssageAlert} setIsOpen={setOpenAlert} />
      ) : null}
      <form onSubmit={handleSubmit} method="post">
        <div className="grid gap-y-2 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
              {t('email')}
            </label>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
                {t('password')}
              </label>
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full"
              />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <button
            type="submit"
            className="flex mt-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('sign_in_button')}
          </button>
        </div>
      </form>
    </>
  )
}

