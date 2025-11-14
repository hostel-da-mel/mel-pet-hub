import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import {
  validatePassword,
  getPasswordErrorMessage,
} from '@/lib/password-validation';
import { handleError } from '@/lib/error-handler';

interface RegisterFormData {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  aniversario: string;
  senha: string;
  confirmarSenha: string;
}

export function useRegisterForm() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    aniversario: '',
    senha: '',
    confirmarSenha: '',
  });

  const passwordValidation = useMemo(
    () => validatePassword(formData.senha),
    [formData.senha]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password strength
    if (!passwordValidation.isValid) {
      toast({
        title: 'Senha inválida',
        description: getPasswordErrorMessage(passwordValidation),
        variant: 'destructive',
      });
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await api.register({
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
        aniversario: formData.aniversario || undefined,
        senha: formData.senha,
      });

      toast({
        title: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso. Faça login para continuar.',
      });

      navigate('/login');
    } catch (error) {
      const errorDetails = handleError(error, 'Register', 'Erro ao cadastrar');
      toast({
        title: errorDetails.title,
        description: errorDetails.description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      const errorDetails = handleError(error, 'Google Register', 'Erro ao cadastrar com Google');
      toast({
        title: errorDetails.title,
        description: errorDetails.description,
        variant: 'destructive',
      });
    }
  };

  return {
    formData,
    setFormData,
    loading,
    showPasswordRequirements,
    setShowPasswordRequirements,
    passwordValidation,
    handleSubmit,
    handleGoogleSignup,
  };
}
