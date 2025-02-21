import { prisma } from '@/lib/prisma';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Readable } from 'stream';
import ffmpeg from 'fluent-ffmpeg';
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
      if (user_id == owner_id && releaseData.status == "Editing") {
        const file = formData.get('file') as File;
        const fileType = file.type;

        if (fileType === 'audio/wav') {
          const name_file = uuidv4()
          const name_file_small = uuidv4()

          const PutObjctCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name_file,
            ACL: "public-read"
          })

          const PutObjtCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name_file_small,
            ACL: "public-read"
          })

          const getUrl = await getSignedUrl(s3, PutObjctCommand, {
            expiresIn: 60
          })
          const getUrl2 = await getSignedUrl(s3, PutObjtCommand, {
            expiresIn: 60
          })

          const bytes = await file.arrayBuffer();
          const wavBuffer = Buffer.from(bytes)
          const input = new Readable();
          input.push(wavBuffer);
          input.push(null);
          const command = ffmpeg()
            .setFfmpegPath('./node_modules/ffmpeg-static/ffmpeg')
            .input(input)
            .inputFormat('wav')
            .toFormat('mp3')
            .outputOptions('-write_xing 0') // Опционально, для улучшения совместимости
            .pipe();
          const mp3Buffer: Buffer[] = [];
          command.on('data', (chunk: any) => {
            mp3Buffer.push(chunk);
          });


          await fetch(getUrl, {
            method: 'PUT',
            body: wavBuffer,
            headers: {
              'Content-Type': file.type,
            },
          });

          await fetch(getUrl2, {
            method: 'PUT',
            body: Buffer.concat(mp3Buffer),
            headers: {
              'Content-Type': 'audio/mpeg',
            },
          });
          const latestNumberModel = await prisma.tracks.findFirst({
            where: {
              releaseId: releaseId, // replace pk with the actual value
            },
            orderBy: {
              id: 'desc',
            },
          });
          let numberman = 1
          if (latestNumberModel?.order) {
            numberman = latestNumberModel ? latestNumberModel.order + 1 : 1;
          }

          const update_release = await prisma.tracks.create({
            data: {
              releaseId: releaseId,
              track_wav: name_file,
              track_mp3: name_file_small,
              order: numberman,
              owner: user_id,
            }
          });
          const info_release = await prisma.tracks.findMany({
            where: {
              releaseId: releaseId,
            }
          })
          return NextResponse.json({ info_release })
        } else {
          return NextResponse.json({ message: 'isFormatNotValidAudio' });
        }
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


