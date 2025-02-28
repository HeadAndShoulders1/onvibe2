import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
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
    const { id_release } = await request.json();
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

    if (userdata && releaseData) {
      const { id } = userdata;
      const { owner } = releaseData;
      const owner_id = owner;
      const user_id = id;

      if (user_id == owner_id && releaseData.status == "Editing") {
        const all_track = await prisma.tracks.findMany({
          where: {
            releaseId: releaseData.id,
          },
        });

        for (const track of all_track) {
          if (track.track_mp3 !== null) {
            const deleteObjectCommandMp3 = new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: track.track_mp3,
            });
            await s3.send(deleteObjectCommandMp3);
          }

          if (track.track_wav !== null) {
            const deleteObjectCommandWav = new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: track.track_wav,
            });
            await s3.send(deleteObjectCommandWav);
          }
        }

        const delete_track = await prisma.tracks.deleteMany({
          where: {
            releaseId: releaseData.id,
          },
        });
        const update_release = await prisma.release.delete({
          where: {
            id: id_release,
          },
        });

        return NextResponse.json({ message: "success" });
      } else {
        // Handle the case where no releases are found for the user
        return NextResponse.json({ message: "No releases found for the user" });
      }
    } else {
      return redirect('/dashboard/catalog');
    }
  }
}

