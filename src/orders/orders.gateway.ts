import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: '*'
  }
})

export class OrdersGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server
  constructor(private readonly orderService: OrdersService) {
  }


  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id)
      console.log('connected')
    })
  }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto, @ConnectedSocket() client: Socket) {
    // console.log('socket body-->>',client.request.user.id)
    // const userId = socket.request.user.id; // Access the user ID
    const userId = 1;
    // await this.orderService.create(createOrderDto);
    this.server.emit('createOrder', createOrderDto);
  }

  @SubscribeMessage('findAllOrders')
  async findAll(@ConnectedSocket() socket: Socket) {
    // const orders = await this.orderService.findAll();
    this.server.emit('findAllOrders');
    // return feeds
  }

}
