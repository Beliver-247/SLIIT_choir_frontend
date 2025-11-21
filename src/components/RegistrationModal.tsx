import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Music } from "lucide-react";
import { api } from "../utils/api";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string) => void;
  onSwitchToLogin: () => void;
}

export function RegistrationModal({ 
  isOpen, 
  onClose, 
  onRegister,
  onSwitchToLogin 
}: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [pendingStudentId, setPendingStudentId] = useState('');
  const [otp, setOtp] = useState('');
  const [requiresVerification, setRequiresVerification] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const completeAuthentication = (payload: any, overrideMessage?: string) => {
    if (!payload?.member || !payload?.token) {
      throw new Error('Invalid verification response. Please try again.');
    }

    localStorage.setItem('authToken', payload.token);
    localStorage.setItem('member', JSON.stringify(payload.member));

    const displayName = `${payload.member.firstName} ${payload.member.lastName}`;
    setSuccess(overrideMessage || 'Email verified! Redirecting...');

    setTimeout(() => {
      onRegister(displayName);
      onClose();
    }, 1200);
  };

  const resetState = () => {
    setFormData({
      firstName: "",
      lastName: "",
      studentId: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setOtp('');
    setPendingStudentId('');
    setStep('form');
    setRequiresVerification(true);
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const studentIdRegex = /^[A-Z]{2}\d{8}$/;
    const normalizedStudentId = formData.studentId.toUpperCase();
    if (!studentIdRegex.test(normalizedStudentId)) {
      setError('StudentID must be 2 letters followed by 8 digits (e.g., CS12345678)');
      setIsLoading(false);
      return;
    }

    const expectedEmail = `${normalizedStudentId.toLowerCase()}@my.sliit.lk`;
    if (formData.email.trim().toLowerCase() !== expectedEmail) {
      setError(`Email must match your student ID (e.g., ${expectedEmail})`);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.auth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: normalizedStudentId,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (!result.success) {
        throw new Error(result.error || result.data?.message || 'Registration failed');
      }

      const shouldRequireVerification = result.data?.requiresVerification !== false;
      setRequiresVerification(shouldRequireVerification);
      setPendingStudentId(normalizedStudentId);

      if (shouldRequireVerification) {
        setStep('otp');
        setSuccess('We sent a 6-digit code to your SLIIT email. Enter it below to activate your account.');
      } else {
        const verificationResult = await api.auth.verifyEmail({
          studentId: normalizedStudentId,
          otp: '000000',
        });

        if (!verificationResult.success) {
          throw new Error(verificationResult.error || verificationResult.data?.message || 'Verification failed');
        }

        completeAuthentication(
          verificationResult.data,
          'Registration successful! Email verification is temporarily disabled, logging you in...'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (otp.trim().length !== 6) {
      setError('Enter the 6-digit code we emailed you');
      setIsLoading(false);
      return;
    }

    try {
      const result = await api.auth.verifyEmail({
        studentId: pendingStudentId,
        otp: otp.trim(),
      });

      if (!result.success) {
        throw new Error(result.error || result.data?.message || 'Verification failed');
      }

      completeAuthentication(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormStep = step === 'form';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Register as Member</DialogTitle>
              <DialogDescription>
                Create your choir member account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {isFormStep ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentId">StudentID *</Label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="CS12345678"
              value={formData.studentId.toUpperCase()}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                studentId: e.target.value 
              }))}
              required
              disabled={isLoading}
              maxLength={10}
            />
            <p className="text-xs text-gray-500">Format: 2 letters + 8 digits (e.g., CS12345678)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.name@sliit.lk"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg text-blue-800 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500">
                {requiresVerification
                  ? `We sent the code to ${pendingStudentId.toLowerCase()}@my.sliit.lk`
                  : 'Email verification is currently disabled.'}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <button
              type="button"
              className="w-full text-sm text-gray-500 hover:text-gray-700"
              disabled={isLoading}
              onClick={() => {
                setStep('form');
                setSuccess('');
                setError('');
              }}
            >
              Edit details instead
            </button>
          </form>
        )}

        {isFormStep && (
          <p className="text-sm text-gray-600 text-center">
            Already a member?{" "}
            <button 
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login here
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
