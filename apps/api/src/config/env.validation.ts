// apps/api/src/config/env.validation.ts
import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @Transform(({ value }) => (value === '' ? undefined : parseInt(value, 10)))
  @IsNumber()
  @IsOptional()
  SHOPEE_PARTNER_ID: number = 0;

  @IsString()
  @IsOptional()
  SHOPEE_PARTNER_KEY: string = '';

  @IsString()
  @IsOptional()
  SHOPEE_API_HOST: string = 'https://partner.test-stable.shopeemobile.com';

  @IsString()
  @IsOptional()
  SHOPEE_REDIRECT_URL: string = '';

  @IsString()
  @IsOptional()
  SHOPEE_FRONTEND_URL: string = '';

  @IsString()
  @IsOptional()
  LAZADA_APP_KEY: string;

  @IsString()
  @IsOptional()
  LAZADA_APP_SECRET: string;

  @IsString()
  @IsOptional()
  LAZADA_API_HOST: string;

  @IsString()
  @IsOptional()
  LAZADA_REDIRECT_URL: string;

  @IsString()
  @IsOptional()
  LAZADA_FRONTEND_URL: string;

  @Transform(({ value }) => (value === '' ? undefined : parseInt(value, 10)))
  @IsNumber()
  @IsOptional()
  API_PORT: number = 3002;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  console.log('Validating environment variables...');
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    console.error('Environment validation errors detected:', JSON.stringify(errors, null, 2));
    throw new Error(`Environment validation failed:\n${errors.toString()}`);
  }

  console.log('Environment validation successful.');
  return validatedConfig;
}
