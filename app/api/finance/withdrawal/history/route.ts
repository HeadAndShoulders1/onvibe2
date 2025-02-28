import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // 🔍 Получаем id пользователя по email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 📜 Получаем историю выводов
    const withdrawals = await prisma.withdrawal.findMany({
      where: { user_id: user.id }, // Используем найденный id
      select: {
        id: true,
        amount: true,
        created_at: true, // Если поле в базе `createdAt`, измени тут
        status: true,
      },
      orderBy: { created_at: "desc" },
    });

    // 🔥 Преобразуем BigInt → Number
    const formattedWithdrawals = withdrawals.map(w => ({
      ...w,
      id: Number(w.id), // id в Number
      amount: Number(w.amount), // сумма в Number
    }));

    return NextResponse.json(formattedWithdrawals);
  } catch (error) {
    console.error("Ошибка при получении истории выводов:", error);
    return NextResponse.json({ error: "Ошибка при загрузке истории" }, { status: 500 });
  }
}
