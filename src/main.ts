import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'src', 'views'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  
  await app.listen(3000);
}
bootstrap();
