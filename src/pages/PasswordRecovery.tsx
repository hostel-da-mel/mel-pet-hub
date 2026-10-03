import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { validatePassword, getPasswordErrorMessage } from "@/lib/password-validation";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { contact } from "@/config/contact";

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const validation = validatePassword(password);

  const sendCode = async () => {
    setBusy(true);
    setError("");
    try {
      await api.forgotPassword(email.trim());
      setStep("password");
      setCode("");
      toast({ title: "Solicitação recebida", description: "Se sua conta permitir recuperação, você receberá um código por e-mail. Confira também o spam." });
    } catch {
      setError("Não foi possível solicitar o código. Confira o e-mail e tente novamente. Contas criadas com Google devem entrar pelo botão Google.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (step === "email") return sendCode();
    if (!code.trim()) {
      setError("Informe o código de recuperação recebido por e-mail.");
      return;
    }
    if (!validation.isValid) {
      setError(getPasswordErrorMessage(validation));
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.confirmForgotPassword(email.trim(), code.trim(), password);
      toast({ title: "Senha redefinida", description: "Entre com sua nova senha." });
      navigate("/login", { replace: true });
    } catch {
      setError("Não foi possível redefinir a senha. Confira o código; se ele expirou, solicite um novo. Tente novamente ou fale com a anfitriã.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Recuperar senha</CardTitle>
            <CardDescription>
              {step === "email" ? "Informe o e-mail da sua conta para solicitar um código." : `Informe o código enviado para ${email.trim()} e escolha uma nova senha.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {step === "email" ? (
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">E-mail</Label>
                  <Input id="recovery-email" type="email" autoComplete="email" required value={email} disabled={busy} onChange={e => setEmail(e.target.value)} />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-code">Código de recuperação</Label>
                    <Input id="recovery-code" autoComplete="one-time-code" inputMode="numeric" required value={code} disabled={busy} onChange={e => setCode(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} disabled={busy} onChange={e => setPassword(e.target.value)} />
                    <PasswordStrengthIndicator validation={validation} show={password.length > 0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirme a nova senha</Label>
                    <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmation} disabled={busy} onChange={e => setConfirmation(e.target.value)} />
                  </div>
                </>
              )}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Aguarde..." : step === "email" ? "Solicitar código" : "Redefinir senha"}
              </Button>
              {step === "password" && (
                <div className="flex flex-wrap justify-between gap-2">
                  <Button type="button" variant="ghost" disabled={busy} onClick={sendCode}>Reenviar código</Button>
                  <Button type="button" variant="ghost" disabled={busy} onClick={() => { setStep("email"); setCode(""); setPassword(""); setConfirmation(""); setError(""); }}>Alterar e-mail</Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">Se você entrou com Google, use o botão Google na tela de login.</p>
              <div className="flex justify-between text-sm">
                <Link to="/login" className="text-primary underline">Voltar para entrar</Link>
                <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Preciso de ajuda</a>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
