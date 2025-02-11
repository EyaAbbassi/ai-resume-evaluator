import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluationModule } from './modules/evaluation/evaluation.module';

@Module({
  imports: [EvaluationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
