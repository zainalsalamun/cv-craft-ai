import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authApi } from '@/integrations/api/client';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authApi.isAuthenticated()) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const { user } = await authApi.getMe();
        setIsAuthenticated(true);
        setUserEmail(user.email || '');
        setIsAdmin(user.is_admin || false);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUserEmail('');
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline"><span className="text-blue-600">BuatCV</span> AI</span>
        </Link>

        <nav className="flex items-center gap-4">
          <a
            href="#faq"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block"
          >
            FAQ
          </a>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="mr-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link to="/admin">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Admin CMS
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="mr-2">
                <Link to="/dashboard">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 mr-2 border-r pr-4">
                <UserIcon className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{userEmail}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to={`/auth?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`}>
                Login
              </Link>
            </Button>
          )}

          <Button
            onClick={() => {
              localStorage.removeItem('cv-data');
              window.location.href = '/editor';
            }}
            size="sm"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Buat CV Baru</span>
            <span className="sm:hidden">Buat CV</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}