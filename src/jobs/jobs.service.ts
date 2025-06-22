import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { findMatchingCompanies } from '../utils/company.util';

export interface SponsorshipCompany {
    organisationName: string;
    townCity: string;
    county: string;
    typeRating: string;
    route: string;
}

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);
    private cachedCompanies: Set<string> = new Set();
    private isDataLoaded = false;

    constructor() {
        this.loadSponsorshipData();
    }

    private async loadSponsorshipData(): Promise<void> {
        try {
            const filesDir = path.join(process.cwd(), 'files');
            const files = fs.readdirSync(filesDir);

            // Find the latest Worker and Temporary Worker file
            const workerFiles = files.filter(file =>
                file.includes('Worker_and_Temporary_Worker') &&
                file.endsWith('.csv')
            );

            if (workerFiles.length === 0) {
                this.logger.error('No Worker and Temporary Worker CSV files found');
                return;
            }

            // Sort by date (YYYY-MM-DD format in filename) and get the latest
            const latestFile = workerFiles
                .map(file => {
                    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
                    return {
                        filename: file,
                        date: dateMatch ? new Date(dateMatch[1]) : new Date(0)
                    };
                })
                .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

            const filePath = path.join(filesDir, latestFile.filename);
            this.logger.log(`Loading sponsorship data from: ${latestFile.filename}`);

            const companies: SponsorshipCompany[] = [];

            return new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        companies.push({
                            organisationName: row['Organisation Name'] || '',
                            townCity: row['Town/City']?.trim() || '',
                            county: row['County']?.trim() || '',
                            typeRating: row['Type & Rating']?.trim() || '',
                            route: row['Route']?.trim() || ''
                        });
                    })
                    .on('end', () => {
                        // Create a set of company names for efficient lookup
                        this.cachedCompanies = new Set(
                            companies
                                .map(company => company.organisationName)
                                .filter(name => name && name.length > 0)
                        );

                        this.isDataLoaded = true;
                        this.logger.log(`Loaded ${this.cachedCompanies.size} companies with sponsorship authority`);
                        resolve();
                    })
                    .on('error', (error) => {
                        this.logger.error('Error reading CSV file:', error);
                        reject(error);
                    });
            });
        } catch (error) {
            this.logger.error('Error loading sponsorship data:', error);
            throw new Error('Unable to load sponsorship data');
        }
    }

    async checkSponsorshipAuthority(companyNames: string[]): Promise<string[]> {
        if (!this.isDataLoaded) {
            this.logger.warn('Sponsorship data not yet loaded, attempting to load...');
            await this.loadSponsorshipData();
        }

        // Find all matching companies using regex pattern matching
        const allMatchingCompanies: string[] = [];

        for (const companyName of companyNames) {
            const matchingCompanies = findMatchingCompanies(companyName, this.cachedCompanies);
            allMatchingCompanies.push(...matchingCompanies);
        }

        // Remove duplicates while preserving order
        const uniqueMatchingCompanies = [...new Set(allMatchingCompanies)];

        this.logger.log(`Checked ${companyNames.length} companies, found ${uniqueMatchingCompanies.length} with sponsorship authority`);

        return uniqueMatchingCompanies;
    }

    async getAllAuthorizedCompanies(): Promise<string[]> {
        if (!this.isDataLoaded) {
            await this.loadSponsorshipData();
        }

        return Array.from(this.cachedCompanies);
    }
} 