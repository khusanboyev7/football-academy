import { PartialType } from '@nestjs/mapped-types';
import { CreatePerformanceReportDto } from './create-perfonmance_report.dto';

export class UpdatePerfonmanceReportDto extends PartialType(CreatePerformanceReportDto) {}
