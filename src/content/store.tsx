import { createContext, useContext, type ReactNode } from "react";
import settings from "./settings.json";
import homepage from "./homepage.json";
import services from "./services.json";
import faq from "./faq.json";
import pages from "./pages.json";
import posts from "./posts.json";

export type SiteContent = {
  settings: typeof settings;
  homepage: typeof homepage;
  services: typeof services;
  faq: typeof faq;
  pages: typeof pages;
  posts: typeof posts;
};

/** The content bundled with the build — used by the live site and as the
 *  starting point the admin loads for editing / live preview. */
export const defaultContent: SiteContent = { settings, homepage, services, faq, pages, posts };

const ContentContext = createContext<SiteContent>(defaultContent);

export const useContent = () => useContext(ContentContext);

/** Wraps the app. The admin passes a `value` to drive an instant live preview;
 *  the public site omits it and renders the bundled content. */
export function ContentProvider({ value, children }: { value?: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={value ?? defaultContent}>{children}</ContentContext.Provider>;
}
