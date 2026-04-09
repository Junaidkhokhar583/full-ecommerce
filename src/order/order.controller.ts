import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/decorator';
import { OrderStatus, OrderStatusDto, PlaceOrderDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { dot } from 'node:test/reporters';

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtGuard)

export class OrderController {

    constructor(private readonly orderService: OrderService){}
    @Post('/order')

    placeOrder(@GetUser() user:any){
        return this.orderService.placeOrder(user)
    }
    
    @Get('/admin/orders')
    getAllOrders(@GetUser() userData:any){
        return this.orderService.getAllOrders(userData)
    }

    @Get('/order-status/:status')
    getOrderStatus(@GetUser() userData:any,@Param('status') status:OrderStatus){
        return this.orderService.getOrderStatus(userData,status)
    }

    @Patch('/admin/orders/:id/status')
    updateOrderStatus(@GetUser() userData:any,@Param('id',ParseIntPipe) orderId:number,@Body() dto:OrderStatusDto){
        return this.orderService.updateOrderStatus(userData,orderId,dto)
    }

    @Get("/orders/:id")
    // @ApiParam({ name: 'id', type: Number })
    getOrderById(@Param('id',ParseIntPipe) productId:number){
        return this.orderService.getOrderById(productId)
    }    
}
