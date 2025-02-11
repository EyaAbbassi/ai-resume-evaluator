import { ApiProperty } from '@nestjs/swagger';

export class EvaluateResponseDto {
 @ApiProperty({ description: 'Unique job ID for tracking', example: '123e4567-e89b-12d3-a456-426614174000' })
 jobId: string;

 @ApiProperty({ description: 'Message containing next steps', example: 'Evaluation started. Stream results from /stream/{jobId}.' })
 message: string;
}
