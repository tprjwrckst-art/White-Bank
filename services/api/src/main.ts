import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Setup Swagger documentation
  setupSwagger(app);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`\n🚀 White Bank API is running on http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs\n`);
}

bootstrap();
