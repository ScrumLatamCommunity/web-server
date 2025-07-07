import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
  NODE_ENV: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;
  BUCKET_NAME: string;
  DOMAIN: string;
  ENDPOINT_URL: string;
  TOKEN_CLOUDFLARE: string;
  PREDETERMINADO: string;
  UNION_EUROPEA: string;
  FRONTEND_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().required(),
    NODE_ENV: joi.string().required().valid('dev', 'production', 'test'),
    AWS_ACCESS_KEY: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required(),
    BUCKET_NAME: joi.string().required(),
    DOMAIN: joi.string().required(),
    ENDPOINT_URL: joi.string().required(),
    TOKEN_CLOUDFLARE: joi.string().required(),
    PREDETERMINADO: joi.string().required(),
    UNION_EUROPEA: joi.string().required(),
    FRONTEND_URL: joi.string().optional().default('https://scrumlatam.com'),
  })
  .unknown();

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: \${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mailUser: envVars.MAIL_USER,
  mailPassword: envVars.MAIL_PASSWORD,
  mailFrom: envVars.MAIL_FROM,
  nodeEnv: envVars.NODE_ENV,
  awsAccessKey: envVars.AWS_ACCESS_KEY,
  awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
  bucketName: envVars.BUCKET_NAME,
  domain: envVars.DOMAIN,
  endpointUrl: envVars.ENDPOINT_URL,
  predeterminado: envVars.PREDETERMINADO,
  tokenCloudflare: envVars.TOKEN_CLOUDFLARE,
  unionEuropea: envVars.UNION_EUROPEA,
  frontendUrl: envVars.FRONTEND_URL,
};
