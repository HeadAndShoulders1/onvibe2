import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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
        if (userdata) {
            const { id_smartlink, url } = await request.json()
            const create_smartlink = await prisma.smartlinks.findUnique({
                where: {
                    id: id_smartlink
                }
            });
            if (create_smartlink?.owner == userdata.id) {
                const check_url_smartlink = await prisma.smartlinks.findUnique({
                    where: {
                        url: url
                    }
                })
                if (!check_url_smartlink) {
                    const url_smartlink = await prisma.smartlinks.update({
                        where: {
                            id: id_smartlink
                        },
                        data: {
                            url: url
                        }
                    });
                    return NextResponse.json({
                        message: "success"
                    });
                } else {
                    return NextResponse.json({
                        message: "not_unique"
                    });
                }
            }
        } else {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
        }
    }
}