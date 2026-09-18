import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquareWarning,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
} from "lucide-react";

function Sidebar({ isLoggedIn }) {

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: true,
    },
    {
      icon: FileText,
      label: "My Applications",
      disabled: !isLoggedIn,
    },
    {
      icon: FolderOpen,
      label: "My Documents",
      disabled: !isLoggedIn,
    },
    {
      icon: MessageSquareWarning,
      label: "My Grievances",
      disabled: !isLoggedIn,
    },
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-section">

        <div className="sidebar-section-title">
          INVESTOR PORTAL
        </div>

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-menu-item ${
                item.active ? "active" : ""
              } ${item.disabled ? "disabled" : ""}`}
              disabled={item.disabled}
            >
              <Icon size={18} />

              <span>
                {item.label}
              </span>

              {item.active && (
                <ChevronRight
                  size={16}
                  className="menu-arrow"
                />
              )}
            </button>
          );
        })}

      </div>

      <div className="sidebar-section">

        <div className="sidebar-section-title">
          SUPPORT
        </div>

        <button className="sidebar-menu-item">

          <HelpCircle size={18} />

          <span>
            Help & Support
          </span>

        </button>

      </div>

      <div className="sidebar-assistance-card">

        <div className="sidebar-assistance-icon">
          ✦
        </div>

        <div>

          <strong>
            Need Assistance?
          </strong>

          <p>
            Nova AI is available 24/7
            to help you.
          </p>

        </div>

      </div>

      <div className="sidebar-security">

        <ShieldCheck size={16} />

        <span>
          Secure & Protected
        </span>

      </div>

      <div className="sidebar-last-login">

        <Clock size={14} />

        <span>
          Last login: Today, 09:42 AM
        </span>

      </div>

    </aside>
  );
}

export default Sidebar;