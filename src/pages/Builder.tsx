import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Upload, FileSignature, CheckCircle2 } from "lucide-react";
import { Step1JobDescription } from "./builder/Step1JobDescription";
import { Step2UploadCV } from "./builder/Step2UploadCV";
import { Step3Result } from "./builder/Step3Result";
import { Step4Editor } from "./builder/Step4Editor";

export default function Builder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = Number(searchParams.get("step")) || 1;
  const [currentStep, setCurrentStep] = useState(initialStep >= 1 && initialStep <= 4 ? initialStep : 1);
  const [jobDescription, setJobDescription] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Sync state changes to URL
  useEffect(() => {
    setSearchParams({ step: currentStep.toString() }, { replace: true });
  }, [currentStep, setSearchParams]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <FileText className="h-6 w-6" />
          <span>CV Builder</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/#templates" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Templates
          </Link>
          <Link to="/#faq" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            FAQ
          </Link>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Start Building
          </Button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 flex flex-col">
        {/* Render Step Content */}
        {currentStep === 1 && (
          <Step1JobDescription
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onNext={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2UploadCV
            cvFile={cvFile}
            setCvFile={setCvFile}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            onJumpToStep={handleJumpToStep}
            currentStep={currentStep}
          />
        )}
        {currentStep === 3 && (
          <Step3Result
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}
        {currentStep === 4 && (
          <Step4Editor onJumpToStep={handleJumpToStep} />
        )}
      </main>
    </div>
  );
}
