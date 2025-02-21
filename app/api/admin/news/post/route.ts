import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: process.env.AWS_REGION || undefined,
    endpoint: 'https://hb.ru-msk.vkcs.cloud/',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

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
        if (userdata?.id && userdata.admin == true) {
            const { text, photo_url } = await request.json()
            const base64String = photo_url.split(",")[1];
            const name_file = uuidv4();
            const PutObjctCommand = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: name_file,
                ACL: "public-read"
            });
            const getUrl = await getSignedUrl(s3, PutObjctCommand, { expiresIn: 60 });
            await fetch(getUrl, {
                method: "PUT",
                body: Buffer.from(base64String, 'base64'),
                headers: {
                    "Content-Type": base64String.type
                }
            });
            const create_news = await prisma.news.create({
                data: {
                    photo_url: name_file,
                    text: text,
                    createdAt: new Date()
                }
            })
            const news = await prisma.news.findMany({
                orderBy: {
                    id: 'desc'
                }
            })
            return NextResponse.json({ news: news })
        }
    }
}