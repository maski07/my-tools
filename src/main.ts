import dotenv from 'dotenv';
dotenv.config();
import http, { IncomingMessage, ServerResponse } from 'http';
import { callGoogleMapAPI } from './Service/mixBService.js';
import url from 'url';
import { chatWithGPT } from './Service/openAIService.js';
import { openAIController } from './controller/openAIController.js';

// TODO: I would like to just return the api response. do not do anything in this api.

const AllowedIps = process.env.ALLOWED_IPS?.split(',');

const cache = new Map();


const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {

    const clientIp = req?.socket?.remoteAddress?.split(':')?.pop()?.split('%').shift();
    const parsedUrl = url.parse(req?.url as string, true);

    const path = parsedUrl.pathname;

    // Health check endpoint - no IP restriction
    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
        return;
    }

    // IPが許可リストにない場合、403で拒否
    if (!AllowedIps?.includes(clientIp as string)) {
        console.error(AllowedIps);
        console.error('アクセス元IP:', clientIp);
        res.statusCode = 403;
        res.end(`Access Denied: ${clientIp}`);
        return;
    }

    try {
        if (path === '/check' || path === '/mix-B/check') {
            callGoogleMapAPI(req, res, parsedUrl, cache);
        } else if (path?.startsWith('/openAI/')) {
            await openAIController(req, res, parsedUrl);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('エンドポイントが見つかりません。');
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('エラーが発生しました。');
    }
});

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${process.env.PORT || 8080}`);
    console.log('サーバー起動中: curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
    console.log('サーバー起動中: curl "localhost:8080/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
});

