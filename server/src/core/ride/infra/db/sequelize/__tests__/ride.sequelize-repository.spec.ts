import Chance from 'chance';

import { DuplicatedEntityError } from '../../../../../../shared/domain/errors';
import { Geolocation } from '../../../../../../shared/domain/value-objects';
import { UnitOfWorkSequelize } from '../../../../../../shared/infra/db/sequelize';
import { setupSequelize } from '../../../../../../shared/infra/testing';
import { Driver } from '../../../../../driver/domain';
import {
  DriverModel,
  DriverModelMapper,
} from '../../../../../driver/infra/db/sequelize';
import {
  Ride,
  RideEstimation,
  RideFilter,
  RideId,
  RideSearchParams,
} from '../../../../domain';
import { RideEstimationModel, RideModel } from '../ride.model';
import {
  RideEstimationModelMapper,
  RideModelMapper,
} from '../ride.model-mapper';
import { RideSequelizeRepository } from '../ride.sequelize-repository';

const chance = new Chance();

const generateRandomLocation = (): Geolocation =>
  new Geolocation(chance.latitude(), chance.longitude(), chance.address());

const createRelations = async (): Promise<{ driver: Driver }> => {
  const driverRes = await DriverModel.create(
    DriverModelMapper.toModelProps(Driver.fake.one().build()),
  );
  return {
    driver: DriverModelMapper.toEntity(driverRes),
  };
};

