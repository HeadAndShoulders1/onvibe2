import { NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { url } = await request.json()
    const link_info = await prisma.smartlinks.findUnique({
        where: {
            url: url
        }
    })
    if (link_info) {
        const url_info = await prisma.smartlinksURL.findMany({
            where: {
                smartlinkID: link_info?.id
            }
        })
        return NextResponse.json({
            cover: link_info?.cover,
            title: link_info?.title,
            version: link_info?.version,
            artist: link_info?.artist,
            featartist: link_info?.featartist,
            smart_url: url_info
        })
    } else {
        return NextResponse.json({ message: "not_found" })
    }
}