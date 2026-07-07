import { useState, useEffect } from "react";
import { authApi } from "@/integrations/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileText, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  useEffect(() => {
    // Check if user is already logged in
    if (authApi.isAuthenticated()) {
      authApi.getMe().then(({ user }) => {
        if (user.is_admin && (!searchParams.get("returnTo") || searchParams.get("returnTo") === '/')) {
          navigate("/admin");
        } else {
          navigate(returnTo);
        }
      }).catch(() => {
        // Token invalid, stay on auth page
      });
    }
  }, [navigate, returnTo, searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const data = await authApi.register(email, password);
        toast.success("Registrasi berhasil! Token disimpan.");
        // Auto redirect
        if (data.user?.is_admin && (!searchParams.get("returnTo") || searchParams.get("returnTo") === '/')) {
          navigate("/admin");
        } else {
          navigate(returnTo);
        }
      } else {
        const data = await authApi.login(email, password);
        toast.success("Login berhasil!");
        if (data.user?.is_admin && (!searchParams.get("returnTo") || searchParams.get("returnTo") === '/')) {
          navigate("/admin");
        } else {
          navigate(returnTo);
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat autentikasi";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSignUp ? "Buat Akun Baru" : "Selamat Datang Kembali"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isSignUp
              ? "Daftar untuk menyimpan dan mengoptimasi CV Anda"
              : "Login untuk melanjutkan pembuatan CV Anda"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 mt-6" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignUp ? (
              "Daftar Sekarang"
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-semibold hover:underline"
          >
            {isSignUp ? "Login di sini" : "Daftar gratis"}
          </button>
        </div>
      </div>
    </div>
  );
}