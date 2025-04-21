'use client'
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useState } from "react";
import NavLink from "next/link";
import RedactRelease from "@/components/dashboard/release/page";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, } from "@heroicons/react/20/solid";
import DeleteRelease from "@/components/dashboard/release/delete";
import CancelRelease from "@/components/dashboard/release/cancel";
import Pagination from "@/components/pagination/page"
import TrackList from "./tracklist";
import StatusSee from "./status";
import SmartlinkRelease from "@/components/dashboard/release/smartlink";
import { useRouter } from "next/navigation";
import React from "react";
import ToolTip from "@/components/Tooltip/page";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import PromoInfo from "@/components/dashboard/bu2y";

interface ReleaseQueryParams {
  name?: string;
  status?: string;
  skip: number;
  take: number;
}

export default function Header() {
  const t = useTranslations('catalog');
  const router = useRouter()
  let [release_info, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const genre = [
    { "name": "All", "text": t('all') },
    { "name": "Editing", "text": t('editing') },
    { "name": "Moderate", "text": t('moderate') },
    { "name": "Uploading on platforms", "text": t('uploading') },
    { "name": "Error", "text": t('error') },
    { "name": "Accepted", "text": t('accepted') },
    { "name": "Removal", "text": t('removal') },
    { "name": "Deleted", "text": t('deleted') },
  ]
  const [filterStatus, setFilterStatus] = useState(genre[0].text);
  const [filterStatusSee, setfilterStatusSee] = useState(genre[0].text);
  function onFilter(selectType: any) {
    setFilterStatus(selectType.name)
    setfilterStatusSee(selectType.text)
    setPage(1);
  }
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  type Release = {
    id: string;
    cover_small_path: string;
    title: string;
    version: string;
    artist: string;
    featartist: string;
    date_release: Date;
    genre: string;
    meta_language: string;
    type: string;
    upc: string;
    status: string;
    tracks: string;
    p_line: string;
  }
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      return "N/A";
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };
  const DeleteReleaseFunction = async (e: { currentTarget: { value: any; }; }) => {
    try {
      const id_release = e.currentTarget.value;
      const res = await fetch("/api/releases/delete_releases", {
        method: "POST",
        body: JSON.stringify({
          id_release: parseInt(id_release, 10)
        }),

      });
      if (res.ok) {
        const data = await res.json();
        closeModalDelete()
        fetchUserData()

      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  const CancelModerateReleaseFunction = async (e: { currentTarget: { value: any; }; }) => {
    try {
      const id_release = e.currentTarget.value;
      const res = await fetch("/api/releases/cancel_moderate_releases", {
        method: "POST",
        body: JSON.stringify({
          id_release: parseInt(id_release, 10)
        }),

      });
      if (res.ok) {
        const data = await res.json();
        closeModerateDelete()
        fetchUserData()
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const CreateSmartlink = async (e: { currentTarget: { value: any; }; }) => {
    try {
      const id_release = e.currentTarget.value;
      const res = await fetch("/api/smartlink/create_smartlink", {
        method: "POST",
        body: JSON.stringify({
          id_release: parseInt(id_release, 10)
        }),

      });
      if (res.ok) {
        const data = await res.json();
        router.push('/dashboard/smartlink/' + data.id_smartlink);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const queryParams: ReleaseQueryParams = {
        skip: (page - 1) * pageSize,
        take: pageSize,
      };

      if (searchName) {
        queryParams.name = searchName;
      }

      if (filterStatus != "All" && filterStatus != "Все") {
        queryParams.status = filterStatus;
      }
      const res = await fetch("/api/releases/user_releases", {
        method: "POST",
        body: JSON.stringify(queryParams),
      });
      if (res.ok) {
        setLoading(false)
        const data = await res.json();
        setReleases(data.releases);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [filterStatus, page, pageSize])



  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const [deleteValue, setDeleteValue] = useState('')
  const [DeleteModal, setDeleteModal] = useState(false)
  function closeModalDelete() {
    setDeleteModal(false)
  }

  function openModalDelete(value: any) {
    setDeleteModal(true)
    setDeleteValue(value)
  }
  const [moderateValue, setModerateValue] = useState('')
  const [moderateModal, setModerateModal] = useState(false)
  function closeModerateDelete() {
    setModerateModal(false)
  }

  function openModerateDelete(value: any) {
    setModerateModal(true)
    setModerateValue(value)
  }
  const md = useTranslations('metadata')
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  return (
    <>
      <head>
        <title>{md('catalog')}</title>
      </head>
      <div>
      {isWeekend && 
      <>
        <div className="flex fixed bottom-10 right-1 z-50 p-8 h-12 bg-[#fff] dark:bg-zinc-900 rounded-2xl border border-slate-300 ml-auto dark:border-zinc-800 w-[300px] items-center shadow-sm">
          <div className="grid grid-flow-col-1">
            <span className="text-sm font-semibold text-zinc-800 dark:text-slate-200">Продуктивных выходных!</span>
            <span className="text-sm font-semibold text-zinc-800 dark:text-slate-200">Модераторы отдыхают</span>
          </div>
          <div className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#5900ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-moon-star"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
          </div>
        </div>
      </>
      }
        <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('catalog_title')}</span>
        <PromoInfo />
        <div className="flex flex-col lg:items-center gap-2 mt-4 lg:flex-row lg:justify-between ">
          <div className="flex p-2 h-12 bg-[#f7f7f7] dark:bg-zinc-900 rounded-2xl  w-full items-center shadow-sm">
            <div className="flex gap-x-2 w-full">
              <div className="w-20 flex justify-center border-r-2 border-slate-300 dark:border-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" className="stroke-black dark:stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <input
                type="text"
                className="border-none bg-transparent outline-none w-full"
                placeholder={t('search_placeholder')}
                value={searchName}
                onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                onBlur={fetchUserData}
              />
            </div>
          </div>
          <div className="flex p-2 bg-[#f7f7f7] h-12 text-zinc-800 dark:text-slate-200 text-base dark:bg-zinc-900 rounded-2xl w-full lg:w-fit items-center shadow-sm">
            <Listbox onChange={onFilter}>
              <div className="relative flex flex-col gap-y-2 w-full lg:w-fit">
                <Listbox.Button className="flex lg:w-64 w-full justify-between outline-none whitespace-nowrap text-base rounded-xl text-left p-2">
                  <span className="">{t('status')}:</span>
                  <span className="">{filterStatusSee}</span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Listbox.Options className="absolute z-20 mt-12 max-h-60 w-full overflow-auto rounded-xl bg-[#f7f7f7] lg:w-fit  dark:bg-[#1a1a1e] text-base shadow-lg ring-1 text-left  ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                    {genre.map((person, personIdx) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover`
                        }
                        value={person}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                } font-semibold text-zinc-800 px-4 dark:text-slate-200`}
                            >
                              {person.text}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center w-full py-20">
            <BigSpinnerLoading />
          </div>
        ) : (
          <div className="flex flex-col gap-y-4 mt-4">
            {release_info ? release_info.map((item) => (
              <div className="flex flex-col bg-[#f7f7f7] dark:bg-[#1a1a1e] rounded-2xl shadow-sm" key={item.id}>
                <div className="flex border-b border-slate-300 dark:border-zinc-800">
                  <div className="flex w-full flex-col lg:flex-row p-4 gap-y-4">
                    <div className="">
                      <div className="relative h-[120px] w-[120px] items-center justify-center rounded-2xl  bg-gray-100 dark:bg-zinc-800">
                        <div className="relative flex h-full w-full items-center justify-center">
                          {item?.cover_small_path ? (
                            <img src={`https://onvibe.hb.ru-msk.vkcs.cloud/${item.cover_small_path}`} className="h-[120px] w-[120px] rounded-2xl " alt="cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-20" viewBox="0 0 24 24" fill="none">
                              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                              <path d="M7 12C7 9.23858 9.23858 7 12 7" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                              <path d="M17 12C17 14.7614 14.7614 17 12 17" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2" strokeLinecap="round"></path>
                              <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" className="stroke-neutral-500 dark:stroke-neutral-400" strokeWidth="2"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full justify-between items-center">
                      <div className="flex flex-col h-full lg:px-4 w-full gap-y-6">
                        <div className="grid gap-y">
                          <div className="text-left w-full">
                            <span className="text-xl font-semibold text-zinc-800 dark:text-slate-200">{item?.title ? item?.title : "N/A"}</span>
                            {item?.version ? (
                              <span className="text-xl font-semibold text-slate-2000 dark:text-zinc-400">({item?.version})</span>
                            ) : null}
                          </div>
                          <div className="">
                            <span className="text-base font-medium  text-zinc-800 dark:text-slate-200">
                              {Array.isArray(item?.artist) && item?.artist.length > 0 ? (
                                <>
                                  {item?.artist.map((items, index, array) => (
                                    <React.Fragment key={index}>
                                      {items}
                                      {index !== array.length - 1 && ', '}
                                    </React.Fragment>
                                  ))}

                                </>
                              ) : "N/A"}
                            </span>
                            {Array.isArray(item?.featartist) && item?.featartist.length > 0 ? (
                              <span className="text-base font-medium text-gray-600 dark:text-zinc-400">
                                (feat.{' '}
                                {item?.featartist.map((items, index, array) => (
                                  <React.Fragment key={index}>
                                    {items}
                                    {index !== array.length - 1 && ', '}
                                  </React.Fragment>
                                ))}
                                )
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 w-full md:grid-cols-3 lg:flex items-center gap-12 flex-wrap">
                          <div className="grid gap-y text-left">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{t('date_release')}</span>
                            <span className="text-base font-semibold text-slate-900 dark:text-slate-50">{item?.date_release ? formatDate(new Date(item.date_release)) : "N/A"}</span>
                          </div>
                          <div className="grid gap-y text-left">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{t('meta_language')}</span>
                            <span className="text-base font-semibold text-slate-900 dark:text-slate-50">{item?.meta_language ? item?.meta_language : "N/A"}</span>
                          </div>
                          <div className="grid gap-y text-left">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{t('genre')}</span>
                            <span className="text-base font-semibold text-slate-900 dark:text-slate-50">{item?.genre ? item?.genre : "N/A"}</span>
                          </div>
                          <div className="grid gap-y text-left">
                            <span className="text-sm  text-slate-600 dark:text-slate-400">{t('type')}</span>
                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.type ? item?.type : "N/A"}</span>
                          </div>
                          <div className="grid gap-y text-left">
                            <span className="text-sm text-slate-600 dark:text-slate-400">UPC</span>
                            <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{item?.upc ? item?.upc : "N/A"}</span>
                          </div>
                          <div className="grid gap-y text-left">
                            <span className="text-sm text-slate-600 dark:text-slate-400">P-line</span>
                            <span className="text-base font-semibold text-slate-900 dark:text-slate-50">{item?.p_line ? item?.p_line : "N/A"}</span>
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex gap-x-2">
                        {item?.status === "Editing" ? (
                          <>
                            <NavLink href={`/dashboard/edit/${item?.id}`}>
                              <RedactRelease />
                            </NavLink>
                            <button onClick={() => openModalDelete(item?.id)}>
                              <DeleteRelease />
                            </button>
                          </>
                        ) : null}
                        {item?.status === "Moderate" ? (
                          <button onClick={() => openModerateDelete(item?.id)}>
                            <CancelRelease />
                          </button>
                        ) : null}
                        {item?.status === "Accepted" ? (
                          <button onClick={CreateSmartlink} value={item?.id}>
                            <SmartlinkRelease />
                          </button>
                        ) : null}
                      </div>
                      <StatusSee item={item} />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col">
                  <TrackList item={item} />
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center w-full py-20 gap-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="6em" height="6em" viewBox="0 0 16 16">
                  <path d="m 3 0 c -1.660156 0 -3 1.339844 -3 3 v 7 c 0 1.660156 1.339844 3 3 3 h 10 c 1.660156 0 3 -1.339844 3 -3 v -7 c 0 -1.660156 -1.339844 -3 -3 -3 z m 0 2 h 10 c 0.554688 0 1 0.445312 1 1 v 7 c 0 0.554688 -0.445312 1 -1 1 h -10 c -0.554688 0 -1 -0.445312 -1 -1 v -7 c 0 -0.554688 0.445312 -1 1 -1 z m 3 2 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m 4 0 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -2 3 c -1.429688 0 -2.75 0.761719 -3.464844 2 c -0.136718 0.238281 -0.054687 0.546875 0.183594 0.683594 c 0.238281 0.136718 0.546875 0.054687 0.683594 -0.183594 c 0.535156 -0.929688 1.523437 -1.5 2.597656 -1.5 s 2.0625 0.570312 2.597656 1.5 c 0.136719 0.238281 0.445313 0.320312 0.683594 0.183594 c 0.238281 -0.136719 0.320312 -0.445313 0.183594 -0.683594 c -0.714844 -1.238281 -2.035156 -2 -3.464844 -2 z m -3 7 c -1.105469 0 -2 0.894531 -2 2 h 10 c 0 -1.105469 -0.894531 -2 -2 -2 z m 0 0" className="fill-red-500" />
                </svg>
                <span className="text-base font-semibold text-zinc-800 dark:text-slate-200">{t('not_found')}</span>
              </div>
            )}
          </div>
        )}


        <Pagination totalPages={totalPages} page={page} handlePageChange={handlePageChange} />

        <Transition appear show={DeleteModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModalDelete}>
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
                        <button onClick={closeModalDelete} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
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
                        onClick={DeleteReleaseFunction}
                        value={deleteValue}
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

        <Transition appear show={moderateModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModerateDelete}>
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
                        {t('cancel_moderate')}
                      </div>
                      <div className="flex items-start">
                        <button onClick={closeModerateDelete} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                      <div className="w-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-red-600" width="4em" height="4em" viewBox="0 0 32 32" version="1.1">
                          <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-slate-900 dark:text-slate-200">{t('cancel_moderate_descript')}</span>
                      </div>
                    </div>
                    <div className="flex w-full justify-end border-t border-gray-300 dark:border-zinc-800 p-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                        onClick={CancelModerateReleaseFunction}
                        value={moderateValue}
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  )
}