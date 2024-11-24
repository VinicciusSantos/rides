import { DuplicatedEntityError } from '../../../../../shared/domain/errors';
import {
  OpBuilder,
  UnitOfWorkSequelize,
} from '../../../../../shared/infra/db/sequelize';
import {
  Driver,
  DriverFilter,
  DriverId,
  DriverSearchParams,
  DriverSearchResult,
  IDriverRepository,
} from '../../../domain';
import { DriverModel, DriverModelProps } from './driver.model';
import { DriverModelMapper } from './driver.model-mapper';

export class DriverSequelizeRepository implements IDriverRepository {
  public sortableFields: (keyof DriverModelProps)[] = [];
  public static relations: (keyof DriverModelProps)[] = [];

  constructor(
    private driverModel: typeof DriverModel,
    private uow: UnitOfWorkSequelize,
  ) {}

  public async insert(aggregate: Driver): Promise<void> {
    this.uow.addAggregateRoot(aggregate);
    await this.driverModel.create(DriverModelMapper.toModelProps(aggregate), {
      include: DriverSequelizeRepository.relations,
      transaction: this.uow.getTransaction(),
    });
  }

  public async findOne(filter: DriverFilter): Promise<Driver | null> {
    const { rows, count } = await this._search(
      DriverSearchParams.create({ filter }),
    );

    if (count > 1) {
      throw new DuplicatedEntityError(filter, Driver);
    }

    return rows[0] || null;
  }

  public async findAll(
    props: DriverSearchParams = DriverSearchParams.create(),
  ): Promise<DriverSearchResult> {
    const { rows, count } = await this._search(props);

    return new DriverSearchResult({
      items: rows,
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(aggregate: Driver): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(_aggregate_id: DriverId): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async _search(
    props: DriverSearchParams = DriverSearchParams.create(),
  ) {
    const { offset, filter, per_page } = props;
    const { driver_id, min_km_lte } = filter || {};

    const data = await this.driverModel.findAndCountAll({
      where: {
        ...OpBuilder.Exact('driver_id', driver_id),
        ...OpBuilder.Lte('minimum_km', min_km_lte),
      },
      include: DriverSequelizeRepository.relations,
      order: OpBuilder.Order(props),
      offset,
      limit: per_page,
      transaction: this.uow.getTransaction(),
    });

    return {
      ...data,
      rows: data.rows.map(DriverModelMapper.toEntity),
    };
  }
}
