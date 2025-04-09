import { IsOptional, IsString, Length } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class PaginationWithSearchDto extends PaginationDto {
  /**
   * Search query to search for.
   * @example "title"
   */
  @IsOptional()
  @IsString()
  @Length(0, 255)
  searchQuery?: string;
}
