import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';

export class UpdateUser extends PartialType(CreateUserDto) {}
