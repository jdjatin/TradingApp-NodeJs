// background-processing.service.ts

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BackgroundProcessingService {
  constructor(@InjectQueue('updateQueue') private readonly updateQueue: Queue) {}

  async processUpdateTask(taskData: any): Promise<void> {
    await this.updateQueue.add('update', taskData);
  }
}
