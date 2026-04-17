/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getMe(@Req() req: any) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile' })
  updateMe(
    @Req() req: any,
    @Body() dto: { fullName?: string; phone?: string; avatarUrl?: string },
  ) {
    return this.userService.update(req.user.id, dto);
  }
}
