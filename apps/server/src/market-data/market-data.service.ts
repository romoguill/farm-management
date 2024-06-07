import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarketDataQueryDTO } from '@server/common/schemasDTO';
import {
  MarketApiQueryDTO,
  currencySchema,
  derivativeSchema,
  grainSchema,
  marketPlaceSchema,
} from 'shared/schema';

@Injectable()
export class MarketDataService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findByToken(query: MarketDataQueryDTO) {
    const apiQuery = this.parseMarketDataQuery(query);

    return { apiQuery };
    // const baseQuery: Pick<
    //   MarketApiQueryDTO,
    //   'segment' | 'excludeEmptyVol' | 'from' | 'to' | 'sortDir' | 'market'
    // > = {
    //   segment: 'Agropecuario',
    //   excludeEmptyVol: 'true',
    //   from: dayjs().format('YYYY-MM-DD'),
    //   to: dayjs().format('YYYY-MM-DD'),
    //   sortDir: 'ASC',
    //   market: 'ROFX',
    // };

    // const finalQuery: MarketApiQueryDTO = {
    //   ...baseQuery,
    //   ...query,
    // };

    // const searchParams = new URLSearchParams(finalQuery);

    // const apiURL = new URL(
    //   this.configService.getOrThrow<string>('MARKET_DATA_API')
    // );
    // apiURL.search = searchParams.toString();

    // try {
    //   const url = this.configService.getOrThrow<string>(
    //     'MARKET_DATA_API_FUTURES'
    //   );
    //   const response = await this.httpService.axiosRef.get(
    //     `${url}&${searchParams.toString()}`
    //   );
    //   return response.data;
    // } catch (error) {
    //   throw new ServiceUnavailableException(error);
    // }
  }

  // Convert internal query data to format required by external API
  public parseMarketDataQuery(query: MarketDataQueryDTO): MarketApiQueryDTO {
    const parseGrain = {
      [grainSchema.enum.SOY]: 'SOJ',
      [grainSchema.enum.CORN]: 'MAI',
      [grainSchema.enum.WHEAT]: 'TRI',
    } as const;

    const parseCurrency = {
      [currencySchema.enum.PESO]: 'Pesos',
      [currencySchema.enum.DOLAR]: 'Dolar',
    } as const;

    const product = `${parseGrain[query.grain]} ${
      parseCurrency[query.currencyRef]
    } MATba` as const;

    const parseMarketPlace = {
      [marketPlaceSchema.enum.ROSARIO]: 'ROS',
      [marketPlaceSchema.enum.CHICAGO]: 'CME',
    };

    const parseDerivative = {
      [derivativeSchema.enum.FUTURE]: 'FUT',
      [derivativeSchema.enum.OPTION]: 'OPT',
    } as const;

    const getUnderlingToken = () => {
      const date = new Date(query.settlement);

      // Get month in MMM spanish format
      const formatterMonth = new Intl.DateTimeFormat('es', {
        month: 'short',
        timeZone: 'UTC',
      });

      const monthOfSettlement = formatterMonth.format(date);

      const formatterYear = new Intl.DateTimeFormat('es', {
        year: '2-digit',
        timeZone: 'UTC',
      });
      const yearOfSettlement = formatterYear.format(new Date(query.settlement));

      return `${parseGrain[query.grain]}.${
        parseMarketPlace[query.marketPlace]
      }/${monthOfSettlement.toUpperCase()}${yearOfSettlement}`;
    };

    return {
      product,
      underlying: getUnderlingToken(),
      type: parseDerivative[query.derivative],
      segment: 'Agropecuario',
      excludeEmptyVol: 'true',
      from: query.from,
      to: query.to,
      sortDir: 'ASC',
      market: 'ROFX',
    };
  }
}
