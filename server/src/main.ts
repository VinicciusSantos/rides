import { NestFactory } from '@nestjs/core';

import { applyGlobalConfig, AppModule } from './nest-modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalConfig(app);

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
