import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SettlementService } from './settlement.service';

@ApiTags('Settlement')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settlement')
export class SettlementController {
  constructor(private settlementService: SettlementService) {}

  @Post('process/:billId')
  @ApiOperation({ summary: '단건 정산 처리' })
  process(@Param('billId') billId: number) {
    return this.settlementService.process(+billId);
  }

  @Post('batch')
  @ApiOperation({ summary: '미처리 청구서 일괄 정산' })
  processBatch() {
    return this.settlementService.processBatch();
  }

  @Post('retry/:settlementId')
  @ApiOperation({ summary: '실패 건 재처리' })
  retry(@Param('settlementId') settlementId: number) {
    return this.settlementService.retry(+settlementId);
  }

  @Get('bill/:billId')
  @ApiOperation({ summary: '청구서별 정산 내역 조회' })
  findByBill(@Param('billId') billId: number) {
    return this.settlementService.findByBill(+billId);
  }

  @Get()
  @ApiOperation({ summary: '전체 정산 내역 조회' })
  findAll() {
    return this.settlementService.findAll();
  }
}