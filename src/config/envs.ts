import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
  NODE_ENV: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().required(),
    NODE_ENV: joi.string().required().valid('dev', 'production', 'test'),
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
};
