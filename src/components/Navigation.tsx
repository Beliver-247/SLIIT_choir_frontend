import { Music, Menu, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface NavigationProps {
  onLoginClick: () => void;
  onLogout: () => void;
  onHomeClick: () => void;
  isLoggedIn: boolean;
  memberName: string;
  currentPage: "home" | "members" | "auth-success";
}

export function Navigation({ 
  onLoginClick, 
  onLogout, 
  onHomeClick, 
  isLoggedIn, 
  memberName,
  currentPage 
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{memberName}</span>
                </div>
                <Button onClick={onLogout} variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {currentPage === "home" ? (
              <>
                <a href="#about" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </a>
                <a href="#events" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Events
                </a>
                <a href="#carol-service" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Carol Service
                </a>
                <a href="#donate" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Donate
                </a>
              </>
            ) : (
              <button onClick={onHomeClick} className="block text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </button>
            )}
            
            {isLoggedIn ? (
              <>
                {currentPage !== "members" && (
                  <Button
                    onClick={() => {
                      window.history.pushState({}, "", "/members");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    variant="outline"
                    className="w-full gap-2 mb-2"
                  >
                    Member Portal
                  </Button>
                )}
                <div className="flex items-center gap-2 text-gray-700 py-2">
                  <User className="h-4 w-4" />
                  <span>{memberName}</span>
                </div>
                <Button onClick={onLogout} variant="outline" className="w-full gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={onLoginClick} className="w-full bg-blue-600 hover:bg-blue-700">
                Members Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}