import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function TracksHome() {
  const t = useTranslations('home');
  const tracks = [
    { id: 1, name: "MONTAGEM CORAL 2.0", href: "/obloga1.jpg", artist: "vxddka", desc: t('partners_desc_13') },
    { id: 2, name: "SI AI", href: "/obloga2.jpg", artist: "vxddka", desc: t('partners_desc_14') },
    { id: 3, name: "fragments", href: "/obloga4.jpg", artist: ".shy, svetlej, ateki", desc: t('partners_desc_15') },
    { id: 4, name: "БУДЬ МОИМ СМЫСЛОМ", href: "/obloga7.jpg", artist: "UNIVER$E", desc: "400" + t('partners_desc_17') },
    { id: 5, name: "Alors Brazilian Dança", href: "/obloga6.jpg", artist: "MORAXKILL", desc: "300"+ t('partners_desc_17') },
    { id: 6, name: "GIGACHAD PHONK", href: "/obloga5.jpg", artist: "MORAXKILL", desc: "200"+ t('partners_desc_17') },
    { id: 7, name: "Однообразные", href: "/obloga3.jpg", artist: "MCmaks32", desc: "20"+ t('partners_desc_17') },
    { id: 8, name: "ХДМ", href: "/obloga8.jpg", artist: "GRAT", desc: "20"+ t('partners_desc_17') },
    { id: 9, name: "Welcome to FPE!", href: "/obloga9.jpg", artist: "Lumin1te<3", desc: "30"+ t('partners_desc_17') },
    { id: 10, name: "Ritmo Matador Conga", href: "/obloga10.jpg", artist: "MORAXKILL", desc: "50"+ t('partners_desc_17') },
    { id: 11, name: "PRESTIGIO", href: "/obloga11.jpg", artist: "MVCMILXN", desc: "15"+ t('partners_desc_17') },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const group = e.currentTarget as HTMLElement;
      const card = group.querySelector(".card") as HTMLElement | null;

      if (!card) return;

      const { left, top, width, height } = group.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (e.clientX - centerX) / width;
      const deltaY = (e.clientY - centerY) / height;

      const rotateX = deltaY * -15;
      const rotateY = deltaX * 15;

      card.style.transform = `perspective(800px) translateZ(50px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
      card.style.zIndex = "10";
      card.style.transition = "transform 0.2s ease-out";
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const group = e.currentTarget as HTMLElement;
      const card = group.querySelector(".card") as HTMLElement | null;

      if (card) {
        card.style.transform = "perspective(800px) translateZ(0) rotateX(0deg) rotateY(0deg) scale(1)";
        card.style.zIndex = "1";
        card.style.transition = "transform 0.3s ease-out, z-index 0s 0.3s";
      }
    };

    const groups = document.querySelectorAll(".group.interactive");

    groups.forEach((group) => {
      group.addEventListener("mousemove", handleMouseMove as EventListener);
      group.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    return () => {
      groups.forEach((group) => {
        group.removeEventListener("mousemove", handleMouseMove as EventListener);
        group.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      });
    };
  }, []);

  return (
    <div className="w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center" data-aos="fade-up" data-aos-delay="100">
      <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center" data-aos="fade-bottom" data-aos-delay="100">
        <span className="font-bold tracking-tight text-white-900 text-3xl mx-auto lg:text-4xl text-center dark:text-slate-200">
        {t('partners_desc_12')}
        </span>
      </div>

      <div className="flex rounded-lg p-4 lg:p-12  w-full items-center justify-center transition select-none">
      <div className="grid w-full grid-cols-1  sm:grid-cols-2 lg:grid-cols-3">
        {tracks.slice(0, 3).map((track) => (
            <div className="group interactive scale-90" key={track.id}>
            <div className="card bg-[#fcfeff] dark:bg-zinc-900 h-full transition 
            group-hover:bg-gray-100 dark:group-hover:bg-zinc-800 
            mt-5 p-3 rounded-xl border border-slate-400 
            dark:border-zinc-800 shadow-sm ">
                <div className="medalion-hover">
                <img src={track.href} className="w-full rounded-md transition" />
                </div>
                <div className="flex flex-col gap-y-1 mt-2">
                <h1 className="dark:text-white text-black">{track.name}</h1>
                <h1 className="text-sm text-zinc-400 leading-3">{track.artist}</h1>
                </div>
                <h1 className="text-sm text-zinc-400 leading-3 mt-3">{track.desc}</h1>
            </div>
            </div>
        ))}
        </div>

      </div>
      <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center" data-aos="fade-bottom" data-aos-delay="100">
        <span className="font-bold tracking-tight text-white-900 text-3xl mx-auto lg:text-4xl text-center dark:text-slate-200">
        {t('partners_desc_16')}
        </span>
      </div>
      {/* Нижний блок со статичными карточками */}
      <div className="flex rounded-lg p-4 lg:p-12 lg:px-12 w-full items-center justify-center transition select-none shadow-sm">
        <div className="grid w-full grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          {tracks.slice(3).map((track) => (
            <div className="group" key={track.id}>
              <div className="bg-[#fcfeff]  dark:bg-zinc-900 group-hover:bg-gray-100 dark:group-hover:bg-zinc-800  transition mt-5 p-4 rounded-xl border border-slate-300 dark:border-zinc-800 shadow-sm">
                <div className="medalion-hover">
                  <img src={track.href} className="w-full rounded-md transition" />
                </div>
                <div className="flex flex-col gap-y-1 mt-2">
                  <h1 className="dark:text-white text-black">{track.name}</h1>
                  <h1 className="text-sm text-zinc-400 leading-3">{track.artist}</h1>
                </div>
                <h1 className="text-sm text-zinc-400 leading-6 mt-3 whitespace-pre-line ">{track.desc}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
