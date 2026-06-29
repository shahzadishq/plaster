import Shell from "@/components/Shell";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";

function fmtDate(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogIndex() {
  const { posts } = useContent();
  const items = [...posts.items].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <Shell>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Blog</span>
            <h1 className="section-title">Aktuelles &amp; <em>Einblicke</em></h1>
          </div>
          <div className="blog-grid">
            {items.map((p) => (
              <a className="blog-card" href={`/blog/${p.slug}`} key={p.slug}>
                {p.cover && <div className="blog-card__media"><img src={asset(p.cover)} alt={p.title} loading="lazy" /></div>}
                <div className="blog-card__body">
                  <span className="blog-card__date">{fmtDate(p.date)}</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="blog-card__more">Weiterlesen →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
