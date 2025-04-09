import { IsString, Length } from 'class-validator';

export class IdDto {
  /**
   * ID of the entity
   * @example "a3c0dcd9-7c7f-4b88-b06b-b80a1f04344f"
   */
  @Length(1, 255)
  @IsString()
  id: string;
}
