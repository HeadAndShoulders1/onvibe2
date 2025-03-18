import { useState, useEffect, useRef } from "react";

export default function LogoCarousel() {
    const logosRef = useRef<HTMLUListElement | null>(null);
  
    useEffect(() => {
      if (logosRef.current) {
        const ul = logosRef.current;
        const parent = ul.parentNode;
        if (parent) {
          const clone = ul.cloneNode(true) as HTMLUListElement;
          clone.setAttribute("aria-hidden", "true");
          parent.appendChild(clone);
        }
      }
    }, []);

  return (
    <div className="relative font-inter antialiased w-full ">
        <div className="w-full  mx-auto flex justify-center">
          <div className="text-center">
            <div className=" lg:max-w-5xl xl:max-w-6xl sm:max-w-2xl md:max-w-3xl px-6 max-w-sm inline-flex flex-nowrap overflow-hidden mask-[linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <ul
                ref={logosRef}
                className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
              >
                {[
                  "KNM",
                  "apple",
                  "facebook",
                  "spotify",
                  "MERLIN",
                  "YANDEX",
                  "vkmusic"
                ].map((logo) => (
                  <li key={logo}>
                    <img
                      src={`/${logo}.png`}
                      alt={logo.charAt(0).toUpperCase() + logo.slice(1)}
                      width={100} height={100}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
}