import { useState } from "react";

export default function IsrcChange({ isrc, id }: { isrc: any, id: any }) {
    const [isrcValue, setIsrcValue] = useState(isrc);
    const handleButtonClick = async () => {
        const res = await fetch('/api/admin/releases/isrc_add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                isrc: isrcValue,
            }),
        });
    }
    return (
        <div className="flex gap-x-2">
            <input
                type="text"
                className="hover:outline-slate-400 hover:dark:outline-zinc-700 outline-none outline-1 focus:border-indigo-600 focus:dark:border-indigo-600 bg-white dark:bg-zinc-900 text-base rounded-xl border-2 text-left border-slate-300 dark:border-zinc-800 px-2 py-1.5 w-full  min-w-40 "
                value={isrcValue}
                onChange={(e) => setIsrcValue(e.target.value)}
            />
            <button onClick={handleButtonClick} className="flex items-center bg-[#5351FF] rounded-lg max-w-10 min-w-10 w-full h-10 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-slate-100" width="1em" height="1em" viewBox="0 0 1920 1920">
                    <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}
