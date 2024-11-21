import { DuplicatedEntityError } from '../../../../../../shared/domain/errors';
import { UnitOfWorkSequelize } from '../../../../../../shared/infra/db/sequelize';
import { setupSequelize } from '../../../../../../shared/infra/testing';
import { Ride, RideFilter, RideId, RideSearchParams } from '../../../../domain';
import { RideEstimationModel, RideModel } from '../ride.model';
import { RideModelMapper } from '../ride.model-mapper';
import { RideSequelizeRepository } from '../ride.sequelize-repository';

describe('RideSequelizeRepository Unit Tests', () => {
  const sequelizeHelper = setupSequelize({
    models: [RideModel, RideEstimationModel],
  });

  let uow: UnitOfWorkSequelize;
  let rideRepo: RideSequelizeRepository;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    rideRepo = new RideSequelizeRepository(RideModel, RideEstimationModel, uow);
  });

  describe('insert', () => {
    it('should insert a ride', async () => {
      const ride = Ride.fake.one().build();

      const rideJSON = ride.toJSON();
      await rideRepo.insert(ride);

      const result = (await RideModel.findByPk(rideJSON.ride_id, {
        include: RideSequelizeRepository.relations,
      }))!;

      expect(result).toBeDefined();
      expect(rideJSON).toEqual({
        ...result.toJSON(),
        active: true,
      });
    });

    describe('transaction mode', () => {
      it('should insert a ride in a transaction', async () => {
        const ride = Ride.fake.one().build();

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
        const ride = Ride.fake.one().build();

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
      // TODO - add other fields
      {
        field: 'ride_id',
        build(ride: Ride) {
          return [ride.entity_id.toString()];
        },
      },
    ])('should find a ride by $field', async ({ field, build }) => {
      const ride = Ride.fake.one().build();
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
        const ride = Ride.fake.one().build();
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
      const rides = Ride.fake.aLot(3).build();
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
          const rides = Ride.fake.aLot(3).build();
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

      // TODO - add a describe block for each field
    });

    describe('transaction mode', () => {
      it('should find all rides in a transaction', async () => {
        const rides = Ride.fake.aLot(3).build();
        await Promise.all(rides.map((ride) => rideRepo.insert(ride)));

        await uow.start();
        const result = await rideRepo.findAll();
        await uow.commit();

        expect(result.items).toHaveLength(3);
      });
    });
  });
});
