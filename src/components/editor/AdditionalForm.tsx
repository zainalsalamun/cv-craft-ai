import { Certificate, Language } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AdditionalFormProps {
  certificates: Certificate[];
  languages: Language[];
  hobbies: string;
  achievements: string;
  onCertificatesChange: (data: Certificate[]) => void;
  onLanguagesChange: (data: Language[]) => void;
  onHobbiesChange: (value: string) => void;
  onAchievementsChange: (value: string) => void;
}

export function AdditionalForm({
  certificates,
  languages,
  hobbies,
  achievements,
  onCertificatesChange,
  onLanguagesChange,
  onHobbiesChange,
  onAchievementsChange,
}: AdditionalFormProps) {
  // Certificates
  const addCertificate = () => {
    onCertificatesChange([
      ...certificates,
      { id: crypto.randomUUID(), name: '', issuer: '', year: '', link: '' },
    ]);
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: string) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    onCertificatesChange(updated);
  };

  const removeCertificate = (index: number) => {
    onCertificatesChange(certificates.filter((_, i) => i !== index));
  };

  // Languages
  const addLanguage = () => {
    onLanguagesChange([
      ...languages,
      { id: crypto.randomUUID(), name: '', level: '' },
    ]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    onLanguagesChange(updated);
  };

  const removeLanguage = (index: number) => {
    onLanguagesChange(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Certificates */}
      <div>
        <h3 className="mb-4 font-semibold">Certificates</h3>
        <div className="space-y-3">
          {certificates.map((cert, index) => (
            <div key={cert.id} className="flex flex-wrap items-start gap-2 rounded-lg border bg-card p-3">
              <Input
                value={cert.name}
                onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                placeholder="Certificate Name"
                className="flex-1 min-w-[150px]"
              />
              <Input
                value={cert.issuer}
                onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                placeholder="Issuer"
                className="w-32"
              />
              <Input
                value={cert.year}
                onChange={(e) => updateCertificate(index, 'year', e.target.value)}
                placeholder="Year"
                className="w-20"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCertificate(index)}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addCertificate} variant="outline" size="sm" className="mt-3 gap-1">
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      {/* Languages */}
      <div>
        <h3 className="mb-4 font-semibold">Languages</h3>
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div key={lang.id} className="flex items-center gap-2">
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                placeholder="Language"
                className="flex-1"
              />
              <Input
                value={lang.level}
                onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                placeholder="Native, Fluent, Basic..."
                className="w-36"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLanguage(index)}
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addLanguage} variant="outline" size="sm" className="mt-3 gap-1">
          <Plus className="h-4 w-4" />
          Add Language
        </Button>
      </div>

      {/* Hobbies */}
      <div className="space-y-2">
        <Label htmlFor="hobbies">Hobbies & Interests (optional)</Label>
        <Textarea
          id="hobbies"
          value={hobbies}
          onChange={(e) => onHobbiesChange(e.target.value)}
          placeholder="Reading, hiking, photography..."
          className="min-h-[60px] resize-none"
        />
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <Label htmlFor="achievements">Notable Achievements (optional)</Label>
        <Textarea
          id="achievements"
          value={achievements}
          onChange={(e) => onAchievementsChange(e.target.value)}
          placeholder="Awards, recognitions, notable accomplishments..."
          className="min-h-[60px] resize-none"
        />
      </div>
    </div>
  );
}
