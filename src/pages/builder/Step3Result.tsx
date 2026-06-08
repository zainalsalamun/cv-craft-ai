import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, AlertTriangle, FileCheck, CheckCircle2, Award, Zap, ShieldCheck } from "lucide-react";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function Step3Result({ onNext, onBack }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [loadingText, setLoadingText] = useState("Mengekstrak data dari PDF...");
  const [optimizeText, setOptimizeText] = useState("Menganalisa kelemahan CV...");

  useEffect(() => {
    if (!isAnalyzing) return;
    
    // Simulate multi-step loading
    const timer1 = setTimeout(() => setLoadingText("Menemukan pengalaman kerja dan skill..."), 800);
    const timer2 = setTimeout(() => setLoadingText("Mencocokkan profil dengan Job Description..."), 1600);
    
    const finishTimer = setTimeout(() => {
      // Hanya set mock data (Dika Pratama) jika kosong
      try {
        const currentData = JSON.parse(localStorage.getItem('cv-data') || '{}');
        if (!currentData.personalInfo?.fullName) {
          const defaultData = {
            personalInfo: {
              fullName: "Nama Anda",
              title: "Posisi Saat Ini",
              email: "email@contoh.com",
              phone: "0812-3456-7890",
              location: "Kota, Negara",
              website: "",
            },
            summary: "Saya adalah seorang profesional yang berdedikasi...",
            workExperience: [],
            skills: [],
            education: [],
            projects: [],
            certificates: [],
            languages: [],
            hobbies: "",
            achievements: ""
          };
          localStorage.setItem('cv-data', JSON.stringify(defaultData));
        }
      } catch (e) {
        console.error("Error checking data", e);
      }
      setIsAnalyzing(false);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(finishTimer);
    };
  }, [isAnalyzing]);

  const handleOptimize = async () => {
    try {
      const { authApi } = await import('@/integrations/api/client');
      
      if (!authApi.isAuthenticated()) {
        import('sonner').then(({ toast }) => {
          toast.error("Fitur Premium", {
            description: "Login sekarang untuk mengaktifkan asisten AI Auto-Optimize.",
            action: {
              label: "Login",
              onClick: () => window.location.href = '/auth?returnTo=/build?step=3'
            }
          });
        });
        return;
      }
      
      setIsOptimizing(true);
      setTimeout(() => setOptimizeText("Menyesuaikan keyword dengan sistem ATS..."), 1000);
      setTimeout(() => setOptimizeText("Menulis ulang pengalaman menjadi impact-driven..."), 2000);
      setTimeout(() => {
        setIsOptimizing(false);
        onNext(); // Lanjut ke Step 4
      }, 3500);
    } catch (e) {
      console.error(e);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col flex-1 mt-6 items-center justify-center animate-in fade-in duration-500 min-h-[400px]">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">AI sedang bekerja...</h2>
        <p className="text-slate-500 animate-pulse">{loadingText}</p>
      </div>
    );
  }

  if (isOptimizing) {
    return (
      <div className="flex flex-col flex-1 mt-6 items-center justify-center animate-in fade-in duration-500 min-h-[400px]">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          <Zap className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Mengoptimasi CV Kamu...</h2>
        <p className="text-slate-500 animate-pulse">{optimizeText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 mt-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto w-full justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-sm font-medium hidden sm:inline">Job</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-sm font-medium hidden sm:inline">CV</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-sm">Result</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">4</div>
          <span className="text-sm font-medium hidden sm:inline">Optimize</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Result / Match & Insight</h1>
        <p className="text-slate-500">Hasil analisa kecocokan CV kamu dengan pekerjaan yang dilamar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm">
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                strokeDasharray="68, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">68%</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Good Match</h3>
          <p className="text-sm text-slate-500 text-center">Cocok dengan posisi ini</p>
          
          <div className="mt-6 w-full bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <Star className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Good Match!</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                CV kamu cukup relevan dengan posisi ini. Tingkatkan beberapa area untuk hasil lebih baik.
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown & Keywords */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-4">Breakdown Kecocokan</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">Skill Match</span>
                  <span className="text-slate-900">70%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">Keyword Match</span>
                  <span className="text-slate-900">65%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['REST API', 'State Management', 'CI/CD', 'Unit Testing'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">Top Keywords dari Job</h3>
            <div className="flex flex-wrap gap-2">
              {['Flutter', 'Dart', 'Firebase', 'REST API', 'Git', 'Agile'].map(keyword => (
                <span key={keyword} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Saran Perbaikan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Saran Perbaikan</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">Tambahkan pencapaian dengan angka/metrics</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">Gunakan keyword yang relevan dari job description</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">Perkuat bagian project experience</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">Tingkatkan skill yang sedang dibutuhkan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acceptance Potential Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between shadow-lg shadow-blue-500/20 mb-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-white/20 p-3 rounded-xl">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-xl">CV kamu memiliki potensi diterima HR sebesar</h3>
            <p className="text-blue-100 text-sm mt-1">Gunakan fitur Auto-Optimize untuk meningkatkan peluangmu!</p>
          </div>
        </div>
        <div className="text-5xl font-black">72%</div>
      </div>
      
      <div className="flex justify-between mt-auto pt-6 border-t">
        <Button variant="outline" onClick={onBack}>Kembali ke Edit Job</Button>
        <div className="flex gap-3">
          <Button variant="outline">Download CV (Original)</Button>
          <Button onClick={handleOptimize} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30">
            <Zap className="w-4 h-4" />
            Optimize CV untuk Job ini
          </Button>
        </div>
      </div>
    </div>
  );
}
