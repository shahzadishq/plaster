import Shell from "@/components/Shell";
import { useContent } from "@/content/store";
import NotFound from "./NotFound";

export default function PageView({ slug }: { slug: string }) {
  const { pages } = useContent();
  const page = pages.items.find((p) => p.slug === slug);
  if (!page) return <NotFound />;
  return (
    <Shell>
      <article className="section">
        <div className="container container--narrow">
          <h1 className="page-title">{page.title}</h1>
          <div className="rich" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </div>
      </article>
    </Shell>
  );
}
