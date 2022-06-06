import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import * as pactum from 'pactum';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(
      'http://localhost:3000',
    );
  });

  afterAll(() => {
    app.close();
  });

  it('GET / Responds with 404', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'marc@email.com',
      password: '123',
    };

    describe('register', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .expectStatus(400);
      });
      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('api', () => {
      const user: AuthDto = {
        email: 'hireme@email.com',
        password: '123',
      };
      it('should register user and call api', async () => {
        const jwtAccess = await pactum
          .spec()
          .post('/auth/register')
          .withBody(user)
          .expectStatus(201)
          .returns((ctx) => {
            const accessToken =
              ctx.res.body.access_token;
            return {
              Authorization: `Bearer ${accessToken}`,
            };
          });
        await pactum
          .spec()
          .get(
            '/api/currency_pair?from=EUR&to=USD&amount=243.59',
          )
          .withHeaders(jwtAccess)
          .expectStatus(200);
      });
      it('should login user and call api', async () => {
        const jwtAccess = await pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(201)
          .returns((ctx) => {
            const accessToken =
              ctx.res.body.access_token;
            return {
              Authorization: `Bearer ${accessToken}`,
            };
          });
        await pactum
          .spec()
          .get(
            '/api/currency_pair?from=EUR&to=USD&amount=243.59',
          )
          .withHeaders(jwtAccess)
          .expectStatus(200);
      });
      it('should throw error if no access token provided', async () => {
        const jwtAccess = await pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(201)
          .returns(() => {
            const accessToken = '';
            return {
              Authorization: `Bearer ${accessToken}`,
            };
          });
        await pactum
          .spec()
          .get(
            '/api/currency_pair?from=EUR&to=USD&amount=243.59',
          )
          .withHeaders(jwtAccess)
          .expectStatus(401);
      });
      it('should throw error if incorrect access token provided', async () => {
        const jwtAccess = await pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(201)
          .returns(() => {
            const accessToken =
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            return {
              Authorization: `Bearer ${accessToken}`,
            };
          });
        await pactum
          .spec()
          .get(
            '/api/currency_pair?from=EUR&to=USD&amount=243.59',
          )
          .withHeaders(jwtAccess)
          .expectStatus(401);
      });
    });
  });
});
