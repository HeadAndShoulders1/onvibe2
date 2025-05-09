import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const news = await prisma.news.findMany({
        orderBy: {
            id: 'desc'
        }
    });

    const serializedNews = news.map(item => ({
        ...item,
        id: item.id.toString(),
    }));

    return NextResponse.json({ news: serializedNews });
}
