import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    const { email, code, password } = await request.json()
    const chech_email = await prisma.user.findUnique({
        where: {
            email: email,
            email_code: code,
        }
    })
    if (chech_email) {
        const passwordHash = bcrypt.hashSync(password, 10);
        const chech_email = await prisma.user.update({
            where: {
                email: email,
                email_code: code,
            },
            data: {
                passwordHash: passwordHash
            }
        })
        return NextResponse.json({ message: "success" })
    } else {
        return NextResponse.json({ message: "email_not_found" })
    }
}