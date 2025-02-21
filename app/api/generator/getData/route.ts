import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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
        } else {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
        }
    }
}