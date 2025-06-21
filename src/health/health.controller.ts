import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
    @Get()
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
} 