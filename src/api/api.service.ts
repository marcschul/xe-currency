import { Injectable, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getExchangeRateData(
    base: string,
  ): Promise<any> {
    const url = `https://api.coinbase.com/v2/exchange-rates?currency=${base}`;
    const { data } = await firstValueFrom(
      this.httpService.get(url),
    );
    return data;
  }

  async getTimeData(): Promise<any> {
    const url =
      'https://api.coinbase.com/v2/time';
    const { data } = await firstValueFrom(
      this.httpService.get(url),
    );
    return data;
  }

  // save request in db
  async createRequest(
    userId: number,
    results: any,
  ) {
    const request =
      await this.prisma.request.create({
        data: {
          userId,
          ...results,
        },
      });
    return request;
  }

  async getJsonData(
    base: string,
    quote: string,
    amount: number,
    user,
  ): Promise<any> {
    const exchangeRateData =
      await this.getExchangeRateData(base);

    const timeData = await this.getTimeData();

    const isoDate = timeData.data.iso;
    const currencyPair = `${base}/${quote} = ${
      exchangeRateData.data.rates[quote] * amount
    }`;

    interface resultsInterface {
      data: {
        isoDate: string;
        base: string;
        amount: number;
        quote: string;
        currencyPair: string;
      };
    }

    const results: resultsInterface = {
      data: {
        isoDate,
        base,
        amount,
        quote,
        currencyPair,
      },
    };
    this.createRequest(user.id, results.data);
    return JSON.stringify(results);
  }
}
