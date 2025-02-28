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
      let { id_smartlink } = await request.json()
      const create_smartlink = await prisma.smartlinks.findUnique({
        where: {
          id: id_smartlink
        }
      });
      if (create_smartlink?.owner == userdata.id) {
        let deezer = ''
        const deezerGET = await fetch(`https://api.deezer.com/album/upc:${create_smartlink.upc}`)
        if (deezerGET.status === 200) {
          const deezerData = await deezerGET.json()
          deezer = deezerData.link
          if (deezer) {
            const url_smartlink = await prisma.smartlinksURL.create({
              data: {
                smartlinkID: create_smartlink.id,
                cover: "deezer.svg",
                url: deezer,
                platform: "Deezer",
              }
            });
            const songLinkGET = await fetch(`https://api.song.link/v1-alpha.1/links?url=${deezer}`)
            if (songLinkGET.status === 200) {
              const songLinkData = await songLinkGET.json()
              try {
                const url_smartlink = await prisma.smartlinksURL.create({
                  data: {
                    smartlinkID: create_smartlink.id,
                    cover: "spotify.svg",
                    url: songLinkData.linksByPlatform.spotify.url,
                    platform: "Spotify",
                  }
                });
              } catch (error) { }
              try {
                const url_smartlink = await prisma.smartlinksURL.create({
                  data: {
                    smartlinkID: create_smartlink.id,
                    cover: "youtube_music.svg",
                    url: songLinkData.linksByPlatform.youtubeMusic.url,
                    platform: "youtubeMusic",
                  }
                });
              } catch (error) { }
              try {
                const url_smartlink = await prisma.smartlinksURL.create({
                  data: {
                    smartlinkID: create_smartlink.id,
                    cover: "yandex_music.svg",
                    url: songLinkData.linksByPlatform.yandex.url,
                    platform: "yandex_music",
                  }
                });
              } catch (error) { }
              try {
                const url_smartlink = await prisma.smartlinksURL.create({
                  data: {
                    smartlinkID: create_smartlink.id,
                    cover: "apple_music.svg",
                    url: songLinkData.linksByPlatform.appleMusic.url,
                    platform: "AppleMusic",
                  }
                });
              } catch (error) { }
              const smartlinksURLDATA = await prisma.smartlinksURL.findMany({
                where: {
                  smartlinkID: create_smartlink.id,
                }
              })
              return NextResponse.json({
                title: create_smartlink.title,
                version: create_smartlink.title,
                cover: create_smartlink?.cover,
                artist: create_smartlink?.artist,
                featartist: create_smartlink?.featartist,
                url: create_smartlink.url,
                smart_url: smartlinksURLDATA
              });
            } else {
              return NextResponse.json({ message: "not_found" })
            }
          } else {
            return NextResponse.json({ message: "not_found" })
          }
        }
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}