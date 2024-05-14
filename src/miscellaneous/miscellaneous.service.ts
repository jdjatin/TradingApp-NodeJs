import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackForm } from './entity/feedback.entity';
import { Repository } from 'typeorm';
import { faqDto } from './dto/faq.dto';
import { faq } from './entity/faq.entity';

@Injectable()
export class MiscellaneousService {


  constructor(
    @InjectRepository(FeedbackForm)
    private readonly feedbackRepo: Repository<FeedbackForm>,
    @InjectRepository(faq)
    private readonly faqRepository: Repository<faq>
  ) { }


  async createFeedback(feedback) {
    return await this.feedbackRepo.save(feedback)
  }

  async getFeedbackreport() {
    return await this.feedbackRepo.find()
  }

  async createFaq(faq) {

    return this.faqRepository.save(faq);
  }

  async findAllFaq() {
    return this.faqRepository.find();
  }

  async findOneFaq(id) {
    return this.faqRepository.findOne({ where: { id: id } });
  }

  async updateFaq(id, faqDto: faqDto) {
    const faq = await this.faqRepository.findOne({ where: { id: id } });
    if (!faq) {
      throw new Error('FAQ not found');
    }
    faq.question = faqDto.question;
    faq.answer = faqDto.answer;
    return this.faqRepository.save(faq);
  }

  async removeFaq(id): Promise<void> {
    await this.faqRepository.delete(id);
  }


}
