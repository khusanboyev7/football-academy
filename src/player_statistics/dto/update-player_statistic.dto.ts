import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerStatisticDto } from './create-player_statistic.dto';

export class UpdatePlayerStatisticDto extends PartialType(CreatePlayerStatisticDto) {}
