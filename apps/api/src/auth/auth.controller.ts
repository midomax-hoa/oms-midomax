// apps/api/src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly VALID_TOKEN = 'mock_auth_token_12345';

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;
    this.logger.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Mock login logic matching mock-api
    if (email === 'admin@midomax.com' && password === 'admin123') {
      const user = {
        id: 1,
        email: 'admin@midomax.com',
        name: 'Admin',
        role: 'admin',
      };

      res.cookie('auth_token', this.VALID_TOKEN, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });

      this.logger.log(`Login successful for user: ${email}`);
      return { user };
    }

    this.logger.warn(`Failed login attempt for user: ${email}`);
    throw new UnauthorizedException('Invalid email or password');
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.logger.log('User logging out');
    res.clearCookie('auth_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getMe(@Req() _req: Request) {
    this.logger.debug('Bypassing auth check for /me');
    return {
      user: {
        id: 1,
        email: 'admin@midomax.com',
        name: 'Admin',
        role: 'admin',
      },
    };
  }
}
