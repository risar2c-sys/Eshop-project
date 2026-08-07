# Čaj Koření Káva — e-shop

## DŮLEŽITÉ — máš už rozdělaný projekt s vlastními produkty!
Tahle verze přidává výběr velikosti balení (50 g / 100 g / 1 kg...). Abys o svoji
práci nepřišel, **NESPOUŠTĚJ `npm run db:seed`** — jen zkopíruj svůj starý databázový
soubor `dev.db` do téhle nové složky (z té staré, kde jsi pracoval) a spusť jen
migraci pro nové pole (krok 4 níže).

## Spuštění
```bash
cp .env.example .env.local
cp .env.local .env
npm install
```

Zkopíruj svůj starý `dev.db` (z předchozí složky) do kořene této nové složky —
stejně jako `.env`, `.env.local`.

```bash
npx prisma migrate dev --name add_variants
npm run dev
```

Otevře se na `http://localhost:3000`.

Pokud tohle spouštíš úplně poprvé (nemáš žádnou starou databázi), použij místo
`add_variants` migrace `init` a přidej `npm run db:seed` pro ukázková data.

## Přihlášení
- e-mail: `richard@cajkorenikava.cz`
- heslo: `heslo123`

## Nové: výběr velikosti balení
V administraci (`/admin/produkty/novy` nebo úprava existujícího produktu) je
sekce "Výběr velikosti balení" — přidáš tam řádky typu `50 g` / `109 Kč` / `20 ks`,
`100 g` / `189 Kč` / `34 ks` atd. Pokud u produktu žádnou velikost nepřidáš,
chová se jako dřív (jedna cena, jedna hmotnost).

Na stránce produktu se pak zákazníkovi zobrazí tlačítka s velikostmi k výběru,
v košíku i pokladně se u položky ukazuje, jakou velikost si vybral.

## Administrace (/admin)
- Přehled, Produkty (přidání/úprava/mazání, fotky, varianty velikosti)

## Další kroky
1. Admin: správa objednávek a kupónů
2. Reálné platby (GoPay, Stripe, Comgate)
3. Nahrazení zbývajícího demo obsahu za reálný, doplnění fotek
4. Nasazení na Blueboard
