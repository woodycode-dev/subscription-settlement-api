import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { PlansService } from '../plans/plans.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private plansService: PlansService,
  ) {}

  async create(user: User, dto: CreateSubscriptionDto): Promise<Subscription> {
    const active = await this.subscriptionsRepository.findOne({
      where: { user: { id: user.id }, status: SubscriptionStatus.ACTIVE },
    });
    if (active) throw new BadRequestException('이미 활성화된 구독이 있습니다.');

    const plan = await this.plansService.findById(dto.planId);
    const subscription = this.subscriptionsRepository.create({ user, plan });
    return this.subscriptionsRepository.save(subscription);
  }

  async findMySubscriptions(userId: number): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { startDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<Subscription> {
    const sub = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!sub) throw new NotFoundException('구독을 찾을 수 없습니다.');
    return sub;
  }

  async changePlan(id: number, dto: UpdateSubscriptionDto): Promise<Subscription> {
    const sub = await this.findById(id);
    if (sub.status !== SubscriptionStatus.ACTIVE)
      throw new BadRequestException('활성화된 구독만 플랜 변경이 가능합니다.');

    sub.plan = await this.plansService.findById(dto.planId);
    return this.subscriptionsRepository.save(sub);
  }

  async cancel(id: number): Promise<Subscription> {
    const sub = await this.findById(id);
    if (sub.status !== SubscriptionStatus.ACTIVE)
      throw new BadRequestException('활성화된 구독만 해지할 수 있습니다.');

    sub.status = SubscriptionStatus.CANCELLED;
    sub.endDate = new Date();
    return this.subscriptionsRepository.save(sub);
  }
}