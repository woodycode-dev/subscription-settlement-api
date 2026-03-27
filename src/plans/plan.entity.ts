import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subscription } from '../subscriptions/subscription.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'monthly' })
  billingCycle: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Subscription, subscription => subscription.plan)
  subscriptions: Subscription[];
}