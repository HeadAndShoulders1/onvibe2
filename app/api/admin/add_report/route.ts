import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { format } from "date-fns";

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
            status: 401,
        });
    } else {
        const userEmail = <string>session.user?.email;
        const userdata = await prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });

        if (userdata) {
            const { admin } = userdata;
            if (admin == true) {
                const { reports } = await request.json();
                for (const report of reports) {
                    const create_report = await prisma.report.create({
                        data: {
                            title: report.title,
                            artist: report.artist,
                            upc: report.upc,
                            amount: report.amount*85,
                            cover: report.cover
                        }
                    })
                }
                return NextResponse.json({ message: "success" })

            } else {
                return NextResponse.json({ message: "not_admin" })

            }
        } else {
            return NextResponse.json({ message: "not_user" })
        }
    }
}

