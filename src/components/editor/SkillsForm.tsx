import { Skill } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const addSkill = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        name: '',
        level: 'intermediate',
      },
    ]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add your key skills. Include technical skills, tools, and soft skills relevant to your target role.
      </p>

      <div className="space-y-3">
        {data.map((skill, index) => (
          <div key={skill.id} className="flex items-center gap-3">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(index, 'name', e.target.value)}
              placeholder="Skill name"
              className="flex-1"
            />
            <Select
              value={skill.level}
              onValueChange={(value) => updateSkill(index, 'level', value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(index)}
              className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={addSkill} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Skill
      </Button>

      {data.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No skills added yet. Click the button above to add your first skill.
          </p>
        </div>
      )}
    </div>
  );
}
