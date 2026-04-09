import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, min } from "class-validator"

export class AddToCartDto{
        @ApiProperty({example:1})
        @IsNumber()
        @IsNotEmpty()
        ProductId:number
    
        @ApiProperty({example:3})
        @IsNotEmpty()
        @IsNumber()
        quantity:number    
}
export class RemoveFromCartDto{
        @ApiProperty({example:1})
        @IsNumber()
        @IsNotEmpty()
        ProductId:number    
}

export class UpdateCartDto{
        @ApiProperty({example:1})
        @IsNumber()
        @IsNotEmpty()
        productQuantity:number    
}


