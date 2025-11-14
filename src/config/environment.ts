type Environment = 'development' | 'homologation' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  environment: Environment;
}

const FALLBACK_API_URLS: Record<Environment, string> = {
  development: 'https://dev-api.hosteldamel.com',
  homologation: 'https://hom-api.hosteldamel.com',
  production: 'https://api.hosteldamel.com',
};

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

const getConfig = (): EnvironmentConfig => {
  const environment = detectEnvironment();

  return {
    apiUrl: resolveApiUrl(environment),
    environment,
  };
};

export const config = getConfig();
