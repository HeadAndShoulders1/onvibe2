import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const smart_url = await prisma.smartlinks.findMany({
    })
    for (const smartlink of smart_url) {
        const release = await prisma.release.findFirst({
            where: {
                cover_small_path: smartlink.cover
            }
        })
        if (release?.upc) {
            const update_upc = await prisma.smartlinks.update({
                where: {
                    id: smartlink.id
                },
                data: {
                    upc: release?.upc
                }
            })
        }
    }
    return NextResponse.json({ message: "success" })
}