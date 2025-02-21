import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
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
            const { date } = await request.json()
            let currentDate = new Date();
            if (date == 1) {
                currentDate.setDate(currentDate.getDate() - 7);
            }
            if (date == 2) {
                currentDate.setDate(currentDate.getDate() - 30);
            }
            if (date == 3) {
                currentDate.setDate(currentDate.getDate() - 90);
            }
            if (date == 4) {
                currentDate.setDate(currentDate.getDate() - 180);
            }
            //release
            const release_all = await prisma.release.count()
            const release_accepter = await prisma.release.count({ where: { status: "Accepted" } })
            const release_moderate = await prisma.release.count({ where: { status: "Moderate" } })
            const release_error = await prisma.release.count({ where: { status: "Error" } })
            const release_edit = await prisma.release.count({ where: { status: "Editing" } })

            const all_release = await prisma.release.findMany()
            const release_data: any[] = []
            for (const streams_release of all_release) {
                if (streams_release) {
                    if (currentDate <= parseDate(convertDateFormat(streams_release?.createdAt))) {
                        const existingEntry = release_data.find((entry: { name: string; }) => entry.name === convertDateFormat(streams_release?.createdAt));
                        if (existingEntry) {
                            existingEntry.uv += 1;
                        } else {
                            release_data.push({ name: convertDateFormat(streams_release?.createdAt), uv: 1 });
                        }
                    }
                }
            }
            release_data.sort((a, b) => parseDate(a.name).getTime() - parseDate(b.name).getTime());
            //user
            const user_all = await prisma.user.count()
            const user_accepter = await prisma.user.count({ where: { license_status: "Accept" } })
            const user_moderate = await prisma.user.count({ where: { license_status: "Moderate" } })
            const user_not_fill = await prisma.user.count({ where: { license_status: "Not fill" } })
            const user_email_fail = await prisma.user.count({ where: { email_auth: false } })

            const all_user = await prisma.user.findMany()
            const user_data: any[] = []
            for (const streams_release of all_user) {
                if (streams_release) {
                    const releaseDate = parseDate(convertDateFormat(streams_release?.createdAt));
                    if (currentDate <= releaseDate) {
                        const existingEntry = user_data.find(entry => entry.name === convertDateFormat(streams_release?.createdAt));
                        if (existingEntry) {
                            existingEntry.uv += 1;
                        } else {
                            user_data.push({ name: convertDateFormat(streams_release?.createdAt), uv: 1 });
                        }
                    }
                }
            }
            user_data.sort((a, b) => parseDate(a.name).getTime() - parseDate(b.name).getTime());

            //payments
            const payments: any[] = []
            const payments_all = await prisma.payment.findMany({})
            const payments_all_z = await prisma.payment.findMany({
                where: {
                    status: "succeeded"
                }
            })

            let all_amount = 0
            for (const asjfolpjia of payments_all_z) {
                if (asjfolpjia.id_payment != null && asjfolpjia.id_payment != "" && asjfolpjia.amount) {
                    all_amount = all_amount + asjfolpjia.amount
                }
            }
            let amount_in_period = 0
            for (const streams_release of payments_all) {
                if (streams_release) {
                    const releaseDate = parseDate(convertDateFormat(streams_release?.createdAt));
                    if (currentDate <= releaseDate) {
                        const existingEntry = payments.find(entry => entry.name === convertDateFormat(streams_release?.createdAt));
                        if (streams_release.status === "canceled") {
                            if (existingEntry) {
                                existingEntry.canceled += 1;
                            } else {
                                payments.push({ name: convertDateFormat(streams_release?.createdAt), canceled: 1, pending: 0, amount: 0 });
                            }
                        }
                        if (streams_release.status === "pending") {
                            if (existingEntry) {
                                existingEntry.pending += 1;
                            } else {
                                payments.push({ name: convertDateFormat(streams_release?.createdAt), canceled: 0, pending: 1, succeeded: 1, amount: 0 });
                            }
                        }
                        if (streams_release.status === "succeeded" && streams_release.amount) {
                            amount_in_period += streams_release.amount
                            if (existingEntry) {
                                existingEntry.succeeded += 1;
                                if (streams_release.id_payment != null && streams_release.id_payment != "" && streams_release.amount) {
                                    existingEntry.amount += streams_release.amount
                                }
                            } else {
                                payments.push({ name: convertDateFormat(streams_release?.createdAt), canceled: 0, pending: 0, succeeded: 1, amount: streams_release.amount });
                            }
                        }
                    }
                }
            }

            //subsribe
            let premium = 0
            let full = 0
            let artist = 0
            const search_subscribe = await prisma.subscribe.findMany({
                orderBy: {
                    id: 'desc'
                }
            })
            for (const subscribe of search_subscribe) {
                let id_subscribe = 0
                if (subscribe && subscribe.startDate && subscribe.endDate) {
                    const today_date = new Date()
                    if (subscribe.startDate < today_date && subscribe.endDate > today_date) {
                        id_subscribe = subscribe.id_subscribe as number
                    }
                }
                if(id_subscribe === 1){
                    artist += 1
                }
                if(id_subscribe === 2){
                    premium += 1
                }
                if(id_subscribe === 3){
                    full += 1
                }
            }
            const ResponseJSON = {
                release: {
                    release_all: release_all,
                    release_accepter: release_accepter,
                    release_moderate: release_moderate,
                    release_error: release_error,
                    release_edit: release_edit,
                    release_data: release_data
                },
                user: {
                    user_all: user_all,
                    user_accepter: user_accepter,
                    user_moderate: user_moderate,
                    user_not_fill: user_not_fill,
                    user_email_fail: user_email_fail,
                    user_data: user_data
                },
                payment: {
                    all_amount: all_amount,
                    amount_in_period: amount_in_period,
                    payment_data: payments
                },
                subscribe: [
                    {
                        platform: "Премиум-артист",
                        stream: artist
                    },
                    {
                        platform: "Премиум",
                        stream: premium
                    },
                    {
                        platform: "Профессиональная",
                        stream: full
                    },
                ]
            }
            return NextResponse.json(ResponseJSON)
        }
    }
}


function convertDateFormat(dateString: any) {
    const day = dateString.getDate().toString().padStart(2, '0');
    const month = (dateString.getMonth() + 1).toString().padStart(2, '0');
    const year = dateString.getFullYear();

    return `${day}.${month}.${year}`;
}
function parseDate(dateString: string): Date {
    const parts = dateString.split(".");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}