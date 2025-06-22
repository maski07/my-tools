import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { MixBController } from './mix-b/mix-b.controller';
import { MixBService } from './mix-b/mix-b.service';
import { OpenAIController } from './openai/openai.controller';
import { OpenAIService } from './openai/openai.service';
import { JobsController } from './jobs/jobs.controller';
import { JobsService } from './jobs/jobs.service';
import { JobsValidator } from './jobs/jobs.validator';
import { CommonExceptionFilter } from './utils/exception.filter';
import { IpGuard } from './guards/ip.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    controllers: [
        HealthController,
        MixBController,
        OpenAIController,
        JobsController,
    ],
    providers: [
        MixBService,
        OpenAIService,
        JobsService,
        JobsValidator,
        CommonExceptionFilter,
        {
            provide: APP_GUARD,
            useClass: IpGuard,
        },
    ],
})
export class AppModule { } 