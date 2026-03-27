import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Bill } from '../billing/bill.entity';

export enum SettlementStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Bill, bill => bill.settlements)
  bill: Bill;

  @Column({ type: 'enum', enum: SettlementStatus, default: SettlementStatus.PENDING })
  status: SettlementStatus;

  @Column({ nullable: true })
  failedReason: string;

  @CreateDateColumn()
  processedAt: Date;
}