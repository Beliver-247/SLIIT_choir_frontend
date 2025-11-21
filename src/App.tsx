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
import { RegistrationModal } from "./components/RegistrationModal";
import AuthSuccess from "./components/AuthSuccess";
import { EventCreation } from "./components/EventCreation";
import PracticeScheduleCreation from "./components/PracticeScheduleCreation";
import AttendanceTaking from "./components/AttendanceTaking";
import AttendanceAnalytics from "./components/AttendanceAnalytics";
import MemberAttendanceReport from "./components/MemberAttendanceReport";
import MyOrdersPage from "./components/MyOrdersPage";
import MerchandiseItemPage from "./components/MerchandiseItemPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "members" | "auth-success" | "create-event" | "create-schedule" | "attendance" | "attendance-analytics" | "member-report" | "my-orders" | "merchandise-item">(() => {
    const path = window.location.pathname;
    if (path === "/members") return "members";
    if (path === "/auth-success") return "auth-success";
    if (path === "/create-event") return "create-event";
    if (path === "/create-schedule") return "create-schedule";
    if (path === "/attendance") return "attendance";
    if (path === "/attendance-analytics") return "attendance-analytics";
    if (path.startsWith("/member-report/")) return "member-report";
    if (path === "/my-orders") return "my-orders";
    if (path.startsWith("/merchandise/")) return "merchandise-item";
    return "home";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
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
  }, []);

  // Sync currentPage with URL path on popstate (browser navigation)
  useEffect(() => {
    const syncPageWithPath = () => {
      const path = window.location.pathname;
      if (path === "/members") setCurrentPage("members");
      else if (path === "/auth-success") setCurrentPage("auth-success");
      else if (path === "/create-event") setCurrentPage("create-event");
      else if (path === "/create-schedule") setCurrentPage("create-schedule");
      else if (path === "/attendance") setCurrentPage("attendance");
      else if (path === "/attendance-analytics") setCurrentPage("attendance-analytics");
      else if (path.startsWith("/member-report/")) setCurrentPage("member-report");
      else if (path === "/my-orders") setCurrentPage("my-orders");
      else if (path.startsWith("/merchandise/")) setCurrentPage("merchandise-item");
      else setCurrentPage("home");
    };
    window.addEventListener("popstate", syncPageWithPath);
    return () => window.removeEventListener("popstate", syncPageWithPath);
  }, []);

  const handleLoginClick = () => {
    setShowRegistrationModal(false);
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(true);
  };

  const handleLogin = (name: string) => {
    setMemberName(name);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setCurrentPage("members");
    window.history.pushState({}, "", "/members");
  };

  const handleRegister = (name: string) => {
    setMemberName(name);
    setIsLoggedIn(true);
    setShowRegistrationModal(false);
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

  const handleAnalyticsClick = () => {
    setCurrentPage("attendance-analytics");
    window.history.pushState({}, "", "/attendance-analytics");
  };

  const handleMyOrdersClick = () => {
    setCurrentPage("my-orders");
    window.history.pushState({}, "", "/my-orders");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onHomeClick={navigateToHome}
        onCreateEventClick={() => {
          setCurrentPage("create-event");
          window.history.pushState({}, "", "/create-event");
        }}
        onCreateScheduleClick={() => {
          setCurrentPage("create-schedule");
          window.history.pushState({}, "", "/create-schedule");
        }}
        onAnalyticsClick={handleAnalyticsClick}
        onMyOrdersClick={handleMyOrdersClick}
        isLoggedIn={isLoggedIn}
        memberName={memberName}
        currentPage={currentPage}
      />
      
      {currentPage === "auth-success" ? (
        <AuthSuccess />
      ) : currentPage === "create-event" ? (
        <EventCreation 
          onEventCreated={() => {
            setCurrentPage("members");
            window.history.pushState({}, "", "/members");
          }}
          onCancel={() => {
            setCurrentPage("members");
            window.history.pushState({}, "", "/members");
          }}
        />
      ) : currentPage === "create-schedule" ? (
        <PracticeScheduleCreation
          onScheduleCreated={() => {
            setCurrentPage("members");
            window.history.pushState({}, "", "/members");
          }}
        />
      ) : currentPage === "attendance" ? (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Take Attendance</h1>
              <p className="text-gray-600">Mark attendance for members in events or practice schedules</p>
            </div>
            <AttendanceTaking 
              onClose={() => {
                setCurrentPage("members");
                window.history.pushState({}, "", "/members");
              }}
            />
          </div>
        </div>
      ) : currentPage === "attendance-analytics" ? (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AttendanceAnalytics />
          </div>
        </div>
      ) : currentPage === "member-report" ? (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(() => {
              const memberId = window.location.pathname.split("/member-report/")[1];
              return memberId ? (
                <MemberAttendanceReport memberId={memberId} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Invalid member ID</p>
                </div>
              );
            })()}
          </div>
        </div>
      ) : currentPage === "home" ? (
        <>
          <Hero />
          <About />
          <Events />
          <CarolService />
          <Donation />
          <Footer />
        </>
      ) : currentPage === "my-orders" ? (
        <MyOrdersPage />
      ) : currentPage === "merchandise-item" ? (
        (() => {
          const merchandiseId = window.location.pathname.split("/merchandise/")[1];
          return merchandiseId ? (
            <MerchandiseItemPage itemId={merchandiseId} />
          ) : (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-600">Invalid merchandise item</p>
              </div>
            </div>
          );
        })()
      ) : (
        <MembersPortal memberName={memberName} />
      )}

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={handleRegisterClick}
      />

      <RegistrationModal 
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegister={handleRegister}
        onSwitchToLogin={handleLoginClick}
      />
    </div>
  );
}
