import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin";

const navItems = [
  { href: "/admin", label: "Přehled" },
  { href: "/admin/produkty", label: "Produkty" },
  { href: "/admin/vzhled", label: "Vzhled" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminSession();
  if (!admin) redirect("/prihlaseni");
  return (
    <div className="min-h-screen bg-sand-dark">
      <div className="bg-forest text-sand">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-display text-xl">Čaj Koření Káva — Administrace</Link>
          <Link href="/" className="text-sm text-sand/70 hover:text-sand">Zpět na web →</Link>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-6 text-sm border-t border-sand/10">
          {navItems.map((item) => <Link key={item.href} href={item.href} className="py-3 text-sand/80 hover:text-sand">{item.label}</Link>)}
        </nav>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
