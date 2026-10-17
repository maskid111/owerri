import type { Metadata } from "next";
import { OrdersView } from "@/components/orders-view";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your cart, checkout and past orders from Owerri kitchens.",
};

export default function OrdersPage() {
  return <OrdersView />;
}
