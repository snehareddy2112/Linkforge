import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  ExternalLink,
  Globe2,
  HeartPulse,
  Link2,
  MonitorSmartphone,
  QrCode,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

interface Props {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: Props) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <button className="landing-brand" onClick={() => window.scrollTo(0, 0)}>
          <span className="landing-logo">
            <Link2 size={18} />
          </span>
          LinkForge
        </button>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <button className="nav-launch" onClick={onLaunch}>
          Open dashboard
          <ArrowRight size={15} />
        </button>
      </nav>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-glow" />

          <div className="landing-badge">
            <Sparkles size={13} />
            Smart link infrastructure
          </div>

          <h1>
            One link.
            <br />
            <span>Any destination.</span>
          </h1>

          <p className="landing-subtitle">
            Create permanent smart links and dynamic QR codes that evolve
            after you share them. Route intelligently, track every visit and
            change destinations without breaking the link.
          </p>

          <div className="landing-actions">
            <button className="landing-primary" onClick={onLaunch}>
              Create a smart link
              <ArrowRight size={17} />
            </button>

            <a className="landing-secondary" href="#how-it-works">
              See how it works
            </a>
          </div>

          <div className="hero-trust">
            <span>
              <Check size={13} /> Dynamic QR
            </span>
            <span>
              <Check size={13} /> Device routing
            </span>
            <span>
              <Check size={13} /> Live analytics
            </span>
          </div>
        </section>

        <section className="product-preview">
          <div className="preview-window">
            <div className="preview-toolbar">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-address">
                <ShieldCheck size={12} />
                linkforge.app/dashboard
              </div>

              <span className="preview-live">
                <span />
                LIVE
              </span>
            </div>

            <div className="preview-body">
              <aside className="preview-sidebar">
                <div className="preview-brand">
                  <div>
                    <Link2 size={14} />
                  </div>
                  LinkForge
                </div>

                <div className="preview-nav active">
                  <Activity size={13} />
                  Overview
                </div>

                <div className="preview-nav">
                  <Link2 size={13} />
                  Smart links
                </div>

                <div className="preview-nav">
                  <BarChart3 size={13} />
                  Analytics
                </div>
              </aside>

              <div className="preview-content">
                <div className="preview-heading">
                  <div>
                    <span>OVERVIEW</span>
                    <h3>Your links, under control.</h3>
                  </div>

                  <button>
                    <span>+</span> New smart link
                  </button>
                </div>

                <div className="preview-stats">
                  <div>
                    <span>Total links</span>
                    <strong>24</strong>
                    <small>+4 this week</small>
                  </div>

                  <div>
                    <span>Total clicks</span>
                    <strong>8,429</strong>
                    <small>+18.4%</small>
                  </div>

                  <div>
                    <span>Active links</span>
                    <strong>21</strong>
                    <small>87.5% active</small>
                  </div>

                  <div>
                    <span>Healthy</span>
                    <strong>20</strong>
                    <small>All systems good</small>
                  </div>
                </div>

                <div className="preview-table">
                  <div className="preview-table-header">
                    <span>SMART LINKS</span>
                    <span>STATUS</span>
                    <span>CLICKS</span>
                  </div>

                  <PreviewRow
                    name="Product launch"
                    path="/launch"
                    clicks="2,814"
                  />

                  <PreviewRow
                    name="Portfolio"
                    path="/portfolio"
                    clicks="1,472"
                  />

                  <PreviewRow
                    name="Event registration"
                    path="/event"
                    clicks="896"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-problem">
          <span className="section-label">WHY LINKFORGE</span>

          <h2>
            A QR code gets printed.
            <br />
            <span>The destination shouldn't be permanent.</span>
          </h2>

          <div className="routing-demo">
            <div className="routing-node source-node">
              <div className="routing-icon">
                <QrCode size={25} />
              </div>
              <div>
                <span>PERMANENT</span>
                <strong>Same QR forever</strong>
                <small>linkforge.app/r/summer</small>
              </div>
            </div>

            <div className="routing-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="router-node">
              <Route size={20} />
              <span>SMART ROUTER</span>
            </div>

            <div className="routing-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="destination-stack">
              <div>
                <span>JUL</span>
                <strong>Summer sale</strong>
              </div>

              <div>
                <span>AUG</span>
                <strong>New arrivals</strong>
              </div>

              <div>
                <span>SEP</span>
                <strong>Fall collection</strong>
              </div>
            </div>
          </div>

          <p className="routing-caption">
            Change the destination whenever you need. Your short URL and
            already-printed QR code stay exactly the same.
          </p>
        </section>

        <section className="landing-features" id="features">
          <div className="section-heading">
            <span className="section-label">BUILT DIFFERENT</span>
            <h2>More than a URL shortener.</h2>
            <p>
              LinkForge treats every link as programmable infrastructure,
              not a disposable redirect.
            </p>
          </div>

          <div className="feature-grid">
            <Feature
              icon={<QrCode size={21} />}
              title="Dynamic QR"
              text="Change where an existing QR points without generating or printing it again."
            />

            <Feature
              icon={<MonitorSmartphone size={21} />}
              title="Device routing"
              text="Send mobile and desktop visitors to different destinations from one URL."
            />

            <Feature
              icon={<BarChart3 size={21} />}
              title="Click intelligence"
              text="Understand devices, browsers, operating systems and recent traffic."
            />

            <Feature
              icon={<HeartPulse size={21} />}
              title="Link health"
              text="Check whether your destination is reachable before your visitors discover a broken page."
            />

            <Feature
              icon={<ExternalLink size={21} />}
              title="Permanent aliases"
              text="Keep one memorable short URL while the destination evolves behind it."
            />

            <Feature
              icon={<Zap size={21} />}
              title="Instant control"
              text="Disable, reactivate or reroute a shared link from one dashboard."
            />
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="section-label">HOW IT WORKS</span>
            <h2>Share once. Control forever.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <div className="step-icon">
                <Link2 size={22} />
              </div>
              <h3>Create</h3>
              <p>
                Add your destination and choose a memorable custom alias.
              </p>
            </div>

            <div className="step-line" />

            <div className="step">
              <span>02</span>
              <div className="step-icon">
                <ScanLine size={22} />
              </div>
              <h3>Share</h3>
              <p>
                Use the short URL or generate a permanent dynamic QR.
              </p>
            </div>

            <div className="step-line" />

            <div className="step">
              <span>03</span>
              <div className="step-icon">
                <Globe2 size={22} />
              </div>
              <h3>Evolve</h3>
              <p>
                Change destinations, routing and status without changing what
                you shared.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-glow" />

          <span className="section-label">READY TO FORGE?</span>

          <h2>Stop treating links as disposable.</h2>

          <p>
            Build a smart link, generate its QR and keep control after it
            leaves your hands.
          </p>

          <button onClick={onLaunch}>
            Open LinkForge
            <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-brand footer-brand">
          <span className="landing-logo">
            <Link2 size={16} />
          </span>
          LinkForge
        </div>

        <span>Smart link infrastructure.</span>
      </footer>
    </div>
  );
}

function PreviewRow({
  name,
  path,
  clicks,
}: {
  name: string;
  path: string;
  clicks: string;
}) {
  return (
    <div className="preview-row">
      <div>
        <span className="preview-link-icon">
          <ExternalLink size={11} />
        </span>

        <div>
          <strong>{name}</strong>
          <small>linkforge.app{path}</small>
        </div>
      </div>

      <span className="preview-status">Active</span>

      <strong className="preview-clicks">{clicks}</strong>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}