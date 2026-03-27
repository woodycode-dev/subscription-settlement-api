import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Subscription } from '../subscriptions/subscription.entity';
import { Settlement } from '../settlement/settlement.entity';

export enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Subscription, subscription => subscription.bills)
  subscription: Subscription;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  billingDate: Date;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.PENDING })
  status: BillStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Settlement, settlement => settlement.bill)
  settlements: Settlement[];
}