import Shell from "@/components/Shell";
import { asset } from "@/lib/asset";
import { useContent } from "@/content/store";
import NotFound from "./NotFound";

function fmtDate(d: string) {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default function PostView({ slug }: { slug: string }) {
  const { posts } = useContent();
  const post = posts.items.find((p) => p.slug === slug);
  if (!post) return <NotFound />;
  return (
    <Shell>
      <article className="section">
        <div className="container container--narrow">
          <a className="post-back" href="/blog">← Blog</a>
          <span className="blog-card__date">{fmtDate(post.date)}</span>
          <h1 className="page-title">{post.title}</h1>
          {post.cover && <img className="post-cover" src={asset(post.cover)} alt={post.title} />}
          <div className="rich" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        </div>
      </article>
    </Shell>
  );
}
