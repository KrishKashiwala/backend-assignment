import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class Address {
  @Prop({ required: true })
  addressLine1: string;

  @Prop({ default: '' })
  addressLine2: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, enum: ['Home', 'Office'] })
  type: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ type: Date })
  birthDate: Date;

  @Prop([Address])
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
