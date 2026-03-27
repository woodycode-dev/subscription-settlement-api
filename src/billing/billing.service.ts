import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill, BillStatus } from './bill.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateBillDto } from './dto/create-bill.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async create(dto: CreateBillDto): Promise<Bill> {
    const subscription = await this.subscriptionsService.findById(dto.subscriptionId);
    const bill = this.billsRepository.create({
      subscription,
      amount: subscription.plan.price,
      billingDate: new Date(dto.billingDate),
    });
    return this.billsRepository.save(bill);
  }

  async findBySubscription(subscriptionId: number): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { subscription: { id: subscriptionId } },
      order: { billingDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: { id },
      relations: ['subscription', 'subscription.plan'],
    });
    if (!bill) throw new NotFoundException('청구서를 찾을 수 없습니다.');
    return bill;
  }

  async updateStatus(id: number, status: BillStatus): Promise<Bill> {
    const bill = await this.findById(id);
    bill.status = status;
    return this.billsRepository.save(bill);
  }

  async findPendingBills(): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { status: BillStatus.PENDING },
      relations: ['subscription', 'subscription.plan', 'subscription.user'],
    });
  }
}