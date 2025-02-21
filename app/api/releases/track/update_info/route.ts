import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const { id_release, title, version, genre, is_curse, is_instrumental } = await request.json();
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

    const releaseData = await prisma.tracks.findUnique({
      where: {
        id: id_release
      }
    });
    if (userdata && releaseData && releaseData.releaseId) {
      const releaseData12 = await prisma.release.findUnique({
        where: {
          id: releaseData.releaseId
        }
      });
      const { id } = userdata
      const { owner } = releaseData
      const owner_id = owner
      const user_id = id

      if (user_id == owner_id && releaseData12?.status == "Editing") {
        const update_release = await prisma.tracks.update({
          where: {
            id: id_release,
          },
          data: {
            title: title,
            version: version,
            genre: genre,
            is_curse: is_curse,
            is_instrumental: is_instrumental
          }
        });

        const info_release = await prisma.tracks.findUnique({
          where: {
            id: id_release,
          }
        });
        const about_track = {
          id: info_release?.id,
          order: info_release?.order,
          title: info_release?.title,
          version: info_release?.version,
          track: info_release?.track_mp3,
          is_curse: info_release?.is_curse,
          is_instrumental: info_release?.is_instrumental,
          genre: info_release?.genre,
          artist: info_release?.artist,
          featartist: info_release?.featartist
        };

        return NextResponse.json(about_track);
      } else {
        return redirect('/dashboard/catalog');
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'data not found' }), {
        status: 404
      });
    }
  }
}
