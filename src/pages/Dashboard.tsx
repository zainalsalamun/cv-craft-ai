import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "@/integrations/api/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CVCard } from "@/components/dashboard/CVCard";
import {
  FileText,
  Plus,
  Loader2,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import {
  getUserCVs,
  createNewCV,
  duplicateCV,
  deleteCV,
  setPrimaryCV,
  renameCV,
  migrateLocalStorageToAPI,
} from "@/hooks/useCVStorage";
import type { CVData, CVSettings } from "@/types/cv";

interface CVItem {
  id: string;
  title: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  cv_data: CVData;
  cv_settings: CVSettings;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  const [cvs, setCVs] = useState<CVItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      if (!authApi.isAuthenticated()) {
        navigate("/auth?returnTo=/dashboard");
        return;
      }
      try {
        const { user } = await authApi.getMe();
        setUserEmail(user.email || "");
      } catch {
        navigate("/auth?returnTo=/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  // Load CVs
  const loadCVs = useCallback(async () => {
    setIsLoading(true);
    try {
      let data = await getUserCVs();

      // If user has no CVs, check for localStorage migration
      if (data.length === 0) {
        const storedData = window.localStorage.getItem("cv-data");
        if (storedData) {
          const migratedId = await migrateLocalStorageToAPI();
          if (migratedId) {
            toast.success("CV Anda berhasil dimigrasi ke cloud!");
            data = await getUserCVs();
          }
        }
      }

      setCVs(
        data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          title: item.title as string,
          is_primary: item.is_primary as boolean,
          created_at: item.created_at as string,
          updated_at: item.updated_at as string,
          cv_data: (item.cv_data as unknown as CVData) || ({} as CVData),
          cv_settings: (item.cv_settings as unknown as CVSettings) || ({} as CVSettings),
        }))
      );
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast.error("Gagal memuat daftar CV");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCVs();
  }, [loadCVs]);

  // Create new CV
  const handleCreateNew = async () => {
    setIsCreating(true);
    try {
      const newId = await createNewCV();
      if (newId) {
        toast.success("CV baru berhasil dibuat!");
        navigate(`/editor?cvId=${newId}`);
      } else {
        toast.error("Gagal membuat CV baru");
      }
    } catch (error) {
      console.error("Error creating CV:", error);
      toast.error("Gagal membuat CV baru");
    } finally {
      setIsCreating(false);
    }
  };

  // Duplicate CV
  const handleDuplicate = async (cvId: string) => {
    try {
      const newId = await duplicateCV(cvId);
      if (newId) {
        toast.success("CV berhasil diduplikasi!");
        await loadCVs();
      } else {
        toast.error("Gagal menduplikasi CV");
      }
    } catch (error) {
      console.error("Error duplicating CV:", error);
      toast.error("Gagal menduplikasi CV");
    }
  };

  // Delete CV
  const handleDelete = async (cvId: string, title: string) => {
    try {
      const success = await deleteCV(cvId);
      if (success) {
        toast.success(`CV "${title}" berhasil dihapus`);
        await loadCVs();
      } else {
        toast.error("Gagal menghapus CV");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Gagal menghapus CV");
    }
  };

  // Set as primary
  const handleSetPrimary = async (cvId: string) => {
    try {
      const success = await setPrimaryCV(cvId);
      if (success) {
        toast.success("CV utama berhasil diubah");
        await loadCVs();
      } else {
        toast.error("Gagal mengubah CV utama");
      }
    } catch (error) {
      console.error("Error setting primary:", error);
      toast.error("Gagal mengubah CV utama");
    }
  };

  // Rename CV
  const handleRename = async (cvId: string, newTitle: string) => {
    try {
      const success = await renameCV(cvId, newTitle);
      if (success) {
        toast.success("Nama CV berhasil diubah");
        await loadCVs();
      } else {
        toast.error("Gagal mengubah nama CV");
      }
    } catch (error) {
      console.error("Error renaming CV:", error);
      toast.error("Gagal mengubah nama CV");
    }
  };

  // Logout
  const handleLogout = () => {
    authApi.logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-slate-500 mt-3 text-sm">Memuat CV Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-slate-900">
                CV Craft AI
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <LayoutDashboard className="w-4 h-4" />
                <span className="truncate max-w-48">{userEmail}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title + New CV Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My CVs</h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola semua CV Anda di satu tempat
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="gap-2"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Buat CV Baru
          </Button>
        </div>

        {/* CV Grid */}
        {cvs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Belum ada CV
            </h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Mulai buat CV profesional Anda sekarang. Anda bisa membuat
              beberapa CV untuk keperluan berbeda.
            </p>
            <Button
              onClick={handleCreateNew}
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Buat CV Pertama Anda
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cvs.map((cv) => (
              <CVCard
                key={cv.id}
                id={cv.id}
                title={cv.title}
                isPrimary={cv.is_primary}
                createdAt={cv.created_at}
                updatedAt={cv.updated_at}
                cvData={cv.cv_data}
                cvSettings={cv.cv_settings}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onSetPrimary={handleSetPrimary}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog (triggered from CVCard) */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus CV</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CV "{deleteTarget?.title}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteTarget) {
                  handleDelete(deleteTarget.id, deleteTarget.title);
                  setDeleteTarget(null);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}