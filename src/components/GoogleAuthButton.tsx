import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import googleLogo from '@/assets/google-logo.png';

interface GoogleAuthButtonProps {
  onClick: () => void;
  label?: string;
}

export function GoogleAuthButton({
  onClick,
  label = 'Continuar com Google',
}: GoogleAuthButtonProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full mb-6"
        onClick={onClick}
      >
        <img src={googleLogo} alt="Google" className="w-5 h-5 mr-2" />
        {label}
      </Button>

      <div className="relative mb-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          ou
        </span>
      </div>
    </>
  );
}
