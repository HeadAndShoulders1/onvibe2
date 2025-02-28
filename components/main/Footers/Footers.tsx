import Logo from "@/components/logo/page";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";


const Footers = () => {
    const locale = useLocale();
    const t = useTranslations('footers');
    const linkFooter = [
        {
            id: 1,
            title: t('basic'),
            name: [
                {
                    id: 1,
                    title: t('main'),
                    url: `/${locale}/`
                },
                {
                    id: 2,
                    title: t('distribution'),
                    url: `/${locale}//distribution`
                },
                {
                    id: 3,
                    title: t('stores'),
                    url: `/${locale}/stores`
                },
                {
                    id: 4,
                    title: t('questions'),
                    url: `/${locale}/questions`
                },
            ]
        },
        {
            id: 2,
            title: t('catalog'),
            name: [
                {
                    id: 1,
                    title: t('office'),
                    url: `/${locale}/dashboard/catalog`
                },
                {
                    id: 2,
                    title: t('analytics'),
                    url: `/${locale}/dashboard/analytics`
                },
                {
                    id: 3,
                    title: t('finance'),
                    url: `/${locale}/dashboard/finance`
                },
                {
                    id: 4,
                    title: t('smartlink'),
                    url: `/${locale}/dashboard/smartlink`
                },
            ]
        },
        {
            id: 3,
            title: t('control_panel'),
            name: [
                {
                    id: 1,
                    title: t('sign_up'),
                    url: `/${locale}/auth/signin`
                }
            ]
        },
        {
            id: 4,
            title: t('documents'),
            name: [
                {
                    id: 1,
                    title: t('privacy_policy'),
                    url: "/docs/privacy"
                },
                {
                    id: 2,
                    title: t('public_offering'),
                    url: "/docs/terms"
                },
                {
                    id: 3,
                    title: t('license_agreement'),
                    url: '/license.pdf'
                }
            ]
        },
    ]
    return (
        <footer className="w-full py-16 divide-y divide-gray-500/10 max-w-7xl lg:m-auto ">
            <div className="-my-6 divide-y divide-gray-500/10"></div>
            <div className='flex w-full mx-auto p-10 first-letter:lg:p-20 align-text-top'>
                <div className='grid gap-6 lg:grid-cols-5 justify-center w-full py-10'>
                    <div>
                        <a href="/" className="-m-1.5 p-1.5">
                            <Logo />
                        </a>
                    </div>
                    {linkFooter.map((links) => (
                        <div key={links.id}>
                            <h1 className="tracking-tight text-zinc-800 dark:text-slate-200 sm:text-lg font-bold">{links.title}</h1>
                            {links.name.map((link) => (
                                <Link href={link.url} className="-m-1.5 p-1.5" key={link.id}>
                                    <h2>{link.title}</h2>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footers