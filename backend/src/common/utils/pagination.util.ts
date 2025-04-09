/** Class for creating pagination APIs */
export class Pagination {
  readonly page: number;
  readonly limit: number;
  readonly totalCount: number;
  readonly lastPage: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(page: number, limit: number, count: number) {
    this.page = page;
    this.limit = limit;
    this.totalCount = count;
    this.lastPage = Math.ceil(this.totalCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.lastPage;
  }

  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Adds pagination to an array.
   * Returns paginated data and its meta.
   */
  static paginate(page: number, limit: number, data: any[]) {
    const offset = Pagination.calculateOffset(page, limit);
    const meta = new Pagination(page, limit, data.length);
    const paginatedData = data.slice(offset, offset + limit);
    return { paginatedData, meta };
  }
}
