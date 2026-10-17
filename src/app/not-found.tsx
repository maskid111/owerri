import { Arrow, ButtonLink, Photo } from "@/components/ui";
import { Design } from "@/components/design";
import { SigNotFound } from "@/components/sig/pages";

function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center py-14 text-center">
      <div className="relative size-40 overflow-hidden rounded-full sm:size-48">
        <Photo name="soups-spread" alt="Empty bowls and soups on a table" sizes="192px" />
      </div>
      <p className="mt-6 font-display text-6xl font-semibold text-forest">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-forest sm:text-4xl">This plate has been cleared.</h1>
      <p className="mt-3 max-w-md text-stone">The page you’re looking for doesn’t exist — but there’s plenty more on the menu.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">
          Back home <Arrow />
        </ButtonLink>
        <ButtonLink href="/explore" variant="outline">
          Explore Owerri
        </ButtonLink>
      </div>
    </section>
  );
}

export default function Page() {
  return <Design a={<NotFound />} b={<SigNotFound />} />;
}
