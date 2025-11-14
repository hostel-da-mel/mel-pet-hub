import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';

interface LoginFormData {
  email: string;
  senha: string;
}

export function useLoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    senha: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.senha);
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta ao Hostel da Mel.',
      });
      navigate('/pet-register');
    } catch (error) {
      const errorDetails = handleError(error, 'Login', 'Erro ao fazer login');
      toast({
        title: errorDetails.title,
        description: errorDetails.description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      const errorDetails = handleError(error, 'Google Login', 'Erro ao fazer login com Google');
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
    handleSubmit,
    handleGoogleLogin,
  };
}
