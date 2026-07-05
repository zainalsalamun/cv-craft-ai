import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  FileText,
  Edit3,
  Copy,
  Trash2,
  Star,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { CVData, CVSettings } from "@/types/cv";

interface CVCardProps {
  id: string;
  title: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  cvData: CVData;
  cvSettings: CVSettings;
  onDuplicate: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onSetPrimary: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export function CVCard({
  id,
  title,
  isPrimary,
  updatedAt,
  cvData,
  cvSettings,
  onDuplicate,
  onDelete,
  onSetPrimary,
  onRename,
}: CVCardProps) {
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleOpen = () => {
    navigate(`/editor?cvId=${id}`);
  };

  const handleRename = () => {
    if (renameValue.trim() && renameValue.trim() !== title) {
      onRename(id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setRenameValue(title);
      setIsRenaming(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Count filled sections for preview
  const filledSections = [
    cvData.personalInfo?.fullName && "Name",
    cvData.summary && "Summary",
    cvData.workExperience?.length > 0 && "Experience",
    cvData.education?.length > 0 && "Education",
    cvData.skills?.length > 0 && "Skills",
    cvData.projects?.length > 0 && "Projects",
  ].filter(Boolean);

  return (
    <>
      <div
        className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
          isPrimary
            ? "border-primary/40 ring-1 ring-primary/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
        onClick={handleOpen}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isPrimary
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              {isRenaming ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={handleRenameKeyDown}
                    className="h-7 text-sm font-semibold py-1"
                    onBlur={handleRename}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 flex-shrink-0"
                    onClick={handleRename}
                  >
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 flex-shrink-0"
                    onClick={() => {
                      setRenameValue(title);
                      setIsRenaming(false);
                    }}
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </div>
              ) : (
                <h3 className="font-semibold text-slate-900 truncate text-sm">
                  {title}
                </h3>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                Updated {formatDate(updatedAt)}
              </p>
            </div>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit CV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setRenameValue(title);
                  setIsRenaming(true);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(id);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              {!isPrimary && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetPrimary(id);
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Set as Primary
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {isPrimary && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 text-xs"
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              Primary
            </Badge>
          )}
          <Badge variant="outline" className="text-xs text-slate-500">
            {cvSettings.template}
          </Badge>
          {filledSections.length > 0 && (
            <Badge variant="outline" className="text-xs text-slate-500">
              {filledSections.length} sections
            </Badge>
          )}
        </div>

        {/* CV Preview Info */}
        <div className="px-5 pb-5">
          {cvData.personalInfo?.fullName && (
            <p className="text-xs text-slate-500 truncate">
              {cvData.personalInfo.jobTitle
                ? `${cvData.personalInfo.fullName} — ${cvData.personalInfo.jobTitle}`
                : cvData.personalInfo.fullName}
            </p>
          )}
          {!cvData.personalInfo?.fullName && (
            <p className="text-xs text-slate-400 italic">
              CV belum dilengkapi
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Hapus CV</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus CV "{title}"? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(id, title);
                setShowDeleteDialog(false);
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}