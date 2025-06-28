import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import axios from 'axios';
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
    private readonly cloudBacketFileUrl = 'https://storage.googleapis.com/my-tools-459008_cloudbuild/files/2025-06-16_-_Worker_and_Temporary_Worker.csv';
    constructor() {
        this.loadSponsorshipData();
    }

    private async loadSponsorshipData(): Promise<void> {
        this.logger.log(`Loading sponsorship data from: ${this.cloudBacketFileUrl}`);

        const companies: SponsorshipCompany[] = [];

        return new Promise((resolve, reject) => {
            axios.get(this.cloudBacketFileUrl, { responseType: 'stream' })
                .then(response => {
                    response.data
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
                            reject(new Error('Failed to read sponsorship data file'));
                        });
                })
                .catch(error => {
                    this.logger.error('Error downloading sponsorship data:', error);
                    throw new HttpException('Error downloading sponsorship data:', error)
                });
        });
    }

    async checkSponsorshipAuthority(companyNames: string[]): Promise<string[]> {
        if (!this.isDataLoaded) {
            this.logger.warn('Sponsorship data not yet loaded, attempting to load...');
            await this.loadSponsorshipData();
            // If still not loaded, return empty array
            if (!this.isDataLoaded || this.cachedCompanies.size === 0) {
                this.logger.warn('No sponsorship data available');
                return [];
            }
        }

        // Find all matching companies using regex pattern matching
        const allMatchingCompanies = findMatchingCompanies(companyNames, this.cachedCompanies);

        this.logger.log(`Checked ${companyNames.length} companies, found ${allMatchingCompanies.length} with sponsorship authority`);

        return allMatchingCompanies;
    }
} 