describe('RideSequelizeRepository Unit Tests', () => {
  const sequelizeHelper = setupSequelize({
    models: [RideModel, RideEstimationModel, DriverModel],
  });

  let uow: UnitOfWorkSequelize;
  let rideRepo: RideSequelizeRepository;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    rideRepo = new RideSequelizeRepository(RideModel, RideEstimationModel, uow);
  });

  describe('insert', () => {
    it('should insert a ride', async () => {
      const { driver } = await createRelations();
      const ride = Ride.fake
        .one()
        .withDriver(driver)
        .withDriverId(driver.driver_id)
        .build();

      const rideJSON = ride.toJSON();
      await rideRepo.insert(ride);

      const result = (await RideModel.findByPk(rideJSON.ride_id, {
        include: RideSequelizeRepository.relations,
      }))!;

      expect(result).toBeDefined();
      expect(rideJSON).toEqual(result.toJSON());
    });

    describe('transaction mode', () => {
      it('should insert a ride in a transaction', async () => {
        const { driver } = await createRelations();
        const ride = Ride.fake
          .one()
          .withDriver(driver)
          .withDriverId(driver.driver_id)
          .build();

        const rideJSON = ride.toJSON();
        await uow.start();
        await rideRepo.insert(ride);
        await uow.commit();

        const result = (await RideModel.findByPk(rideJSON.ride_id, {
          include: RideSequelizeRepository.relations,
        }))!;

        expect(result).toBeDefined();
        expect(result.ride_id).toBe(rideJSON.ride_id);
      });

      it('should rollback the transaction', async () => {
        const { driver } = await createRelations();
        const ride = Ride.fake
          .one()
          .withDriver(driver)
          .withDriverId(driver.driver_id)
          .build();

        await uow.start();
        await rideRepo.insert(ride);
        await uow.rollback();

        const result = await RideModel.findByPk(ride.entity_id.id);

        expect(result).toBeNull();
      });
    });
  });

  describe('findOne', () => {
    it.each([
      {
        field: 'ride_id',
        build(ride: Ride) {
          return [ride.entity_id.toString()];
        },
      },
    ])('should find a ride by $field', async ({ field, build }) => {
      const { driver } = await createRelations();
      const ride = Ride.fake
        .one()
        .withDriver(driver)
        .withDriverId(driver.driver_id)
        .build();

      await rideRepo.insert(ride);

      const result = await rideRepo.findOne({
        [field]: build(ride),
      });

      expect(result).toBeDefined();
      expect(result?.toJSON()).toEqual(ride.toJSON());
    });

    it('should return null if ride is not found', async () => {
      const result = await rideRepo.findOne({
        ride_id: new RideId().toString(),
      });
      expect(result).toBeNull();
    });

    it('should throw error when result is not unique', async () => {
      const count = 2;
      const rows = Ride.fake
        .aLot(count)
        .build()
        .map((e) => RideModel.build(RideModelMapper.toModelProps(e)));

      jest.spyOn(RideModel, 'findAndCountAll').mockResolvedValueOnce({
        rows,
        count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const props: RideFilter = { ride_id: 'id' };

      await expect(rideRepo.findOne(props)).rejects.toThrow(
        new DuplicatedEntityError(props, Ride),
      );
    });

    describe('transaction mode', () => {
      it('should find a ride by id in a transaction', async () => {
        const { driver } = await createRelations();
        const ride = Ride.fake
          .one()
          .withDriver(driver)
          .withDriverId(driver.driver_id)
          .build();
        await rideRepo.insert(ride);

        await uow.start();
        const result = await rideRepo.findOne({
          ride_id: ride.entity_id.toString(),
        });
        await uow.commit();

        expect(result).toEqual(ride);
      });

      it('should return null if ride is not found in a transaction', async () => {
        await uow.start();
        const result = await rideRepo.findOne({
          ride_id: new RideId().toString(),
        });
        await uow.commit();

        expect(result).toBeNull();
      });
    });
  });

  describe('findAll', () => {
    it('should find all rides', async () => {
      const { driver } = await createRelations();
      const rides = Ride.fake
        .aLot(3)
        .withDriver(driver)
        .withDriverId(driver.driver_id)
        .build();

      await Promise.all(rides.map((ride) => rideRepo.insert(ride)));

      const result = await rideRepo.findAll();
      expect(result.items).toHaveLength(3);
      expect(result.items).toEqual(expect.arrayContaining(rides));
      expect(result.total).toBe(3);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(15);
      expect(result.last_page).toBe(1);
    });

    it('should return an empty list if no rides are found', async () => {
      const result = await rideRepo.findAll();
      expect(result.items).toHaveLength(0);
    });

    describe('filters', () => {
      describe('ride_id', () => {
        it('should find rides by a single ride_id', async () => {
          const { driver } = await createRelations();
          const rides = Ride.fake
            .aLot(3)
            .withDriver(driver)
            .withDriverId(driver.driver_id)
            .build();

          await Promise.all(rides.map((ride) => rideRepo.insert(ride)));

          const result = await rideRepo.findAll(
            RideSearchParams.create({
              filter: { ride_id: rides[1].entity_id.id },
            }),
          );

          expect(result.items).toHaveLength(1);
          expect(result.items[0].toJSON()).toEqual(rides[1].toJSON());
        });
      });
    });

    describe('transaction mode', () => {
      it('should find all rides in a transaction', async () => {
        const { driver } = await createRelations();
        const rides = Ride.fake
          .aLot(3)
          .withDriver(driver)
          .withDriverId(driver.driver_id)
          .build();

        await Promise.all(rides.map((ride) => rideRepo.insert(ride)));

        await uow.start();
        const result = await rideRepo.findAll();
        await uow.commit();

        expect(result.items).toHaveLength(3);
      });
    });
  });

  describe('update', () => {
    it('should not be implemented', async () => {
      const ride = Ride.fake.one().build();

      await expect(rideRepo.update(ride)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });

  describe('delete', () => {
    it('should not be implemented', async () => {
      const ride = Ride.fake.one().build();

      await expect(rideRepo.delete(ride.ride_id)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });

  describe('registerEstimation', () => {
    it('should insert a ride estimation', async () => {
      const rideEstimation = new RideEstimation({
        origin: generateRandomLocation(),
        destination: generateRandomLocation(),
        distance: 1000,
        duration: '10 mins',
        encoded_polyline: 'encoded-polyline',
      });

      await rideRepo.registerEstimation(rideEstimation);

      const [result] = await RideEstimationModel.findAll();

      expect(result).toBeDefined();
      expect(result.toJSON()).toEqual(
        expect.objectContaining({
          ...rideEstimation.toJSON(),
          id: expect.any(Number),
        }),
      );
    });

    describe('transaction mode', () => {
      it('should insert a ride in a transaction', async () => {
        const rideEstimation = new RideEstimation({
          origin: generateRandomLocation(),
          destination: generateRandomLocation(),
          distance: 1000,
          duration: '10 mins',
          encoded_polyline: 'encoded-polyline',
        });

        await uow.start();
        await rideRepo.registerEstimation(rideEstimation);
        await uow.commit();

        const [result] = await RideEstimationModel.findAll();

        expect(result).toBeDefined();
        expect(result.toJSON()).toEqual(
          expect.objectContaining({
            ...rideEstimation.toJSON(),
            id: expect.any(Number),
          }),
        );
      });

      it('should rollback the transaction', async () => {
        const rideEstimation = new RideEstimation({
          origin: generateRandomLocation(),
          destination: generateRandomLocation(),
          distance: 1000,
          duration: '10 mins',
          encoded_polyline: 'encoded-polyline',
        });

        await uow.start();
        await rideRepo.registerEstimation(rideEstimation);
        await uow.rollback();

        const [result] = await RideEstimationModel.findAll();

        expect(result).toBeUndefined();
      });
    });
  });

  describe('removeEstimation', () => {
    it('should throw error on delete when a entity not found', async () => {
      const estimationId = chance.integer({ min: 1, max: 1000 });
      await expect(rideRepo.removeEstimation(estimationId)).rejects.toThrow();
    });

    it('should delete a entity', async () => {
      const estimation = new RideEstimation({
        origin: generateRandomLocation(),
        destination: generateRandomLocation(),
        distance: 1000,
        duration: '10 mins',
        encoded_polyline: 'encoded-polyline',
      });
      await rideRepo.registerEstimation(estimation);

      const [storedEstimation] = await RideEstimationModel.findAll();
      await rideRepo.removeEstimation(storedEstimation.id);
      const [estimationFound] = await RideEstimationModel.findAll();
      expect(estimationFound).toBeUndefined();
    });

    describe('transaction mode', () => {
      it('should delete a Estimation', async () => {
        const estimation = new RideEstimation({
          origin: generateRandomLocation(),
          destination: generateRandomLocation(),
          distance: 1000,
          duration: '10 mins',
          encoded_polyline: 'encoded-polyline',
        });
        await rideRepo.registerEstimation(estimation);

        const [storedEstimation] = await RideEstimationModel.findAll();
        await uow.start();
        await rideRepo.removeEstimation(storedEstimation.id);
        await uow.commit();

        const [estimationFound] = await RideEstimationModel.findAll();
        expect(estimationFound).toBeUndefined();
      });

      it('rollback the deletion', async () => {
        const estimation = new RideEstimation({
          origin: generateRandomLocation(),
          destination: generateRandomLocation(),
          distance: 1000,
          duration: '10 mins',
          encoded_polyline: 'encoded-polyline',
        });
        await rideRepo.registerEstimation(estimation);

        const [storedEstimation] = await RideEstimationModel.findAll();
        await uow.start();
        await rideRepo.removeEstimation(storedEstimation.id);
        await uow.rollback();

        const [estimationFound] = await RideEstimationModel.findAll();
        expect(estimationFound.toJSON()).toEqual(storedEstimation.toJSON());
      });
    });
  });

  describe('findEstimation', () => {
    it('should return a mapped ride estimation', async () => {
      const estimation = new RideEstimation({
        id: 1,
        origin: generateRandomLocation(),
        destination: generateRandomLocation(),
        distance: 2.5,
        duration: '5 mins',
        encoded_polyline: 'mocked-polyline',
        created_at: new Date(),
      });

      await RideEstimationModel.create({
        ...RideEstimationModelMapper.toModelProps(estimation),
      });

      const result = await rideRepo.findEstimation(
        estimation.origin.address!,
        estimation.destination.address!,
      );

      expect(result).toBeDefined();
      expect(result?.toJSON()).toEqual({
        ...estimation.toJSON(),
        created_at: estimation.created_at,
      });
    });

    it('should return null if no estimation is found', async () => {
      const result = await rideRepo.findEstimation(
        chance.address(),
        chance.address(),
      );

      expect(result).toBeNull();
    });
  });
});
