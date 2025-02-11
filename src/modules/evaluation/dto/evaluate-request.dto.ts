import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EvaluateRequestDto {
 @ApiProperty({
  description: 'Job assignment description',
  example: 'Full-Stack Developer with AI experience',
 })
 @IsString()
 jobAssignment: string;

 @ApiProperty({
  description: 'Resume file (PDF format only)',
  type: 'string',
  format: 'binary', //file upload
 })
 resume: any;
}
