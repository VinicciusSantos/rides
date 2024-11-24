import { DuplicatedEntityError } from '../../../../../../shared/domain/errors';
import { UnitOfWorkSequelize } from '../../../../../../shared/infra/db/sequelize';
import { setupSequelize } from '../../../../../../shared/infra/testing';
import {
  Customer,
  CustomerFilter,
  CustomerId,
  CustomerSearchParams,
} from '../../../../domain';
import { CustomerModel } from '../customer.model';
import { CustomerModelMapper } from '../customer.model-mapper';
import { CustomerSequelizeRepository } from '../customer.sequelize-repository';

describe('CustomerSequelizeRepository Unit Tests', () => {
  const sequelizeHelper = setupSequelize({ models: [CustomerModel] });

  let uow: UnitOfWorkSequelize;
  let customerRepo: CustomerSequelizeRepository;

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    customerRepo = new CustomerSequelizeRepository(CustomerModel, uow);
  });

  describe('insert', () => {
    it('should insert a customer', async () => {
      const customer = Customer.fake.one().build();

      const customerJSON = customer.toJSON();
      await customerRepo.insert(customer);

      const result = (await CustomerModel.findByPk(customerJSON.customer_id, {
        include: CustomerSequelizeRepository.relations,
      }))!;

      expect(result).toBeDefined();
      expect(customerJSON).toEqual(result.toJSON());
    });

    describe('transaction mode', () => {
      it('should insert a customer in a transaction', async () => {
        const customer = Customer.fake.one().build();

        const customerJSON = customer.toJSON();
        await uow.start();
        await customerRepo.insert(customer);
        await uow.commit();

        const result = (await CustomerModel.findByPk(customerJSON.customer_id, {
          include: CustomerSequelizeRepository.relations,
        }))!;

        expect(result).toBeDefined();
        expect(result.customer_id).toBe(customerJSON.customer_id);
      });

      it('should rollback the transaction', async () => {
        const customer = Customer.fake.one().build();

        await uow.start();
        await customerRepo.insert(customer);
        await uow.rollback();

        const result = await CustomerModel.findByPk(customer.entity_id.id);

        expect(result).toBeNull();
      });
    });
  });

  describe('findOne', () => {
    it.each([
      {
        field: 'customer_id',
        build(customer: Customer) {
          return [customer.entity_id.toString()];
        },
      },
    ])('should find a customer by $field', async ({ field, build }) => {
      const customer = Customer.fake.one().build();
      await customerRepo.insert(customer);

      const result = await customerRepo.findOne({
        [field]: build(customer),
      });

      expect(result).toBeDefined();
      expect(result?.toJSON()).toEqual(customer.toJSON());
    });

    it('should return null if customer is not found', async () => {
      const result = await customerRepo.findOne({
        customer_id: new CustomerId().toString(),
      });
      expect(result).toBeNull();
    });

    it('should throw error when result is not unique', async () => {
      const count = 2;
      const rows = Customer.fake
        .aLot(count)
        .build()
        .map((e) => CustomerModel.build(CustomerModelMapper.toModelProps(e)));

      jest.spyOn(CustomerModel, 'findAndCountAll').mockResolvedValueOnce({
        rows,
        count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const props: CustomerFilter = { customer_id: 'id' };

      await expect(customerRepo.findOne(props)).rejects.toThrow(
        new DuplicatedEntityError(props, Customer),
      );
    });

    describe('transaction mode', () => {
      it('should find a customer by id in a transaction', async () => {
        const customer = Customer.fake.one().build();
        await customerRepo.insert(customer);

        await uow.start();
        const result = await customerRepo.findOne({
          customer_id: customer.entity_id.toString(),
        });
        await uow.commit();

        expect(result).toEqual(customer);
      });

      it('should return null if customer is not found in a transaction', async () => {
        await uow.start();
        const result = await customerRepo.findOne({
          customer_id: new CustomerId().toString(),
        });
        await uow.commit();

        expect(result).toBeNull();
      });
    });
  });

  describe('findAll', () => {
    it('should find all customers', async () => {
      const customers = Customer.fake.aLot(3).build();
      await Promise.all(
        customers.map((customer) => customerRepo.insert(customer)),
      );

      const result = await customerRepo.findAll();
      expect(result.items).toHaveLength(3);
      expect(result.items).toEqual(expect.arrayContaining(customers));
      expect(result.total).toBe(3);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(15);
      expect(result.last_page).toBe(1);
    });

    it('should return an empty list if no customers are found', async () => {
      const result = await customerRepo.findAll();
      expect(result.items).toHaveLength(0);
    });

    describe('filters', () => {
      describe('customer_id', () => {
        it('should find customers by a single customer_id', async () => {
          const customers = Customer.fake.aLot(3).build();
          await Promise.all(
            customers.map((customer) => customerRepo.insert(customer)),
          );

          const result = await customerRepo.findAll(
            CustomerSearchParams.create({
              filter: { customer_id: customers[1].entity_id.id },
            }),
          );

          expect(result.items).toHaveLength(1);
          expect(result.items[0].toJSON()).toEqual(customers[1].toJSON());
        });
      });
    });

    describe('transaction mode', () => {
      it('should find all customers in a transaction', async () => {
        const customers = Customer.fake.aLot(3).build();
        await Promise.all(
          customers.map((customer) => customerRepo.insert(customer)),
        );

        await uow.start();
        const result = await customerRepo.findAll();
        await uow.commit();

        expect(result.items).toHaveLength(3);
      });
    });
  });

  describe('update', () => {
    it('should not be implemented', async () => {
      const customer = Customer.fake.one().build();

      await expect(customerRepo.update(customer)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });

  describe('delete', () => {
    it('should not be implemented', async () => {
      const customer = Customer.fake.one().build();

      await expect(customerRepo.delete(customer.customer_id)).rejects.toThrow(
        new Error('Method not implemented.'),
      );
    });
  });
});
