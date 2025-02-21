import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Telegraf } from 'telegraf';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  } else {
    const userEmail = <string>session.user?.email;
    const { message } = await request.json()
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });
    if (userdata) {
      const message_add = await prisma.answer.create({
        data: {
          title: message,
          name: userdata.username,
          status: "default_user",
          owner: userdata.id
        }
      });
      const update_status = await prisma.user.update({
        where: {
          id: userdata.id
        },
        data: {
          message_status: "unread"
        }
      });
      const message_all = await prisma.answer.findMany({
        where: {
          owner: userdata.id
        }
      });
      const bot = new Telegraf('6340836760:AAE9EJiASuuTVVBkqwYL3fUJF_spZ49kwzc');
      await bot.telegram.sendMessage('1364654007', 'Человек с ником ' + userdata.username + ' написал в поддержку: ' + message);
      await bot.telegram.sendMessage('794498292', 'Человек с ником ' + userdata.username + ' написал в поддержку: ' + message);
      const formattedMessages = message_all.map(msg => {
        return {
          ...msg,
          createdAt: msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ru }) : null
        };
      });

      return NextResponse.json(formattedMessages)
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  }
}