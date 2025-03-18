"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Lfr from "../partners/LFR";
import YOF from "../partners/YOF";
import DMB from "../partners/KNM";

export default function StoresOther2() {
  const t = useTranslations("home");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const stores = [
    {
      id: 1,
      url_black: <Lfr />,
      name: "LFR",
      description: t('partners_desc_19'),
    },
    {
      id: 2,
      url_black: <YOF />,
      name: "YOF",
      description: t('partners_desc_20'),
    },
    {
      id: 3,
      url_black: <DMB />,
      name: "DMB",
      description: t('partners_desc_21'),
    },
  ];

  return (
    <div className="w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center" data-aos="fade-up" data-aos-delay="100">
      <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center" data-aos="fade-bottom" data-aos-delay="100">
        <span className="font-bold tracking-tight text-white-900 text-3xl mx-auto lg:text-4xl text-center dark:text-slate-200">
          {t('partners_desc_22')}
        </span>
      </div>
      <div className="flex w-full mx-auto justify-center my-10 ">
        <div className="grid gap-x-20 gap-y-20 grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 justify-center">
          {stores.map((store) => (
            <div
              key={store.id}
              className="relative flex mx-auto shadow-2xl h-full px-4 lg:px-16 py-4 rounded-3xl  md:h-44 w-full border border-slate-200 dark:border-zinc-800 lg:mx-0 lg:flex items-center justify-center scroll-smooth shadow-slate-400 dark:shadow-slate-800 bg-white dark:bg-zinc-900 transition-all duration-150 hover:-translate-y-4 ease-in 
              hover:animate-[pulseShadow_1.5s_infinite]"
              data-aos="fade-up"
              data-aos-delay="100"
              onMouseEnter={() => setHoveredId(store.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {store.url_black}

              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-[300px] p-4 rounded-lg shadow-xl text-center text-white bg-black dark:bg-gray-800 z-50 transition-all duration-300 ${
                  hoveredId === store.id ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                {store.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
