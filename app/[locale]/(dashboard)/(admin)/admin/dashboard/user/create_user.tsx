'use client'
import AlertAll from "@/components/Alert/page"
import { Dialog, RadioGroup, Transition } from "@headlessui/react"
import { useTranslations } from "next-intl"
import { Fragment, useState } from "react"

export function CreateUser(){
    const t = useTranslations('user_admin')
    const [OpenModal, setOpenModal] = useState(false)
    const CreateUser = async () =>{
        const res = await fetch('/api/admin/users/create_user',{
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    type: selected.id
                })
            }
        )
        const data = await res.json()
        if(data.message === "success"){
            setOpenAlert(true)
            setTypeAlert('success')
            setMesssageAlert(data.message)
            setOpenAlert(false)
        }else{
            setOpenAlert(true)
            setTypeAlert('error')
            setMesssageAlert(data.message)
        }
    }
    const plans = [
        {
        id:1,
        type: t('premium_artist'),
        type_ph: t('type_premium_artist_description')
        },
        {
            id:2,
            type: t('premium'),
            type_ph: t('type_premium_description')
        },
        {
            id:3,
            type: t('professional'),
            type_ph: t('type_professional_description')
        },
    ]
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [selected, setSelected] = useState(plans[0])

    const [openAlert,setOpenAlert] = useState(false)
    const [TypeAlert,setTypeAlert] = useState('')
    const [MesssageAlert,setMesssageAlert] = useState('')
    return(
        <>
            {openAlert ? (
                <AlertAll type={TypeAlert} message={MesssageAlert} setIsOpen={setOpenAlert} />
            ) : null}
            <button onClick={() => setOpenModal(true)} className="flex items-center gap-x-2 bg-[#5351FF] h-10 px-3 rounded-lg">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12H20M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <span className="text-sm font-semibold text-white">{t('create_user')}</span>
            </button>

            <Transition appear show={OpenModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setOpenModal(false)}>
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
                                    <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left align-middle shadow-xl transition-all">
                                        <div className="flex justify-between p-6 border-b border-slate-300 dark:border-zinc-800">
                                            <div className="text-lg font-medium leading-6 text-zinc-800 dark:text-slate-200">
                                                {t('create_user')}
                                            </div>
                                            <div className="flex items-start">
                                                <button onClick={() => setOpenModal(false)} className="items-center flex justify-center hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md w-6 h-6">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" className="fill-black dark:fill-white"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 border-b gap-y-4 flex flex-col   border-slate-300 dark:border-zinc-800">
                                            <div className="flex flex-col gap-y-1">
                                                <span className="text-sm text-zinc-600 dark:text-slate-400">
                                                    {t('username')}
                                                </span>
                                                <input type="username" name="username" autoComplete="off" className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" required value={username} onChange={(e) => setUserName(e.target.value)}/>
                                            </div>
                                            <div className="flex flex-col gap-y-1">
                                                <span className="text-sm text-zinc-600 dark:text-slate-400">
                                                    {t('email')}
                                                </span>
                                                <input type="email" name="email" autoComplete="off"  className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                                            </div>
                                            <div className="flex flex-col gap-y-1">
                                                <span className="text-sm text-zinc-600 dark:text-slate-400">
                                                    {t('password')}
                                                </span>
                                                <input type="password" name="password" autoComplete="off"  className="hover:outline-slate-400  hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white  dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 w-full" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                                            </div>
                                            <div className="flex flex-col gap-y-1">
                                                <span className="text-sm text-zinc-600 dark:text-slate-400">
                                                    {t('type')}
                                                </span>
                                                <RadioGroup value={selected} onChange={setSelected}>
                                                    <div className="flex flex-col w-full h-full gap-4 select-none">
                                                        {plans.map((plan) => (
                                                        <RadioGroup.Option key={plan.type} value={plan}>
                                                            <div className="grid items-center w-full h-full gap-y-1  bg-white dark:bg-zinc-900 rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 hover">
                                                                <div className="flex justify-between  text-base font-semibold">
                                                                    {plan.type}
                                                                    {selected.id === plan.id ? (
                                                                        <div className="shrink-0 text-white h-6 w-6">
                                                                            <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em">
                                                                                <circle cx={12} cy={12} r={12} className="fill-neutral-900 dark:fill-[#fff]" opacity="0.2" />
                                                                                <path
                                                                                d="M7 13l3 3 7-7"
                                                                                className="stroke-neutral-900 dark:stroke-[#fff]"
                                                                                strokeWidth={1.5}
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                    ):null}
                                                                </div>
                                                                <div className="text-sm text-slate-2000 dark:text-zinc-400">
                                                                    {plan.type_ph}
                                                                </div>
                                                            </div>
                                                        </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>

                                        <div className="py-4 px-6 flex gap-x-4 justify-end">
                                            <button
                                                type="button"
                                                onClick={CreateUser}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            >
                                                {t('accept')}
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                    </Dialog>
                </Transition>
        </>
    )
}