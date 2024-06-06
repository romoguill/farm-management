import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataService } from './market-data.service';

describe('MarketDataService', () => {
  let service: MarketDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketDataService],
      imports: [HttpModule, ConfigModule],
    }).compile();

    service = module.get<MarketDataService>(MarketDataService);
  });

  it('should be able to parse the market filters correctly into required external API DTO', () => {
    const queries: {
      rawQuery: MarketDataQueryDTO;
      parsedQuery: MarketApiQueryDTO;
    }[] = [
      {
        rawQuery: {
          grain: 'SOY',
          derivative: 'FUTURE',
          currencyRef: 'DOLAR',
          from: '2024-01-01',
          to: '2024-01-01',
          marketPlace: 'ROSARIO',
          settlement: '2024-02-01',
        },
        parsedQuery: {
          excludeEmptyVol: 'true',
          from: '2024-01-01',
          to: '2024-01-01',
          market: 'ROFX',
          product: 'SOJ Dolar MATba',
          segment: 'Agropecuario',
          sortDir: 'ASC',
          type: 'FUT',
          underlying: 'SOJ.ROS/FEB24',
        },
      },
      {
        rawQuery: {
          grain: 'WHEAT',
          derivative: 'OPTION',
          currencyRef: 'PESO',
          from: '2024-02-10',
          to: '2024-02-10',
          marketPlace: 'CHICAGO',
          settlement: '2024-04-06',
        },
        parsedQuery: {
          excludeEmptyVol: 'true',
          from: '2024-02-10',
          to: '2024-02-10',
          market: 'ROFX',
          product: 'TRI Pesos MATba',
          segment: 'Agropecuario',
          sortDir: 'ASC',
          type: 'OPT',
          underlying: 'TRI.CME/ABR24',
        },
      },
    ];

    for (const query of queries) {
      expect(service.parseMarketDataQuery(query.rawQuery)).toStrictEqual(
        query.parsedQuery,
      );
    }
  });
});
