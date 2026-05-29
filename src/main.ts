import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación automática de DTOs en todos los endpoints
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  console.log("DEBUG: La URL de Frontend configurada es:", frontendUrl);

  // CORS para Angular
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://sportshub-production.up.railway.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefijo global /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`SportsHub API corriendo en puerto ${port}`);
}
bootstrap();
