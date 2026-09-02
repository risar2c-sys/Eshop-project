import { z } from "zod";

export const shippingMethods = [
  { id: "zasilkovna", label: "Zásilkovna — výdejní místo", price: 59 },
  { id: "balikovna", label: "Balíkovna — výdejní místo", price: 55 },
  { id: "osobni-odber", label: "Osobní odběr na prodejně — Praha 7", price: 0 },
] as const;

export const paymentMethods = [
  { id: "apple-pay", label: "Apple Pay" },
  { id: "google-pay", label: "Google Pay" },
  { id: "karta-pri-vyzvednuti", label: "Platba kartou při vyzvednutí" },
  { id: "dobirka", label: "Dobírka (+ 40 Kč)" },
] as const;

const shippingIds = shippingMethods.map((m) => m.id) as [string, ...string[]];
const paymentIds = paymentMethods.map((m) => m.id) as [string, ...string[]];

export const checkoutSchema = z
  .object({
    createAccount: z.boolean().default(false),
    email: z.string().email("Zadejte platný e-mail"),
    firstName: z.string().min(1, "Zadejte jméno"),
    lastName: z.string().min(1, "Zadejte příjmení"),
    phone: z.string().min(9, "Zadejte platné telefonní číslo"),
    street: z.string().min(1, "Zadejte ulici a číslo popisné"),
    city: z.string().min(1, "Zadejte město"),
    zip: z.string().min(5, "Zadejte platné PSČ"),
    billingSameAsDelivery: z.boolean().default(true),
    billingCompany: z.string().optional(),
    billingIco: z.string().optional(),
    billingDic: z.string().optional(),
    billingStreet: z.string().optional(),
    billingCity: z.string().optional(),
    billingZip: z.string().optional(),
    note: z.string().optional(),
    shippingMethod: z.enum(shippingIds, { errorMap: () => ({ message: "Vyberte způsob dopravy" }) }),
    paymentMethod: z.enum(paymentIds, { errorMap: () => ({ message: "Vyberte způsob platby" }) }),
  })
  .refine(
    (data) => data.billingSameAsDelivery || (data.billingStreet && data.billingCity && data.billingZip),
    { message: "Vyplňte fakturační adresu", path: ["billingStreet"] }
  );

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
