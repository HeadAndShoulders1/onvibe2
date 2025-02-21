import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { S3Client } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


const s3 = new S3Client({
  region: process.env.AWS_REGION || undefined,
  endpoint: 'https://hb.ru-msk.vkcs.cloud/',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session) {
    const formData = await req.formData();
    const id_release = formData.get('id_release');
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    const releaseId = id_release ? parseInt(id_release as string, 10) : undefined;
    const releaseData = await prisma.release.findUnique({
      where: {
        id: releaseId,
      },
    });

    if (userdata && releaseData) {
      const { id } = userdata;
      const { owner } = releaseData;
      const owner_id = owner;
      const user_id = id;
      if (user_id == owner_id) {
        const info_release = await prisma.tracks.findMany({
          where: {
            releaseId: releaseId,
          },
          orderBy: {
            id: 'asc'
          },
        })
        const about_track = info_release.map(track => ({
          id: track.id,
          order: track.order,
          title: track.title,
          version: track.version,
          track: track.track_mp3,
          is_curse: track.is_curse,
          is_instrumental: track.is_instrumental,
          genre: track.genre,
          artist: track.artist,
          featartist: track.featartist

        }));
        return NextResponse.json(about_track)
      } else {
        return NextResponse.json({ message: 'not_file' });
      }
    } else {
      return NextResponse.json({ message: 'false' });
    }
  } else {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  }
}

