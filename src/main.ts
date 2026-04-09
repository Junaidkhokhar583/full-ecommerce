import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
 const config=  new DocumentBuilder().setTitle("E_Commerce").setDescription("API Testing").addBearerAuth().setVersion('1.0').build()
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true,whitelist: true,}));

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle("E_Commerce")
    .setDescription("API Testing")
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const docoment = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("",app,docoment);
  const port=configService.get<number>('PORT')||3000
  await app.listen(port);
}
bootstrap();
