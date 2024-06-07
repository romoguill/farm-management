import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidatorPipe } from '../common/pipes/zod-validator.pipe';
import { MarketDataService } from './market-data.service';
import { marketQuerySchema } from 'shared/schema';
import { ApiQuery } from '@nestjs/swagger';
import { MarketDataQueryDTO } from '@server/common/schemasDTO';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get()
  // @ApiQuery({ type: MarketDataQueryDTO })
  findByToken(
    @Query(new ZodValidatorPipe(marketQuerySchema)) query: MarketDataQueryDTO,
  ) {
    return this.marketDataService.findByToken(query);
  }
}
