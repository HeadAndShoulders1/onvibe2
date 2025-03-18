import Link from "next/link";

export default function YOF() {
    return(
        <Link href="https://yofmus.fun/">
            <div>
                <img src="/yof black1.png" className="dark:hidden block" height={300} width={300}/>
                <img src="/yof white1.png" className="hidden dark:block" height={300} width={300}/>
            </div>
        </Link>
    )
}