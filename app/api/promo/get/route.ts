import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  } else {
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });
    if (userdata?.id) {
      const userdata12 = await prisma.release.findMany({
        where: {
          owner: userdata.id,
          status: "Accepted"
        }
      });
      userdata12.forEach(async (item) => {
        if (item.promo_prosent === null) {
          const randomProsent = Math.floor(Math.random() * (40 - 10 + 1)) + 10;
          await prisma.release.update({
            where: { id: item.id },
            data: { promo_prosent: randomProsent }
          });
        }
      });
      const userdata1 = await prisma.release.findMany({
        where: {
          owner: userdata.id,
          status: "Accepted"
        },
        orderBy: {
          id: 'desc'
        }
      });
      const resultData = userdata1.map(item => ({
        id: item.id,
        cover_small_path: item.cover_small_path,
        artist: item.artist,
        featartist: item.featartist,
        title: item.title,
        version: item.version,
        promo_prosent: item.promo_prosent,
        promo_send: item.promo_send,
      }));

      return NextResponse.json(resultData);
    }
  }
}
