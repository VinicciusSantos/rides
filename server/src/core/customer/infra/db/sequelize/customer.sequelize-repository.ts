import { DuplicatedEntityError } from '../../../../../shared/domain/errors';
import {
  OpBuilder,
  UnitOfWorkSequelize,
} from '../../../../../shared/infra/db/sequelize';
import {
  Customer,
  CustomerFilter,
  CustomerId,
  CustomerSearchParams,
  CustomerSearchResult,
  ICustomerRepository,
} from '../../../domain';
import { CustomerModel, CustomerModelProps } from './customer.model';
import { CustomerModelMapper } from './customer.model-mapper';

export class CustomerSequelizeRepository implements ICustomerRepository {
  public sortableFields: (keyof CustomerModelProps)[] = [];
  public static relations: (keyof CustomerModelProps)[] = [];

  constructor(
    private customerModel: typeof CustomerModel,
    private uow: UnitOfWorkSequelize,
  ) {}

  public async insert(aggregate: Customer): Promise<void> {
    this.uow.addAggregateRoot(aggregate);
    await this.customerModel.create(
      CustomerModelMapper.toModelProps(aggregate),
      {
        include: CustomerSequelizeRepository.relations,
        transaction: this.uow.getTransaction(),
      },
    );
  }

  public async findOne(filter: CustomerFilter): Promise<Customer | null> {
    const { rows, count } = await this._search(
      CustomerSearchParams.create({ filter }),
    );

    if (count > 1) {
      throw new DuplicatedEntityError(filter, Customer);
    }

    return rows[0] || null;
  }

  public async findAll(
    props: CustomerSearchParams = CustomerSearchParams.create(),
  ): Promise<CustomerSearchResult> {
    const { rows, count } = await this._search(props);

    return new CustomerSearchResult({
      items: rows,
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(_aggregate: Customer): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(_aggregate_id: CustomerId): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async _search(props: CustomerSearchParams) {
    const { offset, filter, per_page } = props;
    const { customer_id, name } = filter || {};

    const data = await this.customerModel.findAndCountAll({
      where: {
        ...OpBuilder.Exact('customer_id', customer_id),
        ...OpBuilder.Like('name', name),
      },
      include: CustomerSequelizeRepository.relations,
      order: OpBuilder.Order(props),
      offset,
      limit: per_page,
      transaction: this.uow.getTransaction(),
    });

    return {
      ...data,
      rows: data.rows.map(CustomerModelMapper.toAggregate),
    };
  }
}
