import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: ApiResponse['meta']
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta }),
    };
    res.status(statusCode).json(response);
  }

  static error(res: Response, message = 'Error', statusCode = 500, error?: string): void {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error }),
    };
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Created successfully'): void {
    this.success(res, data, message, 201);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }
}
