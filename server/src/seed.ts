import { Driver, DriverId } from './core/driver/domain';
import { Review, Vehicle } from './core/driver/domain/value-objects';
import {
  DriverModel,
  DriverModelMapper,
} from './core/driver/infra/db/sequelize';
import { SequelizeDb } from './shared/infra/db/sequelize';

async function seed() {
  try {
    const sequelize = SequelizeDb.sequelize;
    sequelize.addModels([DriverModel]);

    console.log('Conecting to database...');
    await sequelize.authenticate();
    console.log('Successfully connected to the database!');

    console.log('Syncing models...');
    await sequelize.sync();

    console.log('Inserting data...');

    await DriverModel.bulkCreate(
      [
        new Driver({
          driver_id: new DriverId(1),
          name: 'Homer Simpson',
          description:
            'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios)',
          vehicle: new Vehicle({
            brand: 'Plymouth',
            model: 'Valiant',
            year: 1973,
            description: 'rosa e enferrujado',
          }),
          fee_by_km: 2.5,
          minimum_km: 1,
          review: new Review({
            rating: 2,
            comment:
              'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
          }),
        }),
        new Driver({
          driver_id: new DriverId(2),
          name: 'Dominic Toretto',
          description:
            'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
          vehicle: new Vehicle({
            brand: 'Dodge',
            model: 'Charger R/T',
            year: 1970,
            description: 'modificado',
          }),
          fee_by_km: 5,
          minimum_km: 5,
          review: new Review({
            rating: 4,
            comment:
              'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
          }),
        }),
        new Driver({
          driver_id: new DriverId(3),
          name: 'James Bond',
          description:
            'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
          vehicle: new Vehicle({
            brand: 'Aston Martin',
            model: 'DB5',
            year: 1964,
            description: 'clássico',
          }),
          fee_by_km: 10,
          minimum_km: 10,
          review: new Review({
            rating: 4,
            comment:
              'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
          }),
        }),
      ].map(DriverModelMapper.toModelProps),
      { ignoreDuplicates: true },
    );

    console.log('Data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting data:', error);
    process.exit(1);
  }
}

seed();
