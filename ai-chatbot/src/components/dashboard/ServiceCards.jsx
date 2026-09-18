import {
  FileCheck2,
  SearchCheck,
  MessageSquareWarning,
  Download,
  ArrowUpRight,
} from "lucide-react";

function ServiceCards() {

  const services = [
    {
      icon: FileCheck2,
      title: "Apply for Certificates",
      description:
        "Submit applications for investor certificates and related services.",
      count: "12 Services",
    },
    {
      icon: SearchCheck,
      title: "Track Applications",
      description:
        "Check application status, pending actions and updates.",
      count: "Track Now",
    },
    {
      icon: MessageSquareWarning,
      title: "Raise a Grievance",
      description:
        "Submit and track your grievance with complete transparency.",
      count: "Get Support",
    },
    {
      icon: Download,
      title: "Download Documents",
      description:
        "Access policies, circulars, certificates and other documents.",
      count: "Browse",
    },
  ];

  return (
    <section
      className="services-section"
      id="services"
    >

      <div className="section-heading">

        <div>
          <span className="section-eyebrow">
            SERVICES
          </span>

          <h2>
            How can we help you?
          </h2>
        </div>

        <button className="view-all-button">
          View all services
          <ArrowUpRight size={16} />
        </button>

      </div>

      <div className="service-grid">

        {services.map((service) => {

          const Icon = service.icon;

          return (
            <div
              className="service-card"
              key={service.title}
            >

              <div className="service-card-top">

                <div className="service-icon">
                  <Icon size={21} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="service-arrow"
                />

              </div>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.description}
              </p>

              <div className="service-card-footer">
                {service.count}
              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default ServiceCards;