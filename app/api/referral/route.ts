import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const promocodes = await prisma.promocodes.findMany({
      select: {
        id: true,
        name: true,
        UserID: true,
      },
    });

    // Получаем только не-null значения для промокодов
    const promoNames = promocodes
      .map((promo) => promo.name)
      .filter((name): name is string => name !== null);

    // Получаем количество подтвержденных платежей для каждого промокода
    const confirmedPayments = await prisma.payment.groupBy({
      by: ['promocode'],
      where: {
        promocode: { in: promoNames },
        status: 'CONFIRMED',
      },
      _count: {
        promocode: true,
      },
    });

    // Преобразуем UserID в массив чисел, исключая null
    const userIds = promocodes
      .map((promo) => promo.UserID)
      .filter((userId): userId is number => userId !== null); // Используем фильтрацию для исключения null и приведения к числу

    // Запросим всех пользователей с найденными UserID
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Создаем мапу для быстрого поиска пользователя по ID
    const userMap = new Map(users.map((user) => [user.id, user]));

    const result = promocodes.map((promo) => {
      // Находим количество подтвержденных платежей для текущего промокода
      const confirmedCount = confirmedPayments.find(
        (payment) => payment.promocode === promo.name
      )?._count.promocode || 0;

      // Находим пользователя по UserID
      const user = promo.UserID ? userMap.get(promo.UserID) : null;

      return {
        id: promo.id,
        name: promo.name,
        user,
        confirmedPayments: confirmedCount,
      };
    });

    // Сортировка по количеству подтвержденных платежей
    const sorted = result.sort(
      (a, b) => b.confirmedPayments - a.confirmedPayments
    ).slice(0, 10);

    return NextResponse.json(sorted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Ошибка получения данных' },
      { status: 500 }
    );
  }
}
