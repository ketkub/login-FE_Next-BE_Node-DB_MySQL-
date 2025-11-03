'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token'); // ดึง token จาก URL

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }), 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage(data.message + '. Redirecting to login...');
      setTimeout(() => {
        router.push('/login'); 
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ถ้าไม่มี token ก็ไม่ต้องแสดงฟอร์ม
  if (!token && !error) {
    return <div>Validating token...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
    >
      <h2 className="mb-6 text-center text-2xl font-bold">Reset Your Password</h2>

      <div className="mb-4">
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !token}
        className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </form>
  );
}