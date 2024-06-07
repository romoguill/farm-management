import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { marketApiQueryDTO, marketQuerySchema } from 'shared/schema';

export const marketDataQueryDTOExt = extendApi(marketQuerySchema);
export class MarketDataQueryDTO extends createZodDto(marketDataQueryDTOExt) {}
