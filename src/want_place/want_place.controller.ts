import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ConflictException,
  Delete,
} from '@nestjs/common';
import { GetUser } from 'src/decorator/get-user.decorator';
import { WantPlaceService } from './want_place.service';
import { User } from 'src/auth/Entity/user.entity';
import { WantPlace } from 'src/want_place/Entity/want_place.entity';
import { PlaceService } from './../place/place.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/security/jwt.Guard';
import { CreateWantPlaceDto } from './dto/create.wantPlace.dto';
import { DeleteWantPlaceDto } from './dto/delete.wantPlace.dto';
import { WantPlaceAndPlace } from './types/wantPlaceAndPlace.type';
import { DeleteResult } from 'typeorm';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('want-place')
export class WantPlaceController {
  constructor(
    private readonly wantPlaceService: WantPlaceService,
    private readonly placeService: PlaceService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Get my WantPlaces',
    description: 'Get my WanPlace List',
  })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiResponse({
    status: 200,
    description: 'Want_palce Result',
    type: WantPlaceAndPlace,
    isArray: true,
  })
  @Get('/my/list')
  @UseGuards(AuthGuard)
  async findByUser(@GetUser() user: User) {
    const userInfo = await this.authService.getUserbyKakaoId(user.userId);

    return this.wantPlaceService.findByUser(userInfo[0]);
  }

  @ApiOperation({ summary: 'createWantPlace', description: 'createWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'CreateWantPlaceDto',
    required: true,
    type: CreateWantPlaceDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Want_palce Result',
    type: WantPlace,
  })
  @Post()
  @UseGuards(AuthGuard)
  async createWantPlace(
    @Body() createWantPlaceDto: CreateWantPlaceDto,
    @GetUser() user: User,
  ): Promise<WantPlace> {
    const place = await this.placeService.findById(createWantPlaceDto.placeId);
    const userInfo = await this.authService.getUserbyKakaoId(user.userId);
    const checkWantPlace = await this.wantPlaceService.checkWantPlace(
      place[0].id,
      userInfo[0].id,
    );
    //이미 저장한 경우 저장 불가
    if (!checkWantPlace)
      throw new ConflictException('Already have a this Place');

    return this.wantPlaceService.createWantPlace(place[0], userInfo[0]);
  }

  @ApiOperation({ summary: 'deleteWantPlace', description: 'deleteWantPlace' })
  @ApiHeader({ name: 'Authorization', description: 'auth token' })
  @ApiBody({
    description: 'DeleteWantPlaceDto',
    required: true,
    type: DeleteWantPlaceDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Delete Want_palce Result',
    type: WantPlace,
  })
  @Delete()
  @UseGuards(AuthGuard)
  async deleteWantPlace(
    @Body() deleteWantPlaceDto: DeleteWantPlaceDto,
  ): Promise<DeleteResult> {
    return this.wantPlaceService.deleteWantPlace(deleteWantPlaceDto.id);
  }
}
