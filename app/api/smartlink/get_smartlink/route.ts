import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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
      const create_smartlink = await prisma.smartlinks.findMany({
        where: {
          owner: userdata.id,
        },
        orderBy: {
          id: 'desc'
        }
      });
      return NextResponse.json(create_smartlink);

    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}