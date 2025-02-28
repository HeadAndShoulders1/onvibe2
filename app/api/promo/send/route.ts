import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { Telegraf } from 'telegraf';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const { id_release, general_text, playlists, key_facts, release_promotion } = await request.json()
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
    const releaseData = await prisma.release.findUnique({
      where: {
        id: id_release
      }
    });
    if (userdata && releaseData) {
      const { id } = userdata
      const { owner } = releaseData
      const owner_id = owner
      const user_id = id
      if (user_id == owner_id && releaseData.status == "Accepted" && releaseData.promo_send === false) {
        const create_promo = await prisma.promo.create({
          data: {
            releaseID: id_release,
            General_text: general_text,
            playlists: playlists,
            key_facts: key_facts,
            release_promotion: release_promotion
          }
        });

        const update_promo = await prisma.release.update({
          where: {
            id: id_release
          },
          data: {
            promo_send: true
          }
        });
        const bot = new Telegraf('6340836760:AAE9EJiASuuTVVBkqwYL3fUJF_spZ49kwzc');
        await bot.telegram.sendMessage('1364654007', 'Человек с ником ' + userdata.username + ' отправил релиз ' + update_promo.title + ' на промо');
        await bot.telegram.sendMessage('794498292', 'Человек с ником ' + userdata.username + ' отправил релиз ' + update_promo.title + ' на промо');
      }
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
    } else {
      return NextResponse.json({ message: "not fill" });
    }
  }
}
