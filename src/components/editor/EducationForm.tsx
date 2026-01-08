import { Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        startYear: '',
        endYear: '',
        notes: '',
      },
    ]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((edu, index) => (
        <div key={edu.id} className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {edu.degree || edu.institution || `Education ${index + 1}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEducation(index)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                placeholder="University Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Degree / Major</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="Bachelor of Science in..."
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Year</Label>
              <Input
                value={edu.startYear}
                onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                placeholder="2018"
              />
            </div>
            <div className="space-y-2">
              <Label>End Year</Label>
              <Input
                value={edu.endYear}
                onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                placeholder="2022"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Notes (optional)</Label>
            <Input
              value={edu.notes || ''}
              onChange={(e) => updateEducation(index, 'notes', e.target.value)}
              placeholder="GPA, honors, relevant coursework..."
            />
          </div>
        </div>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}
