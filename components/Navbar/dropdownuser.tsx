import { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import SpinnerLoading from '../Spinner/page';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import NavLink from "next/link";
import { redirect, useRouter } from 'next/navigation';


export default function DropdownUser() {
  type UserData = {
    username: string;
    email: string;
    balance: string;
  };
  const router = useRouter();
  const t = useTranslations('dashboard_link');
  const [userData, setUserData] = useState<UserData | null>(null); // Specify the type here

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch('/api/user/user_info')
      const data = await res.json()
      if (data.message == "email_not_confirm") {
        router.refresh();
        router.push('/auth/signin/auth_email');
      } else {
        setUserData(data);
      }
    };
    fetchUserData();
  }, [setUserData]);


  return (
    <>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="flex gap-x-2 items-center hover:bg-gray-100 dark:hover:bg-zinc-800 h-full p-2 rounded-md transition"
          >
            <div className='justify-center flex rounded-xl w-9 h-9 text-sm font-semibold shadow-sm items-center bg-indigo-900'>
              <span className="text-slate-200 justify-center p-0 leading-0">
                <div>
                  {userData ? userData.username[0] : <SpinnerLoading />}
                </div>
              </span>
            </div>

            <div className='flex-col text-left xl:flex lg:hidden flex '>
              <span className="dark:text-slate-200 text-zinc-800 justify-center p-0 leading-0 text-sm font-semibold">
                {userData ? userData.username : <SpinnerLoading />}
              </span>
              <span className="dark:text-zinc-400 text-slate-2000 justify-center p-0 leading-0 text-xs">
                {userData ? userData.email : <SpinnerLoading />}
              </span>
            </div>
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
          <Menu.Items className="absolute right-0 z-50 w-fit py-2 px-4 origin-top-right rounded-lg bg-white dark:bg-zinc-900 shadow-lg border border-slate-300 dark:border-zinc-800 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                <div className="flex gap-x-2 py-1">
                  <div className='justify-center flex rounded-xl w-9 h-9 text-sm font-semibold shadow-sm items-center bg-indigo-900'>
                    <span className="text-slate-200 justify-center p-0 leading-0">
                      <div>
                        {userData ? userData.username[0] : <SpinnerLoading />}
                      </div>
                    </span>
                  </div>

                  <div className='flex flex-col text-left'>
                    <span className="dark:text-slate-200 text-zinc-800 justify-center p-0 leading-0 text-sm font-semibold">
                      {userData ? userData.username : <SpinnerLoading />}
                    </span>
                    <span className="dark:text-zinc-400 text-slate-2000 justify-center p-0 leading-0 text-xs">
                      {userData ? userData.email : <SpinnerLoading />}
                    </span>
                  </div>
                </div>
              </Menu.Item>
              <Menu.Item>
                <NavLink href="/dashboard/profile" className='flex gap-x-2 mt-1 items-center py-2 px-1 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-600 hover'>
                  <div className='px-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" version="1.1">
                      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -2119.000000)" className="fill-black dark:fill-gray-200">
                          <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path d="M338.083123,1964.99998 C338.083123,1962.79398 336.251842,1960.99998 334,1960.99998 C331.748158,1960.99998 329.916877,1962.79398 329.916877,1964.99998 C329.916877,1967.20599 331.748158,1968.99999 334,1968.99999 C336.251842,1968.99999 338.083123,1967.20599 338.083123,1964.99998 M341.945758,1979 L340.124685,1979 C339.561214,1979 339.103904,1978.552 339.103904,1978 C339.103904,1977.448 339.561214,1977 340.124685,1977 L340.5626,1977 C341.26898,1977 341.790599,1976.303 341.523154,1975.662 C340.286989,1972.69799 337.383888,1970.99999 334,1970.99999 C330.616112,1970.99999 327.713011,1972.69799 326.476846,1975.662 C326.209401,1976.303 326.73102,1977 327.4374,1977 L327.875315,1977 C328.438786,1977 328.896096,1977.448 328.896096,1978 C328.896096,1978.552 328.438786,1979 327.875315,1979 L326.054242,1979 C324.778266,1979 323.773818,1977.857 324.044325,1976.636 C324.787453,1973.27699 327.107688,1970.79799 330.163906,1969.67299 C328.769519,1968.57399 327.875315,1966.88999 327.875315,1964.99998 C327.875315,1961.44898 331.023403,1958.61898 334.733941,1959.04198 C337.422678,1959.34798 339.650022,1961.44698 340.05323,1964.06998 C340.400296,1966.33099 339.456073,1968.39599 337.836094,1969.67299 C340.892312,1970.79799 343.212547,1973.27699 343.955675,1976.636 C344.226182,1977.857 343.221734,1979 341.945758,1979 M337.062342,1978 C337.062342,1978.552 336.605033,1979 336.041562,1979 L331.958438,1979 C331.394967,1979 330.937658,1978.552 330.937658,1978 C330.937658,1977.448 331.394967,1977 331.958438,1977 L336.041562,1977 C336.605033,1977 337.062342,1977.448 337.062342,1978" id="profile_round-[#1346]"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200'>{t('profile')}</div>
                </NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink href="/dashboard/profile/license" className='flex gap-x-2 items-center py-2 px-1 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-600 hover'>
                  <div className='px-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                      <path d="M19 3H9V3C7.11438 3 6.17157 3 5.58579 3.58579C5 4.17157 5 5.11438 5 7V10.5V17" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 17V19C14 20.1046 14.8954 21 16 21V21C17.1046 21 18 20.1046 18 19V9V4.5C18 3.67157 18.6716 3 19.5 3V3C20.3284 3 21 3.67157 21 4.5V4.5C21 5.32843 20.3284 6 19.5 6H18.5" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 21H5C3.89543 21 3 20.1046 3 19V19C3 17.8954 3.89543 17 5 17H14" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 7H14" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 11H14" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className='whitespace-nowrap text-sm font-semibold text-zinc-800 dark:text-slate-200'>{t('license')}</div>
                </NavLink>
              </Menu.Item>
              <Menu.Item>
                <button className='w-full' onClick={() => { signOut() }}>
                  <div className='flex gap-x-2 items-center py-2 px-1 transition-all duration-75 hover:bg-brand-600/5 rounded hover:bg-gray-200 dark:hover:bg-zinc-600 hover'>
                    <div className='px-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                        <g id="Interface / Exit">
                          <path id="Vector" d="M12 15L15 12M15 12L12 9M15 12H4M4 7.24802V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2839 4.21799 18.9076C4 18.4798 4 17.9201 4 16.8V16.75" className="stroke-black dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </div>
                    <div className='text-sm font-semibold text-zinc-800 dark:text-slate-200'>{t('exit')}</div>
                  </div>
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
