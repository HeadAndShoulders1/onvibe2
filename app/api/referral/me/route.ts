export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Получаем сессию пользователя
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
      });
    }

    const email = session.user.email ?? undefined;

    // Получаем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Пользователь не найден" }), {
        status: 404,
      });
    }

    // Получаем промокод этого пользователя
    const promocode = await prisma.promocodes.findFirst({
      where: { UserID: user.id },
      select: { name: true },
    });

    if (!promocode || !promocode.name) {
      return new Response(JSON.stringify({ referredCount: 0 }), {
        status: 200,
      });
    }

    // Считаем количество подтвержденных платежей по промокоду
    const referredCount = await prisma.payment.count({
      where: {
        promocode: promocode.name,
        status: "CONFIRMED",
      },
    });

    // Возвращаем количество приглашённых пользователей
    return new Response(
      JSON.stringify({ referredCount }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching referred count:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении данных" }),
      { status: 500 }
    );
  }
}
