import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/responseHandler';
import { getPaginationParams, getSkip, getPaginationMeta } from '../utils/pagination';
import { BaseService } from '../services/BaseService';
import { AppError } from '../middlewares/errorHandler';

/**
 * Base Controller với common CRUD operations
 */
export class BaseController<T> {
  protected service: BaseService<T>;
  protected resourceName: string;

  constructor(service: BaseService<T>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  /**
   * GET /resource - Lấy danh sách
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req);
    const skip = getSkip(page, limit);

    const orderByField = sortBy || 'createdAt';
    const orderByValue = sortOrder || 'desc';
    const orderBy: Record<string, string> = { [orderByField]: orderByValue };

    const [items, total] = await Promise.all([
      this.service.findAll({
        skip,
        take: limit,
        orderBy,
      }),
      this.service.count(),
    ]);

    const meta = getPaginationMeta(page, limit, total);

    ResponseHandler.success(res, items, `${this.resourceName} fetched successfully`, 200, meta);
  };

  /**
   * GET /resource/:id - Lấy một item
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const item = await this.service.findById(id);

    if (!item) {
      throw new AppError(`${this.resourceName} not found`, 404);
    }

    ResponseHandler.success(res, item, `${this.resourceName} fetched successfully`);
  };

  /**
   * POST /resource - Tạo mới
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body);

    ResponseHandler.created(res, item, `${this.resourceName} created successfully`);
  };

  /**
   * PUT /resource/:id - Update
   */
  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const exists = await this.service.exists({ id });
    if (!exists) {
      throw new AppError(`${this.resourceName} not found`, 404);
    }

    const item = await this.service.update(id, req.body);

    ResponseHandler.success(res, item, `${this.resourceName} updated successfully`);
  };

  /**
   * DELETE /resource/:id - Xóa
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const exists = await this.service.exists({ id });
    if (!exists) {
      throw new AppError(`${this.resourceName} not found`, 404);
    }

    await this.service.delete(id);

    ResponseHandler.success(res, null, `${this.resourceName} deleted successfully`);
  };
}
