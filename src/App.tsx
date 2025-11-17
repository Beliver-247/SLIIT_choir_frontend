import { useState, useEffect } from "react";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Events } from "./components/Events";
import { CarolService } from "./components/CarolService";
import { Donation } from "./components/Donation";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { MembersPortal } from "./components/MembersPortal";
import { LoginModal } from "./components/LoginModal";
import AuthSuccess from "./components/AuthSuccess";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "members" | "auth-success">(() => {
    if (window.location.pathname === "/members") return "members";
    if (window.location.pathname === "/auth-success") return "auth-success";
    return "home";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const token = localStorage.getItem("authToken");
    const member = localStorage.getItem("member");

    if (token && member) {
      try {
        const memberData = JSON.parse(member);
        setMemberName(`${memberData.firstName} ${memberData.lastName}`);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse member data:", error);
      }
    }

    // Listen for userLoggedIn events from Google OAuth callback
    const handleUserLoggedIn = (event: Event) => {
      const customEvent = event as CustomEvent;
      const memberData = customEvent.detail;
      setMemberName(`${memberData.firstName} ${memberData.lastName}`);
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setCurrentPage("members");
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    return () => window.removeEventListener("userLoggedIn", handleUserLoggedIn);
  }, []);


  // Sync currentPage with URL path on popstate (browser navigation)
  useEffect(() => {
    const syncPageWithPath = () => {
      if (window.location.pathname === "/members") setCurrentPage("members");
      else if (window.location.pathname === "/auth-success") setCurrentPage("auth-success");
      else setCurrentPage("home");
    };
    window.addEventListener("popstate", syncPageWithPath);
    return () => window.removeEventListener("popstate", syncPageWithPath);
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };


  const handleLogin = (name: string) => {
    setMemberName(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setCurrentPage("members");
    window.history.pushState({}, "", "/members");
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setMemberName("");
    setCurrentPage("home");
    window.history.pushState({}, "", "/");
    localStorage.removeItem("authToken");
    localStorage.removeItem("member");
  };


  const navigateToHome = () => {
    setCurrentPage("home");
    window.history.pushState({}, "", "/");
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
      
      {currentPage === "auth-success" ? (
        <AuthSuccess />
      ) : currentPage === "home" ? (
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
