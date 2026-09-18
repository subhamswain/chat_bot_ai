import { useState } from "react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import HeroSection from "./components/dashboard/HeroSection";
import ServiceCards from "./components/dashboard/ServiceCards";
import LatestUpdates from "./components/dashboard/LatestUpdates";
import QuickLinks from "./components/dashboard/QuickLinks";

import ChatButton from "./components/chatbot/ChatButton";
import ChatWidget from "./components/chatbot/ChatWidget";

import "./App.css";

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleLogin = () => {
    setIsLoggedIn((previous) => !previous);
  };

  return (
    <div className="app">

      <Header
        isLoggedIn={isLoggedIn}
        onToggleLogin={toggleLogin}
      />

      <div className="app-body">

        <Sidebar
          isLoggedIn={isLoggedIn}
        />

        <main className="main-content">

          <HeroSection
            isLoggedIn={isLoggedIn}
            onOpenChat={() => setChatOpen(true)}
          />

          <ServiceCards
            isLoggedIn={isLoggedIn}
          />

          <div className="dashboard-grid">

            <LatestUpdates />

            <QuickLinks
              onOpenChat={() => setChatOpen(true)}
            />

          </div>

        </main>

      </div>

      <Footer />

      {!chatOpen && (
        <ChatButton
          onClick={() => setChatOpen(true)}
        />
      )}

      {chatOpen && (
        <ChatWidget
          onClose={() => setChatOpen(false)}
          isLoggedIn={isLoggedIn}
        />
      )}

    </div>
  );
}

export default App;