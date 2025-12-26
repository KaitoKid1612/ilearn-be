import prisma from '../config/database';

/**
 * Base Service class với common CRUD operations
 */
export class BaseService<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected model: any;

  constructor(modelName: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    this.model = (prisma as any)[modelName];
  }

  /**
   * Tìm tất cả records với pagination
   */
  async findAll(options: {
    skip?: number;
    take?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderBy?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include?: any;
  }): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.model.findMany(options);
  }

  /**
   * Đếm số lượng records
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async count(where?: any): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return await this.model.count({ where });
  }

  /**
   * Tìm một record theo ID
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findById(id: string, include?: any): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return await this.model.findUnique({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      include,
    });
  }

  /**
   * Tìm một record theo điều kiện
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findOne(where: any, include?: any): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return await this.model.findFirst({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      include,
    });
  }

  /**
   * Tạo mới record
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return await this.model.create({ data });
  }

  /**
   * Update record
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: any): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return await this.model.update({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
    });
  }

  /**
   * Xóa record
   */
  async delete(id: string): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.model.delete({
      where: { id },
    });
  }

  /**
   * Check record tồn tại
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exists(where: any): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const count = await this.model.count({ where });
    return count > 0;
  }
}
