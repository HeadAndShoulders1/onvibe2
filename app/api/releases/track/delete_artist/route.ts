import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { id_release, name, type } = await request.json() as { id_release: number, name: string, type: string };

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
          id: releaseData?.releaseId
        }
      });

      if (releaseData12 && releaseData12.status) {
        const { id } = userdata;
        const { owner } = releaseData;
        const owner_id = owner;
        const user_id = id;

        if (user_id == owner_id && releaseData12.status == "Editing") {
          if (type == 'basic') {

            const originalArray = releaseData.artist;
            const elementToRemove = name;
            const updatedArray = originalArray.filter(element => element !== elementToRemove);
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                artist: updatedArray
              }
            });
          }
          if (type == 'feat') {
            const originalArray = releaseData.featartist;
            const elementToRemove = name;
            const updatedArray = originalArray.filter(element => element !== elementToRemove);
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                featartist: updatedArray
              }
            });
          }
          if (type == 'autor') {
            const originalArray = releaseData.autor;
            const elementToRemove = name;
            const updatedArray = originalArray.filter(element => element !== elementToRemove);
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                autor: updatedArray
              }
            });
          }
          if (type == 'autortext') {
            const originalArray = releaseData.autor_text;
            const elementToRemove = name;
            const updatedArray = originalArray.filter(element => element !== elementToRemove);
            const result_update = await prisma.tracks.update({
              where: {
                id: id_release,
              },
              data: {
                autor_text: updatedArray
              }
            });
          }
          

          const userdata12 = await prisma.tracks.findUnique({
            where: {
              id: id_release
            }
          });
          return NextResponse.json(userdata12);
        } else {
          return redirect('/dashboard/catalog');
        }
      } else {
        return NextResponse.json({ message: "not fill" });
      }
    }
  }
}
