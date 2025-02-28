'use client';

import { Listbox, Menu, Transition } from '@headlessui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import { useState, useTransition } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  function onSelectChange(selectedLocale: any) {
    startTransition(() => {
      router.replace(pathname, { locale: selectedLocale });
    });
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="flex gap-x-2 items-center hover:bg-gray-100 dark:hover:bg-zinc-800 h-full p-2 rounded-md transition"
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center">
            <span className="ml-3 block truncate text-sm text-zinc-800 dark:text-slate-100 font-medium">
              {locale === 'en' ? 'English' : 'Русский'}
            </span>
          </span>
          <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition ${open ? 'transform rotate-180' : ''}`} aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute left-0 p-1 z-10 mt-2 min-w-max w-full origin-top-right rounded-lg bg-white dark:bg-zinc-800 shadow-lg border border-slate-300 dark:border-zinc-900 focus:outline-none">
          <div className="py-1">
            {['en', 'ru'].map((cur) => (
              <Menu.Item key={cur} >
                {({ active }) => (
                  <button
                    onClick={() => onSelectChange(cur)}
                    className={`cursor-pointer select-none relative px-4 py-2 min-w-max w-full text-left rounded-md ${active ? 'hover:bg-gray-200 dark:hover:bg-zinc-600' : ''
                      } ${!active ? 'text-zinc-800 dark:text-gray-100' : ''}`}
                  >
                    {cur === 'en' ? 'English' : 'Русский'}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
