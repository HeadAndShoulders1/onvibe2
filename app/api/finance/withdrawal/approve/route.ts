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

export async function POST(request: Request) {
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

    const { id } = await request.json();

    if (!id) {
      return Response.json({ error: "ID заявки не указан" }, { status: 400 });
    }

    // Обновляем статус заявки
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: BigInt(id) },
      data: { status: "Completed" },
    });

    // Преобразуем BigInt перед отправкой
    return Response.json(
      { message: "Заявка одобрена!", withdrawal: serializeBigInt(updatedWithdrawal) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении заявки:", error);
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
