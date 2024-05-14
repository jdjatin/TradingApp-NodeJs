import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './orders.controller';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';
import { Deposit } from '../payment/entities/deposits.entity';
import { BackgroundProcessingService } from '../common/background-processing/background-processing.service';
import { BullModule } from '@nestjs/bull';
import { BullQueueModule } from '../bull.module';


@Module({
  providers: [OrdersGateway, OrdersService, PaymentService, BackgroundProcessingService],
  controllers: [OrderController],
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost', // Redis server host
        port: 6379, // Redis server port
      },
    }),
    BullQueueModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      Order, Group, GroupUser, Deposit
    ])
  ]
})
export class OrdersModule { }
