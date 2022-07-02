import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserDetails } from 'src/user/user.details.inerface';
import { ExistingUserDto } from 'src/user/userDto/existingUser.dto';
import { NewUserDTO } from 'src/user/userDto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async registerUser(@Body() user: NewUserDTO): Promise<UserDetails | any> {
    console.log(user);
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDto): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}
