import {
  ExternalLink,
  ArrowRight,
} from "lucide-react";

import { quickLinks } from "../../data/dummyData";

function QuickLinks({
  onOpenChat,
}) {

  return (
    <section className="quick-links-card">

      <div className="card-heading">

        <div>

          <span className="section-eyebrow">
            QUICK ACCESS
          </span>

          <h2>
            Helpful Resources
          </h2>

        </div>

      </div>

      <div className="quick-links-list">

        {quickLinks.map((link) => (

          <button
            key={link}
            className="quick-link"
          >

            <span>
              {link}
            </span>

            <ExternalLink size={15} />

          </button>

        ))}

      </div>

      <div className="quick-ai-box">

        <div className="quick-ai-symbol">
          ✦
        </div>

        <div>

          <strong>
            Can't find what you need?
          </strong>

          <p>
            Ask Nova AI and get instant
            assistance.
          </p>

        </div>

        <button onClick={onOpenChat}>
          <ArrowRight size={17} />
        </button>

      </div>

    </section>
  );
}

export default QuickLinks;