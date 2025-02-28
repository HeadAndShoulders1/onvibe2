'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HollisResearch(){
    const route = useRouter()
    useEffect(()=>{
        route.push('https://t.me/hollistg')
    },[])
    return(
        <></>
    )
}