import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chart } from './Entity/chart.entity';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Chart)
    private readonly chartRepository: Repository<Chart>,
  ) {}

  async findPlaceIdListByName(name: string): Promise<string[]> {
    const ret = await this.chartRepository.find({
      where: {
        name,
      },
      select: ['placeId'],
      take: 10,
    });

    return ret.map((c) => c.placeId);
  }
}
