import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, RegisterDto, ReSendOtp, VerifyOtpDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}
    @Post("/register")
    register(@Body() dto:RegisterDto){
        return this.authservice.register(dto)
    }

    @Post("/login")
    login(@Body() dto:loginDto){
        return this.authservice.login(dto)
    }

    @Post('verify-otp')
    async verifyOTP(@Body() dto: VerifyOtpDto) {
        return this.authservice.verifyOTP(dto)
    }
    @Post('resend-otp')
    async reSendOtp(@Body() dto: ReSendOtp) {
        return this.authservice.reSendOtp(dto)
    }
}
