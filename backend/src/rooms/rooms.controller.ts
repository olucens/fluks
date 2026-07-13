import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiRoom, ApiRoomWithState, RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtUser } from './room.types';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomsService: RoomService) {}

  @Public()
  @Get()
  async findAll(@Query('adminId') adminId?: string): Promise<ApiRoom[]> {
    return this.roomsService.findAll(adminId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiRoomWithState> {
    return this.roomsService.findOneWithState(id);
  }

  // Guests hold valid JWTs but must not own rooms — registered roles only.
  @Roles('user', 'admin')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateRoomDto,
    @CurrentUser() user: JwtUser,
  ): Promise<ApiRoom> {
    return this.roomsService.create(dto, user.userId);
  }

  @Roles('user', 'admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
    @CurrentUser() user: JwtUser,
  ): Promise<ApiRoom> {
    return this.roomsService.update(id, dto, user.userId);
  }

  @Roles('user', 'admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ): Promise<void> {
    return this.roomsService.remove(id, user.userId);
  }
}
