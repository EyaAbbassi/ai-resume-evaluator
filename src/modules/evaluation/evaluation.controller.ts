import {
 Controller,
 Post,
 UploadedFile,
 UseInterceptors,
 Body,
 BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import { EvaluateResponseDto } from './dto/evaluate-response.dto';
import { EvaluateRequestDto } from './dto/evaluate-request.dto';
import { Express } from 'express';

@ApiTags('Evaluation')
@Controller('evaluate')
export class EvaluationController {
 constructor(private readonly evaluationService: EvaluationService) { }

 @Post()
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
 @ApiResponse({ status: 200, type: EvaluateResponseDto, description: 'Resume uploaded successfully' })
 @ApiResponse({ status: 400, description: 'Invalid file format or missing fields' })
 async evaluate(
  @UploadedFile() resume: Express.Multer.File,
  @Body() body: EvaluateRequestDto,
 ): Promise<EvaluateResponseDto> {
  if (!resume) {
   throw new BadRequestException('Resume file is required');
  }
  const jobId = uuidv4();

  // we just return the job ID (AI processing will be implemented later)
  return { jobId, message: `Evaluation started. Stream results from /stream/${jobId}` };
 }
}
