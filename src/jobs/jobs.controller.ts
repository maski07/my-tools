import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsValidator, CheckSponsorshipDto } from './jobs.validator';
import { CommonExceptionFilter } from '../utils/exception.filter';

export class SponsorshipResponse {
    companyNames: string[];
    totalChecked: number;
    totalAuthorized: number;
}

@Controller('jobs')
@UseFilters(CommonExceptionFilter)
export class JobsController {
    constructor(
        private readonly jobsService: JobsService,
        private readonly jobsValidator: JobsValidator
    ) { }

    @Post('check-authority')
    async checkSponsorshipAuthority(
        @Body() body: CheckSponsorshipDto
    ): Promise<SponsorshipResponse> {
        // Validate input using the validator
        this.jobsValidator.validateCheckSponsorshipInput(body);

        const companyNames = await this.jobsService.checkSponsorshipAuthority(
            body.companyNames
        );

        return {
            companyNames,
            totalChecked: body.companyNames.length,
            totalAuthorized: companyNames.length
        };
    }
} 