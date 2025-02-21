import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
    const userEmail = <string>session.user?.email;
    const userdata = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    const track_id = formData.get('track_id');
    const release_id = formData.get('release_id');
    const trackId = track_id ? parseInt(track_id as string, 10) : undefined;
    const ReleaseID = release_id ? parseInt(release_id as string, 10) : undefined;
    const releaseData = await prisma.tracks.findUnique({
      where: {
        id: trackId,
      },
    });

    if (userdata && releaseData && releaseData.releaseId) {
      const releaseData12 = await prisma.release.findUnique({
        where: {
          id: releaseData.releaseId,
        },
      });
      const { id } = userdata;
      const { owner } = releaseData;
      const owner_id = owner;
      const user_id = id;
      if (user_id == owner_id && releaseData12?.status == "Editing") {
        if (releaseData.track_mp3 != null) {
          const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: releaseData.track_mp3
          })
          await s3.send(deleteObjectCommand)
          const deleteObjecCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: releaseData.track_wav as string,
          })
          await s3.send(deleteObjecCommand)
        }
        const info_release = await prisma.tracks.delete({
          where: {
            id: trackId,
          }
        })
        const manage = await prisma.tracks.findMany({
          where: {
            releaseId: releaseData.releaseId,
          }
        });

        let s = 1;
        for (const el of manage) {
          await prisma.tracks.update({
            where: {
              id: el.id,
            },
            data: {
              order: s,
            },
          });
          s = s + 1;
        }
        return NextResponse.json({ message: 'success' })
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

