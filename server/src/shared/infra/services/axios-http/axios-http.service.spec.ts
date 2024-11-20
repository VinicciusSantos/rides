import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { HttpRequestFailedError } from '../../../domain/errors';
import { HTTPStatus, RequestConfig } from '../../../domain/services';
import { AxiosHttpService } from './axios-http.service';

const axiosInstanceMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} satisfies Partial<AxiosInstance>;

describe('AxiosHttpService', () => {
  let service: AxiosHttpService;

  beforeEach(() => {
    service = new AxiosHttpService();
    service['axiosInstance'] = axiosInstanceMock as unknown as AxiosInstance;
  });

  describe('get', () => {
    it('should return data on successful GET request', async () => {
      const responseData = { data: 'success' };
      axiosInstanceMock.get.mockResolvedValueOnce({ data: responseData });

      const props: RequestConfig = { url: '/test' };
      const result = await service.get(props);

      expect(result).toEqual(responseData);
      expect(axiosInstanceMock.get).toHaveBeenCalledWith(props.url, {
        params: undefined,
      });
    });

    it('should throw HttpRequestFailedError on GET request failure', async () => {
      const error = new AxiosError('GET error');
      axiosInstanceMock.get.mockRejectedValueOnce(error);

      const props: RequestConfig = { url: '/test' };

      await expect(service.get(props)).rejects.toThrow(HttpRequestFailedError);
    });
  });

  describe('post', () => {
    it('should return data on successful POST request', async () => {
      const responseData = { data: 'success' };
      axiosInstanceMock.post.mockResolvedValueOnce({ data: responseData });

      const props: RequestConfig = {
        url: '/test',
        data: { key: 'value' },
      };
      const result = await service.post(props);

      expect(result).toEqual(responseData);
      expect(axiosInstanceMock.post).toHaveBeenCalledWith(
        props.url,
        props.data,
        {},
      );
    });

    it('should throw HttpRequestFailedError on POST request failure', async () => {
      const error = new AxiosError('POST error');
      axiosInstanceMock.post.mockRejectedValueOnce(error);

      const props: RequestConfig = { url: '/test' };

      await expect(service.post(props)).rejects.toThrow(HttpRequestFailedError);
    });
  });

  describe('put', () => {
    it('should return data on successful PUT request', async () => {
      const responseData = { data: 'success' };
      axiosInstanceMock.put.mockResolvedValueOnce({ data: responseData });

      const props: RequestConfig = {
        url: '/test',
        data: { key: 'value' },
      };
      const result = await service.put(props);

      expect(result).toEqual(responseData);
      expect(axiosInstanceMock.put).toHaveBeenCalledWith(
        props.url,
        props.data,
        {},
      );
    });

    it('should throw HttpRequestFailedError on PUT request failure', async () => {
      const error = new AxiosError('PUT error');
      axiosInstanceMock.put.mockRejectedValueOnce(error);

      const props: RequestConfig = { url: '/test' };

      await expect(service.put(props)).rejects.toThrow(HttpRequestFailedError);
    });
  });

  describe('delete', () => {
    it('should return data on successful DELETE request', async () => {
      const responseData = { data: 'success' };
      axiosInstanceMock.delete.mockResolvedValueOnce({ data: responseData });

      const props: RequestConfig = { url: '/test' };
      const result = await service.delete(props);

      expect(result).toEqual(responseData);
      expect(axiosInstanceMock.delete).toHaveBeenCalledWith(props.url, {});
    });

    it('should throw HttpRequestFailedError on DELETE request failure', async () => {
      const error = new AxiosError('DELETE error');
      axiosInstanceMock.delete.mockRejectedValueOnce(error);

      const props: RequestConfig = { url: '/test' };

      await expect(service.delete(props)).rejects.toThrow(
        HttpRequestFailedError,
      );
    });
  });

  describe('handleAxiosError', () => {
    it('should throw HttpRequestFailedError with BAD_GATEWAY on Axios error', () => {
      const axiosError = new AxiosError('error');
      axiosError.response = {
        status: HTTPStatus.BAD_GATEWAY,
        data: 'error data',
      } as AxiosResponse;

      expect(() => service['handleAxiosError'](axiosError, 'GET')).toThrowError(
        new HttpRequestFailedError(
          'GET request failed: error',
          HTTPStatus.BAD_GATEWAY,
          'error data',
        ),
      );
    });

    it('should throw HttpRequestFailedError with INTERNAL_SERVER_ERROR on general error', () => {
      const error = new Error('general error');

      expect(() => service['handleAxiosError'](error, 'GET')).toThrowError(
        new HttpRequestFailedError(
          'GET request failed: general error',
          HTTPStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
