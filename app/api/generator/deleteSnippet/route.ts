import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

const projectPath = process.cwd();
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
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    } else {
        const userEmail = <string>session.user?.email;
        const userdata = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });
        if (userdata) {
            const { id_snippet } = await request.json()
            const track2 = await prisma.snippet.findUnique({
                where: {
                    id: id_snippet
                }
            })
            if (userdata.id === track2?.owner && track2.url) {
                const deleteObjectCommandMp3 = new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: track2.url,
                });
                await s3.send(deleteObjectCommandMp3);
                const track1 = await prisma.snippet.delete({
                    where: {
                        id: id_snippet
                    }
                })
                const releaseAccept = await prisma.release.findMany({
                    where: {
                        owner: userdata.id,
                        status: "Accepted"
                    }
                })
                const track: any[] = []
                for (const release of releaseAccept) {
                    const track_all = await prisma.tracks.findMany({
                        where: {
                            releaseId: release.id
                        },
                        orderBy: {
                            id: 'desc'
                        }
                    })
                    for (const track_one of track_all) {
                        track.push({ id: track_one.id, cover: release.cover_small_path, title: track_one.title, version: track_one.version, artist: track_one.artist, featartist: track_one.featartist })
                    }
                }
                const snippet = await prisma.snippet.findMany({
                    where: {
                        owner: userdata.id,
                    },
                    orderBy: {
                        id: 'desc'
                    }
                })
                return NextResponse.json({
                    releases: track,
                    snippets: snippet
                })
            }
        }
    }
}