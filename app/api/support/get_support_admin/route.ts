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
    if (userdata && userdata.admin == true) {
      const message = await prisma.user.findMany({
        where: {
          message_status: "unread"
        }
      });
      if (message) {
        const responseData = message.map(row => {
          const { id, username } = row;
          return { id, username };
        });
        return NextResponse.json(responseData);

      }
    } else {
      return NextResponse.json({ message: "not_admin" })
    }
  }
}