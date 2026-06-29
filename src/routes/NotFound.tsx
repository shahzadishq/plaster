import Shell from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <section className="section">
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <h1 className="page-title">Seite nicht gefunden</h1>
          <p className="section-sub">Die angeforderte Seite existiert nicht.</p>
          <a className="btn btn--primary" href="/">Zur Startseite</a>
        </div>
      </section>
    </Shell>
  );
}
