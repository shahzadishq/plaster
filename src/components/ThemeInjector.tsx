import { useEffect } from "react";
import settings from "@/content/settings.json";

// Applies the CMS-managed brand colors as CSS variables so editing colors in
// the admin updates the whole site after a rebuild.
export default function ThemeInjector() {
  useEffect(() => {
    const c = settings.colors;
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
  }, []);
  return null;
}
