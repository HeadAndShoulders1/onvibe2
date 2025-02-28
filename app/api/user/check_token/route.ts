import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";

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
      if (userdata.email_auth == true) {
        return NextResponse.json({ message: "success" })
      } else {
        const { code } = await request.json()
        if (code == userdata.email_code) {
          const userdata = await prisma.user.update({
            where: {
              email: userEmail
            },
            data: {
              email_auth: true
            }
          });
          return NextResponse.json({ message: "success" })
        } else {
          return NextResponse.json({ message: "not_valid_code" })
        }
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  }
}