import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(8080);
    console.log(`Server started on port ${8080}`);
    console.log('サーバー起動中 prod: curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
    console.log('サーバー起動中 local: curl "localhost:8080/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
}

bootstrap();

