import { Button } from "@/components/ui/button";
import Editor from "../Editor";
import { ChevronLeft } from "lucide-react";

interface Props {
  onJumpToStep?: (step: number) => void;
}

export function Step4Editor({ onJumpToStep }: Props) {
  return (
    <div className="flex flex-col flex-1 mt-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto w-full justify-center">
        <div 
          className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onJumpToStep && onJumpToStep(1)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">1</div>
          <span className="text-sm font-medium hidden sm:inline">Job</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div 
          className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onJumpToStep && onJumpToStep(2)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">2</div>
          <span className="text-sm font-medium hidden sm:inline">CV</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div 
          className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onJumpToStep && onJumpToStep(3)}
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">3</div>
          <span className="text-sm font-medium hidden sm:inline">Result</span>
        </div>
        <div className="w-8 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-primary font-semibold">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">4</div>
          <span className="text-sm">Optimize</span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Editor & Final CV</h1>
          <p className="text-slate-500">Edit jika perlu, lalu download CV terbaikmu.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium flex items-center gap-2 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> AI Optimized
          </span>
        </div>
      </div>

      {/* Render the actual Editor */}
      <div className="flex-1 min-h-[700px] border rounded-2xl overflow-hidden shadow-sm relative [&>div]:!h-full [&>div]:!min-h-[700px]">
        <Editor hideHeader={false} />
      </div>
    </div>
  );
}
