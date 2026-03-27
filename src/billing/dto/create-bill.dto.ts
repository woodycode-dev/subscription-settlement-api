import { IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  subscriptionId: number;

  @ApiProperty({ example: '2026-03-27' })
  @IsDateString()
  billingDate: string;
}