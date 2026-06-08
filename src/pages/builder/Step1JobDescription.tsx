import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Target, Zap, ShieldCheck } from "lucide-react";

interface Props {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onNext: () => void;
}

export function Step1JobDescription({ jobDescription, setJobDescription, onNext }: Props) {
  return (
    <div className="flex flex-col flex-1 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-10 text-primary font-semibold">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
        <span>Input Job Description</span>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Buat CV yang tepat,<br />
          <span className="text-primary">buka peluang karier hebat</span>
        </h1>
        <p className="text-lg text-slate-600">
          Paste job description, dapatkan analisa kecocokan,<br />
          dan CV kamu akan di-upgrade oleh AI dalam hitungan menit.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Paste job description di sini
          </label>
          <div className="relative">
            <Textarea 
              className="min-h-[200px] resize-none bg-slate-50/50 border-slate-200 focus:bg-white text-base p-4 placeholder:text-slate-400"
              placeholder="Contoh: We are looking for a Flutter Developer with experience in mobile app development, state management, REST API, and deployment..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium bg-slate-50/80 px-2 py-1 rounded backdrop-blur-sm">
              {jobDescription.length} / 2000
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">i</div>
            Tips: Paste minimal 20 kata untuk hasil lebih akurat
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              className="flex-1 h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" 
              onClick={onNext}
              disabled={jobDescription.trim().split(/\s+/).filter(Boolean).length < 20}
            >
              <Sparkles className="w-5 h-5" />
              Analyze CV Sekarang
            </Button>
            <Button
              variant="outline"
              className="sm:w-32 h-12 text-base font-semibold"
              onClick={() => {
                setJobDescription("");
                onNext();
              }}
            >
              Lewati
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full mb-10">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-1">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">AI Job Match</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Hitung kecocokan CV kamu dengan pekerjaan impian</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 mt-1">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Smart Improvement</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Dapatkan saran perbaikan yang spesifik</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 mt-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">ATS Friendly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">CV kamu lebih optimal & lolos sistem ATS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
