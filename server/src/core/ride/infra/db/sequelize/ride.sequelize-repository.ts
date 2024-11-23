import { DuplicatedEntityError } from '../../../../../shared/domain/errors';
import {
  OpBuilder,
  UnitOfWorkSequelize,
} from '../../../../../shared/infra/db/sequelize';
import {
  IRideRepository,
  Ride,
  RideEstimation,
  RideFilter,
  RideId,
  RideSearchParams,
  RideSearchResult,
} from '../../../domain';
import { RideEstimationModel, RideModel, RideModelProps } from './ride.model';
import {
  RideEstimationModelMapper,
  RideModelMapper,
} from './ride.model-mapper';

export class RideSequelizeRepository implements IRideRepository {
  public sortableFields: (keyof RideModelProps)[] = [];
  public static relations: (keyof RideModelProps)[] = [];

  constructor(
    private rideModel: typeof RideModel,
    private rideEstimationModel: typeof RideEstimationModel,
    private uow: UnitOfWorkSequelize,
  ) {}

  public async insert(entity: Ride): Promise<void> {
    await this.rideModel.create(RideModelMapper.toModelProps(entity), {
      include: RideSequelizeRepository.relations,
      transaction: this.uow.getTransaction(),
    });
  }

  public async findOne(filter: RideFilter): Promise<Ride | null> {
    const { rows, count } = await this._search(
      RideSearchParams.create({ filter }),
    );

    if (count > 1) {
      throw new DuplicatedEntityError(filter, Ride);
    }

    return rows[0] || null;
  }

  public async findAll(
    props: RideSearchParams = RideSearchParams.create(),
  ): Promise<RideSearchResult> {
    const { rows, count } = await this._search(props);

    return new RideSearchResult({
      items: rows,
      total: count,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(_aggregate: Ride): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async delete(_aggregate_id: RideId): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async registerEstimation(estimation: RideEstimation): Promise<void> {
    await this.rideEstimationModel.create(
      { ...RideEstimationModelMapper.toModelProps(estimation) },
      {
        include: RideSequelizeRepository.relations,
        transaction: this.uow.getTransaction(),
      },
    );
  }

  public async removeEstimation(estimation_id: number): Promise<void> {
    await this.rideEstimationModel.destroy({
      where: { id: estimation_id },
      transaction: this.uow.getTransaction(),
    });
  }

  public async findEstimation(
    origin: string,
    destination: string,
  ): Promise<RideEstimation | null> {
    const data = await this.rideEstimationModel.findOne({
      where: { origin, destination },
      transaction: this.uow.getTransaction(),
    });

    return data ? RideEstimationModelMapper.toValueObject(data) : null;
  }

  private async _search(props: RideSearchParams) {
    const { offset, filter, per_page } = props;
    const { ride_id } = filter || {};

    const data = await this.rideModel.findAndCountAll({
      where: {
        ...OpBuilder.Exact('ride_id', ride_id),
        ...OpBuilder.Exact('driver_id', filter?.driver_id),
      },
      include: RideSequelizeRepository.relations,
      order: OpBuilder.Order(props),
      offset,
      limit: per_page,
      transaction: this.uow.getTransaction(),
    });

    return {
      ...data,
      rows: data.rows.map(RideModelMapper.toAggregate),
    };
  }
}
