import { Body, Controller, Get, UseGuards, Post, Request, Render, Req, Session, Redirect, Res, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { upiLinkDTO } from './dto/upiLink.dto';
import { TransactionFilterDto } from './dto/transactionFilter.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('create-deposit')
  createDeposit(@Body() createDepositDto: CreateDepositDto, @Request() req) {
    return this.paymentService.createDeposit(createDepositDto);
  }


  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('payment-link')
  // @Render('upi') // Specify the payment template name (without .hbs extension)
  async initiatePayment(@Body() upiData: upiLinkDTO, @Request() req) {
    let userId = { userId: req.user.id };
    const paymentOrder = await this.paymentService.createPaymentOrder(upiData, userId);

    // return { paymentOrder };
    return paymentOrder;
  }



  @Post('payment-confirmation')
  async paymentConfirmation(@Body() webhookData: any, @Session() session: Record<string, any>) {
    console.log('webhokData', webhookData)
    const result = await this.paymentService.paymentConfirmation(webhookData);
    console.log(result);

    return result; // Handle other cases if needed


  }

  @Render('upi')
  // @Roles('customer')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  @Get('dashboard')
  async renderDashboard(@Session() session: Record<string, any>) {

    // const accessToken = request.cookies.access_token;
    console.log("sessionnnn", session.accessToken)
    return { token: session.accessToken }
  }


  @Get('complete-profile')
  @Render('completeProfile')
  async completeProfile(@Session() session: Record<string, any>) {
    return {};
  }


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('total-deposits')
  totalDeposits(@Request() req) {
    const userId = req.user.id;
    return this.paymentService.totalDeposits(userId);
  }

  // @Roles('customer')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  // @ApiBearerAuth('access-token')
  // @Get('active-order-history')
  // async activeOrderHistory(@Request() req) {
  //   let userId = { userId: req.user.id };
  //   return await this.paymentService.activeOrderHistory(userId);

  // }

  // @Roles('customer')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  // @ApiBearerAuth('access-token')
  // @Get('past-order-history')
  // async pastOrderHistory(@Request() req) {
  //   let userId = { userId: req.user.id };
  //   return await this.paymentService.pastOrderHistory(userId);

  // }

  @Roles('manager')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('transactions')
  transactions(@Request() req) {
    const userId = req.user.id;
    return this.paymentService.transactions();
  }

  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('transactions-customer')
  transactionsCustomer(@Request() req, @Query() filters: TransactionFilterDto) {
    const userId = req.user.id;
    return this.paymentService.transactionsCustomer(userId);
  }



  async bankWithdrawl(){
    return await this.paymentService.bankWithdrawlService()
  }



}
