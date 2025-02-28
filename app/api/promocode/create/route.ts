import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";
import { Telegraf } from 'telegraf';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    const { name } = await request.json()
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
        const check_promo = await prisma.promocodes.findFirst({
            where: {
                name: name
            }
        });
        const check_promo_user_id = await prisma.promocodes.findFirst({
            where: {
                UserID: userdata?.id
            }
        });
        console.log(check_promo_user_id)
        if (userdata && check_promo == null && check_promo_user_id == null) {
            if (name.length < 4) {
                return NextResponse.json({ message: "short_promocode", status: "error" });
            } else {
                const create_promocode = await prisma.promocodes.create({
                    data: {
                        name: name,
                        UserID: userdata.id
                    }
                })

                const info_promocodes = await prisma.promocodes.findUnique({
                    where: {
                        id: create_promocode.id
                    }
                })

                const info_action = await prisma.promocodesAction.findMany({
                    where: {
                        IdPromocode: create_promocode.id
                    }
                })
                let summ = 0
                for (const action of info_action) {
                    if (action.amount) {
                        summ = summ + action.amount
                    }
                }
                return NextResponse.json({ action: info_action, info: info_promocodes, summ: summ })
            }
        } else {
            return NextResponse.json({ message: "already_exists", status: "error" });
        }
    }
}
