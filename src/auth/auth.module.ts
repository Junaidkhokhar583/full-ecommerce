import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { MailService } from 'src/mail/mail.service';
import { Otp } from 'src/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Otp]),JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,MailService]
})
export class AuthModule {}
