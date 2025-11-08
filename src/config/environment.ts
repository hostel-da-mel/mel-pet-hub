type Environment = 'development' | 'homologation' | 'production';

interface EnvironmentConfig {
  apiUrl: string;
  environment: Environment;
}

const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  
  if (hostname.includes('hom') || hostname.includes('staging')) {
    return 'homologation';
  }
  
  return 'production';
};

const getConfig = (): EnvironmentConfig => {
  const env = getEnvironment();
  
  const configs: Record<Environment, string> = {
    development: 'https://dev-api.hosteldamel.com',
    homologation: 'https://hom-api.hosteldamel.com',
    production: 'https://api.hosteldamel.com',
  };
  
  return {
    apiUrl: configs[env],
    environment: env,
  };
};

export const config = getConfig();
