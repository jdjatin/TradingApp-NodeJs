import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsGateway } from './feeds.gateway';

@Module({
  providers: [FeedsGateway, FeedsService]
})
export class FeedsModule {}
