import { Label } from '@/components/ui/label';
import { daycareOptions, type DaycareFrequency } from '@/lib/daycare';

export function DaycareSelect({ value, onChange }: {
  value: DaycareFrequency | '';
  onChange: (value: DaycareFrequency) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="daycare-frequency">Frequência de creche *</Label>
      <select id="daycare-frequency" required value={value}
        onChange={event => onChange(event.target.value as DaycareFrequency)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option value="" disabled>Selecione a frequência</option>
        {daycareOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {!value && <p className="text-xs text-muted-foreground">Informe com que frequência seu pet frequenta creche.</p>}
    </div>
  );
}
