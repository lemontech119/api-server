import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GetUserDto } from '../dto/getUser.dto';

@Injectable()
export class ParseUserPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}
  /**
   * custom decorator 에서 받은 데이터 pipe로 전달 하여 pipe에서 DB유저 정보 받아옴
   */
  async transform(value: GetUserDto) {
    const user = await this.authService.getUserbyKakaoId(value.userId);

    return user[0];
  }
}
