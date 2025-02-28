import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      has_grant: true,
      grant_duration: true,
      grant_review: true,
      grant_end: true
    },
  });

  return NextResponse.json({
    grant: user?.has_grant ?? false,
    grant_duration: user?.grant_duration ? Number(user.grant_duration) : 0,
    grant_review: user?.grant_review ?? false,
    grant_end: user?.grant_end ?? null
  });
}
