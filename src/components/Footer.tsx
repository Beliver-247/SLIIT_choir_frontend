import { Music, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-6 w-6" />
              <span className="text-xl">SLIIT Choir</span>
            </div>
            <p className="text-blue-200 mb-4">
              The official choir of Sri Lanka Institute of Information Technology, 
              dedicated to musical excellence and community service.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-blue-200 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#events" className="text-blue-200 hover:text-white transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#carol-service" className="text-blue-200 hover:text-white transition-colors">
                  Carol Service
                </a>
              </li>
              <li>
                <a href="#donate" className="text-blue-200 hover:text-white transition-colors">
                  Donate
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Join the Choir
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-blue-200">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:choir@sliit.lk" className="hover:text-white transition-colors">
                  choir@sliit.lk
                </a>
              </li>
              <li className="flex items-start gap-2 text-blue-200">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>+94 11 754 4801</span>
              </li>
              <li className="flex items-start gap-2 text-blue-200">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  New Kandy Road,<br />
                  Malabe, Sri Lanka
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white mb-4">Stay Updated</h3>
            <p className="text-blue-200 mb-4">
              Subscribe to our newsletter for event updates and choir news.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500"
              />
              <Button className="w-full bg-white text-blue-900 hover:bg-blue-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-200 text-sm">
            © 2025 SLIIT Choir. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
