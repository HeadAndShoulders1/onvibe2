import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Telegraf } from "telegraf";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  try {
    const userEmail = session.user.email;
    const userdata = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        username: true,
        bank_account_number: true,
      },
    });

    if (!userdata) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userdata.bank_account_number) {
      return NextResponse.json({ error: "Укажите номер карты в профиле" }, { status: 400 });
    }

    const withdrawalAmount = Number(amount);

    if (withdrawalAmount <= 0) {
      return NextResponse.json({ error: "Сумма вывода должна быть положительной" }, { status: 400 });
    }

    if (withdrawalAmount < 1000) {
      return NextResponse.json({ error: "Минимальная сумма вывода — 1000 ₽" }, { status: 400 });
    }

    const upcList = await prisma.release.findMany({
      where: { owner: userdata.id, status: "Accepted" },
      select: { upc: true },
    });

    const validUpcList = upcList.map(r => r.upc).filter((upc): upc is string => upc !== null);

    const reports = await prisma.report.findMany({
      where: { upc: { in: validUpcList } },
      select: { amount: true },
    });

    const totalEarnings = reports.reduce((sum, report) => sum + Number(report.amount || 0), 0);

    const totalWithdrawals = await prisma.withdrawal.aggregate({
      where: { user_id: userdata.id },
      _sum: { amount: true },
    });

    const withdrawalsAmount = Number(totalWithdrawals._sum.amount || 0); 
    const availableBalance = totalEarnings/100 - withdrawalsAmount;
    if (withdrawalAmount > availableBalance/100) {
      return NextResponse.json({ error: "Недостаточно средств для вывода" }, { status: 400 });
    }

    const newWithdrawal = await prisma.withdrawal.create({
      data: {
        amount: withdrawalAmount,
        card_number: userdata.bank_account_number,
        user_id: userdata.id,
      },
    });

    const bot = new Telegraf('6340836760:AAE9EJiASuuTVVBkqwYL3fUJF_spZ49kwzc');
    await bot.telegram.sendMessage('1364654007', `Человек с ником ${userdata.username} отправил заявку на вывод: ${withdrawalAmount} ₽`);
    await bot.telegram.sendMessage('794498292', `Человек с ником ${userdata.username} отправил заявку на вывод: ${withdrawalAmount} ₽`);

    return NextResponse.json({
      success: true,
      withdrawalId: Number(newWithdrawal.id),
    });
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    return NextResponse.json({ error: "Ошибка при создании заявки" }, { status: 500 });
  }
}