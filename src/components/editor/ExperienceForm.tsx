import { WorkExperience } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';

interface ExperienceFormProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        isPresent: false,
        bullets: [''],
      },
    ]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addBullet = (expIndex: number) => {
    const updated = [...data];
    updated[expIndex].bullets.push('');
    onChange(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data];
    updated[expIndex].bullets[bulletIndex] = value;
    onChange(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...data];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div key={exp.id} className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {exp.position || exp.company || `Experience ${index + 1}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExperience(index)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                placeholder="Job Title"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={exp.location || ''}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={exp.startDate}
                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                placeholder="Jan 2020"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>End Date</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={exp.isPresent}
                    onCheckedChange={(checked) => updateExperience(index, 'isPresent', checked)}
                  />
                  <span className="text-xs text-muted-foreground">Present</span>
                </div>
              </div>
              <Input
                value={exp.isPresent ? 'Present' : exp.endDate}
                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                placeholder="Dec 2023"
                disabled={exp.isPresent}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="mb-2 block">Responsibilities / Achievements</Label>
            <div className="space-y-2">
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <span className="mt-2.5 text-muted-foreground">•</span>
                  <Input
                    value={bullet}
                    onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                    placeholder="Describe your achievement or responsibility..."
                    className="flex-1"
                  />
                  {exp.bullets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBullet(index, bulletIndex)}
                      className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addBullet(index)}
              className="mt-2 gap-1 text-primary"
            >
              <Plus className="h-4 w-4" />
              Add bullet point
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
}
