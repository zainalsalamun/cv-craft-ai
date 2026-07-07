import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Globe } from 'lucide-react';
import { CVData } from '@/types/cv';
import { authApi } from '@/integrations/api/client';
import { toast } from 'sonner';

interface SummaryFormProps {
  summary: string;
  cvData: CVData;
  onChange: (summary: string) => void;
}

interface SummaryVariant {
  tone: string;
  summary: string;
}

export function SummaryForm({ summary, cvData, onChange }: SummaryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<SummaryVariant[]>([]);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  const generateSummary = async () => {
    if (!authApi.isAuthenticated()) {
      toast.error("Fitur Premium", {
        description: "Login sekarang untuk mengaktifkan AI Summary Generator.",
        action: {
          label: "Login",
          onClick: () => window.location.href = '/auth?returnTo=/editor'
        }
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVariants([]);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockVariants = language === 'id' ? [
        {
          tone: 'Standard',
          summary: `Profesional ${cvData.personalInfo.jobTitle || 'di bidang saya'} dengan rekam jejak yang terbukti dalam memberikan hasil yang luar biasa. Berpengalaman dalam memimpin proyek, memecahkan masalah kompleks, dan berkolaborasi dalam lingkungan tim.`
        },
        {
          tone: 'Impact-focused',
          summary: `Mendorong pertumbuhan dan efisiensi melalui solusi strategis. Berhasil meningkatkan metrik kinerja utama di peran sebelumnya. Mencari peluang untuk membawa keahlian ini ke lingkungan yang dinamis.`
        },
        {
          tone: 'Friendly',
          summary: `Saya adalah seorang yang antusias dan berdedikasi dengan minat yang besar di bidang ${cvData.personalInfo.jobTitle || 'ini'}. Senang belajar hal baru dan berkontribusi secara positif terhadap tim.`
        }
      ] : [
        {
          tone: 'Standard',
          summary: `Experienced ${cvData.personalInfo.jobTitle || 'professional'} with a proven track record of delivering exceptional results. Skilled in project management, problem-solving, and cross-functional collaboration.`
        },
        {
          tone: 'Impact-focused',
          summary: `Results-driven professional focused on efficiency and growth. Successfully improved key performance metrics in previous roles. Looking to leverage these skills in a dynamic environment.`
        },
        {
          tone: 'Friendly',
          summary: `Passionate and dedicated individual with a keen interest in ${cvData.personalInfo.jobTitle || 'this field'}. Always eager to learn new things and contribute positively to any team.`
        }
      ];

      setGeneratedVariants(mockVariants);
      toast.success(language === 'id' ? 'Ringkasan berhasil dibuat!' : 'Summary generated successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error(language === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertVariant = (variant: SummaryVariant) => {
    onChange(variant.summary);
    setGeneratedVariants([]);
    toast.success(language === 'id' ? 'Ringkasan diterapkan!' : 'Summary applied!');
  };

  const getToneLabel = (tone: string) => {
    if (language === 'id') {
      switch (tone) {
        case 'Standard': return 'Standar';
        case 'Impact-focused': return 'Berorientasi Dampak';
        case 'Friendly': return 'Ramah';
        default: return tone;
      }
    }
    return tone;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="summary">
          {language === 'id' ? 'Ringkasan Profesional' : 'Professional Summary'}
        </Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder={language === 'id' 
            ? "Tulis ringkasan profesional singkat yang menyoroti kekuatan utama dan tujuan karir Anda..."
            : "Write a brief professional summary highlighting your key strengths and career objectives..."
          }
          className="min-h-[120px] resize-none"
        />
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {language === 'id' ? 'Generator Ringkasan AI' : 'AI Summary Generator'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(v: 'id' | 'en') => setLanguage(v)}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {language === 'id' 
            ? 'Buat ringkasan profesional berdasarkan profil Anda. Isi jabatan, keahlian, dan pengalaman untuk hasil terbaik.'
            : 'Generate a professional summary based on your profile. Fill in your job title, skills, and experience for best results.'
          }
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
              {language === 'id' ? 'Membuat...' : 'Generating...'}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {language === 'id' ? 'Buat dengan AI' : 'Generate with AI'}
            </>
          )}
        </Button>

        {generatedVariants.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium">
              {language === 'id' ? 'Pilih varian:' : 'Choose a variant:'}
            </p>
            {generatedVariants.map((variant, index) => (
              <div 
                key={index}
                className="rounded-lg border bg-card p-3 text-sm cursor-pointer hover:border-primary transition-colors"
                onClick={() => insertVariant(variant)}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {getToneLabel(variant.tone)}
                  </span>
                </div>
                <p className="text-muted-foreground">{variant.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
