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
      const url_link = await prisma.smartlinksURL.findUnique({
        where: {
          id: id_link
        }
      });
      if (create_smartlink?.owner == userdata.id && url_link?.smartlinkID == create_smartlink.id) {
        const url_link1 = await prisma.smartlinksURL.delete({
          where: {
            id: id_link
          }
        });
        return NextResponse.json({ message: "success" })
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}