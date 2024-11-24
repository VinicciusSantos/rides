import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { applyGlobalConfig, AppModule } from './nest-modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalConfig(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rides API')
    .setDescription("The Rides' API documentation")
    .setVersion('0.0.1')
    .build();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
