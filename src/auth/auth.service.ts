import { BadRequestException, ConsoleLogger, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { user } from 'srentities/cart.entity';
import { Any, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginDto, RegisterDto, ReSendOtp, VerifyOtpDto } from './dto';
import { MailService } from 'src/mail/mail.service';
import { Otp } from 'src/entities/otp.entity';

@Injectable()
export class AuthService {
    private readonly logger = new ConsoleLogger(AuthService.name);
    constructor(
    private jwt:JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
    private readonly mailService: MailService,) {}
    
    async register(dto:RegisterDto){
        try{   
            const otpCode = this.createOtpCode()
            const res = await this.userRepo.save({
                name:dto.name,
                email:dto.email,
                Hash:dto.password,
            })
            
            await this.otpRepo.save({
                otp:otpCode,
                createdAt: new Date(),
                user:{id:res.id}
            })

            // Email failures must not crash signup (per requirements).
            try {
                await this.mailService.sendOtpEmail(dto.email,dto.name,otpCode)
            } catch (err) {
                this.logger.error('Failed to send OTP email', err as any);
            }

            return  {
                email: res.email,
                userId: res.id
            }
            // return this.signToken(res.id,res.email);
        }catch(error){
            if(error.code === "23505"){
                throw new ForbiddenException("Credentials taken")
            }
            throw error;
        }
    }

    async login(dto:loginDto){
        try{
            const user= await this.userRepo.findOneBy({email:dto.email})
            if(!user) throw new UnauthorizedException("Invalid Credentials")
            if (user.Hash !== dto.password) {
                throw new UnauthorizedException("Invalid Password");
            }
            
            if(!user.status) throw new ForbiddenException("Please verify your Account");
            
            return this.signToken(user.id,user.email,user.name,user.role);
        }catch(error){
            throw error;
        }
    }


     async signToken(userId:number,email:string,name:string,role:string):Promise<{access_token:string}>{
        const payload ={
            sub:userId,
            email,
            name,
            role,
        }
        const secret =this.config.get('JWT_KEY')
        const token =  await this.jwt.signAsync(payload,{
            expiresIn:'1h',
            secret:secret,
        });

        return {access_token:"Bearer "+token,}

    }

        async verifyOTP(dto: VerifyOtpDto) {
            try {
                const user = await this.userRepo.findOne({
                    where: { id: dto.userId },
                    relations: ['otp'],
                });

                if (!user) {
                    throw new NotFoundException('User not found');
                }

                if (user.status) {
                    throw new BadRequestException('Email already verified');
                }

                if (!user.otp) {
                    throw new BadRequestException('No OTP found. Please request a new one.');
                }

                if (user.otp.otp !== dto.otp) {
                    throw new BadRequestException('Invalid OTP');
                }
                const createdAt = new Date(user.otp.createdAt)
                
                const otpAge = Date.now() - createdAt.getTime()
                const twoMinutes = 2 * 60 * 1000;
                if (otpAge > twoMinutes) {
                    throw new BadRequestException('OTP has expired. Please request a new one.');
                }

                user.status = true;
                await this.userRepo.save(user);
                try {
                    await this.mailService.sendWelcomeEmail(user.email,user.name)
                } catch (err) {
                    this.logger.error('Failed to send welcome email', err as any);
                }
                await this.otpRepo.remove(user.otp);

                return {
                    message: 'Email verified successfully',
                    token: await this.signToken(user.id, user.email,user.name,user.role), // If you want auto-login
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                };

            } catch (error) {
                throw error;
            }
        }
    
    async reSendOtp(dto: ReSendOtp) {
        try{
            const user = await this.userRepo.findOne({where:{email:dto.email}})
            if(!user) throw new NotFoundException("user not found")
            if(user.status) throw new ForbiddenException("user is already verified")
            
            const otpCode = this.createOtpCode()
            await this.mailService.sendOtpEmail(user.email,user.name,otpCode)

            const res = await this.otpRepo.update({user:{id:user.id}},
                {otp:otpCode,
                createdAt: new Date(),}
            )
            return {message:"Check you mail"}
        }catch(error){
            throw error
        }
    }

    
    createOtpCode(){
      return Math.floor(100000 + Math.random() * 900000);
    }
}
