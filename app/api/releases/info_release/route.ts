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
      if (user_id == owner_id) {
        const info = {
          id: releaseData?.id,
          title: releaseData?.title,
          version: releaseData?.version,
          type: releaseData?.type,
          p_line: releaseData?.p_line,
          meta_language: releaseData?.meta_language,
          cover_small_path: releaseData?.cover_small_path,
          date_release: releaseData?.date_release,
          artist: releaseData?.artist,
          featartist: releaseData?.featartist,
          genre: releaseData?.genre,
          comment: releaseData?.comment,
          text: releaseData?.text,
        }
        return NextResponse.json(info);
      } else {
        return redirect('/dashboard/catalog')
      }
    }
  }
}


