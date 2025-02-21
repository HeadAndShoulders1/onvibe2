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
    const { id_release } = await request.json()
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
    if (releaseData?.owner == userdata?.id && releaseData && releaseData.status == "Accepted") {
      const create_smartlink = await prisma.smartlinks.create({
        data: {
          title: releaseData.title,
          version: releaseData.version || null,
          artist: releaseData.artist,
          featartist: releaseData.featartist || null,
          cover: releaseData.cover_small_path,
          owner: userdata?.id,
          url: uuidv4(),
          upc: releaseData.upc
        }
      });
      return NextResponse.json({ message: "success", id_smartlink: create_smartlink.id });

    } else {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    }
  }
}