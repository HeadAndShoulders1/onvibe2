export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Функция для безопасного преобразования BigInt
function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ error: "Не авторизован" }, { status: 401 });
    }

    const email = session.user.email ?? undefined;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { admin: true },
    });

    if (!user?.admin) {
      return Response.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        status: { not: "Completed" }, // Фильтр: заявки не Completed
      },
      select: {
        id: true,
        card_number: true,
        user_id: true,
        amount: true,
        status: true,
      },
    });

    // Преобразуем BigInt перед отправкой
    const serializedWithdrawals = serializeBigInt(withdrawals);

    return Response.json(serializedWithdrawals, { status: 200 });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return Response.json(
      { error: "Ошибка при получении заявок на вывод" },
      { status: 500 }
    );
  }
}
