"use client"
import BigSpinnerLoading from "@/components/Spinner/bigspinner"
import DeleteRelease from "@/components/dashboard/release/delete"
import RedactRelease from "@/components/dashboard/release/page"
import { Dialog, Transition } from "@headlessui/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import React, { Fragment, useEffect, useState } from "react"

export default function SmartLinkCatalog() {
  const t = useTranslations('smartlink')
  const [smartlink_info, setSmartlinkInfo] = useState<Smartlink[]>([])
  const [loading, setLoading] = useState(false)
  type Smartlink = {
    id: string;
    title: string;
    version: string;
    artist: string;
    featartist: string;
    url: string;
    cover: string;
  }
  const FetchSmartlink = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/smartlink/get_smartlink", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setSmartlinkInfo(data)
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  useEffect(() => {
    FetchSmartlink();
  }, [])

  const DeleteSmartLink = async () => {
    try {
      const res = await fetch("/api/smartlink/delete_smartlink", {
        method: "POST",
        body: JSON.stringify({
          id_smartlink: DeleteNumber,
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message == "success") {
          FetchSmartlink()
          closeModal()
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  const [DeleteNumber, setDeleteNumber] = useState('')
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function OpenModalDelete(value: any) {
    setDeleteNumber(value)
    setIsOpen(true)
  }
  const md = useTranslations('metadata')
  return (
    <>
      <head>
        <title>{md('smartlink')}</title>
      </head>
      <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
      {loading ? (
        <div className="flex w-full justify-center items-center py-20">
          <BigSpinnerLoading />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {smartlink_info ? smartlink_info.map((item: any) => (
            <div className="bg-white dark:bg-zinc-900 rounded-xl w-full shadow-sm" key={item.id}>
              <div className="flex lg:flex-row flex-col justify-between ">
                <div className="lg:flex gap-6">
                  <div className="w-44 h-44">
                    <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover}`} className="w-44 h-44 rounded-l-xl " alt="cover" />
                  </div>
                  <div className="flex flex-col gap-y-8 justify-center p-4 lg:p-0">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-zinc-800 dark:text-slate-200 font-semibold text-lg">{item.title}</span>
                      <span className="text-slate-2000 dark:text-zinc-400 text-base">
                        {Array.isArray(item?.artist) && item?.artist.length > 0 ? (
                          <>
                            {item?.artist.map((items: any, index: number, array: string | any[]) => (
                              <React.Fragment key={index}>
                                {items}
                                {index !== array.length - 1 && ', '}
                              </React.Fragment>
                            ))}

                          </>
                        ) : "N/A"}
                        {' '}
                        {Array.isArray(item?.featartist) && item?.featartist.length > 0 ? (
                          <>
                            (feat.{' '}
                            {item?.featartist.map((items: any, index: number, array: string | any[]) => (
                              <React.Fragment key={index}>
                                {items}
                                {index !== array.length - 1 && ', '}
                              </React.Fragment>
                            ))}
                            )
                          </>
                        ) : null}
                      </span>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-zinc-800 dark:text-slate-200 font-semibold text-base">{t('url_smartlink')}</span>
                      <div className="bg-white dark:bg-zinc-900 rounded-xl px-4 py-2 border border-slate-300 dark:border-zinc-800 h-fit w-fit">
                        <Link href={`/${item.url}`} className="text-gray-700 dark:text-gray-200 text-sm">onvibe.fun/{item.url}</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-4 p-4 ">
                  <Link href={`/dashboard/smartlink/${item.id}`} className="flex justify-center items-center w-8 h-8 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md"><RedactRelease /></Link>
                  <button onClick={() => OpenModalDelete(item.id)} className="flex justify-center items-center w-8 h-8 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md"><DeleteRelease /></button>
                </div>
              </div>
            </div>
          )) : null}
          {smartlink_info.length == 0 ? (
            <div className="flex flex-col items-center w-full py-20 gap-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500" />
              </svg>
              <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('not_found_smartlink')}</span>
            </div>
          ) : null}
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                    <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                      {t('delete_release')}
                    </div>
                    <div className="flex items-start">
                      <button onClick={closeModal} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                    <div className="w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24" fill="none">
                        <path d="M10 11V17" className="stroke-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 11V17" className="stroke-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 7H20" className="stroke-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" className="stroke-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" className="stroke-red-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-slate-900 dark:text-slate-200">{t('delete_descript')}</span>
                    </div>
                  </div>
                  <div className="flex w-full justify-end border-t border-gray-300 dark:border-zinc-800 p-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                      value={DeleteNumber}
                      onClick={DeleteSmartLink}
                    >
                      {t('delete')}
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