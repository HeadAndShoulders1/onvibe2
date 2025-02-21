import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
            const { id_track } = await request.json()
            const track = await prisma.tracks.findUnique({
                where: {
                    id: id_track
                }
            })
            if (userdata.id === track?.owner && track.releaseId) {
                const release = await prisma.release.findFirst({
                    where: {
                        id: track.releaseId
                    }
                })
                return NextResponse.json({ title: track.title, artist: track.artist, featartist: track.featartist, cover: release?.cover_small_path, track: track.track_mp3 })
            } else {
                return NextResponse.json({ message: "not_permission" })
            }
        } else {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
        }
    }
}