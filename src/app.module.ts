import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluationModule } from './modules/evaluation/evaluation.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // Load .env variables
    EvaluationModule
  ],
  controllers: [AppController],
  providers: [AppService],
}
)

export class AppModule {}
