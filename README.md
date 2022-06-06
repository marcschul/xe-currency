# Demo App

A currency conversion service that includes FIAT and cryptocurrencies. Users can log & store requests. A rate limit is applied to requests based on specific criteria.

# Setup

## Prerequisites

- [Nodejs](https://nodejs.org/en/download/) version `^16.13.2`
- [npm](https://nodejs.org/en/download/) version `^8.1.2`
- [NestJS CLI](https://docs.nestjs.com/) version `^8.0.0`

## Installation

1. Clone repository into local machine.

2. Install packages and dependacies in the `/demo` directory with the following command.

```bash
$ npm install
```

3. Create database migrations

```
$ npx prisma migrate dev
```

# Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# view database in browser
$ npx prisma studio
```

# Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Information

## External APIs

[Coinbase - Exchange rate](https://developers.coinbase.com/api/v2#get-exchange-rates)

Get current exchange rates. Default base currency is USD. Endpoint doesn’t require authentication.

## Supported currency pairs

Base/Quote

eg: USD/EURO = 0.95EUR

- FIAT
  - USD/EUR
- Crypto
  - BTC/ETH

## Query String

Replace base, quote and amount with your parameters.

`?from=[BASE]&to=[QUOTE]&amount=[AMOUT]`

Example:

`localhost:3000/api/currency_pair?from=EUR&to=USD&amount=243.59`

## Licenses

Unlicensed.
