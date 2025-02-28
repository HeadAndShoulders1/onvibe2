"use client"
import { useTranslations } from "next-intl"
import NavigatorProfile from "./NavigatorProfile"
import { useEffect, useState } from "react";
import SpinnerLoading from "@/components/Spinner/page";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";


export default function Profile() {
  const t = useTranslations('profile')
  type UserData = {
    username: string;
    email: string;
  };
  type Subscribe = {
    id: string;
    id_subscribe: number;
    startDate: string;
  }
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscribe, setSubscribe] = useState<Subscribe[]>([])
  const [loading, setLoading] = useState(true)
  const subs = useTranslations('subscribe')

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/user_info", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const getSubscribe = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/user/subscribe", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setSubscribe(data);
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    getSubscribe()
  }, []);

  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      return "N/A";
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  const md = useTranslations('metadata')
  return (
    <>
      <head>
        <title>{md('profile')}</title>
      </head>
      <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
      <NavigatorProfile />
      <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">{t('basic_information')}</span>
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:items-center mt-5">
          <div className="flex flex-col gap-y-1">
            <div className="text-lg text-zinc-800 font-bold dark:text-slate-200">{t('my_username')}:</div>
            <div className="text-sm text-zinc-400  dark:text-gray-300">{t('my_username_description')}</div>
          </div>
          <div className="text-lg text-gray-700 font-semibold dark:text-slate-200">{userData ? userData.username : <SpinnerLoading />} </div>
        </div>
        <div className="mt-5 flex w-full flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className=" gap-y-1">
            <div className="text-lg text-zinc-800 font-bold dark:text-slate-200">{t('my_email')}:</div>
            <div className="text-sm text-zinc-400 dark:text-gray-300">{t('my_email_description')}</div>
          </div>
          <div className="text-lg text-zinc-800 font-semibold dark:text-slate-200">{userData ? userData.email : <SpinnerLoading />} </div>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 mt-4 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
        <span className="text-xl text-zinc-800 font-bold dark:text-slate-200">{t('subscribe')}</span>
        {loading ? (
          <div className="flex w-full h-full justify-center items-center my-5">
            <BigSpinnerLoading />
          </div>
        ) : (
          <>
            {subscribe ? subscribe.map((item: any, index: any) => (
              <>
                {item.id_subscribe === 3 ? (
                  <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                    <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                      <div className="flex gap-x-4 items-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="2.5em" height="2.5em" viewBox="0 0 226.777 226.777" enableBackground="new 0 0 226.777 226.777">
                            <path className="fill-orange-500" d="M113.388,0C50.765,0,0,50.767,0,113.392c0,62.618,50.765,113.385,113.389,113.385  c62.626,0,113.389-50.768,113.389-113.385C226.777,50.767,176.014,0,113.388,0z M159.202,67.375  c-0.102,0.892-0.248,1.868-0.448,2.947c-0.2,1.069-0.452,2.152-0.754,3.255c-0.298,1.102-0.666,2.112-1.099,3.035  c-0.434,0.921-0.916,1.682-1.452,2.275c-0.534,0.594-1.097,0.888-1.696,0.888c-0.937,0-2.104-0.368-3.502-1.109  c-1.401-0.745-3.118-1.549-5.151-2.411c-2.035-0.858-4.418-1.667-7.148-2.413c-2.738-0.74-5.836-1.112-9.306-1.112  c-3.6,0-6.649,0.445-9.149,1.338c-2.502,0.892-4.553,2.068-6.152,3.53c-1.602,1.451-2.787,3.095-3.55,4.903  c-0.769,1.819-1.149,3.648-1.149,5.487c0,2.142,0.599,4.031,1.796,5.673c1.202,1.633,2.803,3.152,4.805,4.55  c1.999,1.403,4.282,2.756,6.849,4.06c2.568,1.31,5.168,2.678,7.807,4.104c2.632,1.427,5.229,2.991,7.795,4.682  c2.57,1.697,4.854,3.668,6.855,5.899c1.998,2.227,3.601,4.785,4.801,7.674c1.198,2.883,1.799,6.197,1.799,9.948  c0,5.595-1.267,10.786-3.8,15.572c-2.536,4.797-6.118,8.959-10.753,12.498c-4.634,3.536-10.237,6.326-16.801,8.34  c-1.836,0.564-3.744,1.036-5.689,1.442l-1.028,14.367c-0.162,2.889-2.515,5.128-5.355,5.207c-0.155,0.004-0.313,0.004-0.471-0.005  c-3.044-0.172-5.374-2.785-5.199-5.825l0.878-12.308c-1.64,0.094-3.291,0.162-4.993,0.162c-1.324,0-2.554-0.084-3.815-0.142  l-0.924,12.91c-0.162,2.889-2.514,5.128-5.354,5.207c-0.156,0.004-0.314,0.004-0.47-0.005c-3.046-0.172-5.375-2.785-5.201-5.825  l0.974-13.642c-2.52-0.509-4.891-1.067-6.966-1.721c-2.832-0.893-5.217-1.83-7.151-2.809c-1.934-0.981-3.367-1.922-4.299-2.81  c-0.936-0.894-1.401-2.231-1.401-4.021c0-0.476,0.068-1.187,0.201-2.143c0.132-0.951,0.315-1.98,0.548-3.074  c0.236-1.099,0.516-2.235,0.851-3.394c0.331-1.156,0.732-2.217,1.202-3.167c0.463-0.951,0.981-1.726,1.549-2.319  c0.566-0.593,1.183-0.896,1.852-0.896c1.131,0,2.48,0.461,4.05,1.387c1.563,0.922,3.513,1.932,5.848,3.03  c2.333,1.103,5.1,2.128,8.303,3.078c3.199,0.953,7.036,1.433,11.501,1.433c3.934,0,7.387-0.446,10.354-1.338  c2.962-0.897,5.449-2.113,7.45-3.659c2.001-1.548,3.519-3.352,4.549-5.402c1.036-2.054,1.555-4.3,1.555-6.738  c0-2.199-0.602-4.132-1.804-5.799c-1.201-1.667-2.786-3.203-4.752-4.601c-1.966-1.396-4.199-2.725-6.698-3.965  c-2.502-1.251-5.055-2.596-7.649-4.022c-2.604-1.427-5.154-2.975-7.652-4.638c-2.502-1.666-4.737-3.618-6.703-5.849  c-1.966-2.226-3.553-4.8-4.75-7.723c-1.199-2.912-1.799-6.305-1.799-10.168c0-5.355,1.201-10.298,3.598-14.819  c2.402-4.521,5.736-8.399,10.002-11.646c3.361-2.553,7.257-4.647,11.656-6.319l1.222-17.092c0.172-3.05,2.804-5.378,5.825-5.202  c3.046,0.17,5.375,2.784,5.202,5.824l-0.964,13.465c2.841-0.472,5.796-0.766,8.872-0.883l0.94-13.204  c0.177-3.05,2.806-5.378,5.827-5.202c3.046,0.17,5.376,2.784,5.201,5.824l-0.928,12.985c0.514,0.059,1.051,0.092,1.555,0.166  c3.003,0.45,5.738,1.01,8.202,1.697c2.466,0.685,4.567,1.441,6.301,2.274c1.736,0.834,2.934,1.536,3.601,2.1  c0.667,0.562,1.151,1.157,1.451,1.778c0.3,0.628,0.451,1.418,0.451,2.369C159.353,65.801,159.3,66.482,159.202,67.375z"></path>
                          </svg>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <div className="text-lg text-zinc-800 font-bold dark:text-slate-200">{t('buy_subscribe_3')}</div>
                          <div className="text-sm text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} -  {formatDate(new Date(item.endDate))}</div>
                        </div>
                      </div>
                      <div className="flex text-red-600 font-semibold text-lg">-{item.amount} ₽</div>
                    </div>
                  </div>
                ) : null}
                {item.id_subscribe === 2 ? (
                  <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                    <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                      <div className="flex gap-x-4 items-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24" fill="none">
                            <path d="M16 7C16 6.07003 16 5.60504 15.8978 5.22354C15.6204 4.18827 14.8117 3.37962 13.7765 3.10222C13.395 3 12.93 3 12 3C11.07 3 10.605 3 10.2235 3.10222C9.18827 3.37962 8.37962 4.18827 8.10222 5.22354C8 5.60504 8 6.07003 8 7M14 11.5C13.5 11.376 12.6851 11.3714 12 11.376M12 11.376C11.7709 11.3775 11.9094 11.3678 11.6 11.376C10.7926 11.4012 10.0016 11.7368 10 12.6875C9.99825 13.7004 11 14 12 14C13 14 14 14.2312 14 15.3125C14 16.1251 13.1925 16.4812 12.1861 16.5991C11.3861 16.5991 11 16.625 10 16.5M12 11.376L12 10M12 16.5995V18M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H7.8C6.11984 7 5.27976 7 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" className="stroke-indigo-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <div className="text-lg text-zinc-800 font-bold dark:text-slate-200">{subs('subscribe_2')}</div>
                          <div className="text-sm text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} -  {formatDate(new Date(item.endDate))}</div>
                        </div>
                      </div>
                      <div className="flex text-red-600 font-semibold text-lg">-{item.amount} ₽</div>
                    </div>
                  </div>
                ) : null}
                {item.id_subscribe === 1 ? (
                  <div className="bg-white dark:bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm" key={index}>
                    <div className="flex lg:flex-row flex-col lg:items-center justify-between gap-y-4">
                      <div className="flex gap-x-4 items-center">
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 28 28" fill="none">
                            <path d="M20.75 3C21.0557 3 21.3421 3.13962 21.5303 3.3746L21.6048 3.48102L25.8548 10.481C26.0556 10.8118 26.0459 11.2249 25.8395 11.5435L25.7634 11.6459L14.7634 24.6459C14.3906 25.0865 13.7317 25.1159 13.3207 24.7341L13.2366 24.6459L2.23662 11.6459C1.98663 11.3505 1.93182 10.941 2.08605 10.5941L2.14522 10.481L6.39522 3.48102C6.55388 3.21969 6.82182 3.04741 7.1204 3.00842L7.25001 3H20.75ZM17.515 12H10.484L13.999 20.672L17.515 12ZM22.844 12H19.673L16.756 19.195L22.844 12ZM8.326 12H5.155L11.242 19.193L8.326 12ZM9.674 5H7.81101L4.775 10H8.245L9.674 5ZM16.246 5H11.753L10.324 10H17.675L16.246 5ZM20.188 5H18.325L19.754 10H23.224L20.188 5Z" className="fill-pink-500 " />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <div className="text-lg text-zinc-800 font-bold dark:text-slate-200">{subs('subscribe_1')}</div>
                          <div className="text-sm text-zinc-400 dark:text-gray-300">{formatDate(new Date(item.startDate))} -  {formatDate(new Date(item.endDate))}</div>
                        </div>
                      </div>
                      <div className="flex text-red-600 font-semibold text-lg">-{item.amount} ₽</div>
                    </div>
                  </div>
                ) : null}
              </>
            )) : (
              <div className="flex flex-col gap-y-4 w-full items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                  <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500"></path>
                </svg>
                <div className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('subscribe_not_found')}</div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}