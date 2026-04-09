import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { AddProductDto, EditProductDto } from './dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
    constructor(private productService:ProductService){}

    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    
    @Get("/products")
    getProduct( @Query('page') page,@Query('limit') limit){
    return this.productService.getProduct(Number(page), Number(limit));
    }
    
    @Get("/product/:id")
    // @ApiParam({ name: 'id', type: Number })
    getProductById(@Param('id',ParseIntPipe) productId:number){
        return this.productService.getProductById(productId)
    }

    @UseGuards(JwtGuard)
    @Post("/admin/product")
    @UseInterceptors(FilesInterceptor('files',6))
    @ApiConsumes('multipart/form-data')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
        files: {
            type: 'array',
            items: {
            type: 'string',
            format: 'binary',
            },
            description: 'Select multiple images',
        },
        data: {
            type: 'string',
            example: JSON.stringify({
            name: 'iPhone 15 Pro',
            description: 'Latest Apple flagship phone',
            price: 250000,
            stockQuantity: 12,
            category: 'Electronics',
            isActive: true,
            }),
        },
        },
        required: ['files', 'data'],
    },
    })

    addProduct(@GetUser() userData: any , @Body('data') rawJson: string,@UploadedFiles() files:Express.Multer.File[]){
            const dto: AddProductDto = JSON.parse(rawJson);
            return this.productService.addProduct(userData,dto,files)
    }
    
    @UseGuards(JwtGuard)
    @Patch("/admin/product/:id")
    updateProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number,@Body() dto:EditProductDto){
        return this.productService.updateProduct(userData,productId,dto)

    }

    @UseGuards(JwtGuard)
    @Delete("/admin/product/:id")
    deleteProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number){
        return this.productService.deleteProduct(userData,productId)
    }

    @Get("/search-product/:name")
    searchProduct(@Param('name') name:string){
        return this.productService.searchProduct(name);
    }



}
