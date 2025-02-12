import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
