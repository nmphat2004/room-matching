/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Query,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateConversationDto } from './dto/chat.dto';

@ApiTags('Chat')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get my conversations' })
  getConversation(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get message in a conversation' })
  getMessage(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.chatService.getMessages(id, req.user.id, page, limit);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start a conversation about a room' })
  getOrCreate(@Req() req: any, @Body() dto: CreateConversationDto) {
    return this.chatService.getOrCreateConversation(req.user.id, dto);
  }
}
