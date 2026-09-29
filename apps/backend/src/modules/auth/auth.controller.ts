import { Controller, Post, Get, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Authentication & Identity')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new workshop user/staff profile' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: any;
      phone?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiResponse({ status: 200, description: 'JWT token issued.' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End session and logout user' })
  async logout() {
    return { success: true, message: 'Logged out successfully.' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve logged-in user profile' })
  async me(@Req() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all active workshop staff (Admin only)' })
  async listUsers() {
    return this.authService.listUsers();
  }
}
