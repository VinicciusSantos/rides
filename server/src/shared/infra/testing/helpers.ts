import { ModelCtor, Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { Config } from '../config';
import { DomainEventModel } from '../db/sequelize/models';

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  // Adiciona DomainEventModel aos modelos, garantindo que não seja undefined
  const models = options.models
    ? [...options.models, DomainEventModel]
    : [DomainEventModel];

  beforeAll(async () => {
    const config = {
      ...Config.env.db,
      ...options,
      storage: ':memory:', // Garante o uso correto para SQLite em memória
      dialect: 'sqlite', // Força SQLite como o dialeto
    };

    console.log('Configuração do Sequelize:', config);

    _sequelize = new Sequelize({
      ...config,
      models,
    } as any);

    await _sequelize.authenticate(); // Verifica a conexão
    await _sequelize.sync({ force: true }); // Garante que as tabelas sejam criadas
  });

  beforeEach(async () => {
    await _sequelize.sync({ force: true }); // Reseta o banco antes de cada teste
  });

  afterAll(async () => {
    await _sequelize.close(); // Fecha a conexão após os testes
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
