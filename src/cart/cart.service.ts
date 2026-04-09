import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartStatus } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { Repository, TreeParent } from 'typeorm';
import { AddToCartDto, RemoveFromCartDto, UpdateCartDto } from './dto';

@Injectable()
export class CartService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Cart) private cartRepo:Repository<Cart>){}
        
        async addToCart(user:any,dto:AddToCartDto){
        if(user.role!=="USER") throw new ForbiddenException("only User can AddToCart") 
            
          try{
            const {ProductId,quantity} =dto;
            if(dto.quantity<=0) throw new ForbiddenException("Quantity must be greater than 0")
            
            const product = await this.productRepo.findOneBy({id:ProductId})
            if(!product) throw new NotFoundException("Product Not Found")

            let cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})
            if(quantity>product.stockQuantity) throw new ForbiddenException("Item is out of stock")
            if(!cart){
                cart= this.cartRepo.create({
                    user:{id:user.id},
                    items:[],
                    status:CartStatus.ACTIVE
                });
            }

            const checkItem = cart.items.find((item)=>item.ProductId===ProductId)
            if(checkItem){
                if(quantity>checkItem.quantity){
                    checkItem.quantity=checkItem.quantity+quantity
                }
            }else{
                cart.items.push({ProductId,quantity})
            }
            const res =await this.cartRepo.save(cart)
            return res
          }
        catch(error){
            throw error
        }
    }


    async RemoveFromCart(user:any,productId:number){
        if(user.role!=="USER") throw new ForbiddenException("Only User Can Remove Form Cart")
        try{
            const cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})
            if(!cart) throw new NotFoundException("Cart not Found")

            const filtercart = cart?.items.filter((item)=>item.ProductId!=productId)
            if(filtercart.length===0){
                cart.status=CartStatus.INACTIVE
            }
            cart.items=filtercart
            await this.cartRepo.save(cart)
            return {message:"Item Remove from cart"}
        }catch(error){
            throw error;
        }
    }

    async viewCart(user:any){
        type product = {
                productId: number,
                name: string,
                price: number,
                quantity: number,
                total: number,
            };
        if(user.role!=="USER") throw new ForbiddenException("Only User Can View Form Cart");

        const cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})

        let productList:product[]=[]
        if(cart===null) throw new NotFoundException("Cart not found")

        for(const item of cart.items){
            const product = await this.productRepo.findOne({where:{id:item.ProductId,isActive:true}})
            
            if(!product) throw new NotFoundException("Product Not Found")
        
            productList.push({
            productId: product.id,
            name: product.name,
            price: product.price, 
            quantity: item.quantity,
            total: Number(product.price) * item.quantity,
            });
        }
        

        return productList;
    }



        async updateCart(user:any,productId:number,dto:UpdateCartDto){
        if(user.role!=="USER") throw new ForbiddenException("Only User can user this");

        if(dto.productQuantity<0) throw new ForbiddenException("Quantity must be greater than 0");

        try{
            const cart= await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})
        
        if(!cart) throw new NotFoundException("cart Not found")

        const cartItemIndex = cart.items.findIndex((item)=>productId===item.ProductId)
        if(dto.productQuantity===0){
            cart.items.splice(cartItemIndex,1)
            return await this.cartRepo.save(cart)
        }

        const product = await this.productRepo.findOne({where:{id:productId,isActive:true}})

        if(!product) throw new NotFoundException("Product Not Found")
        
        if(dto.productQuantity>product.stockQuantity){
            throw new ForbiddenException(`only ${product.stockQuantity} is available`)
        }

        cart.items[cartItemIndex].quantity=dto.productQuantity;

        return await this.cartRepo.save(cart)
        }catch(error){
            throw error;
        }
    }
}
