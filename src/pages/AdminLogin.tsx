import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLogin() {
  const {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleLogin,
  } = useAdminAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        
        <AdminLoginForm
          email={email}
          password={password}
          isLoading={isLoading}
          onSubmit={handleLogin}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
      </div>
    </div>
  );
}