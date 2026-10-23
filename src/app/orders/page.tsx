import type { Metadata } from "next";
import { OrdersView } from "@/components/orders-view";
import { Design } from "@/components/design";
import { SigOrders } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your cart, checkout and past orders from local kitchens.",
};

function OrdersPage() {
  return <OrdersView />;
}

export default function Page() {
  return <Design a={<OrdersPage />} b={<SigOrders />} />;
}
