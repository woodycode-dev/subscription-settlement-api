import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Plan } from '../plans/plan.entity';
import { Bill } from '../billing/bill.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.subscriptions)
  user: User;

  @ManyToOne(() => Plan, plan => plan.subscriptions)
  plan: Plan;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToMany(() => Bill, bill => bill.subscription)
  bills: Bill[];
}