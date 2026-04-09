import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/decorator';
import { AddToCartDto, RemoveFromCartDto, UpdateCartDto } from './dto';

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class CartController {
    constructor(private readonly cartService: CartService){}
    
    @Get("/")
    viewCart(@GetUser() user:any){
        return this.cartService.viewCart(user)
    }

    
    @Post('/items')
    addToCart(@GetUser() user:any,@Body() dto:AddToCartDto){
        return this.cartService.addToCart(user,dto)
    }

    @Patch("/items/:id")
    updateCart(@GetUser() user: any,@Param('id', ParseIntPipe) productId: number,@Body()dto:UpdateCartDto) 
    {
    return this.cartService.updateCart(user, productId,dto);
}
     @Delete('/items/:productId')
    RemoveFromCart(@GetUser() user:any,@Param('productId') productId:number){
        return this.cartService.RemoveFromCart(user,productId)
    }
    

}
