import { fieldLabel, type Lang } from "./i18n";
import ImageField from "./ImageField";

type Props = {
  value: unknown;
  onChange: (next: unknown) => void;
  lang: Lang;
  keyName?: string;
  ui: Record<string, string>;
};

const COLOR_KEYS = new Set(["brand", "navy", "amber"]);
const IMAGE_KEYS = new Set(["image", "img", "cover"]);
const LONG_KEYS = new Set(["titleHtml", "desc", "text", "quote", "a", "sub", "lead", "cardText", "bodyHtml"]);

function isHex(v: string) {
  return /^#([0-9a-f]{3,8})$/i.test(v.trim());
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/** Build a blank copy of a template value (for "Add new item"). */
function blankLike(template: unknown): unknown {
  if (Array.isArray(template)) return [];
  if (template && typeof template === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(template)) out[k] = blankLike(v);
    return out;
  }
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  return "";
}

export default function Field({ value, onChange, lang, keyName, ui }: Props) {
  // ── string ───────────────────────────────────────────────
  if (typeof value === "string") {
    if (keyName && IMAGE_KEYS.has(keyName)) {
      return <ImageField value={value} onChange={onChange} lang={lang} />;
    }
    if ((keyName && COLOR_KEYS.has(keyName)) || isHex(value)) {
      return (
        <div className="cms-color">
          <input type="color" value={isHex(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)} />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    }
    const long = (keyName && LONG_KEYS.has(keyName)) || value.length > 70 || value.includes("\n");
    return long ? (
      <textarea className="cms-input" rows={Math.min(8, Math.max(2, Math.ceil(value.length / 60)))} value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input className="cms-input" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }

  // ── number ───────────────────────────────────────────────
  if (typeof value === "number") {
    return <input className="cms-input" type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />;
  }

  // ── boolean ──────────────────────────────────────────────
  if (typeof value === "boolean") {
    return (
      <label className="cms-switch">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <span />
      </label>
    );
  }

  // ── array ────────────────────────────────────────────────
  if (Array.isArray(value)) {
    const arr = value as unknown[];
    const set = (i: number, v: unknown) => {
      const next = arr.slice();
      next[i] = v;
      onChange(next);
    };
    const move = (i: number, dir: number) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return;
      const next = arr.slice();
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };
    const removeAt = (i: number) => onChange(arr.filter((_, k) => k !== i));
    const add = () => onChange([...arr, arr.length ? blankLike(arr[0]) : ""]);

    return (
      <div className="cms-list">
        {arr.map((item, i) => (
          <div className="cms-list__item" key={i}>
            <div className="cms-list__bar">
              <span className="cms-list__idx">#{i + 1}</span>
              <div className="cms-list__btns">
                <button type="button" onClick={() => move(i, -1)} title={ui.up}>↑</button>
                <button type="button" onClick={() => move(i, 1)} title={ui.down}>↓</button>
                <button type="button" className="cms-del" onClick={() => removeAt(i)} title={ui.remove}>✕</button>
              </div>
            </div>
            <Field value={item} onChange={(v) => set(i, v)} lang={lang} ui={ui} />
          </div>
        ))}
        <button type="button" className="cms-add" onClick={add}>+ {ui.add}</button>
      </div>
    );
  }

  // ── object ───────────────────────────────────────────────
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return (
      <div className="cms-object">
        {Object.entries(obj).map(([k, v]) => {
          const leaf = typeof v !== "object" || v === null;
          return (
            <div className={`cms-field${leaf ? " cms-field--leaf" : ""}`} key={k}>
              <label className="cms-label">{fieldLabel(k, lang)}</label>
              <Field value={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} lang={lang} keyName={k} ui={ui} />
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export { deepClone };
