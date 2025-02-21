import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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
    if (userdata) {
      let { id_smartlink, url } = await request.json()
      const create_smartlink = await prisma.smartlinks.findUnique({
        where: {
          id: id_smartlink
        }
      });
      if (create_smartlink?.owner == userdata.id) {
        let check_url_complete = 0
        let platform = ""
        let url_platform = ""
        const containsAppleMusic = url.includes("music.apple.com");
        if (containsAppleMusic) platform = "AppleMusic", url_platform = "apple_music.svg", check_url_complete = 1
        const containsSpotify = url.includes("spotify.com");
        if (containsSpotify) platform = "Spotify", url_platform = "spotify.svg", check_url_complete = 1
        const containsZvuk = url.includes("zvuk.com");
        if (containsZvuk) platform = "Zvuk", url_platform = "zvuk.svg", check_url_complete = 1
        const containsDeezer = url.includes("deezer.com");
        if (containsDeezer) platform = "Deezer", url_platform = "deezer.svg", check_url_complete = 1
        const containsMTS = url.includes("music.mts.ru");
        if (containsMTS) platform = "MTS", url_platform = "MTS_music.svg", check_url_complete = 1
        const containsVK = url.includes("vk.com");
        if (containsVK) platform = "VK", url_platform = "VK.svg", check_url_complete = 1
        const containsYA = url.includes("music.yandex.ru");
        if (containsYA) platform = "yandex_music", url_platform = "yandex_music.svg", check_url_complete = 1
        if (check_url_complete == 1) {
          let check_adress = 0
          const check_https = url.includes("https://");
          if (!check_https) url = "https://" + url, check_adress = 1

          const url_smartlink = await prisma.smartlinksURL.create({
            data: {
              smartlinkID: create_smartlink.id,
              cover: url_platform,
              url: url,
              platform: platform,
            }
          });
          return NextResponse.json({
            message: "success"
          });
        } else {
          return NextResponse.json({
            message: "not_found"
          });
        }
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}