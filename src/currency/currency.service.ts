import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { CurrencyResponse, Currency } from './interfaces/currency.interface';
import { GetRatesDto } from './dto/get-rates.dto';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

@Injectable()
export class CurrencyService {
  private readonly baseUrl = 'https://api.freecurrencyapi.com/v1';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('CURRENCY_API_KEY');
    if (!this.apiKey) {
      throw new Error(
        'CURRENCY_API_KEY is not defined in environment variables',
      );
    }
  }
  async getLatestRates(query: GetRatesDto): Promise<Currency[]> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get<CurrencyResponse>(`${this.baseUrl}/latest`, {
            params: {
              apikey: this.apiKey,
              base_currency: query.base_currency,
              currencies: query.currencies,
            },
          })
          .pipe(
            catchError((error: AxiosError<ErrorResponse>) => {
              console.error('API Error:', error.response?.data);
              throw new HttpException(
                (error.response?.data as ErrorResponse)?.message ||
                  'Failed to fetch currency rates',
                error.response?.status || HttpStatus.BAD_REQUEST,
              );
            }),
          ),
      );

      if (!response.data || !response.data.data) {
        throw new HttpException(
          'Invalid response from currency API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return Object.entries(response.data.data).map(([code, rate]) => ({
        code,
        rate: Number(rate),
      }));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch currency rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
