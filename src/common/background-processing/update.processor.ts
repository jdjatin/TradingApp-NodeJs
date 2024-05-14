// update.processor.ts

import { Process, Processor } from '@nestjs/bull';
import { EntityManager } from 'typeorm';

@Processor('updateQueue') // Specify the queue name to listen to
export class UpdateProcessor {
    constructor(private readonly entityManager: EntityManager) { }

    @Process('update') // Specify the job name to process
    async handleUpdateJob(job: any): Promise<void> {
        console.log('JOB DATA', job.data)
        // Perform the database update based on job.data
        // This method should be non-blocking and return quickly
        const query = `
        UPDATE order
        SET closingPrice = :closingPrice, closingType = :closingType
        WHERE id = :orderId
      `;
        const data = job.data;
        const parameters = [
            234.123 ?? data.cmp,
            'Triggered',
            data.id
        ]

        await this.entityManager.query(query, parameters);
    }
}
