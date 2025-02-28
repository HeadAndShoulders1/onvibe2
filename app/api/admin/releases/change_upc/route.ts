import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';


const s3 = new S3Client({
  region: process.env.AWS_REGION || undefined,
  endpoint: 'https://hb.ru-msk.vkcs.cloud/',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});


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
      const { release_id, upc } = await request.json();
      const all_track = await prisma.tracks.findMany({
        where: {
          releaseId: release_id
        }
      })
      const release = await prisma.release.findUnique({
        where: {
          id: release_id
        }
      })
      for (const track of all_track) {

        if (track.track_wav !== null) {
          const deleteObjectCommandWav = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: track.track_wav,
          });
          await s3.send(deleteObjectCommandWav);
        }
      }
      if (release && release.cover_path !== null) {
        const deleteObjectCommandCover = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: release.cover_path,
        });
        await s3.send(deleteObjectCommandCover);
      }

      const upc_change = await prisma.release.update({
        where: {
          id: release_id
        },
        data: {
          upc: upc,
          status: "Accepted"
        }
      });
      return NextResponse.json({ message: "success" });
    } else {
      return NextResponse.json({ message: 'not_admin' })
    }
  }
}
