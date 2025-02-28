import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const { id_release, name, type } = await request.json()
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
      if (user_id == owner_id && releaseData.status == "Editing") {
        if (type == 'basic') {
          const originalArray = releaseData.artist
          const elementToRemove = name;
          const updatedArray = originalArray.filter(element => element !== elementToRemove);
          const result_update = await prisma.release.update({
            where: {
              id: id_release,
            },
            data: {
              artist: updatedArray
            }
          });
        } else {
          const originalArray = releaseData.featartist
          const elementToRemove = name;
          const updatedArray = originalArray.filter(element => element !== elementToRemove);
          const result_update = await prisma.release.update({
            where: {
              id: id_release,
            },
            data: {
              featartist: updatedArray
            }
          });
        }
        const userdata12 = await prisma.release.findUnique({
          where: {
            id: id_release
          }
        });
        const info = {
          id: userdata12?.id,
          title: userdata12?.title,
          version: userdata12?.version,
          type: userdata12?.type,
          p_line: userdata12?.p_line,
          meta_language: userdata12?.meta_language,
          cover_small_path: userdata12?.cover_small_path,
          date_release: userdata12?.date_release,
          artist: userdata12?.artist,
          featartist: userdata12?.featartist,
          genre: userdata12?.genre,
        }
        return NextResponse.json(info);
      } else {
        return redirect('/dashboard/catalog')
      }

    } else {
      return NextResponse.json({ message: "not fill" });
    }
  }
}
