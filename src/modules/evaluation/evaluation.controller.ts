import {
 Controller,
 Post,
 Get,
 Param,
 UploadedFile,
 UseInterceptors,
 Body,
 BadRequestException,
 Sse,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { map, Observable } from 'rxjs';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import { EvaluateResponseDto } from './dto/evaluate-response.dto';
import { EvaluateRequestDto } from './dto/evaluate-request.dto';
import { Express } from 'express';

@ApiTags('Evaluation')
@Controller()
export class EvaluationController {
 constructor(private readonly evaluationService: EvaluationService) { }

 @Post('evaluate')
 @UseInterceptors(FileInterceptor('resume', {
  storage: diskStorage({
   destination: './uploads',
   filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {
   if (!file.originalname.match(/\.(pdf)$/)) {
    return cb(new BadRequestException('Only PDF files are allowed!'), false);
   }
   cb(null, true);
  },
 }))
 @ApiOperation({ summary: 'Submit a resume for evaluation' })
 @ApiConsumes('multipart/form-data')
 @ApiBody({
  description: 'Resume file and job assignment',
  type: EvaluateRequestDto,
 })
 @ApiResponse({ status: 200, type: EvaluateResponseDto, description: 'Resume uploaded successfully' })
 async evaluate(
  @UploadedFile() resume: Express.Multer.File,
  @Body() body: EvaluateRequestDto,
 ): Promise<EvaluateResponseDto> {
  if (!resume) {
   throw new BadRequestException('Resume file is required');
  }
  const jobId = uuidv4();
  this.evaluationService.startEvaluation(jobId, resume, body.jobAssignment);
  return { jobId, message: `Evaluation started. Stream results from /stream/${jobId}` };
 }

 @Get('stream/:jobId')
 @ApiOperation({ summary: 'Stream AI-generated resume evaluation results in real-time' })
 @ApiResponse({ status: 200, description: 'Streaming AI response line by line' })
 @Sse()
 streamResults(@Param('jobId') jobId: string): Observable<MessageEvent> {
  return this.evaluationService.getStream(jobId).pipe(
   map((data) => {
     return new MessageEvent('message', {
       data: JSON.stringify(data),
       lastEventId: '',
       origin: '',
       ports: [],
       source: null
     });
   })
 );
}
}