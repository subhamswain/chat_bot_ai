import {
  ArrowRight,
  PlayCircle,
  Sparkles,
} from "lucide-react";

function HeroSection({
  isLoggedIn,
  onOpenChat,
}) {

  return (
    <section className="hero-section">

      <div className="hero-content">

        <div className="hero-label">
          <span className="hero-label-dot" />
          SECURITIES & INVESTOR SERVICES
        </div>

        <h1>
          Empowering Investors,
          <br />
          <span>
            Building Trust.
          </span>
        </h1>

        <p>
          Access investor services, track your
          applications, manage grievances and get
          instant assistance from our AI-powered
          digital assistant.
        </p>

        <div className="hero-actions">

          <button className="primary-button">
            Explore Services
            <ArrowRight size={17} />
          </button>

          <button className="secondary-button">
            <PlayCircle size={17} />
            How it works
          </button>

        </div>

        <div className="hero-status">

          <div className="hero-status-item">
            <span className="status-check">
              ✓
            </span>

            <span>
              Secure Services
            </span>
          </div>

          <div className="hero-status-item">
            <span className="status-check">
              ✓
            </span>

            <span>
              24/7 Assistance
            </span>
          </div>

          <div className="hero-status-item">
            <span className="status-check">
              ✓
            </span>

            <span>
              Multilingual Support
            </span>
          </div>

        </div>

      </div>

      <div className="hero-visual">

        <div className="hero-building">

          <div className="building-top">
            SWS
          </div>

          <div className="building-columns">

            <div />
            <div />
            <div />
            <div />
            <div />

          </div>

          <div className="building-door" />

        </div>

        <div className="hero-ai-card">

          <div className="hero-ai-icon">
            <Sparkles size={18} />
          </div>

          <div>

            <strong>
              Nova AI Assistant
            </strong>

            <span>
              {isLoggedIn
                ? "Ready to assist you"
                : "Available for general queries"}
            </span>

          </div>

          <button onClick={onOpenChat}>
            Open
          </button>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;