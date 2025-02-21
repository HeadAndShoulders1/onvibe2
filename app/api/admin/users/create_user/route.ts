'use server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
            status: 401
        });
    } else {
        const userEmail = <string>session.user?.email;
        const userdata = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        if (userdata?.admin == true) {
            const { email, username, password, type } = await request.json()
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (user) {
                return NextResponse.json({ message: 'invalid_email' });
            } else {
                const user = await prisma.user.findUnique({
                    where: {
                        username,
                    },
                });
                if (user) {
                    return NextResponse.json({ message: 'invalid_username' });
                } else {
                    const passwordHash = bcrypt.hashSync(password, 10);
                    const newuserdata = await prisma.user.create({
                        data: {
                            username,
                            email,
                            passwordHash,
                            email_auth: true,

                        },
                    });
                    const startDate = new Date();
                    const endDate = new Date(startDate);
                    endDate.setMonth(startDate.getMonth() + 12);
                    const create_subscribe = await prisma.subscribe.create({
                        data: {
                            UserID: newuserdata.id,
                            id_subscribe: type,
                            endDate: endDate,
                            startDate: startDate,
                        },
                    });
                    return NextResponse.json({ message: "success" });
                }
            }
        }
    }
}