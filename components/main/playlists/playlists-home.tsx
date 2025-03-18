import { useTranslations } from "next-intl";

export default function PlaylistsHome() {
  const t = useTranslations('home');
  const tracks = [
    { id: 1, name: "Фонк: лучшее", href: "/m1000x1000 (1).png", artist: "Яндекс Музыка", desc: "vxddka, Mari X - SI AI" },
    { id: 2, name: "Электронная музыка: лучшее", href: "/m1000x1000 (3).png", artist: "Яндекс Музыка", desc: "vxddka, Mari X - SI AI" },
    { id: 3, name: "Хроника электроника", href: "/m1000x1000 (2).png", artist: "Яндекс Музыка", desc: "vxddka - MANDALA\n vxddka - SI AI \n vxddka - PASSION \n Anjee, Leenk - Tell you" },
  ];

  return (
    <div className="w-11/12 lg:w-11/12 2xl:w-10/12 mx-auto justify-center" data-aos="fade-up" data-aos-delay="100">
      <div className="flex justify-between lg:flex-row flex-col gap-2 lg:text-left text-center" data-aos="fade-bottom" data-aos-delay="100">
        <span className="font-bold tracking-tight text-white-900 text-3xl mx-auto lg:text-4xl text-center dark:text-slate-200">
          {t('partners_desc_18')}
        </span>
      </div>

      <div className="flex rounded-lg p-4 lg:p-12  w-full items-center justify-center transition select-none shadow-sm">
      <div className="grid w-full grid-cols-1  sm:grid-cols-2 lg:grid-cols-3">
        {tracks.slice(0, 3).map((track) => (
            <div className="group interactive scale-90" key={track.id}>
            <div className=" bg-[#fcfeff] dark:bg-zinc-900 h-full transition 
            group-hover:bg-gray-100 dark:group-hover:bg-zinc-800 
            mt-5 p-3 rounded-xl border border-slate-300 
            dark:border-zinc-800 shadow-sm ">
                <div className="medalion-hover">
                <img src={track.href} className="w-full rounded-md transition" />
                </div>
                <div className="flex flex-col gap-y-1 mt-2">
                <h1 className="dark:text-white text-black">{track.name}</h1>
                <h1 className="text-sm text-zinc-400 leading-3">{track.artist}</h1>
                </div>
                <h1 className="text-sm text-zinc-400 leading-6 mt-3 whitespace-pre-line">{track.desc}</h1>
            </div>
            </div>
        ))}
        </div>

      </div>

      
    </div>
  );
}
