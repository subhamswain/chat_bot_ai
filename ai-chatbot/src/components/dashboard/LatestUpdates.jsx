import {
  BellRing,
  ArrowUpRight,
} from "lucide-react";

import { latestUpdates } from "../../data/dummyData";

function LatestUpdates() {

  return (
    <section className="updates-card">

      <div className="card-heading">

        <div>

          <span className="section-eyebrow">
            INFORMATION
          </span>

          <h2>
            Latest Updates
          </h2>

        </div>

        <button className="small-icon-button">
          <ArrowUpRight size={17} />
        </button>

      </div>

      <div className="updates-list">

        {latestUpdates.map((item, index) => (

          <div
            className="update-item"
            key={index}
          >

            <div className="update-icon">
              <BellRing size={16} />
            </div>

            <div className="update-content">

              <div className="update-meta">

                <span>
                  {item.category}
                </span>

                <time>
                  {item.date}
                </time>

              </div>

              <strong>
                {item.title}
              </strong>

            </div>

            <ArrowUpRight
              size={15}
              className="update-arrow"
            />

          </div>

        ))}

      </div>

    </section>
  );
}

export default LatestUpdates;