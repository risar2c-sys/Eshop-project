import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);
const SHOP_EMAIL = "igel-cz@volny.cz";

type OrderItemInput = {
  name: string;
  price: number;
  quantity: number;
  productId?: string;
  variantLabel?: string;
};

async function decrementStock(item: OrderItemInput) {
  if (!item.productId) return;
  const product = await prisma.product.findUnique({ where: { slug: item.productId } });
  if (!product) return;

  if (item.variantLabel && product.variantsJson) {
    const variants = JSON.parse(product.variantsJson) as { label: string; price: number; stockCount: number }[];
    const updated = variants.map((v) =>
      v.label === item.variantLabel ? { ...v, stockCount: Math.max(0, v.stockCount - item.quantity) } : v
    );
    await prisma.product.update({
      where: { id: product.id },
      data: { variantsJson: JSON.stringify(updated) },
    });
  } else {
    const newStock = Math.max(0, product.stockCount - item.quantity);
    await prisma.product.update({
      where: { id: product.id },
      data: { stockCount: newStock, inStock: newStock > 0 },
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    email, firstName, lastName, phone,
    street, city, zip, note,
    shippingMethod, paymentMethod,
    items, total,
  } = body as {
    email: string; firstName: string; lastName: string; phone: string;
    street: string; city: string; zip: string; note?: string;
    shippingMethod: string; paymentMethod: string;
    items: OrderItemInput[]; total: number;
  };

  if (!email || !firstName || !items?.length) {
    return NextResponse.json({ error: "Chybí povinné údaje objednávky" }, { status: 400 });
  }

  const orderNumber = `OBJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      email, firstName, lastName, phone,
      street, city, zip, note,
      shippingMethod, paymentMethod,
      total,
      items: {
        create: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      },
    },
  });

  // Trvale odečteme množství skladem — pro produkty s velikostmi u té
  // konkrétní velikosti, jinak u základního skladu produktu.
  for (const item of items) {
    try {
      await decrementStock(item);
    } catch (err) {
      console.error("Odečtení skladu selhalo pro položku:", item.name, err);
    }
  }

  const itemsHtml = items
    .map((i) => `<li>${i.quantity}× ${i.name} — ${i.price * i.quantity} Kč</li>`)
    .join("");

  try {
    await resend.emails.send({
      from: "Čaj Koření Káva <onboarding@resend.dev>",
      to: SHOP_EMAIL,
      subject: `Nová objednávka ${orderNumber}`,
      html: `
        <h2>Nová objednávka ${orderNumber}</h2>
        <p><strong>${firstName} ${lastName}</strong><br/>
        ${email}<br/>${phone}</p>
        <p>${street}, ${city}, ${zip}</p>
        ${note ? `<p>Poznámka: ${note}</p>` : ""}
        <p>Doprava: ${shippingMethod}<br/>Platba: ${paymentMethod}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Celkem: ${total} Kč</strong></p>
      `,
    });
  } catch (err) {
    console.error("Odeslání e-mailu obchodu selhalo:", err);
  }

  try {
    await resend.emails.send({
      from: "Čaj Koření Káva <onboarding@resend.dev>",
      to: email,
      subject: `Potvrzení objednávky ${orderNumber} — Čaj Koření Káva`,
      html: `
        <h2>Děkujeme za objednávku!</h2>
        <p>Vaše objednávka <strong>${orderNumber}</strong> byla úspěšně přijata a zpracováváme ji.</p>
        <p>${firstName} ${lastName}<br/>${street}, ${city}, ${zip}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Celkem: ${total} Kč</strong></p>
        <p>Doprava: ${shippingMethod}<br/>Platba: ${paymentMethod}</p>
        <p>O dalším průběhu vás budeme informovat.</p>
      `,
    });
  } catch (err) {
    console.error("Odeslání potvrzení zákazníkovi selhalo:", err);
  }

  return NextResponse.json({ orderNumber, id: order.id });
}
