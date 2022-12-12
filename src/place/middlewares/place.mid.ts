import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PlaceService } from '../place.service';

@Injectable()
export class PlaceMiddleware implements NestMiddleware {
  constructor(private readonly placeService: PlaceService) {}

  async use(req: Request, _: Response, next: NextFunction): Promise<void> {
    const isExists = await this.placeService.isExistsByKakaoId(
      req.body.kakaoId,
    );

    if (isExists) {
      throw new BadRequestException('Already registered place');
    }
    next();
  }
}
