import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { Deposit } from './entities/deposits.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { query } from 'express';

@Injectable()
export class PaymentService {



  constructor(@InjectRepository(Deposit)
  private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {
    //   this.razorpay = new Razorpay({
    //     key_id: process.env.KEY_ID,
    //     key_secret: process.env.KEY_SECRET,
    //   });

  }


  async createDeposit(data) {
    const deposit = await this.depositRepository.save(
      {
        amount: data.amount,
        user: data.user,
        provider: data.provider,
        transactionId: data.transactionId,
        status: data.status
      },
      { transaction: true },
    );
    return deposit;
  }


  async totalDeposits(userId: string) {
    const sumResult = await this.depositRepository
      .createQueryBuilder('deposits')
      .select('SUM(deposits.amount)', 'sum')
      .where({ status: 'completed', user: { id: userId } })
      .getRawOne();
    console.log("summmmm---->>", sumResult)

    return sumResult?.sum ?? 0;
  }

  async transactions() {
    return await this.depositRepository.find({ where: { 'status': "completed" } });
  }

   
  async transactionsCustomer(user) {
    return await this.depositRepository.find({ where: { 'user': user.userId, 'status': 'completed' }, select: ['amount', "provider","transactionType","status", "transactionId", "updated_at"] });
  }

  async createPaymentOrder(upiData, user) {
    const razorpay = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    try {
      const { amount } = upiData;
      const multipliedAmount = amount * 100;
      const res = await razorpay.paymentLink.create({
        amount: multipliedAmount,
        currency: 'INR',
        callback_method: "get",
        callback_url: 'https://trade.masterinfotech.com/api/payment/dashboard',
        description: 'For XYZ purpose',
        customer: {
          name: 'Gaurav Kumar',
          email: 'gaurav.kumar@example.com',
          contact: '+919000090000',
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        options: { checkout: { method: { netbanking: 1, card: 1, upi: 1, wallet: 0 } } },
      });
      console.log("res------>>", res);

      const data = {
        amount: res.amount,
        user: user.userId,
        provider: 'UPI',
        transactionId: res.id,
        status: 'pending',
      };

      const savedData = await this.createDeposit(data);
      console.log(savedData)
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async paymentConfirmation(webhookData) {
    try {
      console.log("Start");
      const data = await webhookData;
      console.log("Before destructuring");
      const payload = data.payload;
      const event = data.event;
      console.log("After destructuring");
      // const { event, payload } = await data;
      console.log('1st statement')
      const webhook_id = payload.payment_link.entity.id;
      console.log('2nd statement')
      const status = event === 'payment_link.paid' ? 'completed' : 'failed';
      console.log('1st statement')
      const dbUpdate = await this.depositRepository.update({ transactionId: webhook_id }, { payload, status });
      console.log('3rd statement')
      return `Number of rows affected - ${dbUpdate.affected}`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async activeOrderHistory(user) {
  //   try {
  //     const res = await this.orderRepository.find({ where: { 'user': user.userId, 'tradeStatus':'pending' } });
  //     if (res) {
  //       return res;
  //     }
  //     else {
  //       return "No Record Found"
  //     }
  //   } catch (error) {
  //     return error;
  //   }

  // }

  // async pastOrderHistory(user) {
  //   try {
  //     const res = await this.orderRepository.find({ where: { 'user': user.userId, 'tradeStatus':'closed' } });
  //     if (res) {
  //       return res;
  //     }
  //     else {
  //       return "No Record Found"
  //     }
  //   } catch (error) {
  //     return error;
  //   }

  // }

  async bankWithdrawlService() {

  }





}

