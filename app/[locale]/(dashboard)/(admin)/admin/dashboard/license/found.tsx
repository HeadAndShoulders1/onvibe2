import { useTranslations } from "next-intl"

export default function Found() {
    const t = useTranslations('admin_license')
    return (
        <div className="flex items-center p-2 text-base gap-x-2 mt-2 text-green-800 rounded-lg bg-green-100 dark:bg-green-200 dark:text-green-700">
            <div className="flex items-center">
                <svg className="flex-shrink-0 inline w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
            </div>
            <div>
                {t('inn_found')}
            </div>
        </div>
    )
}