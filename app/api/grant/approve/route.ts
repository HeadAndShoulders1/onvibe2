import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { addMonths } from 'date-fns';

export async function POST(req: Request) {
  try {
    const { user_id, id, grant_duration } = await req.json();
    console.log('Получен запрос на одобрение:', { user_id, id, grant_duration });

    if (!user_id || !id || grant_duration === undefined) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }

    // Вычисляем дату окончания гранта
    const grantEndDate = addMonths(new Date(), grant_duration);

    // Обновляем пользователя: устанавливаем has_grant = true, grant_duration и grant_end
    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: {
        has_grant: true,
        grant_duration: grant_duration,
        grant_end: grantEndDate, // Устанавливаем дату окончания гранта
      },
    });

    console.log('Пользователь обновлен:', updatedUser);

    // Удаляем заявку из таблицы Grant по id
    const deletedGrant = await prisma.grant.delete({
      where: { id: id },
    });

    console.log('Заявка удалена:', deletedGrant);

    return NextResponse.json({ message: "Заявка одобрена, пользователь обновлен" });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
