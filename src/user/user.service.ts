import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService } from '../utils/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly httpService: HttpService,
    private readonly rabbitMQService: RabbitMQService,
    private emailService: EmailService,
  ) {}

  async createUser(name: string, email: string): Promise<User> {
    const newUser = new this.userModel({ name, email });
    const savedUser = await newUser.save();

    // Publish to RabbitMQ
    const message = `New user created: ${savedUser.name} (${savedUser.email})`;
    await this.rabbitMQService.publish('user_created', message);

    // Send email
    const emailSubject = 'Welcome to Our Service';
    const emailText = `Hello ${savedUser.name}, welcome to our service!`;
    await this.emailService.sendEmail(savedUser.email, emailSubject, emailText);

    return savedUser;
  }

  async getUserById(userId: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`https://reqres.in/api/users/${userId}`),
    );
    const responseData = response as { data: { data: any } };
    return responseData.data.data;
  }

  async getUserAvatar(userId: string): Promise<string> {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (user.avatar) {
        // If avatar is already saved, return the base64 string
        const avatarPath = user.avatar;
        const imageBuffer = fs.readFileSync(avatarPath);
        return imageBuffer.toString('base64');
      }

      const avatarUrl = `https://gravatar.com/avatar/${userId}?s=400&d=robohash&r=x`; // Ensure this URL is correct and accessible

      const avatarPath = path.resolve(__dirname, `../../avatars/${userId}.png`);

      const imageResponse = await firstValueFrom(
        this.httpService.get(avatarUrl, {
          responseType: 'arraybuffer' as const,
        }),
      );

      const imageBuffer = Buffer.from(imageResponse.data);

      const avatarHash = crypto
        .createHash('md5')
        .update(imageBuffer)
        .digest('hex');

      fs.writeFileSync(avatarPath, imageBuffer);

      user.avatar = avatarPath;
      user.avatarHash = avatarHash;
      await user.save();

      return imageBuffer.toString('base64');
    } catch (error) {
      console.error('Error in getUserAvatar:', error);
      throw new Error('Failed to retrieve or save user avatar');
    }
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (user.avatar) {
      fs.unlinkSync(user.avatar);
      user.avatar = null;
      user.avatarHash = null;
      await user.save();
    }
  }
}
