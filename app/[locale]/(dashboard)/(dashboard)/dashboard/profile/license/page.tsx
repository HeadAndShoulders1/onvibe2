"use client"
import { useTranslations } from "next-intl"
import NavigatorProfile from "../NavigatorProfile"
import { useEffect, useState } from "react";
import SpinnerLoading from "@/components/Spinner/page";
import LicenseForm from "./form";
import BigSpinnerLoading from "@/components/Spinner/bigspinner";
import LicenseModerate from "./moderate";
import LicenseAccept from "./accept";

export default function License() {
  type UserData = {
    license_status: string;
  };
  const t = useTranslations('license')

  const [userData, setUserData] = useState<UserData | null>(null); // Specify the type here

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/check_license", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const md = useTranslations('metadata')
  return (
    <>
      <head>
        <title>{md('license')}</title>
      </head>
      <span className="text-3xl text-zinc-800 font-bold dark:text-slate-200">{t('title')}</span>
      <NavigatorProfile />
      <div className="flex justify-center mt-4">
        {userData ? null : <BigSpinnerLoading />}
      </div>
      {userData?.license_status === "Not fill" ? <LicenseForm /> : null}
      {userData?.license_status === "Moderate" ? <LicenseModerate /> : null}
      {userData?.license_status === "Accept" ? <LicenseAccept /> : null}
    </>
  )
}