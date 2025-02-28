"use client"
import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";
import LocaleSwitcher from "@/components/SelectLanguage/SelectLanguageUp";

export default function FooterSign() {
    return (
        <footer className="flex w-full items-center justify-between px-4 py-6 mt-auto">
            <div className="text-sm text-zinc-800 dark:text-slate-200">
                © 2024 ONVIBE LLP All rights reserved
            </div>
            <div className="flex items-center">
                <DarkModeToggle />
                <LocaleSwitcher />
            </div>
        </footer>
    )
}