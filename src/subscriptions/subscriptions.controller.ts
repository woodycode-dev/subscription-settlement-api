import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: '구독 등록' })
  create(@Request() req, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req.user, dto);
  }

  @Get('my')
  @ApiOperation({ summary: '내 구독 목록 조회' })
  findMy(@Request() req) {
    return this.subscriptionsService.findMySubscriptions(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '구독 상세 조회' })
  findOne(@Param('id') id: number) {
    return this.subscriptionsService.findById(+id);
  }

  @Patch(':id/plan')
  @ApiOperation({ summary: '구독 플랜 변경' })
  changePlan(@Param('id') id: number, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionsService.changePlan(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '구독 해지' })
  cancel(@Param('id') id: number) {
    return this.subscriptionsService.cancel(+id);
  }
}