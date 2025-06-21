import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const clientIp = this.extractClientIp(request);
        const allowedIps = this.configService.get<string>('ALLOWED_IPS')?.split(',');

        // Health check endpoint - no IP restriction
        if (request.route?.path === '/') {
            return true;
        }

        // Check if IP is in allowed list
        if (!allowedIps?.includes(clientIp)) {
            console.error('Allowed IPs:', allowedIps);
            console.error('Access IP:', clientIp);
            throw new ForbiddenException(`Access Denied: ${clientIp}`);
        }

        return true;
    }

    private extractClientIp(request: any): string {
        const clientIp = request?.socket?.remoteAddress?.split(':')?.pop()?.split('%').shift();
        return clientIp;
    }
} 