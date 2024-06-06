import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidatorPipe } from '../common/pipes/zod-validator.pipe';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  findByToken(
    @Query(new ZodValidatorPipe(marketQuerySchema)) query: MarketDataQueryDTO,
  ) {
    return this.marketDataService.findByToken(query);
  }
}
