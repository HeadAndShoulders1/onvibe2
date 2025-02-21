import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

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
    if (userdata) {
      const { admin } = userdata;
      if (admin == true) {
        const { id_license } = await request.json();
        const userdatafetch = await prisma.user.update({
          where: {
            id: id_license,
          },
          data: {
            license_status: "Accept"
          }
        });
        return NextResponse.json({ message: "success" });
      } else {
        return NextResponse.json({ admin });
      }
    } else {
      return NextResponse.json({ message: "not_admin" })
    }
  }
}