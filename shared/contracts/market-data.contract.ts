import { initContract } from '@ts-rest/core';
import { MarketData, marketQuerySchema } from 'shared/types';

const c = initContract();

export const contract = c.router({
  getMaketDataByToken: {
    method: 'GET',
    path: '/market-data',
    query: marketQuerySchema,
    summary: 'Get market data of token',
    responses: {
      200: c.type<MarketData>(),
      503: c.type<{ error: 'Data unavailable' }>(),
    },
  },
});
