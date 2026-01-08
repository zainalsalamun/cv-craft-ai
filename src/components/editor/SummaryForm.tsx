import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { CVData } from '@/types/cv';

interface SummaryFormProps {
  summary: string;
  cvData: CVData;
  onChange: (summary: string) => void;
}

export function SummaryForm({ summary, cvData, onChange }: SummaryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (will be replaced with real AI when Cloud is enabled)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { personalInfo, skills, workExperience } = cvData;
    const role = personalInfo.jobTitle || 'professional';
    const topSkills = skills.slice(0, 3).map(s => s.name).join(', ') || 'various skills';
    const experience = workExperience[0];
    
    const variants = [
      `Results-driven ${role} with expertise in ${topSkills}. ${experience ? `Proven track record at ${experience.company} delivering impactful solutions.` : 'Passionate about delivering high-quality work and continuous learning.'} Seeking opportunities to leverage technical skills and drive innovation.`,
      `Dynamic ${role} specializing in ${topSkills}. ${experience ? `Successfully contributed to projects at ${experience.company}, demonstrating strong problem-solving abilities.` : 'Committed to excellence and collaborative teamwork.'} Ready to make an immediate impact in a fast-paced environment.`,
      `Enthusiastic ${role} with a passion for ${topSkills}. ${experience ? `Gained valuable experience at ${experience.company}, developing both technical and interpersonal skills.` : 'Eager to grow professionally while contributing meaningful work.'} Looking forward to bringing energy and fresh perspectives to new challenges.`,
    ];
    
    setGeneratedVariants(variants);
    setIsGenerating(false);
  };

  const insertVariant = (variant: string) => {
    onChange(variant);
    setGeneratedVariants([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a brief professional summary highlighting your key strengths and career objectives..."
          className="min-h-[120px] resize-none"
        />
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-medium">AI Summary Generator</span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate a professional summary based on your profile. Fill in your job title, skills, and experience for best results.
        </p>
        
        <Button 
          onClick={generateSummary} 
          disabled={isGenerating}
          variant="outline"
          className="w-full gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </>
          )}
        </Button>

        {generatedVariants.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium">Choose a variant:</p>
            {generatedVariants.map((variant, index) => (
              <div 
                key={index}
                className="rounded-lg border bg-card p-3 text-sm cursor-pointer hover:border-primary transition-colors"
                onClick={() => insertVariant(variant)}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {index === 0 ? 'Professional' : index === 1 ? 'Impact-focused' : 'Friendly'}
                  </span>
                </div>
                <p className="text-muted-foreground">{variant}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
