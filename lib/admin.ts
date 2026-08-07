import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "richard@cajkorenikava.cz")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return null;
  }
  return session;
}
