import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString } from "class-validator"
import { Decimal128 } from "typeorm"

export class PlaceOrderDto{
        @ApiProperty({type: [Number], example: [1, 2, 3] })
        @IsNotEmpty()
        @ArrayMinSize(1)
        products:number[]
}


export enum OrderStatus {
  Pending = 'PENDING',
  confirm = 'CONFIRMED',
  cancle = 'CANCELLED',
}
export class OrderStatusDto{
        @ApiProperty({example: OrderStatus.confirm})
        @IsEnum(OrderStatus)
        @IsNotEmpty()
        status:OrderStatus
}