import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { MixBService, TransitResult } from './mix-b.service';

@Controller('mix-b')
export class MixBController {
    constructor(private readonly mixBService: MixBService) { }

    @Get('check')
    async checkTransitTimeGet(
        @Query('origin') origin: string,
        @Query('destination') destination: string,
        @Query('maxMinutes') maxMinutes: string,
    ) {
        if (!origin || !destination || !maxMinutes) {
            throw new BadRequestException('origin, destination, maxMinutes parameters are required.');
        }

        const maxMinutesNum = parseInt(maxMinutes);
        if (isNaN(maxMinutesNum) || maxMinutesNum <= 0) {
            throw new BadRequestException('maxMinutes must be a valid positive number.');
        }

        try {
            const req = {
                origin,
                destination,
                maxMinutes: maxMinutesNum
            };
            const result: TransitResult = await this.mixBService.checkTransitTime(req);
            return {...req, ...result};
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

} 