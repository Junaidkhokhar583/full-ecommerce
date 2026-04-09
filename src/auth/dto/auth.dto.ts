import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RegisterDto{
    @ApiProperty({example:"Moiz Hassan"})
    @IsString()
    @IsNotEmpty()
    name:string

    @ApiProperty({example:"glidexsol@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({example:"123"})
    @IsString()
    @IsNotEmpty()
    password:string

    @ApiProperty({example:"USER", default: "USER"})
    @IsString()
    @IsOptional()
    role:string
}


export class loginDto{
    @ApiProperty({example:"moiz123@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string

    @ApiProperty({example:"123"})
    @IsString()
    @IsNotEmpty()
    password:string
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 123456,
    type: Number,
    minimum: 100000,
    maximum: 999999,
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
export class ReSendOtp {
    @ApiProperty({example:"glidexsol@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email:string
}
export class VerifyCaptchaDto {
  @ApiProperty({
    example: '03AFcWeA6...',})
    @IsNotEmpty()
    token: string;
}