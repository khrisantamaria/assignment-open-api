import { IsString, IsOptional } from 'class-validator';

export class GetRatesDto {
  @IsString()
  @IsOptional()
  base_currency?: string = 'USD';

  @IsString()
  @IsOptional()
  currencies?: string;
} 