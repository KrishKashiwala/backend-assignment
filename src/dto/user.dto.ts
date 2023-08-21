import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ArrayMinSize,
  IsString,
  Length,
  IsIn,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string | null;

  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  pincode: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Home', 'Office'])
  type: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  mobileNumber: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => AddressDto)
  addresses: AddressDto[];
}
