import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm'; // <--- Import Client Component

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}