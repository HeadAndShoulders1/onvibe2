import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, grant_duration } = await req.json();

    if (!user_id || !grant_duration) {
      return NextResponse.json(
        { error: "user_id и grant_duration обязательны" },
        { status: 400 }
      );
    }

    // Вычисляем сумму платежа
    const amountToAdd = 329 * grant_duration;
    console.log("📌 Начинаем создание платежа: user_id =", user_id, "сумма =", amountToAdd);

    // Создаем платеж
    const newPayment = await prisma.payment.create({
      data: {
        UserID: user_id, // Поле UserID, как в схеме Prisma
        amount: amountToAdd,
        status: "succeeded",
      },
    });

    console.log("✅ Платеж успешно создан:", newPayment);

    // Обновляем баланс пользователя
    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: {
        balance: { increment: amountToAdd },
      },
    });

    console.log("✅ Баланс обновлен! Новый баланс:", updatedUser.balance);

    return NextResponse.json({
      message: "Платеж создан и баланс обновлен",
      updatedBalance: updatedUser.balance,
      payment: newPayment,
    });
  } catch (error: any) {
    console.error("❌ Ошибка при создании платежа или обновлении баланса:", error);

    return NextResponse.json(
      { error: "Ошибка сервера", details: error.message },
      { status: 500 }
    );
  }
}
