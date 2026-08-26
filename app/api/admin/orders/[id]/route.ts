import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });

  const body = await request.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: body.status },
  });

  return NextResponse.json(order);
}
