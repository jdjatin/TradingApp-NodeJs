import { IsEnum, IsOptional, IsNumber, IsDate, IsDateString } from 'class-validator';

export class TransactionFilterDto {
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed'])
  status?: string;


  @IsOptional()
  @IsDateString()
  last3Days?: string;

  @IsOptional()
  @IsDateString()
  last7Days?: string;

  @IsOptional()
  @IsDateString()
  last30Days?: string;

  @IsOptional()
  @IsDateString()
  last3Months?: string;

  @IsOptional()
  @IsDateString()
  customStartDate?: string;

  @IsOptional()
  @IsDateString()
  customEndDate?: string;
}