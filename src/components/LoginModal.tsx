import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Music } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in a real app, this would authenticate with a backend
    // For demo purposes, extract name from email
    const name = email.split("@")[0] || "Member";
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    onLogin(displayName);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Members Login</DialogTitle>
              <DialogDescription>
                Access your choir member portal
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@sliit.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Login
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Not a member yet?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Contact us to join
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
