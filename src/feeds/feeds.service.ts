import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { Feed } from './entities/feed.entity';

@Injectable()
export class FeedsService {
  feeds: Feed[] = [
    {
      "symbol": "EURUSD",
      "ts": "1694076457697",
      "bid": 1.24705,
      "ask": 1.24709,
      "mid": 1.24707
    },
    {
      "symbol": "USDCHF",
      "ts": "1694076457697",
      "bid": 1.24685,
      "ask": 1.24689,
      "mid": 1.24687
    },
    {
      "symbol": "GBPUSD",
      "ts": "1694076457697",
      "bid": 1.24675,
      "ask": 1.24679,
      "mid": 1.24677
    },
    {
      "symbol": "USDJPY",
      "ts": "1694076457697",
      "bid": 1.24715,
      "ask": 1.24719,
      "mid": 1.24717
    },
    {
      "symbol": "USDRUB",
      "ts": "1694076457697",
      "bid": 73.24695,
      "ask": 73.24699,
      "mid": 73.24697
    },
    {
      "symbol": "AUSUSD",
      "ts": "1694076457697",
      "bid": 0.74695,
      "ask": 0.74699,
      "mid": 0.74697
    },
    {
      "symbol": "NZDUSD",
      "ts": "1694076457697",
      "bid": 0.64695,
      "ask": 0.74699,
      "mid": 0.74697
    },
    {
      "symbol": "USDCAD",
      "ts": "1694076457697",
      "bid": 1.34695,
      "ask": 1.34699,
      "mid": 1.34697
    },
    {
      "symbol": "USDSEK",
      "ts": "1694076457697",
      "bid": 8.24695,
      "ask": 8.24699,
      "mid": 8.24697
    },
    {
      "symbol": "USDHKD",
      "ts": "1694076457697",
      "bid": 7.74695,
      "ask": 7.74699,
      "mid": 7.74697
    }
  ];

  clientToUser = {};


  findAll() {
    const randomIndex = Math.floor(Math.random() * this.feeds.length);
    return this.feeds[randomIndex];
  }



}
