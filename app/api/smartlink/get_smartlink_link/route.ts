import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';

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
      const { id_smartlink } = await request.json()
      const create_smartlink = await prisma.smartlinks.findUnique({
        where: {
          id: id_smartlink
        }
      });
      if (create_smartlink?.owner == userdata.id) {
        const url_smartlink = await prisma.smartlinksURL.findMany({
          where: {
            smartlinkID: id_smartlink
          }
        });
        return NextResponse.json({
          title: create_smartlink.title,
          version: create_smartlink.version,
          cover: create_smartlink?.cover,
          artist: create_smartlink?.artist,
          featartist: create_smartlink?.featartist,
          url: create_smartlink.url,
          smart_url: url_smartlink
        });
      } else {
        return NextResponse.json({ message: "error" })
      }
    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}