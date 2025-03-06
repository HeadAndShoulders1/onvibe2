import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";
import { createHash } from "crypto";
const YooKassa = require('yookassa');
const yooKassa = new YooKassa({
    shopId: process.env.SHOP_ID,
    secretKey: process.env.SHOP_SECRET_KEY
});

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
                status: 401
            });
        }

        const userEmail = <string>session.user?.email;
        const userdata = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        if (!userdata) {
            return new NextResponse(JSON.stringify({ error: 'user not found' }), {
                status: 404
            });
        }

        const payments = await prisma.payment.findMany({
            where: {
                UserID: userdata.id
            }
        });

        let balance = 0;

        for (const payment of payments) {
            if (payment.id_payment != null && payment.status !== "succeeded" && payment.status !== "canceled" && payment.status !== "CONFIRMED" && payment.status !== "CANCELED") {
                let decodedPassword = ''; 
                if (process.env.PAYMENT_PASSWORD) {
                    // Декодируем base64 и корректируем с помощью decodeURIComponent
                    decodedPassword = decodeURIComponent(Buffer.from(process.env.PAYMENT_PASSWORD, 'base64').toString('utf-8'));
                  } else {
                    console.error('PAYMENT_PASSWORD is not defined');
                  }
                const token = decodedPassword + payment.id_payment + process.env.PAYMENT_LOGIN;
                const tokenSha256 = createHash('sha256')
                    .update(new TextEncoder().encode(token))
                    .digest('hex');

                const create_payment_tin = await axios.post(`https://securepay.tinkoff.ru/v2/GetState`, {
                    "TerminalKey": process.env.PAYMENT_LOGIN,
                    "PaymentId": parseInt(payment.id_payment, 10),
                    "Token": tokenSha256,
                });

                const update_status = await prisma.payment.update({
                    where: {
                        id: payment.id
                    },
                    data: {
                        status: create_payment_tin.data.Status
                    }
                });

                if ((create_payment_tin.data.status === "succeeded" || payment.status != "CONFIRMED") && payment.promocode != null && update_status.amount) {
                    const find_promocode = await prisma.promocodes.findFirst({
                        where: {
                            name: update_status.promocode
                        }
                    });

                    if (find_promocode) {
                        await prisma.promocodesAction.create({
                            data: {
                                amount: Math.floor(update_status.amount * 0.15),
                                IdPromocode: find_promocode?.id,
                                status: "paid"
                            }
                        });
                    }
                }
            }
        }

        const payment_success = await prisma.payment.findMany({
            where: {
                UserID: userdata.id,
                status: { in: ["CONFIRMED", "succeeded"] }
            }
        });

        const subscribe_all = await prisma.subscribe.findMany({
            where: {
                UserID: userdata.id
            }
        });

        for (const payment of payment_success) {
            if (payment.amount) {
                balance = payment.amount + balance;
            }
        }

        for (const subscribe of subscribe_all) {
            if (subscribe.amount != null) {
                balance = balance - subscribe.amount;
            }
        }

        const update_balance_user = await prisma.user.update({
            where: {
                id: userdata.id
            },
            data: {
                balance: balance
            }
        });

        return NextResponse.json({ balance: update_balance_user.balance });

    } catch (error) {
        console.error('Error in GET function:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500
        });
    }
}