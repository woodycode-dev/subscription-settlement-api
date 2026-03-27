import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settlement, SettlementStatus } from './settlement.entity';
import { BillingService } from '../billing/billing.service';
import { BillStatus } from '../billing/bill.entity';

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(Settlement)
    private settlementRepository: Repository<Settlement>,
    private billingService: BillingService,
  ) {}

  // 단건 정산 처리
  async process(billId: number): Promise<Settlement> {
    const bill = await this.billingService.findById(billId);

    const settlement = this.settlementRepository.create({ bill });

    try {
      // 실제 PG 연동 자리 — 여기서 외부 결제 API 호출
      // 지금은 성공으로 처리
      settlement.status = SettlementStatus.SUCCESS;
      await this.billingService.updateStatus(billId, BillStatus.PAID);
    } catch (e) {
      settlement.status = SettlementStatus.FAILED;
      settlement.failedReason = e.message;
      await this.billingService.updateStatus(billId, BillStatus.FAILED);
    }

    return this.settlementRepository.save(settlement);
  }

  // 미처리 청구서 일괄 정산
  async processBatch(): Promise<{ success: number; failed: number }> {
    const pendingBills = await this.billingService.findPendingBills();

    let success = 0;
    let failed = 0;

    for (const bill of pendingBills) {
      try {
        const settlement = this.settlementRepository.create({ bill });
        settlement.status = SettlementStatus.SUCCESS;
        await this.settlementRepository.save(settlement);
        await this.billingService.updateStatus(bill.id, BillStatus.PAID);
        success++;
      } catch (e) {
        const settlement = this.settlementRepository.create({
          bill,
          status: SettlementStatus.FAILED,
          failedReason: e.message,
        });
        await this.settlementRepository.save(settlement);
        await this.billingService.updateStatus(bill.id, BillStatus.FAILED);
        failed++;
      }
    }

    return { success, failed };
  }

  // 실패 건 재처리
  async retry(settlementId: number): Promise<Settlement> {
    const prev = await this.settlementRepository.findOne({
      where: { id: settlementId },
      relations: ['bill'],
    });

    const retry = this.settlementRepository.create({
      bill: prev.bill,
      status: SettlementStatus.SUCCESS,
    });

    await this.billingService.updateStatus(prev.bill.id, BillStatus.PAID);
    return this.settlementRepository.save(retry);
  }

  // 정산 내역 조회
  async findByBill(billId: number): Promise<Settlement[]> {
    return this.settlementRepository.find({
      where: { bill: { id: billId } },
      order: { processedAt: 'DESC' },
    });
  }

  // 전체 정산 내역
  async findAll(): Promise<Settlement[]> {
    return this.settlementRepository.find({
      relations: ['bill', 'bill.subscription', 'bill.subscription.user'],
      order: { processedAt: 'DESC' },
    });
  }
}