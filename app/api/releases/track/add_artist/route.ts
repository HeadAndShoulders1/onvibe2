import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";

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
    const releaseData = await prisma.tracks.findUnique({
      where: {
        id: id_release
      }
    });

    if (userdata && releaseData && releaseData.releaseId) {
      const releaseData12 = await prisma.release.findUnique({
        where: {
          id: releaseData?.releaseId
        }
      });
      const { id } = userdata
      const { owner } = releaseData
      const owner_id = owner
      const user_id = id
      if (releaseData12) {
        if (user_id == owner_id && releaseData12.status == "Editing") {
          if (type == 1) {
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                artist: {
                  push: name,
                },
              },
            });
          } else {
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                featartist: {
                  push: name,
                },
              },
            });
          }
        }
      }
      const userdata12 = await prisma.tracks.findUnique({
        where: {
          id: id_release
        }
      });
      return NextResponse.json(userdata12);
    } else {
      return NextResponse.json({ message: "not fill" });
    }
  }
}
