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
      const { id_user, status_admin } = await request.json()
      const update_admin = await prisma.user.update({
        where: {
          id: id_user
        },
        data: {
          admin: status_admin,
        }
      });
      return NextResponse.json({ message: 'success' })
    } else {
      return NextResponse.json({ message: 'not_admin' })
    }
  }
}