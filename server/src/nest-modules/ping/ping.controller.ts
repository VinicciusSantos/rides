import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('ping')
export class PingController {
  @Get()
  @ApiOkResponse({ description: 'pong' })
  public ping(): string {
    return 'pong';
  }
}
