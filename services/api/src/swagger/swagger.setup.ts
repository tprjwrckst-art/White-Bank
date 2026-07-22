import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('White Bank API')
    .setDescription(
      'A comprehensive digital banking platform API with user management, accounts, transactions, cards, and more.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:4000', 'Development')
    .addServer('https://api.whitebank.com', 'Production')
    .addTag('Auth', 'User authentication and authorization')
    .addTag('Accounts', 'User account management')
    .addTag('Transactions', 'Transaction history and operations')
    .addTag('Transfers', 'Money transfer operations')
    .addTag('Cards', 'Card management and operations')
    .addTag('Notifications', 'User notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
