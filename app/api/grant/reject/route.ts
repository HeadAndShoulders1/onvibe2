// app/api/grant/reject/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // или путь к вашей prisma инстанции

export async function POST(req: Request) {
  try {
    const { user_id, grant_review } = await req.json();

    // Обновляем пользователя: grant_review = false
    await prisma.user.update({
      where: { id: user_id },
      data: {
        grant_review: grant_review,
      },
    });

    return NextResponse.json({ message: "Пользователь обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    return NextResponse.error();
  }
}
