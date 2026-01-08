import { Project } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const addProject = () => {
    onChange([
      ...data,
      {
        id: crypto.randomUUID(),
        name: '',
        role: '',
        description: '',
        link: '',
      },
    ]);
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <div key={project.id} className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {project.name || `Project ${index + 1}`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProject(index)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                placeholder="Project Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Role / Tech Stack</Label>
              <Input
                value={project.role}
                onChange={(e) => updateProject(index, 'role', e.target.value)}
                placeholder="Lead Developer, React, Node.js"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Description</Label>
            <Textarea
              value={project.description}
              onChange={(e) => updateProject(index, 'description', e.target.value)}
              placeholder="Brief description of the project and your contributions..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="mt-4 space-y-2">
            <Label>Link (optional)</Label>
            <Input
              value={project.link || ''}
              onChange={(e) => updateProject(index, 'link', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      ))}

      <Button onClick={addProject} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Project
      </Button>

      {data.length === 0 && (
        <div className="rounded-lg border border-dashed bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Projects are a great way to showcase your skills. Add personal or professional projects.
          </p>
        </div>
      )}
    </div>
  );
}
