import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})

export class FeedsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server
  constructor(private readonly feedsService: FeedsService) { }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id)
      console.log('connected')
    })
  }


  private interval: NodeJS.Timeout;


  afterInit() {
    this.interval = setInterval(() => this.refreshFeeds(), 1000); // Refresh every 5 seconds (adjust the interval as needed)
  }


  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    this.server.emit('message', payload);
  }

  // @SubscribeMessage('createFeed')
  // async create(@MessageBody() createFeedDto: CreateFeedDto) {
  //   const feed = await this.feedsService.create(createFeedDto);
  //   this.server.emit('createFeed', feed);
  //   // return feed;
  // }

  @SubscribeMessage('findAllFeeds')
  async findAll(@MessageBody() data) {
    const feeds = await this.feedsService.findAll();
    this.server.emit('findAllFeeds', feeds);
  }

  private async refreshFeeds() {
    // Fetch updated data and send it to all connected clients
    const feeds = await this.feedsService.findAll();
    this.server.emit('findAllFeeds', feeds);
  }
}
