import { useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { api } from "./api";
import type { Lang } from "./i18n";

const T = {
  de: { upload: "Bild hochladen", change: "Bild ändern", uploading: "Wird hochgeladen …", path: "Pfad", hint: "JPG, PNG oder WebP. Erscheint nach dem Speichern auf der Website." },
  en: { upload: "Upload image", change: "Change image", uploading: "Uploading …", path: "Path", hint: "JPG, PNG or WebP. Appears on the site after saving." },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ImageField({ value, onChange, lang }: { value: string; onChange: (v: string) => void; lang: Lang }) {
  const t = T[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    setPreview(URL.createObjectURL(file)); // instant local preview
    try {
      const b64 = await fileToBase64(file);
      const res = await api.upload(file.name, b64);
      onChange(res.path);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : String(e2));
      setPreview("");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const src = preview || (value ? asset(value) : "");
  return (
    <div className="cms-image">
      <div className="cms-image__preview">
        {src ? <img src={src} alt="" /> : <span className="cms-image__empty">—</span>}
      </div>
      <div className="cms-image__controls">
        <input className="cms-input" type="text" value={value} placeholder="assets/…" onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="cms-btn" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? t.uploading : value ? t.change : t.upload}
        </button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
        {err && <span className="cms-image__err">{err}</span>}
        <span className="cms-image__hint">{t.hint}</span>
      </div>
    </div>
  );
}
