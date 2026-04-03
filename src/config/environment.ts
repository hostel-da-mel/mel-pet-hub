type Environment = 'development' | 'homologation' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  environment: Environment;
  google: {
    clientId: string;
    redirectUri: string;
  };
}

const FALLBACK_API_URLS: Record<Environment, string> = {
  development: 'https://api.hosteldamel.com',
  homologation: 'https://api.hosteldamel.com',
  production: 'https://api.hosteldamel.com',
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string || '';

const isBrowser = typeof window !== 'undefined';

const detectEnvironment = (): Environment => {
  const mode = import.meta.env.MODE;

  if (mode === 'development' || mode === 'homologation' || mode === 'production') {
    return mode;
  }

  if (!isBrowser) {
    return 'development';
  }

  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }

  if (hostname.includes('hom') || hostname.includes('staging')) {
    return 'homologation';
  }

  return 'production';
};

const resolveApiUrl = (environment: Environment): string => {
  const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;

  if (envApiUrl && envApiUrl.trim().length > 0) {
    return envApiUrl;
  }

  return FALLBACK_API_URLS[environment];
};

const resolveRedirectUri = (): string => {
  if (!isBrowser) return 'https://hosteldamel.com/auth/callback';

  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return `http://localhost:${window.location.port}/auth/callback`;
  }

  return `${window.location.origin}/auth/callback`;
};

const getConfig = (): EnvironmentConfig => {
  const environment = detectEnvironment();

  return {
    apiUrl: resolveApiUrl(environment),
    environment,
    google: {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: resolveRedirectUri(),
    },
  };
};

export const config = getConfig();
