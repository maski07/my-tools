"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 8080;
    await app.listen(port);
    console.log(`Server started on port ${port}`);
    console.log('サーバー起動中 prod: curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
    console.log('サーバー起動中 local: curl "localhost:8080/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
}
bootstrap();
//# sourceMappingURL=main.js.map