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

type GroupedResult = {
    amount: number;
    date: string;
    release: ReleaseInfo[];
};

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
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
}
