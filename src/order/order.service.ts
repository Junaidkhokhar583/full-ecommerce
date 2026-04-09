import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, OrderStatusDto, PlaceOrderDto } from './dto';
import { Product } from 'src/entities/product.entity';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Cart, CartStatus } from 'src/entities/cart.entity';
import { DataSource } from 'typeorm';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Order) private orderRepo:Repository<Order>,
        @InjectRepository(Cart) private cartRepo:Repository<Cart>,private dataSource:DataSource,
        private readonly mailService: MailService,){}
    
    async placeOrder(user: any) {
        if (user.role !== "USER") {
            throw new ForbiddenException("only User can place order");
        }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const cart = await queryRunner.manager.findOne(Cart, {
        where: { user: { id: user.id }, status: CartStatus.ACTIVE },
        });

        if (!cart) throw new NotFoundException("Cart not Found");

        type OrderItem = {
        product: Product;
        quantity: number;
        };

        const orderItems: OrderItem[] = [];

        for (const item of cart.items) {
        const product = await queryRunner.manager.findOne(Product, {
            where: { id: item.ProductId, isActive: true },
        });

        if (!product)
            throw new NotFoundException(`Product ${item.ProductId} not found`);

        if (product.stockQuantity === undefined)
            throw new BadRequestException(`Product stock info missing`);

        if (item.quantity > product.stockQuantity)
            throw new ForbiddenException(
            `product has only ${product.stockQuantity} in stock`
            );

        // Add order item
        orderItems.push({
            product,
            quantity: item.quantity,
        });

        // Reduce stock
        product.stockQuantity -= item.quantity;
        await queryRunner.manager.save(Product, product);
        }

        // Calculate total
        const totalAmount = await this.calculateTotal(orderItems);

        // Save order
        const order = this.orderRepo.create({
        user: { id: user.id },
        items: orderItems,
        totalAmount,
        });

        await queryRunner.manager.save(order);

        // Clear cart
        cart.items = [];
        cart.status = CartStatus.INACTIVE;
        await queryRunner.manager.save(Cart, cart);

        // Commit if everything OK
        await queryRunner.commitTransaction();

        return { message: "Order placed successfully", orderId: order.id };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

        
    async getAllOrders(userData:any){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can Get")
        try{
            const res = await this.orderRepo.find({relations: ["user"],
                select: {id: true,totalAmount: true,status: true,items: true,
            user: {id: true,name: true,email: true,createdAt: true,},},
});
            
            return res;
        }catch(error){
        throw error
    }
}
    
    async getOrderStatus(user:any,status:OrderStatus){
        if(user.role!=="USER") throw new ForbiddenException("Only USER can Get")
        try{
            const order = await this.orderRepo.find({ where: { user: { id: user.id },status:status}});
            if(!order) return {message:`There is no ${status} order`}
            return order;
        }catch(error){
            throw error;
        }
    }

    async updateOrderStatus(userData:any,orderId:number,dto:OrderStatusDto){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can Get")
        try{
                const res = await this.orderRepo.update({id:orderId},{status:dto.status})
                const order = await this.orderRepo.findOne({where:{id:orderId},relations:['user']})
                if(res.affected===0) throw new NotFoundException("Order not Found") 
                await this.mailService.sendOrderStatus(order?.user.email||'',order?.user.name||'',dto.status)
                return res;
        }
        catch(error){
            throw error;
        }
    }

    async getOrderById(orderId:number){
        try{
            const orderInfo = await this.orderRepo.find({where:{id:orderId}})
            if(!orderInfo) throw new NotFoundException("Order Not Found")
            return orderInfo
        }catch(error){
            throw error;
        }
    }

    calculateTotal(items: { product: any; quantity: number }[]) {
    const total = items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
    }, 0);
    return total;
    }


}
