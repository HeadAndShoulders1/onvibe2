import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

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

    if (userdata && releaseData) {
      const { id } = userdata;
      const { owner } = releaseData;
      const owner_id = owner;
      const user_id = id;

      if (user_id == owner_id && releaseData.status == "Moderate") {
        const delete_track = await prisma.release.update({
          where: {
            id: id_release,
          },
          data: {
            status: "Editing"
          }
        });
        return NextResponse.json({ message: "success" });
      } else {
        return redirect('/dashboard/catalog');
      }
    }
  }
}
