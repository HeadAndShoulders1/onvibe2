import { Popover, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

export default function StatusSee({ item }: any) {
  const t = useTranslations('catalog')
  return (
    <div className="w-full ">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                                        ${open ? 'text-white' : 'text-white/90'}
                                        w-48
                                        flex items-center bg-[#f7f7f7] dark:bg-[#1a1a1e] text-lg rounded-xl border text-left border-slate-300 dark:border-zinc-800 py-4 px-2 justify-center`}
            >
              <span className="text-base text-zinc-800 dark:text-slate-200 font-semibold">
                {item?.status === "Editing" ? t('editing') : null}
                {item?.status === "Moderate" ? t('moderate') : null}
                {item?.status === "Uploading" ? t('uploading') : null}
                {item?.status === "Error" ? t('error') : null}
                {item?.status === "Accepted" ? t('accepted') : null}
                {item?.status === "Removal" ? t('removal') : null}
                {item?.status === "Deleted" ? t('deleted') : null}
              </span>

            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 mt-3 w-full lg:w-fit transform px-4 sm:px-0 lg:max-w-lg right-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 ">
                  <div className="relative p-4 bg-[#f7f7f7] dark:bg-[#1a1a1e] rounded-xl text-base text-zinc-800 dark:text-slate-200">
                    {item?.status === "Editing" ? t('editing_descript') : null}
                    {item?.status === "Moderate" ? t('moderate_descript') : null}
                    {item?.status === "Uploading" ? t('uploading_descript') : null}
                    {item?.status === "Error" ? (item.error[item.error.length - 1]) : null}
                    {item?.status === "Accepted" ? t('accepted_descript') : null}
                    {item?.status === "Removal" ? t('removal_descript') : null}
                    {item?.status === "Deleted" ? t('deleted_descript') : null}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}