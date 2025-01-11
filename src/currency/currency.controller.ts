import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { GetRatesDto } from './dto/get-rates.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  async getLatestRates(@Query() query: GetRatesDto) {
    return this.currencyService.getLatestRates(query);
  }
} 