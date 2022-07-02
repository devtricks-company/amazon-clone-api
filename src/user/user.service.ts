import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDetails } from './user.details.inerface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}
  _getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const existUser = await this.userModel.findOne({ email }).exec();
    if (!existUser) return null;
    return existUser;
  }

  async createUser(
    name: string,
    email: string,
    hashPassword: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({ name, email, password: hashPassword });
    return newUser.save();
  }
}
