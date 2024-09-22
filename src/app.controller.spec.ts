import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

// Mock AuthGuard to bypass authentication for test purposes
class MockAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 1, email: 'test@example.com' }; // Mock user
    return true; // Bypass actual authentication
  }
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthGuard('local'),
          useClass: MockAuthGuard, // Use mocked AuthGuard
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return the user on successful login', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201)
      .expect({
        id: 1,
        email: 'test@example.com',
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
