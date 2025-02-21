import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
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
        const userdata = await prisma.user.findMany({
          where: {
            license_status: 'Moderate'
          }
        });
        if (userdata) {
          const responseData = userdata.map(row => {
            const { first_name, last_name, middle_name, id } = row;
            return { first_name, last_name, middle_name, id };
          });
          return NextResponse.json(responseData);
        }
      } else {
        return NextResponse.json({ admin });
      }
    } else {
      return NextResponse.json({ message: "not_admin" })
    }
  }
}