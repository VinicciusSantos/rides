import { DuplicatedEntityError } from '../../../../../../shared/domain/errors';
import { UnitOfWorkSequelize } from '../../../../../../shared/infra/db/sequelize';
import { setupSequelize } from '../../../../../../shared/infra/testing';
import { RideModel } from '../../../../../ride/infra/db/sequelize';
import {
  Driver,
  DriverFilter,
  DriverId,
  DriverSearchParams,
} from '../../../../domain';
import { DriverModel } from '../driver.model';
import { DriverModelMapper } from '../driver.model-mapper';
import { DriverSequelizeRepository } from '../driver.sequelize-repository';

describe('DriverSequelizeRepository Unit Tests', () => {
  const sequelizeHelper = setupSequelize({ models: [DriverModel, RideModel] });

  let uow: UnitOfWorkSequelize;
  let driverRepo: DriverSequelizeRepository;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    driverRepo = new DriverSequelizeRepository(DriverModel, uow);
  });

  describe('insert', () => {
    it('should insert a driver', async () => {
      const driver = Driver.fake.one().build();

      const driverJSON = driver.toJSON();
      await driverRepo.insert(driver);

      const result = (await DriverModel.findByPk(driverJSON.driver_id, {
        include: DriverSequelizeRepository.relations,
      }))!;

      expect(result).toBeDefined();
      expect(driverJSON).toEqual(result.toJSON());
    });

    describe('transaction mode', () => {
      it('should insert a driver in a transaction', async () => {
        const driver = Driver.fake.one().build();

        const driverJSON = driver.toJSON();
        await uow.start();
        await driverRepo.insert(driver);
        await uow.commit();

        const result = (await DriverModel.findByPk(driverJSON.driver_id, {
          include: DriverSequelizeRepository.relations,
        }))!;

        expect(result).toBeDefined();
        expect(result.driver_id).toBe(driverJSON.driver_id);
      });

      it('should rollback the transaction', async () => {
        const driver = Driver.fake.one().build();

        await uow.start();
        await driverRepo.insert(driver);
        await uow.rollback();

        const result = await DriverModel.findByPk(driver.entity_id.id);

        expect(result).toBeNull();
      });
    });
  });

  describe('findOne', () => {
    it.each([
      {
        field: 'driver_id',
        build(driver: Driver) {
          return driver.driver_id.id;
        },
      },
    ])('should find a driver by $field', async ({ field, build }) => {
      const driver = Driver.fake.one().build();
      await driverRepo.insert(driver);

      const result = await driverRepo.findOne({
        [field]: build(driver),
      });

      expect(result).toBeDefined();
      expect(result?.toJSON()).toEqual(driver.toJSON());
    });

    it('should return null if driver is not found', async () => {
      const result = await driverRepo.findOne({ driver_id: Math.random() });
      expect(result).toBeNull();
    });

    it('should throw error when result is not unique', async () => {
      const count = 2;
      const id = 123;
      const rows = Driver.fake
        .aLot(count)
        .withDriverId(new DriverId(id))
        .build()
        .map((e) => DriverModel.build(DriverModelMapper.toModelProps(e)));

      jest.spyOn(DriverModel, 'findAndCountAll').mockResolvedValueOnce({
        rows,
        count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const props: DriverFilter = { driver_id: id };

      await expect(driverRepo.findOne(props)).rejects.toThrow(
        new DuplicatedEntityError(props, Driver),
      );
    });

    describe('transaction mode', () => {
      it('should find a driver by id in a transaction', async () => {
        const driver = Driver.fake.one().build();
        await driverRepo.insert(driver);

        await uow.start();
        const result = await driverRepo.findOne({
          driver_id: driver.driver_id.id,
        });
        await uow.commit();

        expect(result).toEqual(driver);
      });

      it('should return null if driver is not found in a transaction', async () => {
        await uow.start();
        const result = await driverRepo.findOne({
          driver_id: Math.random(),
        });
        await uow.commit();

        expect(result).toBeNull();
      });
    });
  });

  describe('findAll', () => {
    it('should find all drivers', async () => {
      const drivers = Driver.fake.aLot(3).build();
      await Promise.all(drivers.map((driver) => driverRepo.insert(driver)));

      const result = await driverRepo.findAll();
      expect(result.items).toHaveLength(3);
      expect(result.items).toEqual(expect.arrayContaining(drivers));
      expect(result.total).toBe(3);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(15);
      expect(result.last_page).toBe(1);
    });

    it('should return an empty list if no drivers are found', async () => {
      const result = await driverRepo.findAll();
      expect(result.items).toHaveLength(0);
    });

    describe('filters', () => {
      describe('driver_id', () => {
        it('should find drivers by a single driver_id', async () => {
          const drivers = Driver.fake.aLot(3).build();
          await Promise.all(drivers.map((driver) => driverRepo.insert(driver)));

          const result = await driverRepo.findAll(
            DriverSearchParams.create({
              filter: { driver_id: drivers[1].entity_id.id },
            }),
          );

          expect(result.items).toHaveLength(1);
          expect(result.items[0].toJSON()).toEqual(drivers[1].toJSON());
        });
      });
    });

    describe('transaction mode', () => {
      it('should find all drivers in a transaction', async () => {
        const drivers = Driver.fake.aLot(3).build();
        await Promise.all(drivers.map((driver) => driverRepo.insert(driver)));

        await uow.start();
        const result = await driverRepo.findAll();
        await uow.commit();

        expect(result.items).toHaveLength(3);
      });
    });
  });

  describe('update', () => {
    it('should not be implemented', async () => {
      const driver = Driver.fake.one().build();

      await expect(driverRepo.update(driver)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });

  describe('delete', () => {
    it('should not be implemented', async () => {
      const driver = Driver.fake.one().build();

      await expect(driverRepo.delete(driver.driver_id)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });
});
