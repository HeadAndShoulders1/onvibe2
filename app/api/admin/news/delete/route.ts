import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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
            const { id } = await request.json()
            const info_delete_release = await prisma.news.findUnique({
                where: {
                    id: id
                }
            })
            if (info_delete_release?.photo_url) {
                const deleteObjectCommand = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: info_delete_release?.photo_url
                });
                await s3.send(deleteObjectCommand);
            }
            const delete_news = await prisma.news.delete({
                where: {
                    id: id
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