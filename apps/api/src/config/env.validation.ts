// apps/api/src/config/env.validation.ts
import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  SHOPEE_PARTNER_ID: number;

  @IsString()
  SHOPEE_PARTNER_KEY: string;

  @IsString()
  SHOPEE_API_HOST: string;

  @IsString()
  SHOPEE_REDIRECT_URL: string;

  @IsString()
  SHOPEE_FRONTEND_URL: string;

  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  API_PORT: number = 3002;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.toString()}`);
  }

  return validatedConfig;
}
