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

# To-Do List

- [x] Identify users.
- [x] Add Suitable Authentication, eg: API keys, Username/Password Login.
  - [Guards](https://docs.nestjs.com/guards)
- [x] Limit users to 100 requests per workday (Mon-Fri) and 200 requests per day on weekends(Sat-Sun). if quota is filled, return an error message.
  - 429 statuscode
  - [Rate Limiting](https://docs.nestjs.com/security/rate-limiting)
- [x] store each request with the date/time it was performed, its parameters and the response body.
- [x] Service Parameters:
  - Source currency.
  - Amount to be converted.
  - Final currency.
  - e.g. `?from=BTC&to=USD&amount=999.20`
- [x] Return data as JSON
- [x] e2e tests [users.e2e, api.e2e]

```bash
# mock return data
{
  "data": {
    "isoDate": "2015-06-23T18:02:51Z",
    "base": "USD",
    "amount": "12.85",
    "quote": "EURO",
    "currencyPair": "USD/EURO = 12.22"
  }
}
```

- [ ] _BONUS:_ cache responses from external currency API.
