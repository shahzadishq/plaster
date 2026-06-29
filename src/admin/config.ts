// Base URL of the standalone auth/save worker (cms-auth-worker).
export const WORKER_BASE = "https://plaster-cms-auth.shahzadishaq.workers.dev";

// Which content files map to which draft slices, and where they live in the repo.
export const CONTENT_FILES = {
  homepage: "src/content/homepage.json",
  services: "src/content/services.json",
  faq: "src/content/faq.json",
  settings: "src/content/settings.json",
  pages: "src/content/pages.json",
  posts: "src/content/posts.json",
} as const;
