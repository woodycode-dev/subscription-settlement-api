import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async create(dto: CreatePlanDto): Promise<Plan> {
    const plan = this.plansRepository.create(dto);
    return this.plansRepository.save(plan);
  }

  async findAll(): Promise<Plan[]> {
    return this.plansRepository.find({ where: { isActive: true } });
  }

  async findById(id: number): Promise<Plan> {
    const plan = await this.plansRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('플랜을 찾을 수 없습니다.');
    return plan;
  }

  async deactivate(id: number): Promise<Plan> {
    const plan = await this.findById(id);
    plan.isActive = false;
    return this.plansRepository.save(plan);
  }
}