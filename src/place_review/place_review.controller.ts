import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PlaceReviewService } from './place_review.service';
import { CreatePlaceReviewDto } from './dto/create.place_review.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from './../auth/Entity/user.entity';
import { AuthGuard } from './../auth/security/jwt.Guard';
import { PlaceService } from './../place/place.service';
import { Place } from './../place/Entity/place.entity';
import { AuthService } from 'src/auth/auth.service';

@Controller('place-review')
export class PlaceReviewController {
  constructor(
    private readonly placeReviewService: PlaceReviewService,
    private readonly placeServce: PlaceService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async createReview(
    @Body() createPlaceReviewDto: CreatePlaceReviewDto,
    @GetUser() kakaoUser: User,
  ): Promise<{
    placeReviewId: string;
  }> {
    const place = await this.checkPlace(createPlaceReviewDto.placeId);
    const user = await this.authService.getUserbyKakaoId(kakaoUser.userId);
    return await this.placeReviewService.createReview(
      createPlaceReviewDto,
      place[0],
      user[0],
    );
  }

  async checkPlace(placeId: string): Promise<Place[]> {
    return await this.placeServce.findById(placeId);
  }
}
