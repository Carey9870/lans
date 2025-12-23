// components/AdminAuthWrapper.tsx
'use client';

import { useState } from 'react';
import { RegisterModal } from '@/components/auth/register-modal';
import { LoginModal } from '@/components/auth/login-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AdminAuthWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterSuccess = () => {
    setShowRegister(false); // Close register modal
    setShowLogin(true); // Auto-open login modal
    // Optional: Remove alert for better UX, or keep for confirmation
    // alert('Registration successful! Logging you in...');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Admin Portal</h1>
          <p className="mt-2 text-muted-foreground">Secure administrator access</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginModal open={showLogin} onOpenChange={setShowLogin} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Admin?</CardTitle>
              <CardDescription>Create an account</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterModal
                open={showRegister}
                onOpenChange={setShowRegister}
                onRegisterSuccess={handleRegisterSuccess}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1" onClick={() => setShowLogin(true)}>
            Login
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setShowRegister(true)}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}











// // components/AdminAuthWrapper.tsx
// 'use client';

// import { useState } from 'react';
// import { RegisterModal } from '@/components/auth/register-modal';
// import { LoginModal } from '@/components/auth/login-modal';

// export function AdminAuthWrapper() {
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//   const handleRegisterSuccess = () => {
//     setIsRegisterModalOpen(false); // This closes the modal
//     alert('Registration successful! You can now log in.');
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center space-y-12 bg-linear-to-br from-slate-50 to-slate-100 px-4">
//       <div className="text-center">
//         <h1 className="text-5xl font-bold tracking-tight text-foreground">Admin Portal</h1>
//         <p className="mt-3 text-lg text-muted-foreground">
//           Secure access for authorized administrators only
//         </p>
//       </div>

//       <div className="flex flex-col gap-6 sm:flex-row">
//         <RegisterModal
//           open={isRegisterModalOpen}
//           onOpenChange={setIsRegisterModalOpen}
//           onRegisterSuccess={handleRegisterSuccess}
//         />
//         <LoginModal />
//       </div>
//     </div>
//   );
// }