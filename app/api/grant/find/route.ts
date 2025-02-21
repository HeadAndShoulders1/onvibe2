export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Не авторизован" }), {
        status: 401,
      });
    }

    const email = session.user.email ?? undefined;
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { admin: true },
    });

    if (!user?.admin) {
      return new Response(JSON.stringify({ error: "Доступ запрещен" }), {
        status: 403,
      });
    }

    const applications = await prisma.grant.findMany({
      select: {
        id: true,
        application: true,
        user_id: true,
      },
    });

    const serializedApplications = applications.map((app) => ({
      ...app,
      id: app.id.toString(),
      user_id: app.user_id ? app.user_id.toString() : null,
    }));

    return new Response(JSON.stringify(serializedApplications), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response(JSON.stringify({ error: "Ошибка при получении заявок" }), {
      status: 500,
    });
  }
}