import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/users-store";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Neplatná data" }, { status: 400 });
  try {
    const user = createUser(parsed.data);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registrace se nezdařila";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
