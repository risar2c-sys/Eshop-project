"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import OrderHistory from "@/components/account/OrderHistory";
import OrderTracking from "@/components/account/OrderTracking";
import WishlistTab from "@/components/account/WishlistTab";
import AddressesTab from "@/components/account/AddressesTab";
import ProfileTab from "@/components/account/ProfileTab";

const tabs = [
  { id: "objednavky", label: "Objednávky" },
  { id: "sledovani", label: "Sledování" },
  { id: "oblibene", label: "Oblíbené" },
  { id: "adresy", label: "Uložené adresy" },
  { id: "udaje", label: "Moje údaje" },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [active, setActive] = useState<TabId>("objednavky");

  if (status === "loading") return <div className="max-w-4xl mx-auto px-6 py-24 text-center text-bark/50">Načítám…</div>;
  if (status === "unauthenticated") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="section-heading mb-3">Nejste přihlášeni</h1>
        <p className="text-bark/60 mb-6">Pro zobrazení účtu se prosím přihlaste.</p>
        <Link href="/prihlaseni" className="btn-primary">Přihlásit se</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="section-heading">Můj účet</h1><p className="text-sm text-bark/60 mt-1">{session?.user?.email}</p></div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline text-sm">Odhlásit se</button>
      </div>
      <div className="flex gap-2 flex-wrap border-b border-forest/10 mb-8">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActive(tab.id)} className={`px-4 py-2.5 text-sm -mb-px border-b-2 transition-colors ${active === tab.id ? "border-forest text-forest" : "border-transparent text-bark/50 hover:text-bark"}`}>{tab.label}</button>
        ))}
      </div>
      {active === "objednavky" && <OrderHistory />}
      {active === "sledovani" && <OrderTracking />}
      {active === "oblibene" && <WishlistTab />}
      {active === "adresy" && <AddressesTab />}
      {active === "udaje" && <ProfileTab />}
    </div>
  );
}
