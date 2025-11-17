import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    // Get token and member data from URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const memberData = params.get('member');

    if (token && memberData) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('member', memberData);

      // Trigger a custom event so the app can update its state
      window.dispatchEvent(new CustomEvent('userLoggedIn', { 
        detail: JSON.parse(memberData) 
      }));

      // Redirect to members portal after a short delay
      setTimeout(() => {
        window.location.href = '/members';
      }, 500);
    } else {
      // No token found, redirect to login
      setTimeout(() => {
        window.location.href = '/?error=Authentication failed';
      }, 500);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Completing authentication...</p>
    </div>
  );
}
