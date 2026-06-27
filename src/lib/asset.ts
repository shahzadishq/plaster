// Resolve a public asset path against the Vite base (/plaster/ on GitHub Pages).
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;
