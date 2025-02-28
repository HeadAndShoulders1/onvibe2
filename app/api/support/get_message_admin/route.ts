import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export async function POST(request: Request) {
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
      const { id_user } = await request.json()
      const message = await prisma.answer.findMany({
        where: {
          owner: id_user
        }
      });
      const formattedMessages = message.map(msg => {
        return {
          ...msg,
          createdAt: msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ru }) : null
        };
      });

      return NextResponse.json(formattedMessages)
    } else {
      return NextResponse.json({ message: "not_admin" })
    }
  }
}