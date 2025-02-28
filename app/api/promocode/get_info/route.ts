import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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
        const check_promo_user_id = await prisma.promocodes.findFirst({
            where: {
                UserID: userdata?.id
            }
        });
        let summ = 0
        const if_act = []
        if (check_promo_user_id != null) {
            const info_actions = await prisma.promocodesAction.findMany({
                where: {
                    IdPromocode: check_promo_user_id.id
                }
            })
            for (const action of info_actions) {
                if(action?.amount) summ = summ + action?.amount
                if_act.push({ action })
            }
        }
        const result = {
            info: check_promo_user_id,
            action: if_act, 
            summ: summ
        }
        return NextResponse.json(result)
    }
}

