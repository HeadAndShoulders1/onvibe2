export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // или путь к вашей prisma инстанции

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Удаляем заявку из таблицы Grant
    await prisma.grant.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Заявка успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении заявки:", error);
    return NextResponse.error();
  }
}
