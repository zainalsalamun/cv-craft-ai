import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, PenLine, Lock, CheckCircle2, ArrowRight, FileText, X } from "lucide-react";

interface Props {
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  onNext: () => void;
  onBack: () => void;
  onJumpToStep?: (step: number) => void;
  currentStep: number;
}

export function Step2UploadCV({ cvFile, setCvFile, onNext, onBack, onJumpToStep }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      alert("Format file tidak didukung. Harap upload PDF atau DOCX.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    
    setCvFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col flex-1 mt-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto w-full justify-center">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-sm font-medium hidden sm:inline">Job</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-sm">CV</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-sm font-medium hidden sm:inline">Result</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">4</div>
          <span className="text-sm font-medium hidden sm:inline">Optimize</span>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload CV kamu</h1>
        <p className="text-slate-500">Kami akan menganalisa dan memberikan saran terbaik untukmu.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Left side: Upload area */}
        <div className="flex-1 flex flex-col">
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors relative cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:bg-slate-50'}
              ${cvFile ? 'border-primary/50 bg-slate-50' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !cvFile && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInput}
            />

            {!cvFile ? (
              <>
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 pointer-events-none">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 pointer-events-none">Drag & drop file CV kamu di sini</h3>
                <p className="text-sm text-slate-500 mb-6 pointer-events-none">PDF, DOCX maksimal 5MB</p>
                <Button variant="default" className="shadow-sm w-40 pointer-events-none">
                  Pilih File
                </Button>
                
                <div className="flex items-center gap-4 w-full max-w-xs my-6 pointer-events-none">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-xs text-slate-400 font-medium uppercase">atau</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full max-w-xs gap-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onJumpToStep) {
                      onJumpToStep(4);
                    }
                  }}
                >
                  <PenLine className="w-4 h-4" />
                  Isi Manual
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-8">
                <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1 max-w-[250px] truncate" title={cvFile.name}>
                  {cvFile.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearFile}>
                    <X className="w-4 h-4" />
                    Hapus File
                  </Button>
                  <Button variant="default" onClick={async (e) => { 
                    e.stopPropagation(); 
                    
                    try {
                      const { extractTextFromPDF, parseCVTextToData } = await import("@/utils/pdfParser");
                      
                      // Coba ekstrak teks jika file adalah PDF
                      if (cvFile.type === 'application/pdf' || cvFile.name.endsWith('.pdf')) {
                        const text = await extractTextFromPDF(cvFile);
                        const extractedData = parseCVTextToData(text, cvFile.name);
                        localStorage.setItem('cv-data', JSON.stringify(extractedData));
                      } else {
                        // Fallback untuk docx (simulasi parsing)
                        const currentData = JSON.parse(localStorage.getItem('cv-data') || '{}');
                        const extractedData = {
                          ...currentData,
                          personalInfo: {
                            ...currentData.personalInfo,
                            fullName: cvFile.name.replace(/\.[^/.]+$/, ""),
                          },
                          summary: "Data dari file: " + cvFile.name + ". Parsing otomatis untuk dokumen Word belum tersedia.",
                        };
                        localStorage.setItem('cv-data', JSON.stringify(extractedData));
                      }
                    } catch (e) {
                      console.error("Error saving extracted data", e);
                    }

                    onNext(); 
                  }}>
                    Lanjut Analisa
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Data kamu aman dan hanya digunakan untuk analisa CV</span>
          </div>
        </div>

        {/* Right side: Tips */}
        <div className="w-full md:w-80 lg:w-96">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Tips CV yang baik</h3>
            
            <div className="space-y-4 mb-6">
              {[
                "Gunakan point-point singkat dan jelas",
                "Tulis pencapaian dengan angka (jika ada)",
                "Sesuaikan pengalaman dengan pekerjaan yang dilamar",
                "Pastikan tidak ada typo"
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
            
            <button 
              className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              onClick={() => {
                import("sonner").then(({ toast }) => {
                  toast.info("Fitur Lihat Contoh CV akan segera hadir!");
                });
              }}
            >
              Lihat Contoh CV <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-auto pt-6 border-t">
        <Button variant="outline" onClick={onBack}>Kembali</Button>
        <Button 
          onClick={async () => {
            if (cvFile) {
              try {
                const { extractTextFromPDF, parseCVTextToData } = await import("@/utils/pdfParser");
                
                if (cvFile.type === 'application/pdf' || cvFile.name.endsWith('.pdf')) {
                  const text = await extractTextFromPDF(cvFile);
                  const extractedData = parseCVTextToData(text, cvFile.name);
                  localStorage.setItem('cv-data', JSON.stringify(extractedData));
                } else {
                  const currentData = JSON.parse(localStorage.getItem('cv-data') || '{}');
                  const extractedData = {
                    ...currentData,
                    personalInfo: {
                      ...currentData.personalInfo,
                      fullName: cvFile.name.replace(/\.[^/.]+$/, ""),
                    },
                    summary: "Data dari file: " + cvFile.name + ". Parsing otomatis belum tersedia.",
                  };
                  localStorage.setItem('cv-data', JSON.stringify(extractedData));
                }
              } catch (e) {
                console.error("Error saving extracted data", e);
              }
            }
            onNext();
          }} 
          disabled={!cvFile}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300"
        >
          Lanjut Analisa
        </Button>
      </div>
    </div>
  );
}
