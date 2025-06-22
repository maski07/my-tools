import { Injectable } from '@nestjs/common';
import { ValidationException } from '../utils/validation.exception';
import { normalizeCompanyName } from '../utils/company.util';

export class CheckSponsorshipDto {
    companyNames: string[];
}

@Injectable()
export class JobsValidator {
    validateCheckSponsorshipInput(body: any): CheckSponsorshipDto {
        // Check if body exists
        if (!body) {
            throw new ValidationException('Request body is required');
        }

        // Check if companyNames exists and is an array
        if (!body.companyNames || !Array.isArray(body.companyNames)) {
            throw new ValidationException('companyNames must be an array of strings', 'companyNames');
        }

        // Validate each company name
        const validatedCompanyNames = body.companyNames.map((name: any, index: number) => {
            if (typeof name !== 'string') {
                throw new ValidationException(
                    `companyNames[${index}] must be a string`,
                    `companyNames[${index}]`
                );
            }

            const normalizedName = normalizeCompanyName(name);
            if (normalizedName.length === 0) {
                throw new ValidationException(
                    `companyNames[${index}] cannot be empty`,
                    `companyNames[${index}]`
                );
            }

            return normalizedName;
        });

        // Check for duplicate company names
        const uniqueNames = new Set(validatedCompanyNames);
        if (uniqueNames.size !== validatedCompanyNames.length) {
            throw new ValidationException('Duplicate company names are not allowed', 'companyNames');
        }

        // Check if array is not empty
        if (validatedCompanyNames.length === 0) {
            throw new ValidationException('companyNames array cannot be empty', 'companyNames');
        }

        // Check maximum array length to prevent abuse
        const MAX_COMPANIES = 1000;
        if (validatedCompanyNames.length > MAX_COMPANIES) {
            throw new ValidationException(
                `Maximum ${MAX_COMPANIES} companies can be checked at once`,
                'companyNames'
            );
        }

        return {
            companyNames: validatedCompanyNames
        };
    }
} 