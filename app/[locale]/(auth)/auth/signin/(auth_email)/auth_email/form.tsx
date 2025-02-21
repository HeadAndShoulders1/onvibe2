"use client"
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import AlertAll from "@/components/Alert/page";


export default function Form() {
  const router = useRouter();


  const [code, setCode] = useState('');


  const AuthCheckCode = async () => {
    const res = await fetch('/api/user/check_token', {
      method: "POST",
      body: JSON.stringify({
        code: code,
      }),
    }
    )
    const data = await res.json()
    if (data.message == "success") {
      router.refresh();
      router.push('/dashboard/catalog');

    } else {
      setOpenAlert(true)
      setTypeAlert('error')
      setMesssageAlert('not_valid_code')
    }
  }

  const [openAlert, setOpenAlert] = useState(false)
  const [TypeAlert, setTypeAlert] = useState('')
  const [MesssageAlert, setMesssageAlert] = useState('')
  const t = useTranslations('auth')
  return (
    <>
      {openAlert ? (
        <AlertAll type={TypeAlert} message={MesssageAlert} setIsOpen={setOpenAlert} />
      ) : null}
      <form onSubmit={AuthCheckCode} method="post">
        <div className="grid gap-y-2 mt-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-400">
              {t('code')}
            </label>
            <div className="mt-8">
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full outline-nonep-2 bg-transparent border-b-2  border-slate-300 dark:border-zinc-800 text-zinc-800 dark:text-slate-200 text-2xl text-center focus:border-indigo-500"
                pattern="[0-9]{,3}"
              />
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className="flex mt-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
