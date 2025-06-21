import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getUnixTimeAtHour } from '../utils/common.util';

export interface TransitResult {
    durationText: string;
    duration: number;
    isWithinLimit: boolean;
}

export interface TransitQuery {
    origin: string;
    destination: string;
    maxMinutes: number;
}

@Injectable()
export class MixBService {
    private cache = new Map<string, TransitResult>();
    private apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('GOOGLE_MAP_API_KEY');
    }

    async checkTransitTime(query: TransitQuery): Promise<TransitResult> {
        const key = `${query.origin}${query.destination}${query.maxMinutes}`;

        // Check cache first
        if (this.cache.has(key)) {
            console.log('used cache');
            return this.cache.get(key);
        }

        try {
            const result = await this.callGoogleMapAPI(query.origin, query.destination, query.maxMinutes);
            this.cache.set(key, result);
            return result;
        } catch (error) {
            throw new Error(`Google API Error: ${error.message}`);
        }
    }

    private async callGoogleMapAPI(origin: string, destination: string, maxMinutes: number): Promise<TransitResult> {
        console.log({ origin, destination, maxMinutes });
        const departureTime = getUnixTimeAtHour(15, 0).toString().trim(); // Fixed at 15:00 daily

        const requestUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit&transit_mode=train&departure_time=${departureTime}&key=${this.apiKey}`;

        try {
            const response = await fetch(requestUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'OK') {
                console.error(data);
                throw new Error(`Google API Error: ${JSON.stringify(data)}`);
            }

            const leg = data.routes[0].legs[0];
            const durationInSeconds = leg.duration.value;

            const result: TransitResult = {
                durationText: leg.duration.text,
                duration: Math.floor(durationInSeconds / 60),
                isWithinLimit: durationInSeconds <= maxMinutes * 60
            };

            console.log('api has been finished successfully.');
            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Google API Error: ${error.message}`);
            }
            throw new Error('Unknown error occurred');
        }
    }
} 