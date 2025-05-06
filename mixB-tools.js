import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { callGoogleMapAPI } from './Service/mixBService.js';
import url from 'url';

// TODO: I would like to just return the api response. do not do anything in this api.

const AllowedIps = process.env.ALLOWED_IPS?.split(',');

const cache = new Map();

const server = http.createServer((req, res) => {
    const clientIp = req.socket.remoteAddress.split(':').pop().split('%').shift();
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/check') {
        // IPが許可リストにない場合、403で拒否
        if (!AllowedIps.includes(clientIp)) {
            console.error(AllowedIps);
            console.error('アクセス元IP:', clientIp);
            res.statusCode = 403;
            res.end(`Access Denied: ${clientIp}`);
            return;
        }

        callGoogleMapAPI(req, res, parsedUrl, cache);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('エンドポイントが見つかりません。');
    }
});

server.listen(process.env.PORT || 8080, () => {
    console.log('サーバー起動中: curl "https://my-tools-leebgt5xxa-an.a.run.app/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
    console.log('サーバー起動中: curl "localhost:8080/check?origin=holborn&destination=harods&maxMinutes=35&transit_mode=train"');
});

