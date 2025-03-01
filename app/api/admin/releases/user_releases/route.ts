import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    });
  } else {
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });

    if (userdata?.admin == true) {
      const { name, skip, take, status, page, comment, text } = await request.json();

      const totalReleasesCount = await prisma.release.count({
        where: {
          title: {
            contains: name
          },
          status: {
            equals: status
          }
        }
      });

      const totalPages = Math.ceil(totalReleasesCount / (take || 10));

      const user_releases = await prisma.release.findMany({
        where: {
          title: {
            contains: name
          },
          status: {
            equals: status
          }
        },
        orderBy: {
          id: 'desc' // 'asc' для сортировки по возрастанию, 'desc' для сортировки по убыванию
        },
        skip: skip ? parseInt(skip as string, 10) : undefined,
        take: take ? parseInt(take as string, 10) : undefined,
      });

      if (user_releases.length > 0) {
        const releasesWithTracks: any[] = [];

        for (const release of user_releases) {
          const userID = release.owner
          const subscribe_all = await prisma.subscribe.findMany({
            where: {
              UserID: userID
            }
          })
          let type_subscribe
          if (release.createdAt) {
            for (const subscribe of subscribe_all) {
              if (subscribe.startDate) {
                if (release?.createdAt >= subscribe.startDate && release.createdAt <= subscribe.endDate) {
                  type_subscribe = subscribe.id_subscribe
                }
              }
            }
          }

          const releaseId = release.id;
          const tracks = await prisma.tracks.findMany({
            where: {
              releaseId: releaseId
            },
            orderBy: {
              order: 'asc' // 'asc' для сортировки по возрастанию, 'desc' для сортировки по убыванию
            },
          });
          let releaseWithTracks
          if (release.status != "Accepted") {
            releaseWithTracks = {
              id: release.id,
              title: release.title,
              version: release.version,
              cover_small_path: release.cover_path,
              meta_language: release.meta_language,
              error: release.error,
              type: release.type,
              artist: release.artist,
              featartist: release.featartist,
              date_release: release.date_release,
              genre: release.genre,
              p_line: release.p_line,
              owner: release.owner,
              fio: release.fio,
              status: release.status,
              upc: release.upc,
              comment: release.comment,
              text: release.text,
              type_subscribe: type_subscribe,
              tracks: tracks.map(track => ({
                id: track.id,
                order: track.order,
                title: track.title,
                version: track.version,
                artist: track.artist,
                featartist: track.featartist,
                genre: track.genre,
                isrc: track.isrc,
                is_instrumental: track.is_instrumental,
                is_curse: track.is_curse,
                track_mp3: track.track_wav,
                releaseId: track.releaseId,
                owner: track.owner,
              }))
            };
          } else {
            releaseWithTracks = {
              id: release.id,
              title: release.title,
              version: release.version,
              cover_small_path: release.cover_small_path,
              meta_language: release.meta_language,
              error: release.error,
              type: release.type,
              artist: release.artist,
              featartist: release.featartist,
              date_release: release.date_release,
              genre: release.genre,
              p_line: release.p_line,
              owner: release.owner,
              fio: release.fio,
              status: release.status,
              upc: release.upc,
              comment: release.comment,
              text: release.text,
              type_subscribe: type_subscribe,
              tracks: tracks.map(track => ({
                id: track.id,
                order: track.order,
                title: track.title,
                version: track.version,
                artist: track.artist,
                featartist: track.featartist,
                genre: track.genre,
                isrc: track.isrc,
                is_instrumental: track.is_instrumental,
                is_curse: track.is_curse,
                track_mp3: track.track_mp3,
                releaseId: track.releaseId,
                owner: track.owner,
              }))
            };
          }


          releasesWithTracks.push(releaseWithTracks);
        }

        return NextResponse.json({
          releases: releasesWithTracks,
          totalPages: totalPages
        });
      } else {
        return NextResponse.json({ message: "No releases found for the user" });
      }
    } else {
      return NextResponse.json({ message: 'not_admin' })
    }
  }
}
