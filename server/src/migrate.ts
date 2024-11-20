import { migrator } from './shared/infra/db/sequelize/migrator';
import { SequelizeDb } from './shared/infra/db/sequelize/sequelize';

async function bootstrap() {
  migrator(SequelizeDb.sequelize).runAsCLI();
}
bootstrap();
