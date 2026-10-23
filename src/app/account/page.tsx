import type { Metadata } from "next";
import { AccountView } from "@/components/auth/account";
import { Design } from "@/components/design";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Your Native profile, orders and saved places.",
  robots: { index: false },
};

/** Protected-style page: visitors see a sign-in prompt; signed-in members see their profile. */
export default function Page() {
  return <Design a={<AccountView variant="a" />} b={<AccountView variant="b" />} />;
}
