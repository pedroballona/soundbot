import 'dotenv/config';

interface BaseConfiguration {
  readonly token: string;
  readonly clientId: string;
}

interface DevConfiguration extends BaseConfiguration {
  readonly isDevelopment: true;
  readonly guildId: string;
}

interface ProdConfiguration extends BaseConfiguration {
  readonly isDevelopment: false;
}

type ConfigurationType = DevConfiguration | ProdConfiguration;

function getRequiredVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (value == null || value.length === 0) {
    throw new Error(`Environment variable with name: ${name} does not exists.`);
  }
  return value;
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV?.trim() === 'development';
}

function getConfiguration(): ConfigurationType {
  if (isDevelopment()) {
    return {
      isDevelopment: true,
      token: getRequiredVariable('WALL_TOKEN'),
      clientId: getRequiredVariable('WALL_CLIENT_ID'),
      guildId: getRequiredVariable('WALL_GUILD_ID'),
    };
  }
  return {
    isDevelopment: false,
    token: getRequiredVariable('WALL_TOKEN'),
    clientId: getRequiredVariable('WALL_CLIENT_ID'),
  };
}

const Configuration = getConfiguration();

export default Configuration;
