import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from 'src/utils/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule,
    HttpModule,
    EmailModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
