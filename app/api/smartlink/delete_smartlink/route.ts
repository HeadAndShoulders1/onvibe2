import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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
      let { id_smartlink, id_link } = await request.json()
      const create_smartlink = await prisma.smartlinks.findUnique({
        where: {
          id: id_smartlink
        }
      });
      if (create_smartlink?.owner == userdata.id) {
        const url_link1 = await prisma.smartlinksURL.deleteMany({
          where: {
            smartlinkID: create_smartlink.id
          }
        });
        const smartlinks = await prisma.smartlinks.delete({
          where: {
            id: id_smartlink
          }
        });
        return NextResponse.json({ message: "success" })
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}