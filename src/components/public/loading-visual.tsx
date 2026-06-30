type LoadingVisualProps = {
  brandName?: string;
  className?: string;
};

function normalizeBrandName(value?: string) {
  return (value || "Lumiatech").replace(/[^a-z0-9]/gi, "").toUpperCase() || "LUMIATECH";
}

export function LoadingVisual({ brandName, className }: LoadingVisualProps) {
  const letters = normalizeBrandName(brandName).split("");

  return (
    <div className={className ? `loading-screen ${className}` : "loading-screen"} aria-busy="true" aria-label="Loading Lumiatech">
      <section className="loading-screen__shell">
        <div className="loading-screen__corner loading-screen__corner--tl" />
        <div className="loading-screen__corner loading-screen__corner--tr" />
        <div className="loading-screen__corner loading-screen__corner--bl" />
        <div className="loading-screen__corner loading-screen__corner--br" />

        <div className="loading-screen__topline">
          <span>ENGINEERING INTERFACE</span>
          <span>BOOT SEQUENCE</span>
        </div>

        <div className="loading-screen__core">
          <div className="loading-screen__orbit">
            <span className="loading-screen__orbit-node loading-screen__orbit-node--one" />
            <span className="loading-screen__orbit-node loading-screen__orbit-node--two" />
            <span className="loading-screen__orbit-node loading-screen__orbit-node--three" />
          </div>

          <div>
            <p className="loading-screen__eyebrow">Discover Engineering Technology</p>
            <h1 className="loading-screen__word" aria-label={letters.join("")}>
              {letters.map((letter, index) => (
                <span key={`${letter}-${index}`} style={{ animationDelay: `${index * 70}ms` }}>
                  {letter}
                </span>
              ))}
            </h1>
            <div className="loading-screen__status">
              <span>Syncing product data</span>
              <span>Preparing interface</span>
              <span>Routing locale content</span>
            </div>
          </div>
        </div>

        <div className="loading-screen__progress">
          <span />
        </div>
      </section>
    </div>
  );
}
