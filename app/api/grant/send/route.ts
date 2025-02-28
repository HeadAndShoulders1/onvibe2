import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Telegraf } from "telegraf";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Проверяем, есть ли сессия и пользователь
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { application } = await req.json();

  try {
    // Получаем пользователя по email из сессии
    const userEmail = session.user.email;
    const userdata = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userdata) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Проверяем, подал ли уже пользователь заявку
    const existingGrant = await prisma.grant.findFirst({
      where: {
        user_id: Number(userdata.id), // Ищем заявку с таким user_id
      },
    });

    if (existingGrant) {
      return NextResponse.json({ error: "Вы уже подали заявку, обновите страницу" }, { status: 400 });
    }

    // Пытаемся создать новую запись в таблице grant
    const newGrant = await prisma.grant.create({
      data: {
        application,
        user_id: Number(userdata.id), // Преобразуем BigInt в Number
      },
    });

    // Обновляем поле grant_review на true
    await prisma.user.update({
      where: {
        id: userdata.id,
      },
      data: {
        grant_review: true, // Обновляем значение grant_review на true
      },
    });

    // Отправляем сообщение в Telegram
    const bot = new Telegraf('6340836760:AAE9EJiASuuTVVBkqwYL3fUJF_spZ49kwzc');
    await bot.telegram.sendMessage('1364654007', `Человек с ником ${userdata.username} отправил заявку на грант: ${application}`);
    await bot.telegram.sendMessage('794498292', `Человек с ником ${userdata.username} отправил заявку на грант: ${application}`);
    // Преобразуем в строку все BigInt значения, чтобы их можно было сериализовать в JSON
    const responseData = JSON.parse(JSON.stringify(newGrant, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString(); // Преобразуем BigInt в строку
      }
      return value;
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);  // Логирование ошибки
    return NextResponse.json({ error: "Ошибка при создании заявки" }, { status: 500 });
  }
}
