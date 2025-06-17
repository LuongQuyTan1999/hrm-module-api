import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Users as UsersEntity } from '../../common/db/entities/user.entity';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Post('signup')
  // async signup(@Body() signupDto: SignupDto) {
  //   return this.authService.signup(signupDto);
  // }

  @Public()
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Get('me')
  getProfile(@User() user: UsersEntity) {
    return user;
  }
}
