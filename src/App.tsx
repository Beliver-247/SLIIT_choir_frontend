import { useState } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Events } from "./components/Events";
import { CarolService } from "./components/CarolService";
import { Donation } from "./components/Donation";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { MembersPortal } from "./components/MembersPortal";
import { LoginModal } from "./components/LoginModal";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "members">("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [memberName, setMemberName] = useState("");

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogin = (name: string) => {
    setMemberName(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setCurrentPage("members");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMemberName("");
    setCurrentPage("home");
  };

  const navigateToHome = () => {
    setCurrentPage("home");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onHomeClick={navigateToHome}
        isLoggedIn={isLoggedIn}
        memberName={memberName}
        currentPage={currentPage}
      />
      
      {currentPage === "home" ? (
        <>
          <Hero />
          <About />
          <Events />
          <CarolService />
          <Donation />
          <Footer />
        </>
      ) : (
        <MembersPortal memberName={memberName} />
      )}

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
