import { MapPin, Phone, Mail, Globe, Facebook, Instagram } from "lucide-react";
import { asset } from "@/lib/asset";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <span className="footer__logo">
              <img src={asset("assets/Plaster-logo.webp")} alt="Pläster Gebäudereinigung GmbH Logo" width={210} height={52} />
            </span>
            <p className="footer__about">
              Ihr verlässlicher Partner für professionelle Gebäudereinigung in Emmendingen – seit 1982.
              Vertrauen. Qualität. Zuverlässigkeit.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Pläster auf Facebook"><Facebook /></a>
              <a href="#" aria-label="Pläster auf Instagram"><Instagram /></a>
              <a href="tel:+49764195257" aria-label="Pläster anrufen"><Phone /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Leistungen</h4>
            <ul>
              <li><a href="/#leistungen">Unterhaltsreinigung</a></li>
              <li><a href="/#leistungen">Glas- &amp; Fassadenreinigung</a></li>
              <li><a href="/#leistungen">Bauschlussreinigung</a></li>
              <li><a href="/#leistungen">Photovoltaik-Reinigung</a></li>
              <li><a href="/#leistungen">Reinraumreinigung</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Unternehmen</h4>
            <ul>
              <li><a href="/#ueber-uns">Über uns</a></li>
              <li><a href="/#referenzen">Referenzen</a></li>
              <li><a href="/#warum">Warum Pläster</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#kontakt">Kontakt</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Kontakt</h4>
            <ul className="footer__contact">
              <li><span className="footer__cicon"><MapPin /></span><span>Wiesenstraße 16<br />79312 Emmendingen</span></li>
              <li><span className="footer__cicon"><Phone /></span><a href="tel:+49764195257">+49 (0) 7641 95257</a></li>
              <li><span className="footer__cicon"><Mail /></span><a href="mailto:info@plaester.de">info@plaester.de</a></li>
              <li><span className="footer__cicon"><Globe /></span><a href="https://www.plaester.de">www.plaester.de</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Pläster Gebäudereinigung GmbH. Alle Rechte vorbehalten.</span>
          <span className="footer__legal">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
            <a href="/agb">AGB</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
