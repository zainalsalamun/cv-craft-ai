import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CVData, CVSettings, defaultCVData, defaultCVSettings } from '@/types/cv';
import { PersonalInfoForm } from '@/components/editor/PersonalInfoForm';
import { SummaryForm } from '@/components/editor/SummaryForm';
import { ExperienceForm } from '@/components/editor/ExperienceForm';
import { EducationForm } from '@/components/editor/EducationForm';
import { SkillsForm } from '@/components/editor/SkillsForm';
import { ProjectsForm } from '@/components/editor/ProjectsForm';
import { AdditionalForm } from '@/components/editor/AdditionalForm';
import { SettingsPanel } from '@/components/editor/SettingsPanel';
import { CVPreview } from '@/components/editor/CVPreview';
import { authApi, cvApi } from '@/integrations/api/client';
import { saveCVToAPI } from '@/hooks/useCVStorage';
import {
  FileText,
  Download,
  Save,
  Upload,
  Eye,
  Edit3,
  Settings2,
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  MoreHorizontal,
  ChevronLeft,
  Check,
  ZoomIn,
  ZoomOut,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface EditorProps {
  hideHeader?: boolean;
}

export default function Editor({ hideHeader = false }: EditorProps) {
  const [searchParams] = useSearchParams();
  const cvIdParam = searchParams.get('cvId');
  const templateParam = searchParams.get('template') as CVSettings['template'] | null;

  // Local storage (fallback for non-authenticated users)
  const [localCvData, setLocalCvData, resetLocalCvData] = useLocalStorage<CVData>('cv-data', defaultCVData);
  const [localCvSettings, setLocalCvSettings] = useLocalStorage<CVSettings>('cv-settings', {
    ...defaultCVSettings,
    template: templateParam || defaultCVSettings.template,
  });

  // State
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [cvSettings, setCvSettings] = useState<CVSettings>({
    ...defaultCVSettings,
    template: templateParam || defaultCVSettings.template,
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [zoom, setZoom] = useState(100);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCvId, setCurrentCvId] = useState<string | null>(cvIdParam);
  const [isLoadingCV, setIsLoadingCV] = useState(!!cvIdParam);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth check
  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  // Load CV from API if cvId is provided
  useEffect(() => {
    const loadCV = async () => {
      if (!cvIdParam || !isAuthenticated) return;

      setIsLoadingCV(true);
      try {
        const { cv } = await cvApi.getById(cvIdParam);

        if (!cv) {
          toast.error('CV tidak ditemukan atau Anda tidak memiliki akses');
          return;
        }

        const loadedCvData = (cv.cv_data as unknown as CVData) || defaultCVData;
        const loadedCvSettings = (cv.cv_settings as unknown as CVSettings) || defaultCVSettings;

        setCvData({
          ...defaultCVData,
          ...loadedCvData,
          personalInfo: {
            ...defaultCVData.personalInfo,
            ...(loadedCvData.personalInfo || {}),
          },
          workExperience: loadedCvData.workExperience || [],
          education: loadedCvData.education || [],
          skills: loadedCvData.skills || [],
          projects: loadedCvData.projects || [],
          certificates: loadedCvData.certificates || [],
          languages: loadedCvData.languages || [],
          hobbies: loadedCvData.hobbies || '',
          achievements: loadedCvData.achievements || '',
        });

        setCvSettings({
          ...defaultCVSettings,
          ...loadedCvSettings,
        });

        setCurrentCvId(cvIdParam);
      } catch (err) {
        console.error('Error loading CV:', err);
        toast.error('Gagal memuat CV');
      } finally {
        setIsLoadingCV(false);
      }
    };

    loadCV();
  }, [cvIdParam, isAuthenticated]);

  // Fallback: if no cvId and not logged in, use localStorage
  useEffect(() => {
    if (!cvIdParam && !isAuthenticated) {
      setCvData(localCvData);
      setCvSettings(localCvSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to API (debounced)
  const debouncedSave = useCallback(async () => {
    if (!isAuthenticated || !currentCvId) return;

    setIsSaving(true);
    try {
      await saveCVToAPI(currentCvId, cvData, cvSettings);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, currentCvId, cvData, cvSettings]);

  // Debounce save on changes
  useEffect(() => {
    if (!currentCvId || !isAuthenticated) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [cvData, cvSettings, debouncedSave, currentCvId, isAuthenticated]);

  // Also save to localStorage as backup (for non-auth or as fallback)
  useEffect(() => {
    if (!currentCvId) {
      setLocalCvData(cvData);
      setLocalCvSettings(cvSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData, cvSettings, currentCvId]);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${cvData.personalInfo.fullName || 'CV'}_Resume`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const exportJSON = () => {
    const dataStr = JSON.stringify({ cvData, cvSettings }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvData.personalInfo.fullName || 'cv'}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CV data exported successfully');
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.cvData) setCvData(imported.cvData);
        if (imported.cvSettings) setCvSettings(imported.cvSettings);
        toast.success('CV data imported successfully');
      } catch {
        toast.error('Failed to import CV data');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setCvData(defaultCVData);
      setCvSettings(defaultCVSettings);
      if (!currentCvId) {
        resetLocalCvData();
      }
      toast.success('CV data reset successfully');
    }
  };

  // Determine back link
  const backLink = isAuthenticated && currentCvId ? '/dashboard' : '/';
  const backLabel = isAuthenticated && currentCvId ? 'Dashboard' : 'Back';

  const formTabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'additional', label: 'More', icon: MoreHorizontal },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  if (isLoadingCV) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-slate-500 mt-3 text-sm">Memuat CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      {!hideHeader && (
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to={backLink}>
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">CV Builder</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save status indicator */}
            {currentCvId && isAuthenticated && (
              <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <Check className="h-3 w-3" />
                    Saved to cloud
                  </>
                ) : null}
              </span>
            )}
            {!currentCvId && lastSaved && (
              <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <Check className="h-3 w-3" />
                Saved locally
              </span>
            )}
            
            <input
              type="file"
              accept=".json"
              onChange={importJSON}
              className="hidden"
              id="import-json"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('import-json')?.click()}
              className="hidden gap-2 sm:flex"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="ghost" size="sm" onClick={exportJSON} className="hidden gap-2 sm:flex">
              <Save className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => {
              if (!isAuthenticated) {
                toast.error("Akses Ditolak", {
                  description: "Bagus sekali! CV Anda sudah jadi. Silakan Login/Daftar gratis untuk mendownload hasilnya.",
                  action: {
                    label: "Login Sekarang",
                    onClick: () => window.location.href = '/auth?returnTo=/editor'
                  }
                });
                return;
              }
              handlePrint();
            }} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </header>
      )}

      {/* Mobile View Toggle */}
      <div className="flex border-b bg-card p-2 lg:hidden">
        <Button
          variant={mobileView === 'edit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMobileView('edit')}
          className="flex-1 gap-2"
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={mobileView === 'preview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMobileView('preview')}
          className="flex-1 gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div
          className={`w-full shrink-0 border-r bg-card lg:w-[480px] ${
            mobileView === 'preview' ? 'hidden lg:block' : ''
          }`}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <ScrollArea className="border-b">
              <TabsList className="flex h-auto w-max gap-1 bg-transparent p-2">
                {formTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="gap-2 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="personal" className="m-0">
                <PersonalInfoForm
                  data={cvData.personalInfo}
                  onChange={(data) => setCvData({ ...cvData, personalInfo: data })}
                />
              </TabsContent>

              <TabsContent value="summary" className="m-0">
                <SummaryForm
                  summary={cvData.summary}
                  cvData={cvData}
                  onChange={(summary) => setCvData({ ...cvData, summary })}
                />
              </TabsContent>

              <TabsContent value="experience" className="m-0">
                <ExperienceForm
                  data={cvData.workExperience}
                  onChange={(data) => setCvData({ ...cvData, workExperience: data })}
                />
              </TabsContent>

              <TabsContent value="education" className="m-0">
                <EducationForm
                  data={cvData.education}
                  onChange={(data) => setCvData({ ...cvData, education: data })}
                />
              </TabsContent>

              <TabsContent value="skills" className="m-0">
                <SkillsForm
                  data={cvData.skills}
                  onChange={(data) => setCvData({ ...cvData, skills: data })}
                />
              </TabsContent>

              <TabsContent value="projects" className="m-0">
                <ProjectsForm
                  data={cvData.projects}
                  onChange={(data) => setCvData({ ...cvData, projects: data })}
                />
              </TabsContent>

              <TabsContent value="additional" className="m-0">
                <AdditionalForm
                  certificates={cvData.certificates}
                  languages={cvData.languages}
                  hobbies={cvData.hobbies}
                  achievements={cvData.achievements}
                  onCertificatesChange={(data) => setCvData({ ...cvData, certificates: data })}
                  onLanguagesChange={(data) => setCvData({ ...cvData, languages: data })}
                  onHobbiesChange={(value) => setCvData({ ...cvData, hobbies: value })}
                  onAchievementsChange={(value) => setCvData({ ...cvData, achievements: value })}
                />
              </TabsContent>

              <TabsContent value="settings" className="m-0">
                <SettingsPanel settings={cvSettings} onChange={setCvSettings} />
                <div className="mt-6 border-t pt-6">
                  <Button variant="destructive" size="sm" onClick={handleReset} className="w-full">
                    Reset All Data
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex flex-1 flex-col bg-muted ${
            mobileView === 'edit' ? 'hidden lg:flex' : ''
          }`}
        >
          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2 border-b bg-card p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-[4rem] text-center text-sm">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              disabled={zoom >= 150}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex justify-center">
              <div
                className="origin-top transition-transform"
                style={{ transform: `scale(${zoom / 100})`, width: '210mm' }}
              >
                <CVPreview ref={previewRef} data={cvData} settings={cvSettings} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}