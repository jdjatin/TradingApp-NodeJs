import { Test, TestingModule } from '@nestjs/testing';
import { MiscellaneousService } from './miscellaneous.service';

describe('MiscellaneousService', () => {
  let service: MiscellaneousService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiscellaneousService],
    }).compile();

    service = module.get<MiscellaneousService>(MiscellaneousService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
