import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Any, ILike, Like, Repository } from 'typeorm';
import { AddProductDto, EditProductDto } from './dto';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
@Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary){}

    async getProduct(page:number, limit:number) {
        try {
            const [products, total] = await this.productRepo.findAndCount({
            where: { isActive: true },
            take: limit, 
            skip: (page - 1) * limit,
            });

            return {
            data: products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw new ForbiddenException(error.message || 'Failed to fetch products');
        }
    }

    
    async getProductById(productId:number){
        try{
            const product = await this.productRepo.findOneBy({id:productId});
            if(!product) throw new ForbiddenException("No product found")
            return product;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

    async addProduct(userData:any,dto:AddProductDto,files:Express.Multer.File[]){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can add Product")
            const imagesArray:string[]=[];
            
            for(var file of files){
                const imageUrl=await this.uploadImage(file)
                imagesArray.push(imageUrl)
            }
            try{
                const res = await this.productRepo.save({
                    name:dto.name,price:dto.price,description:dto.description,category:dto.category,stockQuantity:dto.stockQuantity,images:imagesArray  
                })
                return res;
            }catch(error){
                throw error
            }
    }
        
    async updateProduct(userData:any ,productId: number,dto:EditProductDto){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can edit Product")
        try{
            const res = await this.productRepo.update({id:productId},dto);
            if (res.affected===0) {
                    throw new NotFoundException(`Product not found`);
            }
            return res
        }
            catch(error){
                throw error;
        }
    }

    
    async deleteProduct(userData:any,productId:number){
        
        if(userData.role!=="ADMIN") throw new ForbiddenException("only admin can Delete product")
        const product = await this.productRepo.findOneBy({id:productId})
        if(!product) throw new NotFoundException("Product not found")
        try{
            if(product){
                const res = await this.productRepo.update({id:productId},{isActive:!product.isActive})
                const message = product.isActive?"Product Deleted":"Product Activate"
                return message
            }
        }catch(error){
            throw new error
        }

    }

    async searchProduct(name:string){
        try{
            const product = await this.productRepo.find({where:{
                name:ILike(`%${name}%`),
                isActive:true}
            })

            if(product.length===0) throw new NotFoundException("Product not Found")
            return product
        }catch(error){
            throw error;
        }
    }


    //here we will create the function of uploading image
    uploadImage( file:Express.Multer.File){
        return new Promise<string>((resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url||'');
      },
    );
    stream.end(file.buffer); // send the buffer
  });
}
}
