"use client";

import { useTranslations } from "next-intl";
import NavigatorProfile from "../NavigatorProfile";
import { useEffect, useState, useRef } from "react";
import { GrantMenu } from "@/components/profile/grant/grant-menu";
import Link from "next/link";
import GrantFormPage from "@/components/profile/grant/GrantFormPage";

export default function Grant() {
  const t = useTranslations("profile");

  type UserData = {
    username: string;
    email: string;
  };

  type UserGrant = {
    grant: boolean;
    grant_duration: number;
    grant_review: boolean;
    grant_end?: string;
  };

  type Subscribe = {
    id: string;
    id_subscribe: number;
    startDate: string;
  };

  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscribe, setSubscribe] = useState<Subscribe[]>([]);
  const [grant, setGrant] = useState<UserGrant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const subs = useTranslations("subscribe");

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/user_info", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const getSubscribe = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/subscribe", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setSubscribe(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGrantStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/check_grant");
      if (res.ok) {
        const data = await res.json();
        
        // Проверяем, истек ли грант
        const now = new Date();
        const grantEndDate = data.grant_end ? new Date(data.grant_end) : null;
        const isGrantExpired = grantEndDate && grantEndDate < now;
        
        setGrant(
          isGrantExpired
            ? { grant: false, grant_duration: 0, grant_review: false, grant_end: data.grant_end }
            : data
        );
      } else {
        setGrant({ grant: false, grant_duration: 0, grant_review: true, grant_end: undefined });
      }
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setGrant({ grant: false, grant_duration: 0, grant_review: true, grant_end: undefined });
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchUserData();
    getSubscribe();
    getGrantStatus();
  }, []);

  const md = useTranslations("metadata");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  return (
    <>
      <head>
        <title>{md("profile")}</title>
      </head>
      <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t("title")}</span>
      <NavigatorProfile />
      <div className=" bg-zinc-900 mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
        <span className="text-xl font-bold text-slate-200">{t("information")}</span>
        <GrantMenu grant={grant?.grant} grant_review={grant?.grant_review} grant_duration={grant?.grant_duration} loading={loading} />
      </div>
      <div className="w-full overflow-x-scroll mt-2">
        <div className="min-w-[600px] p-4  bg-zinc-900 mt-5  rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
          <div className="flex">
            <div className="w-1/4 h-2  mt-1 dark:border-zinc-900 bg-gradient-to-r from-transparent to-[#5351ff]"></div>
            <div className="w-8 h-[30px] bg-[#5351ff] rounded-full border-zinc-900 border-4 mt-[-6px]"></div>
            {grant?.grant_review ? <> <div className="w-1/4 h-2 bg-[#5351ff] mt-1"></div>
            <div className="w-8 h-[30px] bg-[#5351ff] rounded-full border-zinc-900 border-4 mt-[-6px]"></div></> : <> <div className="w-1/4 h-2 bg-[#3c3c4b] mt-1"></div>
            <div className="w-8 h-[30px] bg-[#3c3c4b] rounded-full border-zinc-900 border-4 mt-[-6px]"></div></>}
            {grant?.grant ? <><div className="w-1/4 h-2 bg-[#5351ff] mt-1"></div>
            <div className="w-8 h-[30px] bg-[#5351ff] rounded-full border-zinc-900 border-4 mt-[-6px]"></div>
            <div className="w-1/4 h-2  mt-1 bg-gradient-to-l from-transparent to-[#5351ff]"></div></> : <><div className="w-1/4 h-2 bg-[#3c3c4b] mt-1"></div>
            <div className="w-8 h-[30px] bg-[#3c3c4b] rounded-full border-zinc-900 border-4 mt-[-6px]"></div>
            <div className="w-1/4 h-2  mt-1 bg-gradient-to-l from-transparent to-[#3c3c4b]"></div></>}
          </div>
          <div className="flex justify-around pl-1/4 pr-[10.75%] pl-[11.5%] text-white">
            <h1>{t('application')}</h1>
            <h1>{t('consideration')}</h1>
            <h1>{t('receiving_grant')}</h1>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-[#5351ff] mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
          <div className="flex gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-right-dash">
              <path d="M5 9v6" />
              <path d="M9 9h3V5l7 7-7 7v-4H9V9z" />
            </svg>
            <span className="text-sm font-bold text-slate-200 mt-[1px]">{t('current_stage')}</span>
          </div>
          <span className="text-xl font-bold text-slate-200 ">{t('apply')}</span>
          <div className="text-sm text-gray-300 mt-2">
            {t('desc')}
          </div>
          {grant?.grant_review ? <>
              <h1 className="text-lg  text-slate-300 mt-4">{t('applied')}</h1>
          </> : <><Link href="#" onClick={openModal} className="text-white"><div className=" mt-5 p-2 rounded-xl border border-slate-300 shadow-sm flex justify-center">
            {t('apply')}
          </div></Link>
          </>}
        </div>
      </div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-500 ease-in-out"></div>
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div
              ref={modalRef}
              className={`sm:w-[50%] w-[90%] bg-white dark:bg-zinc-900 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm transform transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <GrantFormPage />
            </div>
          </div>
        </>
      )}
    </>
  );
}
