import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  /**
   * The page number for pagination.
   * @example 1
   */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  page: number = 1;

  /**
   * The number of items per page for pagination.
   * @example 10
   */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsInt()
  limit: number = 10;
}
