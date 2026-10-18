import type { Metadata } from "next";
import { SettingsView } from "./settings-view";
import { Design } from "@/components/design";
import { SigSettings } from "@/components/sig/pages";

export const metadata: Metadata = { title: "Settings", description: "Your Native preferences on this device." };

function SettingsPage() {
  return <SettingsView />;
}

export default function Page() {
  return <Design a={<SettingsPage />} b={<SigSettings />} />;
}
