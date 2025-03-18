import Link from "next/link";

export default function Lfr() {
    return(
        <Link href="https://vk.com/lfr_studio">
            <div>
                <img src="/Логотип исходник FINAL.png" className="dark:hidden block" height={500} width={300}/>
                <img src="/Логотип-FINAL.png" className="hidden dark:block" height={500} width={300}/>
            </div>
        </Link>
    )
}