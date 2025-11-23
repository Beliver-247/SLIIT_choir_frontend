import { Menu, LogOut, User, Home, ShoppingBag, CalendarPlus, ClipboardList, BarChart3, Sparkles, PhoneCall, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { canCreateEvents, canCreateSchedules } from "../utils/roleUtils";
import CarolsLogo from "../Assets/CarolsLogo.png";

interface NavigationProps {
  onLoginClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  onCreateEventClick: () => void;
  onCreateScheduleClick: () => void;
  onAnalyticsClick: () => void;
  onMyOrdersClick: () => void;
  isLoggedIn: boolean;
  memberName: string;
  currentPage: "home" | "members" | "auth-success" | "create-event" | "create-schedule" | "attendance" | "attendance-analytics" | "member-report" | "my-orders" | "merchandise-item";
}

export function Navigation({ 
  onLoginClick, 
  onLogout, 
  onHomeClick,
  onCreateEventClick,
  onCreateScheduleClick,
  onAnalyticsClick,
  onMyOrdersClick,
  isLoggedIn, 
  memberName,
  currentPage 
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canCreate = isLoggedIn && canCreateEvents();
  const canCreateSched = isLoggedIn && canCreateSchedules();
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-brand-navy/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onHomeClick} className="flex items-center hover:opacity-80 transition-opacity">
              <img src={CarolsLogo} alt="SLIIT Choir" className="h-12 w-auto object-contain" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {currentPage === "home" ? (
                <>
                  <a href="#about" className="flex items-center gap-2 text-brand-navy/80 hover:text-brand-orange transition-colors">
                    <Sparkles className="h-4 w-4 text-brand-orange" />
                    About
                  </a>
                  <a href="#events" className="flex items-center gap-2 text-brand-navy/80 hover:text-brand-orange transition-colors">
                    <CalendarPlus className="h-4 w-4 text-brand-orange" />
                    Events
                  </a>
                  <a href="#donate" className="flex items-center gap-2 text-brand-navy/80 hover:text-brand-orange transition-colors">
                    <Gift className="h-4 w-4 text-brand-orange" />
                    Donate
                  </a>
                </>
              ) : (
                <button onClick={onHomeClick} className="flex items-center gap-2 text-brand-navy/80 hover:text-brand-orange transition-colors">
                  <Home className="h-4 w-4" />
                  Home
                </button>
              )}

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {currentPage !== "members" && (
                    <Button
                      onClick={() => {
                        window.history.pushState({}, "", "/members");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Member Portal
                    </Button>
                  )}
                  {isLoggedIn && currentPage !== "my-orders" && (
                    <Button
                      onClick={onMyOrdersClick}
                      variant="outline"
                      className="gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      My Orders
                    </Button>
                  )}
                  {canCreate && currentPage === "members" && (
                    <Button
                      onClick={onCreateEventClick}
                      className="bg-brand-orange hover:bg-brand-orange/90 gap-2"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Create Event
                    </Button>
                  )}
                  {canCreateSched && currentPage === "members" && (
                    <Button
                      onClick={onCreateScheduleClick}
                      className="bg-brand-purple hover:bg-brand-purple/90 gap-2"
                    >
                      <ClipboardList className="h-4 w-4" />
                      Create Schedule
                    </Button>
                  )}
                  {canCreate && currentPage === "members" && (
                    <Button
                      onClick={onAnalyticsClick}
                      className="bg-brand-green hover:bg-brand-green/90 gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Attendance Analytics
                    </Button>
                  )}
                  <div className="flex items-center gap-2 text-brand-navy">
                    <User className="h-4 w-4" />
                    <span>{memberName}</span>
                  </div>
                  <Button onClick={onLogout} variant="outline" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={onLoginClick} className="bg-brand-blue hover:bg-brand-blue/90">
                  Members Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6 text-brand-navy" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[70] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl border-l border-brand-blue/20 z-[80] md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="pt-6 pb-10 px-6 space-y-6 overflow-y-auto h-full">
                <div className="flex items-center gap-3 pb-4 border-b border-brand-navy/10">
                  <img src={CarolsLogo} alt="SLIIT Choir" className="h-12 w-auto object-contain" />
                  <p className="text-base font-semibold text-brand-navy">Quick Navigation</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Main Sections</p>
                  {currentPage === "home" ? (
                    <div className="grid gap-2">
                      {[{ label: "About", href: "#about" }, { label: "Events", href: "#events" }, { label: "Carol Service", href: "#carol-service" }, { label: "Donate", href: "#donate" }].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-2xl border border-brand-blue/15 bg-white px-4 py-3 text-sm font-medium text-brand-navy/80 shadow-sm hover:border-brand-orange/40 hover:text-brand-orange transition"
                        >
                          <Sparkles className="h-4 w-4 text-brand-orange" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onHomeClick();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 rounded-2xl border border-brand-blue/15 bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-orange/40 hover:text-brand-orange transition"
                    >
                      <Home className="h-4 w-4 text-brand-blue" />
                      Back to Home
                    </button>
                  )}
                </div>

                {isLoggedIn ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Member Actions</p>
                    {currentPage !== "members" && (
                      <Button
                        onClick={() => {
                          window.history.pushState({}, "", "/members");
                          window.dispatchEvent(new PopStateEvent("popstate"));
                          closeMenu();
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 rounded-2xl border-brand-navy/20 bg-white text-brand-navy"
                      >
                        <Home className="h-4 w-4 text-brand-blue" />
                        Member Portal
                      </Button>
                    )}
                    {isLoggedIn && currentPage !== "my-orders" && (
                      <Button
                        onClick={() => {
                          onMyOrdersClick();
                          closeMenu();
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 rounded-2xl border-brand-navy/20 bg-white text-brand-navy"
                      >
                        <ShoppingBag className="h-4 w-4 text-brand-blue" />
                        My Orders
                      </Button>
                    )}
                    {canCreate && currentPage === "members" && (
                      <Button
                        onClick={() => {
                          onCreateEventClick();
                          closeMenu();
                        }}
                        className="w-full justify-start gap-3 rounded-2xl bg-brand-orange hover:bg-brand-orange/90 text-white"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Create Event
                      </Button>
                    )}
                    {canCreateSched && currentPage === "members" && (
                      <Button
                        onClick={() => {
                          onCreateScheduleClick();
                          closeMenu();
                        }}
                        className="w-full justify-start gap-3 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white"
                      >
                        <ClipboardList className="h-4 w-4" />
                        Create Schedule
                      </Button>
                    )}
                    {canCreate && currentPage === "members" && (
                      <Button
                        onClick={() => {
                          onAnalyticsClick();
                          closeMenu();
                        }}
                        className="w-full justify-start gap-3 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Attendance Analytics
                      </Button>
                    )}
                    <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm">
                      <div className="h-9 w-9 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-brand-navy/70">Signed in as</p>
                        <p className="font-semibold text-brand-navy">{memberName}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        onLogout();
                        closeMenu();
                      }}
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-2xl border-2 border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-blue/5"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Members</p>
                    <Button
                      onClick={() => {
                        onLoginClick();
                        closeMenu();
                      }}
                      className="w-full justify-center gap-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/90"
                    >
                      <User className="h-4 w-4" />
                      Members Login
                    </Button>
                    <p className="text-xs text-brand-gray">
                      Access choir resources, order merchandise, and stay updated on schedules.
                    </p>
                  </div>
                )}

                <div className="rounded-3xl border border-brand-blue/15 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-brand-navy flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-brand-blue" /> Need quick help?
                  </p>
                  <p className="text-xs text-brand-navy/70 mt-1">
                    Reach out to the choir coordinators for urgent questions about events or merchandise.
                  </p>
                  <a
                    href="mailto:choir@sliit.lk"
                    className="mt-3 inline-flex items-center justify-center rounded-2xl border border-brand-blue/20 bg-brand-blue/10 px-4 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/20"
                  >
                    choir@sliit.lk
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
