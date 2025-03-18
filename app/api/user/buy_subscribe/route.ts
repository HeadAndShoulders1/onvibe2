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

        if (userdata && userdata.balance !== null && userdata.balance >= 0) {
            const search_subscribe = await prisma.subscribe.findMany({
                where: {
                    UserID: userdata.id
                },
                orderBy: {
                    id: 'desc'
                }
            })
            let if_subscribe = false
            if (search_subscribe) {
                const subscribe_last = search_subscribe[0]
                if (subscribe_last && subscribe_last.startDate && subscribe_last.endDate) {
                    const today_date = new Date()
                    if (subscribe_last.startDate < today_date && subscribe_last.endDate > today_date) {
                        if_subscribe = true
                    }
                }
            }
            if (if_subscribe == false) {
                const { type_subscribe } = await request.json();
                let have_money = false;
                const startDate = new Date();
                let endDate = new Date(startDate);
                let id_subscribe
                let amount
                if (type_subscribe == "month_start" && userdata.balance >= 329) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 329
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 1);
                    id_subscribe = 4
                    amount = 329
                }

                if (type_subscribe == "month_premium" && userdata.balance >= 999) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 999
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 1);
                    id_subscribe = 2
                    amount = 999
                }
                if (type_subscribe == "month_premka" && userdata.balance >= 499) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 499
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 1);
                    id_subscribe = 3
                    amount = 499
                }

                if (type_subscribe == "year_start" && userdata.balance >= 2999) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 2999
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 12);
                    id_subscribe = 4
                    amount = 2999
                }

                if (type_subscribe == "year_premium" && userdata.balance >= 6499) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 6499
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 12);
                    id_subscribe = 2
                    amount = 6499
                }

                if (type_subscribe == "year_premka" && userdata.balance >= 3996) {
                    have_money = true;
                    const update_money_user = await prisma.user.update({
                        where: {
                            id: userdata.id
                        },
                        data: {
                            balance: userdata.balance - 3996
                        }
                    })
                    endDate.setMonth(startDate.getMonth() + 12);
                    id_subscribe = 3
                    amount = 3996
                }

                if (have_money == true) {
                    const create_subscribe = await prisma.subscribe.create({
                        data: {
                            UserID: userdata.id,
                            id_subscribe: id_subscribe,
                            endDate: endDate,
                            startDate: startDate,
                            amount: amount
                        },
                    });
                    return NextResponse.json({ message: "success" });
                } else {
                    return NextResponse.json({ message: "not_enough_money" });
                }
            } else {
                return NextResponse.json({ message: "have_subscribe" });
            }
        } else {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
                status: 401
            })
        }
    }
}