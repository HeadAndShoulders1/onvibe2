"use client"
import Logo from "@/components/logo/page";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import NavLink from "next/link";

export default function Headers() {
    const t = useTranslations('auth')
    return (
        <header className="flex w-full items-center justify-between px-4 py-6">
            <nav className="flex items-center justify-between w-full">
                <div className="flex lg:flex-1">
                    <NavLink href="/" className="-m-1.5 p-1.5 w-[140px] lg:w-full">
                        <Logo />
                    </NavLink>
                </div>
                <div className="flex">
                    <button onClick={() => { signOut() }}>
                        <div className="flex rounded-md items-center ml-auto px-2 py-2 font-medium text-[#FFF] ring-1 ring-inset bg-indigo-600 gap-x-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full justify-center">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 64 64" fill="none">
                                    <g clipPath="url(#clip0_14_1995)">
                                        <path d="M27.865 31.758C33.5972 31.758 38.244 27.1112 38.244 21.379C38.244 15.6468 33.5972 11 27.865 11C22.1328 11 17.486 15.6468 17.486 21.379C17.486 27.1112 22.1328 31.758 27.865 31.758Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M40 36.346C37.0313 33.3973 33.0142 31.7466 28.83 31.756H26.9C22.6831 31.756 18.6388 33.4312 15.657 36.413C12.6752 39.3948 11 43.4391 11 47.656V52.516H44.73V51.756" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M48.621 38.146V46.123" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M52.609 42.134H44.632" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_14_1995">
                                            <rect width="45.609" height="45.516" fill="white" transform="translate(9 9)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span className="text-sm font-semibold text-white">
                                {t('create_account_header')}
                            </span>
                        </div>
                    </button>
                </div>
            </nav>
        </header>
    )
}