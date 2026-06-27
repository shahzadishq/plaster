import { Phone, Send } from "lucide-react";

export default function CallBar() {
  return (
    <div className="callbar" aria-label="Schnellkontakt">
      <a className="callbar__btn callbar__btn--call" href="tel:+49764195257"><Phone /> Anrufen</a>
      <a className="callbar__btn callbar__btn--quote" href="#kontakt"><Send /> Angebot</a>
    </div>
  );
}
