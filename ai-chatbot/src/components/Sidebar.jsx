import {
  Plus,
  Search,
  Home,
  Compass,
  Library,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  Folder,
} from "lucide-react";

function Sidebar() {

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="brand">

        <div className="brand-icon">
          ✦
        </div>

        <div>
          <strong>Nova AI</strong>
          <small>Think · Build · Solve</small>
        </div>

      </div>


      {/* NEW CHAT */}

      <button className="new-chat">
        <Plus size={18} />
        New Chat
      </button>


      {/* SEARCH */}

      <button className="sidebar-search">
        <Search size={16} />
        Search conversations
      </button>


      {/* NAVIGATION */}

      <nav className="main-navigation">

        <NavItem icon={Home} label="Home" active />

        <NavItem icon={Compass} label="Explore" />

        <NavItem icon={Library} label="Library" />

        <NavItem icon={Folder} label="Workspace" />

      </nav>


      {/* RECENT */}

      <div className="sidebar-heading">
        Recent Chats
      </div>

      <div className="recent-chats">

        <ChatItem
          title="Django REST Framework"
          time="2 min ago"
          active
        />

        <ChatItem
          title="React Project Setup"
          time="1 hour ago"
        />

        <ChatItem
          title="API Testing Guide"
          time="Yesterday"
        />

        <ChatItem
          title="Trading Algorithm Idea"
          time="Yesterday"
        />

        <ChatItem
          title="Python Code Review"
          time="2 days ago"
        />

        <ChatItem
          title="System Design Discussion"
          time="3 days ago"
        />

      </div>


      {/* STARRED */}

      <div className="sidebar-heading starred-heading">
        <Star size={13} />
        Starred
      </div>

      <div className="starred-items">

        <button>
          <MessageSquare size={14} />
          Important Notes
        </button>

        <button>
          <MessageSquare size={14} />
          Learning Roadmap
        </button>

        <button>
          <MessageSquare size={14} />
          Interview Preparation
        </button>

      </div>


      {/* BOTTOM */}

      <div className="sidebar-bottom">

        <button>
          <Settings size={17} />
          Settings
        </button>

        <button>
          <HelpCircle size={17} />
          Help & Feedback
        </button>

        <div className="user-card">

          <div className="user-avatar">
            SB
          </div>

          <div>
            <strong>Subham Swain</strong>
            <small>subham@example.com</small>
          </div>

        </div>

      </div>

    </aside>
  );
}


function NavItem({ icon: Icon, label, active }) {

  return (
    <button className={active ? "nav-item active" : "nav-item"}>

      <Icon size={17} />

      {label}

    </button>
  );
}


function ChatItem({ title, time, active }) {

  return (
    <button className={active ? "chat-item active" : "chat-item"}>

      <MessageSquare size={14} />

      <div>
        <strong>{title}</strong>
        <small>{time}</small>
      </div>

    </button>
  );
}


export default Sidebar;