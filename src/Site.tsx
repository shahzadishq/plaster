import App from "./App";
import BlogIndex from "./routes/BlogIndex";
import PostView from "./routes/PostView";
import PageView from "./routes/PageView";

/** Public-site routing. Each route is a real URL; Cloudflare's SPA fallback
 *  serves index.html and we pick the view from the path (links are plain <a>). */
export default function Site() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return <App />;
  if (path === "/blog") return <BlogIndex />;
  if (path.startsWith("/blog/")) return <PostView slug={decodeURIComponent(path.slice(6))} />;
  return <PageView slug={decodeURIComponent(path.replace(/^\//, ""))} />;
}
