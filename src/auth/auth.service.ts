import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/userDto/user.dto';
import { UserDetails } from 'src/user/user.details.inerface';
import { ExistingUserDto } from 'src/user/userDto/existingUser.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) return 'email is taken!';
    const hashpass = await this.hashPassword(user.password);
    const newUser = await this.userService.createUser(
      user.name,
      user.email,
      hashpass,
    );
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    return this.userService._getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
