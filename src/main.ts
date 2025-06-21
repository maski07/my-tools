import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get('PORT') || 8080;

    await app.listen(port);
    console.log(`Server started on port ${port}`);
    console.log('サーバー起動中 prod: curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
    console.log('サーバー起動中 local: curl "localhost:8080/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
}

bootstrap();

