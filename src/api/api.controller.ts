import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator';
import { Throttle } from '@nestjs/throttler';
import { getDay } from './functions/index';

@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Throttle(getDay(), 86400)
  @Get('currency_pair')
  JsonData(
    @Query('from') base: string,
    @Query('to') quote: string,
    @Query('amount') amount: number,
    @GetUser() user,
  ) {
    return this.apiService.getJsonData(
      base,
      quote,
      amount,
      user,
    );
  }
}
