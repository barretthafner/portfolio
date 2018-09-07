import { name } from './package.json';
export { name };

// Export environment
export const
	NODE_ENV_DEVELOPMENT = 'development',
	NODE_ENV_STAGING = 'staging',
	NODE_ENV_PRODUCTION = 'production',
	env = process.env.NODE_ENV || NODE_ENV_DEVELOPMENT;

// Export server configurations
export const ip = process.env.IP || (env === NODE_ENV_DEVELOPMENT ? 'localhost' : undefined);
export const port = process.env.PORT || (env === NODE_ENV_PRODUCTION ? undefined : 8080);

// define server domains
const domains = {
	[NODE_ENV_DEVELOPMENT]: 'localhost',
	[NODE_ENV_STAGING]: 'staging.barretthafner.com',
	[NODE_ENV_PRODUCTION]: 'www.barrethafner.com'
};

// Export domain for environment
export const domain = domains[env];

// Export protocol
const enableHttps = env !== NODE_ENV_DEVELOPMENT;
export const protocol = enableHttps ? 'https://' : 'http://';

export const siteTitle = 'Barrett Hafner | Net Runner';
