import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, IsNull, Not, Repository, getRepository } from 'typeorm';
import { Group } from '../manager/entities/groups.entity';
import { GroupUser } from '../manager/entities/groups_users.entity';
import { PaymentService } from '../payment/payment.service';
import WebSocket from 'websocket';
import { BackgroundProcessingService } from '../common/background-processing/background-processing.service';
import { WrapPositionDto } from './dto/wrap-position.dto';
import { Deposit } from '../payment/entities/deposits.entity';

@Injectable()
export class OrdersService {

  constructor(
    private readonly backgroundProcessingService: BackgroundProcessingService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupUser)
    private readonly groupUserRepository: Repository<GroupUser>,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    private readonly paymentService: PaymentService
  ) { }


  async createBuy(data: any, userId: any) {
    try {
      data.currentInitialPrice = data.OpeningPrice == 0 ? data.ClosingPrice : data.OpeningPrice;
      const isValidOrderValue = await this.validateOrderValue(userId, data);
      const isValidSL = await this.validateStopLossBuy(data);
      const isValidTP = this.validateTakeProfitBuy(data);

      if (!isValidOrderValue) throw new Error("You don't have sufficient balance.");
      if (!isValidSL) throw new Error("Stop-loss must be less than price");
      if (!isValidTP) throw new Error("Take-profit must be greater than current price");
      if (isValidOrderValue && isValidSL && isValidTP) {
        this.deductAmountFromDeposit(userId, data.Price);  //deduct amount from total balance
        const order = await this.orderRepository.save({
          FullPairName: data.FullPairName,
          PairId: data.PairId,
          Symbol: data.Symbol,   //NICKNAME
          SwapRate: data.SwapRate,
          Price: data.Price,
          StopLimitPrice: data.StopLimitPrice,
          LotSize: data.LotSize,
          SL: data.SL,
          TakeProfit: data.TP,
          OrderCategories: data.OrderCategories,
          OrderType: data.OrderType,
          UserId: userId,
          openingPrice: data.OpeningPrice,
          closingPrice: data.ClosingPrice,
          Remarks: data.Remarks
        });

        return order;
      }
    } catch (error) {
      console.log('ERRRRROOOOORRRRR--->>>', error)
      throw new Error(error.message);

    }
  }

  async createSell(data: any, userId: any) {
    try {
      const isValidOrderValue = await this.validateOrderValue(userId, data);
      const isValidSL = await this.validateStopLossSell(data);
      const isValidTP = await this.validateTakeProfitSell(data);

      if (!isValidOrderValue) throw new Error("You don't have sufficient balance.");
      if (!isValidSL) throw new Error("Stop-loss must be greater than entry price");
      if (!isValidTP) throw new Error("Take-profit must be less than entry price");
      if (isValidOrderValue && isValidSL && isValidTP) {
        const order = await this.orderRepository.save({
          FullPairName: data.FullPairName,
          PairId: data.PairId,
          Symbol: data.Symbol,   //NICKNAME
          SwapRate: data.SwapRate,
          Price: data.Price,
          StopLimitPrice: data.StopLimitPrice,
          LotSize: data.LotSize,
          SL: data.SL,
          TakeProfit: data.TP,
          OrderCategories: data.OrderCategories,
          OrderType: data.OrderType,
          UserId: userId,
          openingPrice: data.OpeningPrice,
          closingPrice: data.ClosingPrice,
          Remarks: data.Remarks
        });
        return order;
      }
    } catch (error) {
      throw new Error(error.message);

    }
  }

  async deductAmountFromDeposit(userId, amount) {
    const deposit = await this.depositRepository.save({
      user: userId,
      amount: amount,
      provider: 'Order',
      transaction_id: 'AQULKKJ12132M2K3D',
      status: 'completed',
      transaction_type: 'Order'
    });
    return deposit;

  }

  async wrapPosition(data: any, userId: any) {
    try {
      const order = await this.orderRepository.update(
        { id: data.orderId, UserId: userId },
        {
          closingPrice: data.currentClosingPrice,
          closingType: 'Manual',
          tradeStatus: 'Closed'
        });
      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async wrapPositionMultiple(positions: WrapPositionDto[], userId: any) {
    try {
      const closedPositionIds: string[] = [];

      for (const position of positions) {
        const order = await this.orderRepository.update(
          { id: position.orderId, UserId: userId },
          {
            closingPrice: position.currentClosingPrice,
            closingType: 'Manual',
            tradeStatus: 'Closed'
          });
        closedPositionIds.push(position.orderId);
      }

      return closedPositionIds;


    } catch (error) {
      throw new Error(error.message);
    }
  }





  async findAll(userid: string) {
    const unSortedData = await this.orderRepository
      .createQueryBuilder("orders")
      .where("orders.UserId= :UserId", { UserId: userid })
      .getMany();
    // Convert property names to camelCase
    const orders = unSortedData.map((item) => {
      const tpString = item.timeStamp;
      const ts = new Date(tpString).getTime();
      return {
        id: item.id,
        orderId: item.orderId,
        deviation: item.Deviation,
        expiration: item.expiration,
        fullPairName: item.FullPairName,
        pairId: item.PairId,
        swapRate: item.SwapRate,
        symbol: item.Symbol,
        price: item.Price,
        stopLimitPrice: item.StopLimitPrice,
        lotSize: item.LotSize,
        sl: item.SL,
        takeProfit: item.TakeProfit,
        orderCategories: item.OrderCategories,
        remarks: item.Remarks,
        openingPrice: item.openingPrice,
        closingPrice: item.closingPrice,
        closingType: item.closingType,
        tradeStatus: item.tradeStatus,
        orderType: item.orderType,
        timeStamp: item.timeStamp,
        ts: ts
      };
    });

    return orders;
  }

  async orderTypes() {
    return [{ 'name': 'Instant Execution', 'id': 1 }
      , { 'name': 'Buy Limit', 'id': 2 }
      , { 'name': 'Sell Limit', 'id': 3 }
      , { 'name': 'Buy Stop', 'id': 4 }
      , { 'name': 'Sell Stop', 'id': 5 }
      , { 'name': 'Buy Stop Limit', 'id': 6 }
      , { 'name': 'Sell Stop Limit', 'id': 7 }]
  }


  async findManagerOrders(userid) {
    // const managerGroups = await this.groupRepository.find({
    //   where: { userId: userid }, // Use 'userId' instead of 'user'
    //   select: ['id']
    // });
    // const users = await this.groupUserRepository.find({ where: { groupId: In(managerGroups) }, select: ['userId'] });
    // const orders = await this.orderRepository.find({ where: { UserId: In(users) } });
    // return orders;
    return [];
  }

  async findActiveOrders(userid: string) {
    try {
      const unSortedData = await this.orderRepository
        .createQueryBuilder("orders")
        .where("orders.UserId= :UserId", { UserId: userid })
        .andWhere("orders.tradeStatus = :tradeStatus", { tradeStatus: "Pending" })
        .getMany();
      // Convert property names to camelCase
      const orders = unSortedData.map((item) => {
        const tpString = item.timeStamp;
        const ts = new Date(tpString).getTime();
        return {
          id: item.id,
          orderId: item.orderId,
          deviation: item.Deviation,
          expiration: item.expiration,
          fullPairName: item.FullPairName,
          pairId: item.PairId,
          swapRate: item.SwapRate,
          symbol: item.Symbol,
          price: item.Price,
          stopLimitPrice: item.StopLimitPrice,
          lotSize: item.LotSize,
          sl: item.SL,
          takeProfit: item.TakeProfit,
          orderCategories: item.OrderCategories,
          remarks: item.Remarks,
          openingPrice: item.openingPrice,
          closingPrice: item.closingPrice,
          closingType: item.closingType,
          tradeStatus: item.tradeStatus,
          orderType: item.orderType,
          timeStamp: item.timeStamp,
          ts: ts
        };
      });

      return orders;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }


  async validateStopLossBuy(data: any) {
    // Check if stop-loss is less than current price and valid
    if (Number(data.SL) !== undefined && Number(data.SL) < Number(data.currentInitialPrice)) {
      return true
    }
    return false;
  }

  async validateTakeProfitBuy(data: any) {
    // take-profit should greater than or equal to the current price and valid
    if (Number(data.TP) !== undefined && Number(data.TP) >= Number(data.currentInitialPrice)) {
      return true
    }
    return false;
  }


  async validateStopLossSell(data: any) {
    // Check if stop-loss is less than or equal to the current price and valid
    if (Number(data.SL) !== undefined && Number(data.SL) > Number(data.currentInitialPrice)) {
      return false
    }
    return true;
  }

  async validateTakeProfitSell(data: any) {
    // Check if take-profit is greater than or equal to the current price and valid
    if (Number(data.TP) !== undefined && Number(data.TP) < Number(data.currentInitialPrice)) {
      return true
    }
    return false;
  }

  async validateOrderValue(uId: string, data: any) {
    // check order value based on margin
    const groupUser = await this.groupUserRepository.findOne({ where: { userId: uId } });
    if (groupUser) {
      var group = await this.groupRepository.findOne({ select: ['margin'], where: { id: groupUser.id } });
    }
    const walletAmt = await this.paymentService.totalDeposits(uId);
    if (!walletAmt) return false;
    const margin = walletAmt * group?.margin ?? 5 //default margin for external user
    if ((data.OpeningPrice ?? data.ClosingPrice) <= margin) {
      return false;
    }
    return true;
  }


  async autoWrapPosition() {
    try {
      const client = new WebSocket.client();
      client.on('connect', (connection) => {
        console.log('Connected to WebSocket server');
        // Define an async function to perform the database query
        const handleWebSocketMessage = async (message) => {
          if (message.type === 'utf8') {
            // Handle WebSocket messages here
            try {
              const orderSL = await this.orderRepository.find();
              const feedData = JSON.parse(message.utf8Data).data;
              feedData.forEach(async (item) => {
                const recordFound = orderSL.find((dbItem) => dbItem.openingPrice === item.askprice);

                if (recordFound) {
                  // Call the process to update in DB async
                  console.log(`Found record with id: ${recordFound.id}`);
                  const updateData = { id: recordFound.id, cmp: item.currentmarketprice };
                  await this.backgroundProcessingService.processUpdateTask(updateData);
                }
              });
            } catch (error) {
              console.error('Error while performing the database query:', error);
            }
          }
        };
        connection.on('message', handleWebSocketMessage);
        connection.on('close', (reasonCode, description) => {
          console.log(`WebSocket connection closed: ${reasonCode} - ${description}`);
        });
      });

      client.connect('ws://192.168.0.118/Quotes');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async pastOrderHistory(user) {
    try {
      const unSortedData = await this.orderRepository
        .createQueryBuilder("orders")
        .where("orders.UserId= :UserId", { UserId: user.userId })
        .andWhere("orders.tradeStatus = :tradeStatus", { tradeStatus: "Closed" })
        .getMany();
      if (unSortedData) {
        const orders = unSortedData.map((item) => {
          const tpString = item.timeStamp;
          const ts = new Date(tpString).getTime();
          return {
            id: item.id,
            orderId: item.orderId,
            deviation: item.Deviation,
            expiration: item.expiration,
            fullPairName: item.FullPairName,
            pairId: item.PairId,
            swapRate: item.SwapRate,
            symbol: item.Symbol,
            price: item.Price,
            stopLimitPrice: item.StopLimitPrice,
            lotSize: item.LotSize,
            sl: item.SL,
            takeProfit: item.TakeProfit,
            orderCategories: item.OrderCategories,
            remarks: item.Remarks,
            openingPrice: item.openingPrice,
            closingPrice: item.closingPrice,
            closingType: item.closingType,
            tradeStatus: item.tradeStatus,
            orderType: item.orderType,
            timeStamp: item.timeStamp,
            ts: ts
          };
        });
        return orders;

      }
      else {
        return "No Record Found"
      }
    } catch (error) {
      return error;
    }

  }

  async portfolioMetrics(userid) {
    const totalBalance = await this.paymentService.totalDeposits(userid);
    const groupUser = await this.groupUserRepository.findOne({ where: { userId: userid } });
    const group = groupUser ? await this.groupRepository.findOne({ select: ['margin'], where: { id: groupUser.id } }) : null;

    const defaultMarginForExternalUser = 5; // Default margin for external user
    const margin = totalBalance * (group?.margin ?? defaultMarginForExternalUser)

    const data = {
      balance: totalBalance !== null ? totalBalance : null,
      margin: margin,
      equity: 0,
      freeMargin: 0,
      marginLevel: 0,
    };
    return data;
  }


}
