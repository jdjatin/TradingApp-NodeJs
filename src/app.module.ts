/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { ManagerModule } from './manager/manager.module';
import { Group } from './manager/entities/groups.entity';
import { GroupUser } from './manager/entities/groups_users.entity';
import { Manager } from './manager/entities/manager.entity';
import { FeedsModule } from './feeds/feeds.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { UserProfile } from './users/entities/user_profile.entity';
import { PaymentModule } from './payment/payment.module';
import { Deposit } from './payment/entities/deposits.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CompleteProfile } from './auth/entities/completeProfile.entity';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { FeedbackForm } from './miscellaneous/entity/feedback.entity';
import { faq } from './miscellaneous/entity/faq.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { BullModule } from '@nestjs/bull';
import { UpdateProcessor } from './common/background-processing/update.processor';
import { UserDocs } from './auth/entities/userDocs.entity';
import * as express from 'express';
import * as serveStatic from 'serve-static';

@Module({

  imports: [
    BullModule.registerQueue({
      name: 'updateQueue', 
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'views'),

    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, RefreshToken, Group, GroupUser, Manager, Order, UserProfile,Order, Deposit, CompleteProfile,FeedbackForm,Wishlist, faq, UserDocs ],
        synchronize: true,   //make true if want to run migration 
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    UsersModule,
    AuthModule,
    MailModule,
    ManagerModule,
    FeedsModule,
    OrdersModule,
    PaymentModule,
    MiscellaneousModule,
    WishlistModule
  ],
  controllers: [],
  providers: [UpdateProcessor],
})
export class AppModule {  configure(consumer: MiddlewareConsumer) {
  // Define the path to your "docs" directory
  const docsDirectory = join(__dirname, '..', 'docs'); // Adjust the path as needed

  // Serve static files from the "docs" directory under the /docs route
  consumer
    .apply(serveStatic.default(docsDirectory))
    .forRoutes({ path: '/docs', method: RequestMethod.GET });
} }
