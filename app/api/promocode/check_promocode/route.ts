import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { promocode } = await request.json()
    if(promocode){
        const promocodes =await prisma.promocodes.findFirst({
            where:{
                name: promocode
            }
        })
        if(promocodes){
            return NextResponse.json({message: "success"})
        }else{
            return NextResponse.json({message: "not_find_promocode"})
        }
    }else{
        return NextResponse.json({message: "enter_promocode"})
    }
}