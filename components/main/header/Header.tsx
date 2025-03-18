"use client";
import React, { useState } from 'react';
import NavLink from "next/link";
import { Dialog } from '@headlessui/react'
import { useLocale, useTranslations } from 'next-intl';

import LocaleSwitcher from "../../SelectLanguage/SelectLanguageDown";
import DarkModeToggle from "../../DarkModeToggle/DarkModeToggle";
import Logo from '@/components/logo/page';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('headers');
  const locale = useLocale();
  const links = [
    {
      id: 1,
      title: t('home'),
      url: `/${locale}/`
    },
    {
      id: 2,
      title: t('distribution'),
      url: `/${locale}/distribution`,
    },
    {
      id: 3,
      title: t('FAQ'),
      url: `/${locale}/questions`
    },
    {
      id: 4,
      title: t('news'),
      url: `/${locale}/news`
    },
  ]
  return (
    <div className="bg-white">
      <header className="inset-x-0 top-0 z-50 fixed bg-white dark:bg-[#141518] border-b border-slate-300 dark:border-zinc-800">
        <nav className="flex items-center justify-between py-1 pt-2 w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto">
          <div className='flex gap-x-6 items-center'>
            <a href="/" className="mb-1">
              <Logo />
            </a>
            <div className="hidden lg:flex lg:gap-x-8 ">
              {links.map((item) => (
                <NavLink key={item.id} href={item.url} className="text-sm font-medium text-zinc-800 dark:text-slate-200 hover:dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 px-4 py-1.5 rounded-md transition-all">
                  {item.title}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-5 items-center">
            <DarkModeToggle />
            <LocaleSwitcher />

            <a href="/dashboard/catalog/" className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {t('sign')} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="flex div_mobile lg:hidden ">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-3xl dark:fill-slate-200 fill-zinc-700" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
              </svg>
            </button>
          </div>
        </nav>


        <Dialog as="div" className="lg:hidden " open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50 " />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 min-w-full overflow-y-auto bg-white dark:bg-zinc-900 pt-2 ">
            <div className='flex flex-col w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto'>
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5">
                  <Logo />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" fill="none">
                    <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#c3bdcf" />
                  </svg>
                </button>

              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {links.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-800 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="/auth/signin"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-zinc-800 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    >
                      {t('sign')}
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className='w-full rounded-3xl flex border border-zinc-300 dark:border-zinc-700 items-center justify-between scroll-smooth mt-5 px-2'>
                  <div className='flex'> <DarkModeToggle /></div>
                  <div className='flex'><LocaleSwitcher /></div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </div>
  )
}
