import { Body, Controller, Delete, Get, Query, Param, Post, Put, Request } from '@nestjs/common';
import { MiscellaneousService } from './miscellaneous.service';
import { FeedbackDto } from './dto/feedback.dto';
import { faq } from './entity/faq.entity';
import { faqDto } from './dto/faq.dto';
import { ApiTags } from '@nestjs/swagger';
import { SymbolDto } from './dto/add-symbols.dto';


@ApiTags('Miscellaneous')
@Controller('miscellaneous')
export class MiscellaneousController {


  constructor(
    private readonly miscellaneousService: MiscellaneousService
  ) { }



  @Post('create-feedback')
  async createFeedbackRoute(@Body() feedback: FeedbackDto) {

    return await this.miscellaneousService.createFeedback(feedback)
  }

  @Get('get-feedback')
  async getFeedback() {
    return await this.miscellaneousService.getFeedbackreport()
  }

  @Post('create-faq')
  async createFaq(@Body() faqDto: faqDto): Promise<faq> {
    return this.miscellaneousService.createFaq(faqDto);
  }

  @Get('get-all-faq')
  async findAllFaq(): Promise<faq[]> {
    return this.miscellaneousService.findAllFaq();
  }

  @Get('get-faq:id')
  async findOneFaq(@Param('id') id: string): Promise<faq> {
    return this.miscellaneousService.findOneFaq(id);
  }

  @Put('update-faq:id')
  async updateFaq(@Param('id') id: string, @Body() faqDto: faqDto): Promise<faq> {
    return this.miscellaneousService.updateFaq(id, faqDto);
  }

  @Delete('remove-faq:id')
  async removeFaq(@Param('id') id: string): Promise<void> {
    return this.miscellaneousService.removeFaq(id);
  }

  @Get('Jaali')
  jaaliFunc() {
    return "Jaali Bnda Abinash"
  }


  // @Post('add-symbols')
  // async addSymbols(@Body() symbolDto: SymbolDto, @Request() req) {
  //   return this.miscellaneousService.addSymbols(symbolDto, req.user.id);
  // }

}
