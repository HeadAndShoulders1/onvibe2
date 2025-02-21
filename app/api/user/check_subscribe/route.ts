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

    if (userdata) {
      const search_subscribe = await prisma.subscribe.findMany({
        where: {
          UserID: userdata.id
        },
        orderBy: {
          id: 'desc'
        }
      })
      let id_subscribe = 0
      if (search_subscribe) {
        const subscribe_last = search_subscribe[0]
        if (subscribe_last && subscribe_last.startDate && subscribe_last.endDate) {
          const today_date = new Date()
          if (subscribe_last.startDate < today_date && subscribe_last.endDate > today_date) {
            id_subscribe = subscribe_last.id_subscribe as number
          }
        }
      }
      return NextResponse.json({ type: id_subscribe })
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  }
}