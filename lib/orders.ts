export type OrderStatus = "zpracovává se" | "expedováno" | "doručeno";

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; quantity: number }[];
};

export const demoOrders: Order[] = [
  {
    id: "OBJ-2026-0148",
    date: "2026-07-15",
    status: "doručeno",
    total: 668,
    items: [{ name: "Assam TGFOP1", quantity: 2 }, { name: "Kurkuma mletá", quantity: 1 }],
  },
  {
    id: "OBJ-2026-0172",
    date: "2026-07-20",
    status: "expedováno",
    total: 329,
    items: [{ name: "Etiopie Yirgacheffe", quantity: 1 }],
  },
];
