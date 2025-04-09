import { PartialType } from '@nestjs/swagger';
import { IdDto } from './id.dto';

export class OptionalIdDto extends PartialType(IdDto) {}
