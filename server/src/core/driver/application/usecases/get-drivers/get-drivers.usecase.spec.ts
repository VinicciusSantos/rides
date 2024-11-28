import { GetDriversUsecase } from './get-drivers.usecase';
import {
  IDriverRepository,
  Driver,
  DriverSearchParams,
  DriverSearchResult,
} from '../../../domain';

const driverRepoMock = {
  findAll: jest.fn(),
};

describe('GetDriversUsecase', () => {
  let usecase: GetDriversUsecase;

  beforeEach(() => {
    usecase = new GetDriversUsecase(
      driverRepoMock as unknown as IDriverRepository,
    );
    jest.clearAllMocks();
  });

  it('should call driverRepo.findAll with correct parameters', async () => {
    const input = { driver_id: 1, min_km_lte: 100 };
    const mockResult = new DriverSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });

    driverRepoMock.findAll.mockResolvedValueOnce(mockResult);

    await usecase.execute(input);

    expect(driverRepoMock.findAll).toHaveBeenCalledWith(
      DriverSearchParams.create({ filter: input }),
    );
  });

  it('should return a valid result when findAll succeeds', async () => {
    const input = { driver_id: 1, min_km_lte: 100 };
    const mockResult = new DriverSearchResult({
      items: [Driver.fake.one().build()],
      total: 1,
      current_page: 1,
      per_page: 10,
    });

    driverRepoMock.findAll.mockResolvedValueOnce(mockResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(mockResult.toJSON(true));
  });

  it('should throw an error if findAll fails', async () => {
    const input = { driver_id: 1, min_km_lte: 100 };
    const mockError = new Error('Database Error');
    driverRepoMock.findAll.mockRejectedValueOnce(mockError);

    await expect(usecase.execute(input)).rejects.toThrow('Database Error');
  });

  it('should handle missing driver_id and min_km_lte', async () => {
    const input = {}; // Empty input filter
    const mockResult = new DriverSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });

    driverRepoMock.findAll.mockResolvedValueOnce(mockResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(mockResult.toJSON(true));
    expect(driverRepoMock.findAll).toHaveBeenCalledWith(
      DriverSearchParams.create({ filter: {} }),
    );
  });

  it('should return an empty result if no drivers match the filter', async () => {
    const input = { driver_id: 999 }; // Non-existing driver
    const mockResult = new DriverSearchResult({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 10,
    });

    driverRepoMock.findAll.mockResolvedValueOnce(mockResult);

    const result = await usecase.execute(input);

    expect(result).toEqual(mockResult.toJSON(true));
  });
});
