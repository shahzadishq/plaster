import { useEffect } from "react";
import { useContent } from "@/content/store";

// Applies the CMS-managed brand colors as CSS variables so editing colors in
// the admin updates the whole site (instantly in the live preview).
export default function ThemeInjector() {
  const { settings } = useContent();
  const c = settings.colors;
  useEffect(() => {
    const root = document.documentElement;
    if (c.brand) root.style.setProperty("--brand", c.brand);
    if (c.navy) {
      root.style.setProperty("--brand-navy", c.navy);
      root.style.setProperty("--color-primary", c.navy);
    }
    if (c.amber) {
      root.style.setProperty("--accent-amber", c.amber);
      root.style.setProperty("--brand-amber", c.amber);
    }
  }, [c.brand, c.navy, c.amber]);
  return null;
}
