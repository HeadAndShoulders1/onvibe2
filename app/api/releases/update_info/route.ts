import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  } else {
    const { id_release, title, version, meta_language, type, p_line, date_release, genre, comment, text } = await request.json()
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
      if (user_id == owner_id && releaseData.status == "Editing") {
        let popachen = null
        if (date_release != null) {
          const data_day = new Date(date_release);
          data_day.setDate(data_day.getDate());
          popachen = <string><unknown>(data_day)
        }


        const update_release = await prisma.release.update({
          where: {
            id: id_release,
          },
          data: {
            title: title,
            comment: comment,
            text: text,
            version: version,
            meta_language: meta_language,
            type: type,
            p_line: p_line,
            genre: genre,
            date_release: popachen,
          }
        });
        const info_release = await prisma.release.findUnique({
          where: {
            id: id_release,
          }
        })
        const info = {
          id: info_release?.id,
          title: info_release?.title,
          version: info_release?.version,
          type: info_release?.type,
          comment: info_release?.comment,
          text: info_release?.text,
          p_line: info_release?.p_line,
          meta_language: info_release?.meta_language,
          cover_small_path: info_release?.cover_small_path,
          date_release: info_release?.date_release,
          artist: info_release?.artist,
          featartist: info_release?.featartist,
          genre: info_release?.genre,

        }
        return NextResponse.json(info);
      } else {
        return redirect('/dashboard/catalog')
      }
    }
  }
}


