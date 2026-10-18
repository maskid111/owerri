import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { SavedList } from "./saved-list";
import { Design } from "@/components/design";
import { SigSaved } from "@/components/sig/client-pages";

export const metadata: Metadata = {
  title: "Saved",
  description: "Restaurants, places and events you’ve saved on Native.",
};

function SavedPage() {
  return (
    <>
      <PageHeader title="Saved" description="Tap the heart on any restaurant, place or event to keep it here. Your list is stored on this device." />
      <section className="container-x pt-4 pb-12">
        <SavedList />
      </section>
    </>
  );
}

export default function Page() {
  return <Design a={<SavedPage />} b={<SigSaved />} />;
}
