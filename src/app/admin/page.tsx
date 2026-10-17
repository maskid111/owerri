import type { Metadata } from "next";
import { AppearanceSettings } from "./appearance-settings";
import { Design } from "@/components/design";
import { SigAdmin } from "@/components/sig/pages";

export const metadata: Metadata = {
  title: "Admin · Website Design",
  description: "Prototype admin settings for Native Kitchen.",
  robots: { index: false },
};

function AdminPage() {
  return <AppearanceSettings />;
}

export default function Page() {
  return <Design a={<AdminPage />} b={<SigAdmin />} />;
}
