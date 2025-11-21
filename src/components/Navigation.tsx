import { Music, Menu, LogOut, User, Home, ShoppingBag, CalendarPlus, ClipboardList, BarChart3, Sparkles, PhoneCall, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { canCreateEvents, canCreateSchedules } from "../utils/roleUtils";

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
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onHomeClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Music className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-blue-900">SLIIT Choir</div>
                <div className="text-xs text-gray-600">Sri Lanka Institute of Information Technology</div>
              </div>
            </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {currentPage === "home" ? (
              <>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </a>
                <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Events
                </a>
                <a href="#carol-service" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Carol Service
                </a>
                <a href="#donate" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Donate
                </a>
              </>
            ) : (
              <button onClick={onHomeClick} className="text-gray-700 hover:text-blue-600 transition-colors">
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
                    Member Portal
                  </Button>
                )}
                {canCreate && currentPage === "members" && (
                  <Button
                    onClick={onCreateEventClick}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                )}
                {canCreateSched && currentPage === "members" && (
                  <Button
                    onClick={onCreateScheduleClick}
                    className="bg-purple-600 hover:bg-purple-700 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Schedule
                  </Button>
                )}
                {canCreate && currentPage === "members" && (
                  <Button
                    onClick={onAnalyticsClick}
                    className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                  >
                    Attendance Analytics
                  </Button>
                </div>
              ) : (
                <Button onClick={onLoginClick} className="bg-blue-600 hover:bg-blue-700">
                  Members Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-700" />
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
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl border-l border-blue-100 z-[80] md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="pt-6 pb-10 px-6 space-y-6 overflow-y-auto h-full">
                <div className="flex items-center gap-3 pb-4 border-b border-white/40">
                  <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Music className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">SLIIT Choir</p>
                    <p className="text-base font-semibold text-blue-900">Quick Navigation</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Main Sections</p>
                  {currentPage === "home" ? (
                    <div className="grid gap-2">
                      {[{ label: "About", href: "#about" }, { label: "Events", href: "#events" }, { label: "Carol Service", href: "#carol-service" }, { label: "Donate", href: "#donate" }].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700 transition"
                        >
                          <Sparkles className="h-4 w-4 text-blue-500" />
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
                      className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-200 hover:text-blue-700 transition"
                    >
                      <Home className="h-4 w-4 text-blue-600" />
                      Back to Home
                    </button>
                  )}
                </div>

                {isLoggedIn ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Actions</p>
                    {currentPage !== "members" && (
                      <Button
                        onClick={() => {
                          window.history.pushState({}, "", "/members");
                          window.dispatchEvent(new PopStateEvent("popstate"));
                          closeMenu();
                        }}
                        variant="outline"
                        className="w-full justify-start gap-3 rounded-2xl border-slate-200 bg-white/80 text-slate-800"
                      >
                        <Home className="h-4 w-4 text-blue-600" />
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
                        className="w-full justify-start gap-3 rounded-2xl border-slate-200 bg-white/80 text-slate-800"
                      >
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                        My Orders
                      </Button>
                    )}
                    {canCreate && currentPage === "members" && (
                      <Button
                        onClick={() => {
                          onCreateEventClick();
                          closeMenu();
                        }}
                        className="w-full justify-start gap-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white"
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
                        className="w-full justify-start gap-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white"
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
                        className="w-full justify-start gap-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Attendance Analytics
                      </Button>
                    )}
                    <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm">
                      <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="font-semibold text-slate-800">{memberName}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        onLogout();
                        closeMenu();
                      }}
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-2xl border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Members</p>
                    <Button
                      onClick={() => {
                        onLoginClick();
                        closeMenu();
                      }}
                      className="w-full justify-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-700"
                    >
                      <User className="h-4 w-4" />
                      Members Login
                    </Button>
                    <p className="text-xs text-gray-500">
                      Access choir resources, order merchandise, and stay updated on schedules.
                    </p>
                  </div>
                )}

                <div className="rounded-3xl border border-blue-100 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-blue-600" /> Need quick help?
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Reach out to the choir coordinators for urgent questions about events or merchandise.
                  </p>
                  <a
                    href="mailto:choir@sliit.lk"
                    className="mt-3 inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
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
