import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";

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
            const { id_release } = await request.json()
            const promo = await prisma.promo.deleteMany({
                where: {
                    releaseID: id_release,
                }
            });
            const releases = await prisma.release.findMany({
                where: {
                    promo_send: true,
                }
            });

            let reuls = []
            for (const release of releases) {
                const promo = await prisma.promo.findFirst({
                    where: {
                        releaseID: release.id,
                    }
                });
                if (promo) {
                    reuls.push({
                        id: release.id,
                        cover_small_path: release.cover_small_path,
                        artist: release.artist,
                        featartist: release.featartist,
                        title: release.title,
                        version: release.version,
                        upc: release.upc,
                        date_release: release.date_release,
                        promo_send: release.promo_send,
                        promo_prosent: release.promo_prosent,
                        General_text: promo?.General_text,
                        playlists: promo?.playlists,
                        key_facts: promo?.key_facts,
                        release_promotion: promo?.release_promotion,

                    })
                }

            }
            return NextResponse.json(reuls);
        } else {
            return NextResponse.json({ message: "not_admin" });
        }
    }
}
