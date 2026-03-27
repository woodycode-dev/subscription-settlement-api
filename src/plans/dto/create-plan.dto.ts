import { IsString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ example: '베이직 플랜' })
  @IsString()
  name: string;

  @ApiProperty({ example: 9900 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  @IsString()
  @IsIn(['monthly', 'yearly'])
  billingCycle: string;
}