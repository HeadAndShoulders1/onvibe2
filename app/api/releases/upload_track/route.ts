import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { Telegraf } from 'telegraf';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    });
  } else {
    const { id_release } = await request.json();
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
    if (userdata && releaseData && releaseData.status == "Editing") {
      const { license_status } = userdata

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
      if (id_subscribe === 0) {
        return NextResponse.json({ message: "not subscribe" });
      } else {
        if (license_status == "Accept") {
          const { id } = userdata;
          const { owner } = releaseData;
          const owner_id = owner;
          const user_id = id;
          if (user_id == owner_id) {
            let error_count = 0;
            let track_error = "";
            let image_error = "";
            let title_error = "";
            let meta_language_error = "";
            let type_error = "";
            let artist_error = "";
            let date_release_error = "";
            let genre_error = "";
            let p_line_error = "";
            const trackCount = await prisma.tracks.count({
              where: {
                releaseId: releaseData.id
              }
            });
            if (releaseData.cover_path == null || releaseData.cover_path == "") {
              image_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.title == null || releaseData.title == "") {
              title_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.meta_language == null || releaseData.meta_language == "") {
              meta_language_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.type == null || releaseData.type == "") {
              type_error = "not_fill";
              error_count = error_count + 1;
            }
            if (trackCount == 0) {
              track_error = "not_track";
              error_count = error_count + 1;
            } else {
              if (releaseData.type == "Single" && trackCount != 1) {
                type_error = "single_error";
                error_count = error_count + 1;
              }
              if (releaseData.type == "EP" && trackCount != 2 && trackCount != 3 && trackCount != 4 && trackCount != 5) {
                type_error = "EP_error";
                error_count = error_count + 1;
              }
              if (releaseData.type == "Album" && trackCount < 6) {
                type_error = "Album_error";
                error_count = error_count + 1;
              }
            }

            if (releaseData.artist == null || releaseData.artist.length === 0) {
              artist_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.date_release == null) {
              date_release_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.genre == null || releaseData.genre == "") {
              genre_error = "not_fill";
              error_count = error_count + 1;
            }
            if (releaseData.p_line == null || releaseData.p_line == "") {
              p_line_error = "not_fill";
              error_count = error_count + 1;
            }
            const trackMane = await prisma.tracks.findMany({
              where: {
                releaseId: releaseData.id
              },
              orderBy: {
                order: 'asc'
              }
            });

            const trackErrors = trackMane
              .map((track) => {
                let errors: string[] = [];

                if (!track.title) {
                  errors.push('no title');
                  error_count = error_count + 1;
                }
                if (track.artist == null || track.artist.length === 0) {
                  errors.push('no artist');
                  error_count = error_count + 1;
                }
                if (!track.genre) {
                  errors.push('no genre');
                  error_count = error_count + 1;
                }

                return { track_id: track.order, errors: [...errors] };
              })
              .filter((track) => track.errors.length > 0);

            if (error_count == 0) {
              const { first_name, middle_name, last_name } = userdata;
              const fio = last_name + " " + first_name + " " + middle_name;
              const bot = new Telegraf('6340836760:AAE9EJiASuuTVVBkqwYL3fUJF_spZ49kwzc');
              await bot.telegram.sendMessage('1364654007', 'Релиз ' + releaseData.title + ' был отправлен на модерацию');
              await bot.telegram.sendMessage('794498292', 'Релиз ' + releaseData.title + ' был отправлен на модерацию');
              await prisma.release.update({
                where: {
                  id: id_release
                },
                data: {
                  fio: fio,
                  status: "Moderate",
                }
              });
              return NextResponse.json({ message: "success" });
            } else {
              return NextResponse.json({
                title_error: title_error,
                image_error: image_error,
                meta_language_error: meta_language_error,
                track_error: track_error,
                type_error: type_error,
                artist_error: artist_error,
                date_release_error: date_release_error,
                genre_error: genre_error,
                p_line_error: p_line_error,
                error_count: error_count,
                track_errors: trackErrors
              });
            }
          } else {

          }
        } else {
          return NextResponse.json({ message: "Not fill" });
        }
      }
    } else {
      return redirect('/dashboard/catalog');
    }
  }
}
