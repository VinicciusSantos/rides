import { GetRidesUsecase } from './get-rides.usecase';
import {
  IRideRepository,
  Ride,
  RideSearchParams,
  RideSearchResult,
} from '../../../domain';

const rideRepoMock = {
  findAll: jest.fn(),
};

describe('GetRidesUsecase', () => {
  let usecase: GetRidesUsecase;

  beforeEach(() => {
    usecase = new GetRidesUsecase(rideRepoMock as unknown as IRideRepository);
    jest.clearAllMocks();
  });

  it('should call rideRepo.findAll with correct parameters', async () => {
    const input = { customer_id: '123', driver_id: 1 };
    const mockResult = new RideSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });
    
    rideRepoMock.findAll.mockResolvedValueOnce(mockResult);

    await usecase.execute(input);

    expect(rideRepoMock.findAll).toHaveBeenCalledWith(
      RideSearchParams.create({ filter: input }),
    );
  });

  it('should return a valid result when findAll succeeds', async () => {
    const input = { customer_id: '123', driver_id: 1 };
    const mockResult = new RideSearchResult({
      items: [Ride.fake.one().build()],
      total: 1,
      current_page: 1,
      per_page: 10,
    });
    rideRepoMock.findAll.mockResolvedValueOnce(mockResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(mockResult.toJSON(true));
  });

  it('should throw an error if findAll fails', async () => {
    const input = { customer_id: '123', driver_id: 1 };
    const mockError = new Error('Database Error');
    rideRepoMock.findAll.mockRejectedValueOnce(mockError);

    await expect(usecase.execute(input)).rejects.toThrow('Database Error');
  });

  it('should handle missing customer_id and driver_id', async () => {
    const input = {};
    const mockResult = new RideSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });
    rideRepoMock.findAll.mockResolvedValueOnce(mockResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(mockResult.toJSON(true));
    expect(rideRepoMock.findAll).toHaveBeenCalledWith(
      RideSearchParams.create({ filter: {} }),
    );
  });
});
