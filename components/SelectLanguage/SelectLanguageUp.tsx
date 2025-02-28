'use client';

import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { ChangeEvent, Fragment, useState, useTransition } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(selectedLocale: any) {
    startTransition(() => {
      router.replace(pathname, { locale: selectedLocale });
    });
  }

  return (
    <Listbox onChange={onSelectChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className="relative w-full pl-3 pr-10 text-left text-zinc-800 dark:text-gray-100 ring-none sm:text-sm sm:leading-6 hover:bg-gray-100 dark:hover:bg-zinc-800 h-full p-2 rounded-md transition"
          >
            <span className="flex items-center">
              <span className="ml-3 block truncate text-sm">
                {locale === 'en' ? 'English' : 'Русский'}
              </span>
            </span>
          </Listbox.Button>

          <Listbox.Options
            className="bottom-full absolute z-10 w-full max-h-56 overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {['en', 'ru'].map((cur) => (
              <Listbox.Option key={cur} value={cur}>
                {({ active, selected }) => (
                  <div
                    className={`cursor-pointer select-none relative px-4 py-2 ${active ? 'hover:bg-gray-200 dark:hover:bg-zinc-800' : ''
                      } ${!active && !selected ? 'text-zinc-800 dark:text-gray-100' : ''}`}
                  >
                    {cur === 'en' ? 'English' : 'Русский'}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>

  );
}
