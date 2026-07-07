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
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          <div>
            <RadioGroupItem value="classic" id="classic" className="peer sr-only" />
            <Label
              htmlFor="classic"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-gray-900" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Classic</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
            <Label
              htmlFor="modern"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded border-t-4 border-primary bg-white shadow-sm" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Modern</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="creative" id="creative" className="peer sr-only" />
            <Label
              htmlFor="creative"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 flex h-12 w-10 overflow-hidden rounded shadow-sm">
                <div className="w-1/3 bg-primary" />
                <div className="w-2/3 bg-white" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Creative</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
            <Label
              htmlFor="professional"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded border-b-2 border-primary bg-white flex flex-col justify-between p-1 shadow-sm">
                <div className="w-full h-1/4 bg-gray-200" />
                <div className="w-full h-1/2 bg-gray-100" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Professional</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="minimalist" id="minimalist" className="peer sr-only" />
            <Label
              htmlFor="minimalist"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-200 flex flex-col items-center p-1 shadow-sm">
                <div className="w-1/2 h-1/4 border-b border-gray-300" />
                <div className="w-full h-1/2 mt-1 border-l border-gray-200" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Minimalist</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="executive" id="executive" className="peer sr-only" />
            <Label
              htmlFor="executive"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col items-center p-1 shadow-sm">
                <div className="w-3/4 h-1 border-b border-gray-800 mb-1" />
                <div className="w-full h-1/4 bg-gray-100 mb-1" />
                <div className="w-full h-1/4 bg-gray-100" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">Executive</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="tech" id="tech" className="peer sr-only" />
            <Label
              htmlFor="tech"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-slate-50 border border-slate-200 flex flex-col overflow-hidden shadow-sm">
                <div className="w-full h-1/4 bg-slate-800" />
                <div className="flex flex-1 w-full">
                  <div className="w-2/3 h-full border-r border-slate-200" />
                  <div className="w-1/3 h-full bg-slate-100" />
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Tech / IT</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="harvard" id="harvard" className="peer sr-only" />
            <Label
              htmlFor="harvard"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col items-center p-1 shadow-sm">
                <div className="w-full h-2 border-b-2 border-black mb-1 flex items-center justify-center">
                  <div className="w-1/2 h-[1px] bg-black"></div>
                </div>
                <div className="w-full h-1 border-b border-black mb-1" />
                <div className="w-full h-1 border-b border-black mb-1" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-800">Harvard</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="startup" id="startup" className="peer sr-only" />
            <Label
              htmlFor="startup"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col shadow-sm">
                <div className="w-full h-1/4 bg-gray-100 border-b border-gray-200" />
                <div className="flex flex-1 w-full p-0.5 gap-0.5">
                  <div className="w-2/3 h-full bg-gray-50 border border-gray-100" />
                  <div className="w-1/3 h-full bg-gray-50 border border-gray-100" />
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">Startup</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="elegant" id="elegant" className="peer sr-only" />
            <Label
              htmlFor="elegant"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col shadow-sm overflow-hidden">
                <div className="w-full h-1/5 border-b border-gray-200 flex items-center justify-center">
                  <div className="w-2/3 h-1 bg-gray-400 rounded-full" />
                </div>
                <div className="flex-1 p-1">
                  <div className="w-full h-1/3 border-b border-dashed border-gray-200" />
                  <div className="w-full h-1/3 border-b border-dashed border-gray-200" />
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">Elegant</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="academic" id="academic" className="peer sr-only" />
            <Label
              htmlFor="academic"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col shadow-sm overflow-hidden">
                <div className="w-full h-1/5 bg-gray-800 flex items-center justify-center">
                  <div className="w-1/2 h-[2px] bg-white rounded-full" />
                </div>
                <div className="flex-1 p-0.5 flex flex-col gap-0.5">
                  <div className="w-full h-1 bg-gray-200" />
                  <div className="w-full h-1 bg-gray-100" />
                  <div className="w-full h-1 bg-gray-100" />
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600">Academic</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="infographic" id="infographic" className="peer sr-only" />
            <Label
              htmlFor="infographic"
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent peer-data-[state=checked]:border-primary"
            >
              <div className="mb-2 h-12 w-10 rounded bg-white border border-gray-300 flex flex-col shadow-sm overflow-hidden">
                <div className="w-full h-1/4 bg-gradient-to-r from-blue-400 to-purple-500" />
                <div className="flex-1 p-0.5 flex gap-0.5">
                  <div className="w-1/2 h-full bg-gray-100 rounded-sm" />
                  <div className="w-1/2 h-full flex flex-col gap-0.5">
                    <div className="h-1/2 bg-gray-100 rounded-sm" />
                    <div className="h-1/2 bg-gray-100 rounded-sm" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">Infographic</span>
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
