import axios, { AxiosError, AxiosInstance } from 'axios';

import { HttpRequestFailedError } from '../../../domain/errors';
import {
  IHttpService,
  HTTPStatus,
  RequestConfig,
} from '../../../domain/services';

export class AxiosHttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  public async get<Receive>(props: RequestConfig): Promise<Receive> {
    const { url, ...rest } = props;
    try {
      const response = await this.axiosInstance.get<Receive>(url, rest);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'GET');
    }
  }

  public async post<Receive>(props: RequestConfig): Promise<Receive> {
    const { url, data, ...rest } = props;
    try {
      const response = await this.axiosInstance.post<Receive>(url, data, rest);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'POST');
    }
  }

  public async put<Receive>(props: RequestConfig): Promise<Receive> {
    const { url, data, ...rest } = props;
    try {
      const response = await this.axiosInstance.put<Receive>(url, data, rest);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'PUT');
    }
  }

  public async delete<Receive>(props: RequestConfig): Promise<Receive> {
    const { url, ...rest } = props;
    try {
      const response = await this.axiosInstance.delete<Receive>(url, rest);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error as AxiosError, 'DELETE');
    }
  }

  private handleAxiosError(error: AxiosError | Error, method: string): never {
    if (axios.isAxiosError(error)) {
      throw new HttpRequestFailedError(
        `${method} request failed: ${error.message}`,
        error.status || HTTPStatus.BAD_GATEWAY,
        error.response?.data,
      );
    }

    throw new HttpRequestFailedError(
      `${method} request failed: ${error.message}`,
      HTTPStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
