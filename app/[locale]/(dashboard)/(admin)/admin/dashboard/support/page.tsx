"use client"
import { useTranslations } from "next-intl"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function getData() {
  const res = await fetch(`/api/user/isAdmin`);

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default function AdminSupport() {
  const t = useTranslations('support')
  const router = useRouter()
  let [admin, setAdmin] = useState<Admin | null>(null);
  type Admin = {
    admin: boolean;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setAdmin(data);

        if (data?.admin === false) {
          router.push('/dashboard/catalog');
        } else {
          search_support()
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [router]);
  type AdminSupport = {
    id: string,
    username: string
  }
  const [support_info, set_support_info] = useState<AdminSupport[]>([])
  const search_support = async () => {
    const res = await fetch(`/api/support/get_support_admin`);
    const data = await res.json()
    set_support_info(data)
  };
  const md = useTranslations('metadata')
  return (
    <>
      <head>
        <title>{md('support')}</title>
      </head>
      <span className="text-3xl text-gray-700 font-bold dark:text-slate-200">{t('title')}</span>

      <div className='grid gap-4 sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 justify-center w-full mt-4'>
        {support_info.map((item) => (
          <div className="flex w-full border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl border p-4" key={item.id}>
            <div className="flex flex-col gap-y-4 w-full">
              <div className="flex flex-col gap-y-0.5">
                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">
                  {item.username}
                </span>
                <span className="text-sm text-zinc-700 dark:text-zinc-400">
                  id: {item.id}
                </span>
              </div>
              <div className="w-full">
                <Link href={`/admin/dashboard/support/${item.id}`} className="flex text-center items-center justify-center text-sm text-slate-200 bg-indigo-600 hover:bg-indigo-500 w-full py-1 font-semibold rounded-md">
                  {t('check_support')}
                </Link>
              </div>
            </div>
          </div>

        ))}
      </div>
    </>
  )
}