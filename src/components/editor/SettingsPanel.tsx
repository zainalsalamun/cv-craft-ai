import { CVSettings } from '@/types/cv';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SettingsPanelProps {
  settings: CVSettings;
  onChange: (settings: CVSettings) => void;
}

const accentColors = [
  { value: '#3B82F6', name: 'Blue' },
  { value: '#10B981', name: 'Green' },
  { value: '#8B5CF6', name: 'Purple' },
  { value: '#F59E0B', name: 'Amber' },
  { value: '#EF4444', name: 'Red' },
  { value: '#1F2937', name: 'Slate' },
];

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const updateSetting = <K extends keyof CVSettings>(key: K, value: CVSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <Label className="mb-3 block font-semibold">Template</Label>
        <RadioGroup
          value={settings.template}
          onValueChange={(value) => updateSetting('template', value as CVSettings['template'])}
          className="grid grid-cols-3 gap-2"
        >
          <div>
            <RadioGroupItem value="classic" id="classic" className="peer sr-only" />
            <Label
              htmlFor="classic"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-gray-900" />
              <span className="text-xs">Classic</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
            <Label
              htmlFor="modern"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded border-t-4 border-primary bg-white" />
              <span className="text-xs">Modern</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="creative" id="creative" className="peer sr-only" />
            <Label
              htmlFor="creative"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 flex h-12 w-10 overflow-hidden rounded">
                <div className="w-1/3 bg-primary" />
                <div className="w-2/3 bg-white" />
              </div>
              <span className="text-xs">Creative</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Accent Color */}
      <div>
        <Label className="mb-3 block font-semibold">Accent Color</Label>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSetting('accentColor', color.value)}
              className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                settings.accentColor === color.value ? 'ring-2 ring-foreground ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <Label className="mb-3 block font-semibold">Font Size</Label>
        <RadioGroup
          value={settings.fontSize}
          onValueChange={(value) => updateSetting('fontSize', value as CVSettings['fontSize'])}
          className="flex gap-2"
        >
          {['small', 'medium', 'large'].map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={size} className="peer sr-only" />
              <Label
                htmlFor={size}
                className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-muted bg-card px-4 py-2 text-sm capitalize hover:bg-accent peer-data-[state=checked]:border-primary"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <Label className="block font-semibold">Visibility</Label>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="showPhoto" className="cursor-pointer text-sm">
            Show Profile Photo
          </Label>
          <Switch
            id="showPhoto"
            checked={settings.showPhoto}
            onCheckedChange={(checked) => updateSetting('showPhoto', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showProjects" className="cursor-pointer text-sm">
            Show Projects Section
          </Label>
          <Switch
            id="showProjects"
            checked={settings.showProjects}
            onCheckedChange={(checked) => updateSetting('showProjects', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showCertificates" className="cursor-pointer text-sm">
            Show Certificates Section
          </Label>
          <Switch
            id="showCertificates"
            checked={settings.showCertificates}
            onCheckedChange={(checked) => updateSetting('showCertificates', checked)}
          />
        </div>
      </div>
    </div>
  );
}
