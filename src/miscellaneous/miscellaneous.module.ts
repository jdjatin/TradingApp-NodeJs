import { Module } from '@nestjs/common';
import { MiscellaneousController } from './miscellaneous.controller';
import { MiscellaneousService } from './miscellaneous.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackForm } from './entity/feedback.entity';
import { faq } from './entity/faq.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      FeedbackForm, faq
    ])
  ],
  controllers: [MiscellaneousController],
  providers: [MiscellaneousService]
})
export class MiscellaneousModule {}
