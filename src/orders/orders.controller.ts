import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WrapPositionDto } from './dto/wrap-position.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { BulkWrapPositionsDto } from './dto/bulk-wrap-position.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrdersService) { }


    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Post('new-order')
    async createGroup(@Body() createOrderDto: CreateOrderDto, @Request() req) {
        const userId = req.user.id;
        try {
            switch (createOrderDto.OrderType) {
                case 'Buy':
                    var order = await this.orderService.createBuy(createOrderDto, userId);
                    break;
                default:
                    var order = await this.orderService.createSell(createOrderDto, userId);
                    break;
            }
            if (order) return order;
        } catch (error) {
            switch (error.status) {
                case 404:
                  throw new HttpException(
                    {
                      statusCode: 404,
                      message: [error.message],
                      data: []
                    },
                    HttpStatus.BAD_REQUEST,
                  );
                case 401:
                  throw new HttpException(
                    {
                      statusCode: 401,
                      message: [error.message],
                      data: []
                    },
                    HttpStatus.BAD_REQUEST,
                  );
        
                default:
                  throw new HttpException(
                    {
                      statusCode: 500,
                      message: [error.message],
                      data: []
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  );
              }
        }
    }

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Post('wrap-position')
    async wrapPosition(@Body() wrapPositionDto: WrapPositionDto, @Request() req) {
        const userId = req.user.id;
        try {
            const order = await this.orderService.wrapPosition(wrapPositionDto, userId);
            if (order) return { message: 'Order closed successfully', order };
        } catch (error) {
            return { error: error.message };
        }
    }


    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Post('wrap-position-multiple')
    async wrapPositionMultiple(@Body() bulkWrapPositionsDto: BulkWrapPositionsDto, @Request() req) {
        const userId = req.user.id;
        try {
            const order = this.orderService.wrapPositionMultiple(bulkWrapPositionsDto.positions, userId);
            if (order) return { message: 'Orders closed successfully', order };
        } catch (error) {
            return { error: error.message };
        }
    }


    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('orders')
    findAllOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findAll(userId);
    }

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('active-orders')
    findActiveOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findActiveOrders(userId);
    }

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('order-types')
    orderTypes() {
        return this.orderService.orderTypes();
    }

    @Roles('manager')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('manager')
    findManagerOrders(@Request() req) {
        const userId = req.user.id;
        return this.orderService.findAll(userId);
    }

    @Get('auto-wrap')
    autoWrap() {
        return this.orderService.autoWrapPosition();
    }

    // @Roles('customer')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    // @ApiBearerAuth('access-token')
    // @Get('active-order')
    // async activeOrderHistory(@Request() req) {
    //   let userId = { userId: req.user.id };
    //   return await this.orderService.activeOrderHistory(userId);

    // }

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('completed-order')
    async pastOrderHistory(@Request() req) {
        let userId = { userId: req.user.id };
        return await this.orderService.pastOrderHistory(userId);
    }

    @Roles('customer')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @ApiBearerAuth('access-token')
    @Get('portfolio')
    async portfolioMetrics(@Request() req) {
        let userId = req.user.id;
        return await this.orderService.portfolioMetrics(userId);
    }




}
