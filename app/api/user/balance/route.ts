import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";
const YooKassa = require('yookassa');
const yooKassa = new YooKassa({
    shopId: process.env.SHOP_ID,
    secretKey: process.env.SHOP_SECRET_KEY
});

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
        if (userdata) {
            const payments = await prisma.payment.findMany({
                where: {
                    UserID: userdata.id
                }
            })
            let balance = 0
            for (const payment of payments) {
                if (payment.status != "succeeded" && payment.status != "canceled") {
                    const response = await axios.get(`https://api.yookassa.ru/v3/payments/${payment.id_payment}`, {
                        auth: {
                            username: <string>process.env.SHOP_ID,
                            password: <string>process.env.SHOP_SECRET_KEY
                        }
                    });
                    const data = await response.data
                    const update_payment = await prisma.payment.update({
                        where: {
                            id_payment: payment.id_payment,
                            id: payment.id
                        },
                        data: {
                            status: data.status
                        }
                    })
                    if (data.status === "succeeded" && payment.promocode != null && update_payment.amount) {
                        const find_promocode = await prisma.promocodes.findFirst({
                            where: {
                                name: update_payment.promocode
                            }
                        })
                        if (find_promocode) {
                            const create_promocode = await prisma.promocodesAction.create({
                                data: {
                                    amount: Math.floor(update_payment.amount * 0.15),
                                    IdPromocode: find_promocode?.id,
                                    status: "paid"
                                }
                            })
                        }
                    }
                }
            }
            const payment_success = await prisma.payment.findMany({
                where: {
                    UserID: userdata.id,
                    status: "succeeded"
                }
            })
            const subscribe_all = await prisma.subscribe.findMany({
                where: {
                    UserID: userdata.id
                }
            })
            for (const payment of payment_success) {
                if (payment.amount) {
                    balance = payment.amount + balance
                }
            }
            for (const subscribe of subscribe_all) {
                if (subscribe.amount != null) {
                    balance = balance - subscribe.amount
                }
            }
            const update_balance_user = await prisma.user.update({
                where: {
                    id: userdata.id
                },
                data: {
                    balance: balance
                }
            })
            return NextResponse.json({ balance: update_balance_user.balance })
        }
    }
}