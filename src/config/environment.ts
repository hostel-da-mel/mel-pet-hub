type Environment = 'development' | 'homologation' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  environment: Environment;
}

const ENVIRONMENT_VALUES: Environment[] = [
  'development',
  'homologation',
  'production',
];

const API_URL_FALLBACKS: Record<Environment, string> = {
  development: 'https://dev-api.hosteldamel.com',
  homologation: 'https://hom-api.hosteldamel.com',
  production: 'https://api.hosteldamel.com',
};

const getEnvironmentFromMeta = (): Environment | undefined => {
  const value = import.meta.env?.VITE_APP_ENVIRONMENT as
    | Environment
    | undefined;

  if (value && ENVIRONMENT_VALUES.includes(value)) {
    return value;
  }

  return undefined;
};

const getEnvironmentFromWindow = (): Environment | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
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

const getEnvironment = (): Environment => {
  return (
    getEnvironmentFromMeta() ?? getEnvironmentFromWindow() ?? 'production'
  );
};

const getApiUrl = (environment: Environment): string => {
  const metaBaseUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;

  if (metaBaseUrl) {
    return metaBaseUrl;
  }

  return API_URL_FALLBACKS[environment];
};

const getConfig = (): EnvironmentConfig => {
  const environment = getEnvironment();

  return {
    apiUrl: getApiUrl(environment),
    environment,
  };
};

export const config = getConfig();
