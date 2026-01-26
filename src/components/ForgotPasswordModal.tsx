import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, ShieldCheck, Clock } from "lucide-react";
import { api } from "../utils/api";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetComplete?: () => void;
}

type Stage = "request" | "verify";

export function ForgotPasswordModal({ isOpen, onClose, onResetComplete }: ForgotPasswordModalProps) {
  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStage("request");
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setMessage("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await api.auth.requestPasswordReset(email.trim().toLowerCase());

      if (!result.success) {
        throw new Error(result.error || "Could not send reset OTP");
      }

      setMessage(result.message || "If this email exists, we sent you an OTP.");
      setStage("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.auth.resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        password,
        confirmPassword,
      });

      if (!result.success) {
        throw new Error(result.error || "Password reset failed");
      }

      setMessage(result.message || "Password reset successful. You can now log in.");
      onResetComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordHint = "Min 8 chars, include an uppercase letter and a number";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {stage === "request" ? (
                <Shield className="h-6 w-6 text-blue-600" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div>
              <DialogTitle>{stage === "request" ? "Forgot password" : "Verify OTP"}</DialogTitle>
              <DialogDescription>
                {stage === "request"
                  ? "We'll send a 6-digit code to your email."
                  : "Enter the OTP and set a new password."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        {stage === "request" ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                placeholder="you@my.sliit.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Sending code..." : "Send reset code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
                maxLength={6}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Expires in 5 minutes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">{passwordHint}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
