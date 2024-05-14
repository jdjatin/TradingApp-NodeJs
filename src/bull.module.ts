// bull.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BackgroundProcessingService } from './common/background-processing/background-processing.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'updateQueue',
        }),
    ],
    providers: [BackgroundProcessingService],
    exports: [BullModule],
})
export class BullQueueModule { }
