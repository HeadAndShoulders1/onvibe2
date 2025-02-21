import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import sizeOf from 'image-size';


export async function POST(req: Request, res: NextResponse) {
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
        const s3 = new S3Client({
          region: process.env.AWS_REGION || undefined,
          endpoint: 'https://hb.ru-msk.vkcs.cloud/',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          },
        });

        const file = formData.get('file') as File;
        if (!file || !file.type) {
          return NextResponse.json({ message: 'not_file' });
        } else {
          const fileType = file.type;
          if (fileType === 'image/jpeg') {
            const maxSize = 6000;
            const bytes1 = await file.arrayBuffer();
            const buffer1 = Buffer.from(bytes1);
            const dimensions = sizeOf(buffer1);
            const width = dimensions.width;
            const height = dimensions.height;
            if (
              width === undefined ||
              height === undefined ||
              (width > maxSize || height > maxSize) ||
              (width < 3000 || height < 3000) ||
              (width !== height)
            ) {
              return NextResponse.json({ message: 'invalid_image_size' });
            } else {
              if (releaseData.cover_path != null) {
                const deleteObjectCommand = new DeleteObjectCommand({
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: releaseData.cover_path
                });
                await s3.send(deleteObjectCommand);

                const deleteObjecCommand = new DeleteObjectCommand({
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: releaseData.cover_small_path as string,
                });
                await s3.send(deleteObjecCommand);
              }

              const name_file = uuidv4();
              const name_file_small = uuidv4();
              const PutObjctCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: name_file,
                ACL: "public-read"
              });
              const PutObjtCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: name_file_small,
                ACL: "public-read"
              });

              const getUrl = await getSignedUrl(s3, PutObjctCommand, { expiresIn: 60 });
              const getUrl2 = await getSignedUrl(s3, PutObjtCommand, { expiresIn: 60 });

              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              // Изменяем размер изображения до 500x500 с использованием Jimp
              const image = await Jimp.read(buffer);
              image.resize(500, 500);
              const resizedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

              // Создаем буфер для измененного изображения
              const bytes_small_image = Buffer.from(resizedImageBuffer);

              await fetch(getUrl, {
                method: "PUT",
                body: buffer,
                headers: {
                  "Content-Type": file.type
                }
              });

              await fetch(getUrl2, {
                method: "PUT",
                body: bytes_small_image,
                headers: {
                  "Content-Type": file.type
                }
              });

              const update_release = await prisma.release.update({
                where: {
                  id: releaseId,
                },
                data: {
                  cover_path: name_file,
                  cover_small_path: name_file_small
                }
              });

              const info_release = await prisma.release.findUnique({
                where: {
                  id: releaseId,
                }
              });
              const info = {
                id: info_release?.id,
                title: info_release?.title,
                version: info_release?.version,
                type: info_release?.type,
                p_line: info_release?.p_line,
                meta_language: info_release?.meta_language,
                cover_small_path: info_release?.cover_small_path,
                date_release: info_release?.date_release,
                artist: info_release?.artist,
                featartist: info_release?.featartist,
                genre: info_release?.genre,
              }
              return NextResponse.json(info);
            }
          } else {
            return NextResponse.json({ message: 'invalid_image_format' });
          }
        }
      } else {
        return NextResponse.json({ message: 'unauthorized' });
      }
    } else {
      return NextResponse.json({ message: 'unauthorized' });
    }
  } else {
    return NextResponse.json({ message: 'unauthorized' });
  }
}
