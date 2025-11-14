import { Check, X } from 'lucide-react';
import { PasswordValidationResult } from '@/lib/password-validation';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult;
  show?: boolean;
}

export function PasswordStrengthIndicator({
  validation,
  show = true,
}: PasswordStrengthIndicatorProps) {
  if (!show) {
    return null;
  }

  const requirements = [
    { label: 'Mínimo 8 caracteres', met: validation.checks.hasMinLength },
    { label: 'Uma letra maiúscula', met: validation.checks.hasUpperCase },
    { label: 'Uma letra minúscula', met: validation.checks.hasLowerCase },
    { label: 'Um número', met: validation.checks.hasNumber },
    { label: 'Um caractere especial', met: validation.checks.hasSpecialChar },
    { label: 'Sem caracteres < ou >', met: validation.checks.noInvalidChars },
  ];

  return (
    <div className="space-y-2 mt-2 p-3 bg-muted/50 rounded-md text-sm">
      <p className="font-medium text-muted-foreground">Requisitos da senha:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={cn(
              'flex items-center gap-2',
              req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
            )}
          >
            {req.met ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
