import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type ReleaseInfo = {
    upc: string;
    amount: number;
    title: string;
    cover: string;
    artist: string;
};
<<<<<<< HEAD

=======
>>>>>>> e65b460f45a8d35f53ee69e5a7bf74bf1ec8e09a
type GroupedResult = {
    amount: number;
    date: string;
    release: ReleaseInfo[];
};
<<<<<<< HEAD

=======
>>>>>>> e65b460f45a8d35f53ee69e5a7bf74bf1ec8e09a
export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
<<<<<<< HEAD
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const userEmail = session.user?.email as string;
    const userdata = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!userdata) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
    }

    const releases = await prisma.release.findMany({
        where: {
            owner: userdata.id,
            status: "Accepted",
        },
    });

    const allGroupedReports: GroupedResult[] = [];
    let all_amount = 0;

    for (const release of releases) {
        if (release.upc) {
            const reports = await prisma.report.findMany({
                where: { upc: release.upc },
                orderBy: { createdAt: 'asc' },
            });

            if (reports.length > 0) {
                reports.forEach(report => {
                    if (report.createdAt && report.amount) {
                        all_amount += report.amount;
                        const dateStr: string = report.createdAt.toISOString().split('T')[0];
                        const reportData: ReleaseInfo = {
                            upc: String(report.upc),
                            amount: report.amount,
                            title: report.title || '',
                            cover: report.cover || '',
                            artist: report.artist || '',
                        };

                        let existingDateEntry = allGroupedReports.find(entry => entry.date === dateStr);
                        if (!existingDateEntry) {
                            existingDateEntry = { amount: 0, date: dateStr, release: [] };
                            allGroupedReports.push(existingDateEntry);
                        }

                        existingDateEntry.amount += reportData.amount;
                        const existingRelease = existingDateEntry.release.find(r => r.upc === reportData.upc);
                        if (existingRelease) {
                            existingRelease.amount += reportData.amount;
                        } else {
                            existingDateEntry.release.push(reportData);
                        }
                    }
                });
            }
        }
    }

    const totalWithdrawals = await prisma.withdrawal.aggregate({
        where: { user_id: userdata.id },
        _sum: { amount: true },
    });

    const withdrawalsAmount = Number(totalWithdrawals._sum.amount || 0) * 100;
    const finalAmount = all_amount - withdrawalsAmount;


    return NextResponse.json({
        all_amount: finalAmount,
        totalWithdrawn: withdrawalsAmount,
        report: allGroupedReports
    });
=======
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
            const releases = await prisma.release.findMany({
                where: {
                    owner: userdata.id,
                    status: "Accepted",
                },
            });


            const allGroupedReports: GroupedResult[] = [];
            let all_amount = 0
            for (const release of releases) {
                if (release.upc) {
                    const reports = await prisma.report.findMany({
                        where: {
                            upc: release.upc,
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    });


                    if (reports && reports.length > 0) {
                        reports.forEach(report => {
                            if (report && report.createdAt && report.amount) {
                                all_amount += report.amount
                                const dateStr: string = report.createdAt.toISOString().split('T')[0];
                                const reportData: ReleaseInfo = {
                                    upc: String(report.upc),
                                    amount: report.amount || 0,
                                    title: report.title || '',
                                    cover: report.cover || '',
                                    artist: report.artist || '',
                                };

                                let existingDateEntry = allGroupedReports.find(entry => entry.date === dateStr);
                                if (!existingDateEntry) {
                                    existingDateEntry = {
                                        amount: 0,
                                        date: dateStr,
                                        release: [],
                                    };
                                    allGroupedReports.push(existingDateEntry);
                                }

                                existingDateEntry.amount += reportData.amount;
                                const existingRelease = existingDateEntry.release.find(r => r.upc === reportData.upc);
                                if (existingRelease) {
                                    existingRelease.amount += reportData.amount;
                                } else {
                                    existingDateEntry.release.push(reportData);
                                }
                            }
                        });
                    }
                }
            }

            return NextResponse.json({
                all_amount: all_amount,
                report: allGroupedReports
            });
        } else {
            return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
                status: 401,
            });
        }
    }
>>>>>>> e65b460f45a8d35f53ee69e5a7bf74bf1ec8e09a
}
