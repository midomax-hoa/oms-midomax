// apps/api/src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Controller()
export class AuthController {
  private readonly VALID_TOKEN = 'mock_auth_token_12345';

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body;

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
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });

      return user;
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getMe(@Req() req: Request) {
    // Check for cookie in headers since we might not have cookie-parser middleware yet
    const cookies = req.headers.cookie || '';
    const hasToken = cookies.includes(`auth_token=${this.VALID_TOKEN}`);

    if (!hasToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Return mock admin user
    return {
      id: 1,
      email: 'admin@midomax.com',
      name: 'Admin',
      role: 'admin',
    };
  }
}
