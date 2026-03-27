import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';
import { CreateBillDto } from './dto/create-bill.dto';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: '청구서 생성' })
  create(@Body() dto: CreateBillDto) {
    return this.billingService.create(dto);
  }

  @Get('subscription/:subscriptionId')
  @ApiOperation({ summary: '구독별 청구서 목록 조회' })
  findBySubscription(@Param('subscriptionId') subscriptionId: number) {
    return this.billingService.findBySubscription(+subscriptionId);
  }

  @Get(':id')
  @ApiOperation({ summary: '청구서 상세 조회' })
  findOne(@Param('id') id: number) {
    return this.billingService.findById(+id);
  }

  @Get('pending/all')
  @ApiOperation({ summary: '미처리 청구서 목록 조회' })
  findPending() {
    return this.billingService.findPendingBills();
  }
}