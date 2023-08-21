import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entity/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { IQuery } from './app.controller';
import { UpdateUser } from './dto/update-user.dto';
@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async userCheck(email: string, mobileNumber: string) {
    let existingUser = await this.UserModel.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });
    if (existingUser)
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    return null;
  }

  async findAll() {
    const users = await this.UserModel.find();
    if (!users) throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userCheck(
      createUserDto.email,
      createUserDto.mobileNumber,
    );
    if (existingUser != null) return existingUser;
    const user = await this.UserModel.create(createUserDto);
    if (!user)
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    return user;
  }

  async searchUsers(query?: IQuery) {
    const filter: any = {};

    // Case-insensitive substring search on first name, last name, or email
    if (query.name) {
      const searchRegex = new RegExp(query.name, 'i');
      filter.$or = [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];
    }

    // Age filter
    if (query.ageMin || query.ageMax) {
      filter.birthDate = {}; // Initialize the filter.date object

      if (query.ageMin) {
        const minBirthdate = new Date();
        minBirthdate.setFullYear(minBirthdate.getFullYear() - query.ageMin);
        filter.birthDate.$lte = minBirthdate;
      }

      if (query.ageMax) {
        const maxBirthdate = new Date();
        maxBirthdate.setFullYear(maxBirthdate.getFullYear() - query.ageMax - 1);
        filter.birthDate.$gte = maxBirthdate;
      }
    }

    // City filter
    if (query.city) {
      const cityRegex = new RegExp(`^${query.city}`, 'i');
      filter.addresses = {
        $elemMatch: {
          city: { $regex: cityRegex },
        },
      };
    }

    const users = await this.UserModel.find(filter);
    if (users.length === 0)
      throw new HttpException('No Users Found', HttpStatus.NOT_FOUND);
    return users;
  }

  async update(
    id: string,
    updateUserDto: UpdateUser,
  ): Promise<UpdateUser | Error> {
    try {
      const existingUser = await this.UserModel.findById(id);
      if (!existingUser)
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

      console.log(300);
      const user: UpdateUser = await this.UserModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true,
        },
      );
      return user;
    } catch (error) {
      throw new HttpException('User updation failed', HttpStatus.BAD_REQUEST);
    }
  }
}
